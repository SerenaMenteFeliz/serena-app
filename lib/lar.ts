import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LessonBlock } from "@/lib/calice";

// ── Lar Interior: Desafio de 7 Dias ─────────────────────────────────────────
// 14 sessões = 7 temas × (teórica + prática). A estrutura é derivada do
// order_index, não guardada no banco: ímpar = teórica, par = prática do mesmo
// tema; tema K = sessões 2K-1 e 2K. O ritmo (7 ou 14 dias) é escolhido no
// onboarding e vira a trava diária: 14 dias → 1 sessão/dia; 7 dias → 2/dia
// (o par completo do tema). Nada disso precisou de migration: o ritmo vive
// como evento em product_events e a trava é calculada do completed_at.

export type Pace = 7 | 14;

export type SessionStatus = "concluida" | "hoje" | "amanha" | "bloqueada";

export type LarSession = {
  id: string;
  order_index: number;
  title: string;
  tema: string;
  temaIndex: number;
  pratica: boolean;
  minutos: number;
  status: SessionStatus;
};

// durações reais dos roteiros (impressas pelo seed-lar-interior.mjs)
const MINUTOS: Record<number, number> = {
  1: 18, 2: 20, 3: 23, 4: 23, 5: 23, 6: 23, 7: 22,
  8: 20, 9: 20, 10: 23, 11: 20, 12: 23, 13: 20, 14: 20,
};

// título no banco é "Tema — Subtítulo da gravação"
export function tituloSessao(title: string): { tema: string; subtitulo: string } {
  const [tema, ...resto] = title.split(" — ");
  return { tema, subtitulo: resto.join(" — ") || "Sessão" };
}

function hojeSP(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(date);
}

// ── Ritmo (event-sourced em product_events) ─────────────────────────────────

export async function getPace(contactId: string): Promise<Pace | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_events")
    .select("payload")
    .eq("contact_id", contactId)
    .eq("product", "lar_interior")
    .eq("event_type", "pace_chosen")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const pace = (data?.payload as { pace?: number } | null)?.pace;
  return pace === 7 || pace === 14 ? pace : null;
}

export async function setPace(contactId: string, pace: Pace) {
  const admin = createAdminClient();
  const { error } = await admin.from("product_events").insert({
    contact_id: contactId,
    product: "lar_interior",
    event_type: "pace_chosen",
    payload: { pace },
  });
  if (error) console.error("setPace falhou", error);
}

// ── Sessões + progresso ──────────────────────────────────────────────────────

export async function getLarSessions(contactId: string, pace: Pace) {
  const supabase = await createClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, order_index, title")
    .eq("product", "lar_interior")
    .order("order_index");

  const lessonIds = (lessons ?? []).map((l) => l.id);
  const { data: progress } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("contact_id", contactId)
        .in("lesson_id", lessonIds)
    : { data: [] };

  const done = new Map((progress ?? []).map((r) => [r.lesson_id, r.completed_at as string]));
  const hoje = hojeSP();
  const concluidasHoje = (progress ?? []).filter((r) => hojeSP(new Date(r.completed_at)) === hoje).length;
  const limiteDiario = pace === 7 ? 2 : 1;
  const atingiuLimite = concluidasHoje >= limiteDiario;

  let proximaEncontrada = false;
  const sessions: LarSession[] = (lessons ?? []).map((l) => {
    const { tema } = tituloSessao(l.title);
    const base = {
      id: l.id,
      order_index: l.order_index,
      title: l.title,
      tema,
      temaIndex: Math.ceil(l.order_index / 2),
      pratica: l.order_index % 2 === 0,
      minutos: MINUTOS[l.order_index] ?? 20,
    };
    if (done.has(l.id)) return { ...base, status: "concluida" as const };
    if (!proximaEncontrada) {
      proximaEncontrada = true;
      return { ...base, status: atingiuLimite ? ("amanha" as const) : ("hoje" as const) };
    }
    return { ...base, status: "bloqueada" as const };
  });

  const concluidas = done.size;
  const totalDias = pace === 7 ? 7 : 14;
  // dia da jornada em que a pessoa está (1-based, não passa do total)
  const diaAtual = Math.min(pace === 7 ? Math.floor(concluidas / 2) + 1 : concluidas + 1, totalDias);

  return { sessions, concluidas, concluidasHoje, limiteDiario, diaAtual, totalDias };
}

export async function getLarSession(order: number) {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, order_index, title")
    .eq("product", "lar_interior")
    .eq("order_index", order)
    .maybeSingle();

  if (!lesson) return null;

  const { data: blocks } = await supabase
    .from("lesson_blocks")
    .select("id, order_index, block_type, content")
    .eq("lesson_id", lesson.id)
    .order("order_index");

  return { ...lesson, blocks: (blocks ?? []) as LessonBlock[] };
}

export async function completeLarSession(contactId: string, lessonId: string) {
  const supabase = await createClient();
  await supabase.from("lesson_progress").upsert({
    contact_id: contactId,
    lesson_id: lessonId,
    completed_at: new Date().toISOString(),
  });

  const admin = createAdminClient();
  const { error } = await admin.from("product_events").insert({
    contact_id: contactId,
    product: "lar_interior",
    event_type: "lesson_completed",
    payload: { lesson_id: lessonId },
  });
  if (error) console.error("completeLarSession: logEvent falhou", error);
}

// ── Intenção do dia ──────────────────────────────────────────────────────────
// A "palavra do dia" da Liz (conceito do acompanhamento do desafio) em rodízio
// diário — mesmo mecanismo do pensamento do dia do Cálice, voz própria.

const INTENCOES = [
  "presença",
  "gentileza com você",
  "um passo de cada vez",
  "respirar antes de responder",
  "acolher o que chega",
  "começar de onde você está",
  "silêncio também é resposta",
  "o corpo sabe, escute",
  "devagar é um ritmo",
  "voltar pra casa, dentro",
  "hoje é o único dia",
  "menos pressa, mais pausa",
  "confiar no processo",
  "seu ritmo é o certo",
];

export function getIntencaoDoDia(date: Date = new Date()): string {
  const dia = hojeSP(date); // YYYY-MM-DD
  const [y, m, d] = dia.split("-").map(Number);
  return INTENCOES[(y + m + d) % INTENCOES.length];
}

export function getGreetingLar(date: Date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false }).format(date)
  );
  if (hour >= 5 && hour < 12) return "bom dia";
  if (hour >= 12 && hour < 18) return "boa tarde";
  return "boa noite";
}

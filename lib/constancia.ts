import "server-only";
import { createClient } from "@/lib/supabase/server";

// Constância — os dias em que a pessoa apareceu (qualquer sessão do Lar,
// prática ou capítulo do Cálice), derivada do que já existe: lesson_progress
// + eventos chapter_read em product_events. Zero migration.
//
// Decisão de produto (12/07): isto NÃO é gamificação. Sem pontos, níveis ou
// badge, e a sequência nunca vira "0 dias" na cara da pessoa — quebrou a
// sequência, mostramos o total de dias vividos, que só cresce. O dia de hoje
// ainda em aberto não quebra a sequência (âncora em ontem).

export type Constancia = {
  // dias corridos terminando hoje ou ontem (hoje em aberto não zera)
  sequenciaAtual: number;
  // total de dias distintos com alguma atividade — nunca diminui
  diasVividos: number;
  // a pessoa já fez algo hoje?
  hojeContou: boolean;
};

function diaSP(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(iso));
}

function addDays(dia: string, delta: number): string {
  const [y, m, d] = dia.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return dt.toISOString().slice(0, 10);
}

export async function getConstancia(contactId: string): Promise<Constancia> {
  const supabase = await createClient();

  const [{ data: progresso }, { data: leituras }] = await Promise.all([
    supabase.from("lesson_progress").select("completed_at").eq("contact_id", contactId),
    supabase
      .from("product_events")
      .select("created_at")
      .eq("contact_id", contactId)
      .eq("event_type", "chapter_read"),
  ]);

  const dias = new Set<string>();
  for (const r of progresso ?? []) if (r.completed_at) dias.add(diaSP(r.completed_at));
  for (const r of leituras ?? []) if (r.created_at) dias.add(diaSP(r.created_at));

  const hoje = diaSP(new Date().toISOString());
  const hojeContou = dias.has(hoje);

  // sequência: anda pra trás a partir de hoje (se contou) ou de ontem
  let sequenciaAtual = 0;
  let cursor = hojeContou ? hoje : addDays(hoje, -1);
  while (dias.has(cursor)) {
    sequenciaAtual++;
    cursor = addDays(cursor, -1);
  }

  return { sequenciaAtual, diasVividos: dias.size, hojeContou };
}

// Frase única da constância — a voz é de acompanhamento, não de cobrança.
// Regras: 1º dia não mostra nada (nada pra celebrar ainda sem parecer
// contador); sequência >= 2 mostra a sequência; senão, o total acumulado.
export function fraseConstancia(c: Constancia): string | null {
  if (c.diasVividos === 0) return null;
  if (c.diasVividos === 1) return null;
  if (c.sequenciaAtual >= 2) {
    return `${c.sequenciaAtual} dias seguidos com você mesma`;
  }
  return `${c.diasVividos} dias vividos nessa jornada`;
}

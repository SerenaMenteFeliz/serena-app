import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// O Quiz Diagnóstico classifica a pessoa em 1 de 4 padrões e grava o
// resultado em `lead_events.quiz_result` (ver metodocalice-site/api/
// subscribe.js). Até 08/08/2026 o app nunca lia esse campo: a pessoa passava
// por um diagnóstico inteiro e entrava num produto que não sabia nada sobre
// ela. Aqui ele finalmente volta pra dentro do app.
//
// Leitura por service_role de propósito: `lead_events` é tabela de funil, não
// tem policy de leitura pro usuário final e não deveria ganhar uma só por
// causa disto.

export type ArquetipoSlug = "aprovador" | "sabotador" | "ausente" | "controlador";

// Rótulo e frase são copy da Ge, copiados do quiz sem reescrever — a pessoa
// já leu exatamente isso na tela de resultado, e ver outra palavra aqui
// quebraria o reconhecimento.
export const ARQUETIPOS: Record<ArquetipoSlug, { label: string; eco: string }> = {
  aprovador: {
    label: "O Aprovador",
    eco: "Você aprendeu cedo que agradar é mais seguro do que ser você.",
  },
  sabotador: {
    label: "O Sabotador",
    eco: "Você deseja. Planeja. Começa. E na hora H, algo te puxa de volta.",
  },
  ausente: {
    label: "O Ausente",
    eco: "Você está presente em tudo. Mas ausente de si.",
  },
  controlador: {
    label: "O Controlador",
    eco: "Você aprendeu que o mundo não é seguro quando as coisas saem do seu controle.",
  },
};

const SLUGS = Object.keys(ARQUETIPOS) as ArquetipoSlug[];

export type Arquetipo = { slug: ArquetipoSlug; label: string; eco: string };

// Sempre opcional, nunca bloqueia nada: quem se cadastrou direto no app (sem
// passar pelo quiz) simplesmente não tem, e a tela mostra o convite pra
// descobrir em vez de um campo vazio. Se essa pessoa fizer o quiz depois com
// o mesmo e-mail, o subscribe do quiz faz upsert no mesmo `contacts` e o
// resultado aparece aqui sozinho, sem nenhum passo extra.
export async function getArquetipo(contactId: string): Promise<Arquetipo | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("lead_events")
    .select("quiz_result")
    .eq("contact_id", contactId)
    .not("quiz_result", "is", null)
    // a coluna de tempo de lead_events é `signed_at` (momento do opt-in), não
    // `created_at` — as outras tabelas do app usam created_at, e essa foi a
    // pegadinha na primeira versão desta consulta
    .order("signed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getArquetipo falhou", error);
    return null;
  }

  const slug = data?.quiz_result as ArquetipoSlug | undefined;
  if (!slug || !SLUGS.includes(slug)) return null;
  return { slug, ...ARQUETIPOS[slug] };
}

// Onde mandar quem ainda não tem padrão. Domínio próprio (não o bruto da
// Vercel) — ver "Conceito - Domínio Bruto de Plataforma Compartilhada Herda
// Reputação de Terceiros" no Vault Zuppas.
export const QUIZ_URL = "https://metodocalice.serenamentefeliz.com/quiz";

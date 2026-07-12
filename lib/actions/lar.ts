"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { setPace, completeLarSession, getLarSessions, getPace, type Pace } from "@/lib/lar";
import { saveNote } from "@/lib/calice-notes";
import { captureServer } from "@/lib/analytics/server";

export async function escolherRitmo(pace: Pace) {
  const { contactId } = await requireProductAccess("lar_interior");
  await setPace(contactId, pace);
  revalidatePath("/lar-interior");
  redirect("/lar-interior");
}

export async function concluirSessao(lessonId: string, order: number) {
  const { contactId } = await requireProductAccess("lar_interior");

  // valida no servidor: só a sessão da vez, dentro da cota do dia — impede
  // maratonar por URL direta (o desbloqueio diário é parte do produto)
  const pace = (await getPace(contactId)) ?? 14;
  const { sessions, concluidas } = await getLarSessions(contactId, pace);
  const sessao = sessions.find((s) => s.id === lessonId);
  if (!sessao || sessao.status !== "hoje") return;

  await completeLarSession(contactId, lessonId);
  // ground truth server-side: o client pode fechar a aba antes do evento sair
  await captureServer(contactId, "lar_session_completed", {
    order,
    desafio_completo: concluidas + 1 === sessions.length,
  });
  revalidatePath(`/lar-interior/sessoes/${order}`);
  revalidatePath("/lar-interior/sessoes");
  revalidatePath("/lar-interior");
}

// Reflexão da sessão ("o que você sentiu hoje?") — mesma tabela/regra das
// notas do Cálice (corpo vazio apaga). chapter_order = order_index da sessão.
export async function guardarReflexao(order: number, formData: FormData) {
  const { contactId } = await requireProductAccess("lar_interior");
  const body = String(formData.get("body") ?? "");
  await saveNote(contactId, "lar_interior", order, body);
  revalidatePath(`/lar-interior/sessoes/${order}`);
}

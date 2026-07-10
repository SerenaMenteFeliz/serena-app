"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { setPace, completeLarSession, getLarSessions, getPace, type Pace } from "@/lib/lar";

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
  const { sessions } = await getLarSessions(contactId, pace);
  const sessao = sessions.find((s) => s.id === lessonId);
  if (!sessao || sessao.status !== "hoje") return;

  await completeLarSession(contactId, lessonId);
  revalidatePath(`/lar-interior/sessoes/${order}`);
  revalidatePath("/lar-interior/sessoes");
  revalidatePath("/lar-interior");
}

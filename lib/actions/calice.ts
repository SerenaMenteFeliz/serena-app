"use server";

import { revalidatePath } from "next/cache";
import { requireProductAccess } from "@/lib/access";
import { completeLesson, evaluateCompletion } from "@/lib/calice";

export async function marcarAulaConcluida(lessonId: string, order: number) {
  const { contactId } = await requireProductAccess("metodo_calice");
  await completeLesson(contactId, lessonId, "metodo_calice");
  await evaluateCompletion(contactId, "metodo_calice");
  revalidatePath(`/metodo-calice/aulas/${order}`);
  revalidatePath("/metodo-calice/aulas");
}

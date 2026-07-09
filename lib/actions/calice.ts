"use server";

import { revalidatePath } from "next/cache";
import { requireProductAccess } from "@/lib/access";
import { completeLesson, evaluateCompletion } from "@/lib/calice";
import { saveNote, deleteNote } from "@/lib/calice-notes";

export async function marcarAulaConcluida(lessonId: string, order: number) {
  const { contactId } = await requireProductAccess("metodo_calice");
  await completeLesson(contactId, lessonId, "metodo_calice");
  await evaluateCompletion(contactId, "metodo_calice");
  revalidatePath(`/metodo-calice/aulas/${order}`);
  revalidatePath("/metodo-calice/aulas");
}

export async function guardarNota(chapterOrder: number, formData: FormData) {
  const { contactId } = await requireProductAccess("metodo_calice");
  const body = String(formData.get("body") ?? "");
  await saveNote(contactId, "metodo_calice", chapterOrder, body);
  revalidatePath(`/metodo-calice/livro/${chapterOrder}`);
  revalidatePath("/metodo-calice/notas");
}

export async function removerNota(chapterOrder: number) {
  const { contactId } = await requireProductAccess("metodo_calice");
  await deleteNote(contactId, "metodo_calice", chapterOrder);
  revalidatePath(`/metodo-calice/livro/${chapterOrder}`);
  revalidatePath("/metodo-calice/notas");
}

import "server-only";
import { createClient } from "@/lib/supabase/server";

export type BookNote = {
  id: string;
  chapter_order: number;
  body: string;
  updated_at: string;
};

// A migration 0006 (book_notes) precisa da senha do banco — passo manual do
// Yan. Até lá o recurso fica oculto: esta checagem decide se os pontos de
// entrada (orb na home, painel no leitor, página de notas) aparecem. Só o
// "sim" é cacheado por processo; o "não" revalida a cada chamada, pra ligar
// sozinho assim que a migration for aplicada.
let notesAvailable = false;

export async function notesFeatureEnabled(): Promise<boolean> {
  if (notesAvailable) return true;
  const supabase = await createClient();
  const { error } = await supabase.from("book_notes").select("id").limit(1);
  notesAvailable = !error;
  return notesAvailable;
}

export async function getNotes(contactId: string, product: "metodo_calice"): Promise<BookNote[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_notes")
    .select("id, chapter_order, body, updated_at")
    .eq("contact_id", contactId)
    .eq("product", product)
    .order("chapter_order");
  return data ?? [];
}

export async function getNote(
  contactId: string,
  product: "metodo_calice",
  chapterOrder: number
): Promise<BookNote | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_notes")
    .select("id, chapter_order, body, updated_at")
    .eq("contact_id", contactId)
    .eq("product", product)
    .eq("chapter_order", chapterOrder)
    .maybeSingle();
  return data;
}

// Corpo vazio apaga a nota — o formulário não precisa de botão "remover"
// separado dentro do leitor (a página Minhas anotações tem o dela).
export async function saveNote(
  contactId: string,
  product: "metodo_calice",
  chapterOrder: number,
  body: string
) {
  const supabase = await createClient();
  const trimmed = body.trim();

  if (!trimmed) {
    await deleteNote(contactId, product, chapterOrder);
    return;
  }

  await supabase.from("book_notes").upsert(
    {
      contact_id: contactId,
      product,
      chapter_order: chapterOrder,
      body: trimmed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "contact_id,product,chapter_order" }
  );
}

export async function deleteNote(contactId: string, product: "metodo_calice", chapterOrder: number) {
  const supabase = await createClient();
  await supabase
    .from("book_notes")
    .delete()
    .eq("contact_id", contactId)
    .eq("product", product)
    .eq("chapter_order", chapterOrder);
}

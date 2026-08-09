import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { captureServer } from "@/lib/analytics/server";

export type LessonBlock = {
  id: string;
  order_index: number;
  block_type: "text" | "video" | "image" | "audio";
  content: Record<string, string>;
};

// Sumário completo (só título e posição) pra montar a prévia de quem ainda
// não comprou. Precisa de service_role: desde a migration 0011 a RLS só
// entrega ao autenticado sem compra o PRIMEIRO capítulo e o PRIMEIRO dia, o
// que fazia a prévia prometer "13 capítulos" e listar 1 (achado 08/08/2026).
// O corpo do capítulo e os blocos da aula continuam protegidos pela RLS — o
// que sai daqui é o mesmo índice que já está na página de vendas.
export async function getCaliceOutline(product: "metodo_calice") {
  const admin = createAdminClient();

  const [{ data: chapters, error: chaptersError }, { data: lessons, error: lessonsError }] =
    await Promise.all([
      admin.from("book_chapters").select("order_index, title").eq("product", product).order("order_index"),
      admin.from("lessons").select("id, order_index, title").eq("product", product).order("order_index"),
    ]);

  if (chaptersError) console.error("getCaliceOutline (capítulos) falhou", chaptersError);
  if (lessonsError) console.error("getCaliceOutline (aulas) falhou", lessonsError);

  return { chapters: chapters ?? [], lessons: lessons ?? [] };
}

export async function getChapters(product: "metodo_calice") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("book_chapters")
    .select("order_index, title")
    .eq("product", product)
    .order("order_index");
  if (error) console.error("getChapters falhou", error);
  return data ?? [];
}

export async function getChapter(product: "metodo_calice", order: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("book_chapters")
    .select("order_index, title, body_md")
    .eq("product", product)
    .eq("order_index", order)
    .maybeSingle();
  if (error) console.error("getChapter falhou", error);
  return data;
}

export async function getBookProgress(contactId: string, product: "metodo_calice") {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_progress")
    .select("last_chapter_order, completed")
    .eq("contact_id", contactId)
    .eq("product", product)
    .maybeSingle();
  return data ?? { last_chapter_order: 0, completed: false };
}

// Chamar toda vez que a pessoa abre um capítulo. Marca concluído quando chega
// no último capítulo publicado — dispara a reavaliação do critério de
// "completou o produto" (lib/completion.ts), que é o que decide se isso
// libera a oferta cruzada do Lar Interior.
export async function saveBookProgress(contactId: string, product: "metodo_calice", order: number) {
  const supabase = await createClient();

  const { data: chapters } = await supabase
    .from("book_chapters")
    .select("order_index")
    .eq("product", product)
    .order("order_index", { ascending: false })
    .limit(1);

  const lastChapterOrder = chapters?.[0]?.order_index ?? 0;
  const completed = order >= lastChapterOrder;

  await supabase.from("book_progress").upsert({
    contact_id: contactId,
    product,
    last_chapter_order: order,
    completed,
    updated_at: new Date().toISOString(),
  });

  await logEvent(contactId, product, "chapter_read", { order, completed });
}

export async function getLessons(product: "metodo_calice") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id, order_index, title")
    .eq("product", product)
    .order("order_index");
  if (error) console.error("getLessons falhou", error);
  return data ?? [];
}

export async function getLessonByOrder(product: "metodo_calice", order: number) {
  const supabase = await createClient();
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, order_index, title")
    .eq("product", product)
    .eq("order_index", order)
    .maybeSingle();
  if (lessonError) console.error("getLessonByOrder falhou", lessonError);

  if (!lesson) return null;

  const { data: blocks, error: blocksError } = await supabase
    .from("lesson_blocks")
    .select("id, order_index, block_type, content")
    .eq("lesson_id", lesson.id)
    .order("order_index");
  if (blocksError) console.error("getLessonByOrder (blocks) falhou", blocksError);

  return { ...lesson, blocks: (blocks ?? []) as LessonBlock[] };
}

// Dia N só desbloqueia depois do Dia N-1 concluído — a própria aula pede
// isso ("para desbloquear o Dia X"), então a progressão é sequencial.
export async function getLessonsWithProgress(contactId: string, product: "metodo_calice") {
  const [lessons, completedIds] = await Promise.all([
    getLessons(product),
    getCompletedLessonIds(contactId, product),
  ]);

  return lessons.map((lesson, i) => ({
    ...lesson,
    completed: completedIds.has(lesson.id),
    locked: i > 0 && !completedIds.has(lessons[i - 1].id),
  }));
}

export async function getCompletedLessonIds(contactId: string, product: "metodo_calice") {
  const supabase = await createClient();
  const { data: lessons } = await supabase.from("lessons").select("id").eq("product", product);
  const lessonIds = (lessons ?? []).map((l) => l.id);
  if (lessonIds.length === 0) return new Set<string>();

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("contact_id", contactId)
    .in("lesson_id", lessonIds);

  return new Set((data ?? []).map((r) => r.lesson_id));
}

export async function completeLesson(contactId: string, lessonId: string, product: "metodo_calice") {
  const supabase = await createClient();
  await supabase.from("lesson_progress").upsert({
    contact_id: contactId,
    lesson_id: lessonId,
    completed_at: new Date().toISOString(),
  });
  await logEvent(contactId, product, "lesson_completed", { lesson_id: lessonId });
}

// Log é gerado pelo próprio app, não input do usuário — grava via
// service_role (só existe policy de leitura pro contato em product_events).
async function logEvent(contactId: string, product: string, eventType: string, payload: Record<string, unknown>) {
  const admin = createAdminClient();
  const { error } = await admin.from("product_events").insert({
    contact_id: contactId,
    product,
    event_type: eventType,
    payload,
  });
  if (error) console.error("logEvent falhou", eventType, error);
}

// Lê o critério em `product_completion_rules` (editável no Supabase sem
// redeploy) e decide se o produto está "completo" pra esse contato. Se
// estiver e ainda não tinha sido marcado, seta `completed_at` em
// product_access (via service_role, já que o client comum não teria
// permissão de escrita ali) e registra o evento.
export async function evaluateCompletion(contactId: string, product: "metodo_calice") {
  const supabase = await createClient();

  const { data: ruleRow } = await supabase
    .from("product_completion_rules")
    .select("rule, active")
    .eq("product", product)
    .maybeSingle();

  if (!ruleRow?.active) return false;

  const rule = ruleRow.rule as { require_book?: boolean; require_lessons?: "all" | "none" | number };

  if (rule.require_book) {
    const book = await getBookProgress(contactId, product);
    if (!book.completed) return false;
  }

  if (rule.require_lessons && rule.require_lessons !== "none") {
    const [lessons, completedIds] = await Promise.all([
      getLessons(product),
      getCompletedLessonIds(contactId, product),
    ]);

    const required = rule.require_lessons === "all" ? lessons.length : rule.require_lessons;
    if (completedIds.size < required) return false;
  }

  const admin = createAdminClient();
  const { data: access } = await admin
    .from("product_access")
    .select("completed_at")
    .eq("contact_id", contactId)
    .eq("product", product)
    .maybeSingle();

  if (access && !access.completed_at) {
    await admin
      .from("product_access")
      .update({ completed_at: new Date().toISOString() })
      .eq("contact_id", contactId)
      .eq("product", product);
    await logEvent(contactId, product, "product_completed", {});
    // dispara exatamente 1x por pessoa/produto (só na transição do completed_at)
    await captureServer(contactId, "product_completed", { product });
  }

  return true;
}

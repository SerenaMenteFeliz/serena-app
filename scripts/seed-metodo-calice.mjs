import { createClient } from "@supabase/supabase-js";

const url = "https://ddgtoebsmmyneumolycy.supabase.co";
const serviceKey = process.argv[2];
const supabase = createClient(url, serviceKey);

async function main() {
  // Capítulos placeholder — trocar pelo conteúdo real do documento da Ge.
  const chapters = [
    {
      product: "metodo_calice",
      order_index: 1,
      title: "Introdução ao Método Cálice",
      body_md:
        "# Bem-vinda ao Método Cálice\n\nEste é um capítulo de exemplo, esperando o conteúdo real do documento da Ge.\n\nO **Método Cálice** é um caminho de reprogramação mental — este texto é só um placeholder pra validar a experiência de leitura.",
    },
    {
      product: "metodo_calice",
      order_index: 2,
      title: "O que é reprogramação mental",
      body_md:
        "## Capítulo 2\n\nConteúdo de exemplo. Aqui entra a explicação de base do método.\n\n> Uma citação de exemplo pra testar a formatação.",
    },
    {
      product: "metodo_calice",
      order_index: 3,
      title: "Fechamento",
      body_md: "## Capítulo final\n\nEste é o último capítulo do placeholder — terminar de ler aqui marca o livro como concluído.",
    },
  ];

  const { error: chError } = await supabase.from("book_chapters").upsert(chapters, { onConflict: "product,order_index" });
  if (chError) throw chError;
  console.log("capítulos ok");

  // Aulas placeholder — mistura de blocos texto/vídeo/imagem.
  const lessonsSpec = [
    {
      order_index: 1,
      title: "Aula 1 — Prática de respiração",
      blocks: [
        { order_index: 1, block_type: "text", content: { markdown: "## Antes de começar\n\nEncontre um lugar tranquilo e sente-se confortavelmente." } },
        { order_index: 2, block_type: "video", content: { youtube_id: "dQw4w9WgXcQ" } },
        { order_index: 3, block_type: "text", content: { markdown: "Repita esse exercício 3 vezes ao dia." } },
      ],
    },
    {
      order_index: 2,
      title: "Aula 2 — Visualização guiada",
      blocks: [
        { order_index: 1, block_type: "text", content: { markdown: "## Visualização\n\nFeche os olhos e imagine..." } },
        { order_index: 2, block_type: "image", content: { url: "https://placehold.co/800x450/2a1a4d/ffffff?text=Imagem+de+exemplo", alt: "Imagem ilustrativa de exemplo" } },
      ],
    },
  ];

  for (const spec of lessonsSpec) {
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .upsert({ product: "metodo_calice", order_index: spec.order_index, title: spec.title }, { onConflict: "product,order_index" })
      .select("id")
      .single();
    if (lessonError) throw lessonError;

    const blocks = spec.blocks.map((b) => ({ ...b, lesson_id: lesson.id }));
    const { error: blockError } = await supabase.from("lesson_blocks").upsert(blocks, { onConflict: "lesson_id,order_index" });
    if (blockError) throw blockError;
  }
  console.log("aulas ok");
}

main().catch((e) => {
  console.error("ERRO:", e);
  process.exit(1);
});

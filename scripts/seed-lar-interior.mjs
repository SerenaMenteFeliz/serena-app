import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

// Semeia as 14 sessões do Lar Interior (7 temas × teórica + prática) a partir
// dos roteiros reais da Liz no vault da família — mesma decisão tomada no
// Método Cálice: enquanto os áudios/vídeos não são gravados, o roteiro entra
// como leitura guiada (os textos já são em segunda pessoa, funcionam como
// prática auto-conduzida). Quando a Liz gravar, cada sessão ganha um bloco
// "video" na frente e o resto fica como material de apoio — sem mudar código.
//
// Transformação: `# Aula N – Tema` + `## Gravação NA/NB — Subtítulo` viram
// duas sessões (order 2N-1 e 2N). Cada `### Momento` vira um bloco de texto.
// A seção "Objetivos" (produção, fala com a Liz) e a linha de duração são
// removidas do corpo — a duração é impressa no final pra virar const na lib.

const VAULT_DIR =
  "C:\\Users\\Yan\\Desktop\\Yan\\Obsidian\\Vault Zuppas\\Vault Zuppas\\20 - Projetos\\Lar Interior";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();
const supabase = createClient(url, serviceKey);

const DASH = "[\\u2013\\u2014-]"; // roteiros alternam – — e -

function parseRoteiro(aulaNum) {
  const file = path.join(VAULT_DIR, `Lar Interior - Roteiro Aula ${aulaNum}.md`);
  const raw = readFileSync(file, "utf8");

  const tema = raw.match(new RegExp(`^# Aula \\d+ ${DASH} (.+)$`, "m"))[1].trim();

  // divide nas duas gravações; [0] é o preâmbulo (frontmatter + título)
  const parts = raw.split(/^## Gravação /m).slice(1);
  if (parts.length !== 2) throw new Error(`Aula ${aulaNum}: esperava 2 gravações, achei ${parts.length}`);

  return parts.map((part, i) => {
    const header = part.match(new RegExp(`^\\d+[AB] ${DASH} (.+)$`, "m"))[1].trim();
    const durMatch = part.match(/estimado: ~?(\d+) min/);
    let minutes = durMatch ? Number(durMatch[1]) : null;

    let body = part.slice(part.indexOf("\n") + 1);
    // remove a linha de metadados de produção ("**... · estimado: ~X min**")
    body = body.replace(/^\*\*.*estimado:.*\*\*$/m, "");
    // remove a seção Objetivos inteira (até o próximo ---)
    body = body.replace(/### Objetivos[\s\S]*?(?=\n---)/, "");

    // cada Momento vira um bloco; título perde o "Momento N –" e o "(X min)"
    const momentos = body.split(/^### Momento /m).slice(1);
    if (momentos.length === 0) throw new Error(`Aula ${aulaNum}${i ? "B" : "A"}: nenhum Momento`);

    if (minutes == null) {
      minutes = momentos.reduce((sum, m) => {
        const t = m.match(/^\d+ .*?\((\d+)(?:\s*a\s*(\d+))?\s*min\)/);
        return sum + (t ? Number(t[2] ?? t[1]) : 0);
      }, 0) || null;
    }

    const blocks = momentos.map((m) => {
      const titleLine = m.slice(0, m.indexOf("\n")).trim();
      const title = titleLine
        .replace(new RegExp(`^\\d+ ${DASH} `), "")
        .replace(/\s*\([^)]*min[^)]*\)\s*$/i, "")
        .trim();
      let text = m.slice(m.indexOf("\n") + 1);
      text = text.replace(/\n---\s*$/g, "").replace(/^---$/gm, "").trim();
      return { markdown: `## ${title}\n\n${text}` };
    });

    return { title: `${tema} — ${header}`, minutes, blocks };
  });
}

const sessions = [];
for (let aula = 1; aula <= 7; aula++) {
  const [teorica, pratica] = parseRoteiro(aula);
  sessions.push({ order_index: aula * 2 - 1, ...teorica });
  sessions.push({ order_index: aula * 2, ...pratica });
}

// idempotente: limpa e reinsere (cascade apaga blocos; progresso de teste
// referencia lesson_id novo, então zera junto — aceitável pré-lançamento)
const { error: delError } = await supabase.from("lessons").delete().eq("product", "lar_interior");
if (delError) throw delError;

for (const s of sessions) {
  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({ product: "lar_interior", order_index: s.order_index, title: s.title })
    .select("id")
    .single();
  if (error) throw error;

  const rows = s.blocks.map((b, i) => ({
    lesson_id: lesson.id,
    order_index: i + 1,
    block_type: "text",
    content: b.markdown ? { markdown: b.markdown } : b,
  }));
  const { error: blockError } = await supabase.from("lesson_blocks").insert(rows);
  if (blockError) throw blockError;

  console.log(
    `✓ ${String(s.order_index).padStart(2)} · ${s.title} — ${s.blocks.length} blocos, ~${s.minutes ?? "?"} min`
  );
}

console.log("\nDurações pra lib (const MINUTOS):");
console.log(JSON.stringify(Object.fromEntries(sessions.map((s) => [s.order_index, s.minutes]))));

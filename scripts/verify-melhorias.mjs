// Verificação visual da rodada de melhorias de 12/07 (error boundaries,
// cross-sell, constância, diário do Lar, SOS, check-in de humor, celebração).
// Monta estados reais no banco pro usuário de preview e fotografa cada
// feature no estado que a ativa. Lê chaves do .env.local.
//
// Uso: npm start (noutro terminal) e depois: node scripts/verify-melhorias.mjs
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const outDir = "screenshots-melhorias";
const email = "preview-serena-app@example.com";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ── usuário/contato/acessos (idempotente, igual verify-app.mjs) ─────────────
let userId;
const { data: created, error: createError } = await supabase.auth.admin.createUser({
  email,
  email_confirm: true,
});
if (createError && createError.message.includes("already been registered")) {
  const { data: list } = await supabase.auth.admin.listUsers();
  userId = list.users.find((u) => u.email === email)?.id;
} else if (createError) {
  throw createError;
} else {
  userId = created.user.id;
}

const { data: contact, error: contactError } = await supabase
  .from("contacts")
  .upsert({ email, auth_user_id: userId, nome: "Ana Preview" }, { onConflict: "email" })
  .select("id")
  .single();
if (contactError) throw contactError;

for (const product of ["metodo_calice", "lar_interior"]) {
  await supabase
    .from("product_access")
    .upsert({ contact_id: contact.id, product, status: "active" }, { onConflict: "contact_id,product" });
}

// ── estados que ativam as features ──────────────────────────────────────────
// ritmo de 7 dias escolhido (evento; o mais recente vale)
await supabase.from("product_events").insert({
  contact_id: contact.id,
  product: "lar_interior",
  event_type: "pace_chosen",
  payload: { pace: 7 },
});

// Lar completo: as 14 sessões vividas, espalhadas nos últimos 7 dias — isso
// ativa: home "completo" + marco, /lar-interior/celebracao, e a constância
// ("7 dias seguidos") no hub/homes.
const { data: larLessons } = await supabase
  .from("lessons")
  .select("id, order_index")
  .eq("product", "lar_interior")
  .order("order_index");
for (const l of larLessons ?? []) {
  const diasAtras = 7 - Math.ceil(l.order_index / 2); // tema 1 → 6 dias atrás ... tema 7 → hoje
  const quando = new Date(Date.now() - diasAtras * 86_400_000);
  await supabase.from("lesson_progress").upsert(
    { contact_id: contact.id, lesson_id: l.id, completed_at: quando.toISOString() },
    { onConflict: "contact_id,lesson_id" }
  );
}

// Cálice completo: livro no fim + 10 práticas + completed_at no acesso — isso
// ativa o cross-sell no hub e /metodo-calice/celebracao.
const { data: caliceChapters } = await supabase
  .from("book_chapters")
  .select("order_index")
  .eq("product", "metodo_calice")
  .order("order_index", { ascending: false })
  .limit(1);
await supabase.from("book_progress").upsert(
  {
    contact_id: contact.id,
    product: "metodo_calice",
    last_chapter_order: caliceChapters?.[0]?.order_index ?? 13,
    completed: true,
    updated_at: new Date().toISOString(),
  },
  { onConflict: "contact_id,product" }
);
const { data: caliceLessons } = await supabase
  .from("lessons")
  .select("id, order_index")
  .eq("product", "metodo_calice")
  .order("order_index");
for (const l of caliceLessons ?? []) {
  const quando = new Date(Date.now() - (10 - l.order_index) * 86_400_000);
  await supabase.from("lesson_progress").upsert(
    { contact_id: contact.id, lesson_id: l.id, completed_at: quando.toISOString() },
    { onConflict: "contact_id,lesson_id" }
  );
}
await supabase
  .from("product_access")
  .update({ completed_at: new Date().toISOString() })
  .eq("contact_id", contact.id)
  .eq("product", "metodo_calice");

// ── login + fotos ────────────────────────────────────────────────────────────
const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo: "http://localhost:3000/auth/callback" },
});
if (linkError) throw linkError;

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const base = "http://localhost:3000";

async function shot(nome, rota) {
  if (rota) await page.goto(base + rota, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/${nome}.png`, fullPage: true });
  console.log(nome, "->", page.url());
}

await page.goto(linkData.properties.action_link, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
console.log("apos magic link:", page.url());

// hub: cross-sell (Cálice completo → CTA pro Lar) + pill de constância
await shot("01-hub-crosssell-constancia", "/hub");

// lar home: SOS flutuante + check-in (pergunta) + marco completo + constância
await shot("02-lar-home-checkin-pergunta", "/lar-interior");

// check-in respondido: toca "ansiosa" e fotografa a intenção ajustada
await page.getByText("ansiosa", { exact: true }).click();
await page.waitForTimeout(400);
await shot("03-lar-home-checkin-respondido", null);

// âncora do SOS no bônus
await page.getByText("SOS Ansiedade").first().click();
await page.waitForTimeout(900);
await shot("04-lar-bonus-ancora-sos", null);

// sessão vivida: link do marco + (diário oculto até a migration 0006)
await shot("05-lar-sessao14-vivida", "/lar-interior/sessoes/14");

// celebração do Lar
await shot("06-lar-celebracao", "/lar-interior/celebracao");

// cálice home: constância + marco
await shot("07-calice-home-constancia-marco", "/metodo-calice");

// celebração do Cálice
await shot("08-calice-celebracao", "/metodo-calice/celebracao");

// error boundaries (rotas temporárias que lançam de propósito)
await shot("09-error-boundary-raiz", "/dev-erro");
await shot("10-error-boundary-lar", "/lar-interior/dev-erro");

await browser.close();
console.log("screenshots em", outDir);

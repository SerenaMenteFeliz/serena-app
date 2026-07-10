// Verificação visual do app completo (hub + Lar Interior + Método Cálice +
// transversais): garante o usuário de preview com os DOIS produtos, gera um
// magic link admin e fotografa todas as telas em viewport mobile.
// Lê as chaves do .env.local (nada via argv).
//
// Uso: node scripts/verify-app.mjs [outDir]
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const outDir = process.argv[2] ?? "screenshots-app";
const email = "preview-serena-app@example.com";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// usuário + contato + acesso aos dois produtos (idempotente)
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

// estado limpo do Lar a cada rodada: sem ritmo escolhido e sem progresso, pro
// fluxo onboarding → home → sessão ser fotografado de ponta a ponta
await supabase
  .from("product_events")
  .delete()
  .eq("contact_id", contact.id)
  .eq("product", "lar_interior")
  .eq("event_type", "pace_chosen");
const { data: larLessons } = await supabase.from("lessons").select("id").eq("product", "lar_interior");
if (larLessons?.length) {
  await supabase
    .from("lesson_progress")
    .delete()
    .eq("contact_id", contact.id)
    .in("lesson_id", larLessons.map((l) => l.id));
}

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
  await page.goto(base + rota, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/${nome}.png`, fullPage: true });
  console.log(nome, "->", page.url());
}

// deslogada: os três logins + 404
await shot("00-entrar-generico", "/entrar");
await shot("01-entrar-lar", "/lar-interior/entrar");
await shot("02-entrar-calice", "/metodo-calice/entrar");
await shot("03-404", "/rota-que-nao-existe");

// login
await page.goto(linkData.properties.action_link, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
console.log("apos magic link:", page.url());

// guarda-chuva
await shot("04-hub", "/hub");
await shot("05-perfil", "/perfil");

// Lar Interior — fluxo real: onboarding → escolher ritmo de 7 → home
await shot("06-lar-onboarding", "/lar-interior/comecar");
await page.getByText("Em 7 dias").click();
await page.waitForURL("**/lar-interior", { timeout: 15000 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${outDir}/07-lar-home.png`, fullPage: true });
console.log("07-lar-home ->", page.url());

await shot("08-lar-sessoes", "/lar-interior/sessoes");
await shot("09-lar-sessao-1", "/lar-interior/sessoes/1");

// concluir a sessão 1 pra ver estados pós-conclusão (cota 7d permite a 2ª)
await page.getByText("Concluir sessão de hoje").click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/10-lar-sessao-1-vivida.png`, fullPage: true });
console.log("10-lar-sessao-1-vivida");
await shot("11-lar-home-progresso", "/lar-interior");
await shot("12-lar-bonus", "/lar-interior/bonus");

// Método Cálice (regressão do redesign anterior)
await shot("13-calice-home", "/metodo-calice");
await shot("14-calice-livro", "/metodo-calice/livro");
await shot("15-calice-capitulo", "/metodo-calice/livro/1");
await shot("16-calice-aulas", "/metodo-calice/aulas");
await shot("17-calice-aula-1", "/metodo-calice/aulas/1");

await browser.close();
console.log("screenshots em", outDir);

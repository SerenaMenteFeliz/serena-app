// Verificação visual do redesign Santuário + Véu: garante o usuário de
// preview, gera um magic link admin e fotografa todas as telas do Método
// Cálice em viewport mobile. Lê as chaves do .env.local (nada via argv).
//
// Uso: node scripts/verify-redesign.mjs [outDir]
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const outDir = process.argv[2] ?? "screenshots-redesign";
const email = "preview-serena-app@example.com";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// usuário + contato + acesso ao produto (idempotente, mesma lógica do seed)
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

await supabase
  .from("product_access")
  .upsert(
    { contact_id: contact.id, product: "metodo_calice", status: "active" },
    { onConflict: "contact_id,product" }
  );

const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo: "http://localhost:3000/auth/callback" },
});
if (linkError) throw linkError;

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// tela de login (deslogada) primeiro
await page.goto("http://localhost:3000/metodo-calice/entrar", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/00-entrar.png`, fullPage: true });

await page.goto(linkData.properties.action_link, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
console.log("apos magic link:", page.url());

const rotas = [
  ["01-home", "/metodo-calice"],
  ["02-livro", "/metodo-calice/livro"],
  ["03-capitulo-1", "/metodo-calice/livro/1"],
  ["04-notas", "/metodo-calice/notas"],
  ["05-aulas", "/metodo-calice/aulas"],
  ["06-aula-1", "/metodo-calice/aulas/1"],
  ["07-perfil", "/perfil"],
];

for (const [nome, rota] of rotas) {
  await page.goto("http://localhost:3000" + rota, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/${nome}.png`, fullPage: true });
  console.log(nome, "->", page.url());
}

await browser.close();
console.log("screenshots em", outDir);

import { chromium } from "playwright";

const actionLink = process.argv[2];
const outDir = "C:/Users/Yan/AppData/Local/Temp/shots";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(actionLink, { waitUntil: "networkidle" });
console.log("apos magic link, url:", page.url());

const rotas = [
  ["metodo-calice", "/metodo-calice"],
  ["metodo-calice-livro", "/metodo-calice/livro"],
  ["metodo-calice-cap1", "/metodo-calice/livro/1"],
  ["metodo-calice-aulas", "/metodo-calice/aulas"],
  ["metodo-calice-aula1", "/metodo-calice/aulas/1"],
];

for (const [nome, rota] of rotas) {
  await page.goto("http://localhost:3000" + rota, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/_${nome}.png`, fullPage: true });
  console.log(nome, "->", page.url());
}

await browser.close();

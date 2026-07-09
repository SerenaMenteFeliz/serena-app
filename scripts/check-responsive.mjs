import { chromium } from "playwright";

const links = process.argv.slice(2);
const outDir = "C:/Users/Yan/AppData/Local/Temp/shots";
const viewports = [
  ["mobile", 390, 844],
  ["tablet", 768, 1024],
  ["desktop", 1440, 900],
];

const browser = await chromium.launch();

for (let i = 0; i < viewports.length; i++) {
  const [nome, width, height] = viewports[i];
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(links[i], { waitUntil: "networkidle" });
  await page.goto("http://localhost:3000/metodo-calice", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/_responsive-capa-${nome}.png` });
  await page.goto("http://localhost:3000/metodo-calice/livro/1", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/_responsive-leitor-${nome}.png` });
  await page.close();
}

await browser.close();
console.log("ok");

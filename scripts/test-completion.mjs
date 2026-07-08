import { chromium } from "playwright";

const actionLink = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(actionLink, { waitUntil: "networkidle" });

// Lê todos os capítulos até o fim (marca o livro como concluído).
for (const cap of [1, 2, 3]) {
  await page.goto(`http://localhost:3000/metodo-calice/livro/${cap}`, { waitUntil: "networkidle" });
}

// Conclui as duas aulas.
for (const aula of [1, 2]) {
  await page.goto(`http://localhost:3000/metodo-calice/aulas/${aula}`, { waitUntil: "networkidle" });
  await page.click('button:has-text("Marcar aula como concluída")');
  await page.waitForTimeout(500);
}

await page.screenshot({ path: "C:/Users/Yan/AppData/Local/Temp/shots/_aula2-concluida.png", fullPage: true });
await browser.close();
console.log("fluxo de conclusão executado");

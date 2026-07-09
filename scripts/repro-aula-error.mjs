import { chromium } from "playwright";

const actionLink = process.argv[2];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

page.on("console", (msg) => console.log("[console]", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("[pageerror]", err.message));
page.on("response", (res) => {
  if (res.status() >= 400) console.log("[http]", res.status(), res.url());
});

await page.goto(actionLink, { waitUntil: "networkidle" });
console.log("apos magic link, url:", page.url());

await page.goto("http://localhost:3000/metodo-calice/aulas/1", { waitUntil: "networkidle" });
console.log("aula 1 url final:", page.url());
console.log("aula 1 status ok?", await page.title());

await page.screenshot({ path: "C:/Users/Yan/AppData/Local/Temp/shots/_repro-aula1.png", fullPage: true });

await browser.close();

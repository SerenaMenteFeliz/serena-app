import { chromium } from "playwright";
import { copyFileSync } from "node:fs";

// Gera os ícones do PWA renderizando a marca com o mesmo vocabulário do app:
// véu teal do guarda-chuva + janela em arco de vidro + sol dourado dentro
// (a porta pra um lugar luminoso). Conteúdo centrado na zona segura de 60%
// pra sobreviver ao recorte "maskable" do Android.
const html = `<!doctype html><html><head><style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 100vw; height: 100vh; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(170deg, #fbfdfd 0%, #eff8f6 45%, #dcefe9 100%);
  }
  .arch {
    width: 46vw; height: 56vh;
    border-radius: 50vw 50vw 6vw 6vw;
    background: rgba(255, 255, 255, 0.6);
    border: 1.2vw solid rgba(255, 255, 255, 0.95);
    box-shadow: 0 4vw 10vw -6vw rgba(94, 182, 166, 0.6);
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .sun {
    width: 20vw; height: 20vw; border-radius: 50%;
    background: radial-gradient(circle at 42% 38%, #f6d795, #ecc27c 55%, #d9973e);
    box-shadow: 0 0 8vw 2vw rgba(236, 194, 124, 0.55);
  }
</style></head><body><div class="arch"><div class="sun"></div></div></body></html>`;

const browser = await chromium.launch();
for (const size of [512, 192]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(html);
  await page.screenshot({ path: `public/icon-${size}.png` });
  await page.close();
  console.log(`✓ public/icon-${size}.png`);
}
await browser.close();

// favicon/ícone da aba — o Next serve app/icon.png automaticamente
copyFileSync("public/icon-512.png", "app/icon.png");
console.log("✓ app/icon.png");

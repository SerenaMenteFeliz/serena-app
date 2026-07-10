import { Lora, Manrope } from "next/font/google";

// Dupla tipográfica do Lar Interior: Lora nos títulos e momentos emocionais
// (serif quente e humanista — a voz acolhedora da Liz, distinta da Cormorant
// do Cálice) e Manrope como base de UI (compartilhada com o resto do app).
// Carregadas só nas rotas do produto, mesmo padrão do Cálice.
const larSerif = Lora({
  variable: "--font-lar-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const larUi = Manrope({
  variable: "--font-lar-ui",
  subsets: ["latin"],
});

export const larFontVars = `${larSerif.variable} ${larUi.variable}`;

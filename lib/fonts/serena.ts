import { Fraunces, Manrope } from "next/font/google";

// Tipografia do guarda-chuva Serena Mente Feliz (hub + perfil + telas
// transversais): Fraunces nos títulos (serif acolhedora e arredondada — a
// marca-mãe, distinta da Cormorant do Cálice e da Lora do Lar) e Manrope
// como base de UI. Carregadas só nas rotas do guarda-chuva.
const serenaSerif = Fraunces({
  variable: "--font-serena-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const serenaUi = Manrope({
  variable: "--font-serena-ui",
  subsets: ["latin"],
});

export const serenaFontVars = `${serenaSerif.variable} ${serenaUi.variable}`;

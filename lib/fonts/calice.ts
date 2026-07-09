import { Cormorant_Garamond, Jost, Manrope } from "next/font/google";

// Trio tipográfico da direção "Santuário + Véu" (ver Método Cálice - Visão
// Geral no vault): Cormorant nos títulos/momentos emocionais, Jost em labels
// e texto curto, Manrope como base da UI. Carregadas só nas rotas do Método
// Cálice (layout do produto + página de login dele) pra não pesar nos outros.
const caliceSerif = Cormorant_Garamond({
  variable: "--font-calice-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const caliceSans = Jost({
  variable: "--font-calice-sans",
  subsets: ["latin"],
});

const caliceUi = Manrope({
  variable: "--font-calice-ui",
  subsets: ["latin"],
});

export const caliceFontVars = `${caliceSerif.variable} ${caliceSans.variable} ${caliceUi.variable}`;

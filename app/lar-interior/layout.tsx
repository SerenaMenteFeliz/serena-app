import type { Viewport } from "next";
import { larFontVars } from "@/lib/fonts/lar";

// Barra de status no topo do véu do Lar (--veil-0 do .theme-lar-interior).
export const viewport: Viewport = { themeColor: "#fdfbf6" };

// Só injeta as variáveis das fontes do produto — `display: contents` pra não
// criar caixa no layout. O tema (cores) continua vindo do shell de cada page.
export default function LarInteriorLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${larFontVars} contents`}>{children}</div>;
}

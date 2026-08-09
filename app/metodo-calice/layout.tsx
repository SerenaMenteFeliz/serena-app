import type { Viewport } from "next";
import { caliceFontVars } from "@/lib/fonts/calice";

// A barra de status do sistema acompanha o topo do véu do produto (--veil-0
// do .theme-metodo-calice) — antes toda rota herdava o verde-menta do hub.
export const viewport: Viewport = { themeColor: "#fdfcfe" };

// Só injeta as variáveis das fontes do produto — `display: contents` pra não
// criar caixa no layout. O tema (cores) continua vindo do shell de cada page.
export default function MetodoCaliceLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${caliceFontVars} contents`}>{children}</div>;
}

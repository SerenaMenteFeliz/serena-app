import { caliceFontVars } from "@/lib/fonts/calice";

// Só injeta as variáveis das fontes do produto — `display: contents` pra não
// criar caixa no layout. O tema (cores) continua vindo do shell de cada page.
export default function MetodoCaliceLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${caliceFontVars} contents`}>{children}</div>;
}

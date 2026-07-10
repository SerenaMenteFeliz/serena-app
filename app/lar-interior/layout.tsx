import { larFontVars } from "@/lib/fonts/lar";

// Só injeta as variáveis das fontes do produto — `display: contents` pra não
// criar caixa no layout. O tema (cores) continua vindo do shell de cada page.
export default function LarInteriorLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${larFontVars} contents`}>{children}</div>;
}

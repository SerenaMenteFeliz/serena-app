import { caliceFontVars } from "@/lib/fonts/calice";
import { larFontVars } from "@/lib/fonts/lar";

// O hub é a vitrine: carrega as fontes dos dois produtos pra cada portal
// mostrar o mundo de dentro com a tipografia real dele (as do guarda-chuva,
// Fraunces + Manrope, já vêm do root layout).
export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${caliceFontVars} ${larFontVars} contents`}>{children}</div>;
}

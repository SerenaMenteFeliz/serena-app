import { serenaFontVars } from "@/lib/fonts/serena";
import { caliceFontVars } from "@/lib/fonts/calice";
import { larFontVars } from "@/lib/fonts/lar";

// O hub é a vitrine: além das fontes do guarda-chuva, carrega as dos dois
// produtos — cada portal mostra o mundo de dentro com a tipografia real dele.
export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${serenaFontVars} ${caliceFontVars} ${larFontVars} contents`}>{children}</div>;
}

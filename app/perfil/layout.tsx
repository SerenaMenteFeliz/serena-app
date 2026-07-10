import { serenaFontVars } from "@/lib/fonts/serena";

// Perfil fala a língua do guarda-chuva — só as fontes da marca-mãe.
export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${serenaFontVars} contents`}>{children}</div>;
}

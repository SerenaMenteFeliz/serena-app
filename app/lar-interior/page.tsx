import { requireProductAccess } from "@/lib/access";
import { AppShell } from "@/components/AppShell";

export default async function LarInteriorPage() {
  await requireProductAccess("lar_interior");

  return (
    <AppShell theme="lar-interior" homeHref="/lar-interior" showHubLink>
      <h1 className="text-2xl font-semibold">Lar Interior</h1>
      <p>Desafio de 7 Dias — conteúdo entra aqui.</p>
    </AppShell>
  );
}

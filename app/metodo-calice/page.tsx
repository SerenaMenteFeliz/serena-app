import { requireProductAccess } from "@/lib/access";
import { AppShell } from "@/components/AppShell";

export default async function MetodoCalicePage() {
  await requireProductAccess("metodo_calice");

  return (
    <AppShell theme="metodo-calice" homeHref="/metodo-calice" showHubLink>
      <h1 className="text-2xl font-semibold">Método Cálice</h1>
      <p>Conteúdo entra aqui assim que o material da Ge estiver definido.</p>
    </AppShell>
  );
}

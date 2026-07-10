import { redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getPace } from "@/lib/lar";
import { escolherRitmo } from "@/lib/actions/lar";
import { LarShell } from "@/components/lar/LarShell";
import { LarSun } from "@/components/lar/LarSun";

// Onboarding do desafio: uma pergunta só, feita uma vez. A escolha define a
// trava diária de desbloqueio (7 dias → teoria + prática juntas; 14 dias →
// uma sessão por dia) e pode ser trocada depois por /lar-interior/comecar?trocar=1.
export default async function ComecarPage({
  searchParams,
}: {
  searchParams: Promise<{ trocar?: string }>;
}) {
  const { contactId } = await requireProductAccess("lar_interior");
  const [pace, params] = await Promise.all([getPace(contactId), searchParams]);

  if (pace && params.trocar === undefined) redirect("/lar-interior");

  const opcoes = [
    {
      pace: 7 as const,
      titulo: "Em 7 dias",
      resumo: "Teoria e prática do mesmo tema no mesmo dia (~40 min/dia).",
      pra: "pra quem quer imersão total",
    },
    {
      pace: 14 as const,
      titulo: "Em 14 dias",
      resumo: "Uma sessão por dia, no seu tempo (~20 min/dia).",
      pra: "pra quem está começando devagar",
    },
  ];

  return (
    <LarShell nav={false}>
      <div className="flex min-h-[85dvh] flex-col justify-center py-6">
        <div className="veil-arch glass-card relative mx-auto flex h-[190px] w-[190px] items-end justify-center overflow-hidden">
          <LarSun width={160} height={112} />
        </div>

        <h1 className="mt-6 text-center font-display text-[26px] leading-tight">
          Como você quer viver
          <br />o Desafio de 7 Dias?
        </h1>
        <p className="mx-auto mt-2 max-w-[300px] text-center text-sm leading-relaxed opacity-60">
          São 7 temas, cada um com uma aula e uma prática guiada. Escolha o ritmo que cabe na sua
          vida — dá pra mudar depois.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {opcoes.map((op) => (
            <form key={op.pace} action={escolherRitmo.bind(null, op.pace)}>
              <button
                type="submit"
                className="glass-card group w-full cursor-pointer px-5 py-4 text-left transition-transform active:scale-[0.985]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display whitespace-nowrap text-xl">{op.titulo}</span>
                  <span
                    className="text-right text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: "var(--accent)" }}
                  >
                    {op.pra}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed opacity-65">{op.resumo}</p>
              </button>
            </form>
          ))}
        </div>

        {pace && (
          <p className="mt-5 text-center text-xs opacity-50">
            Hoje você está no ritmo de {pace} dias.
          </p>
        )}
      </div>
    </LarShell>
  );
}

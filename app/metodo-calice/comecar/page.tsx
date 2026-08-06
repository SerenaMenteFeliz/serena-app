import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProductAccess, getContactFirstName } from "@/lib/access";
import { getChapters, getBookProgress, getLessonsWithProgress } from "@/lib/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { CaliceBook } from "@/components/calice/CaliceBook";
import { Track } from "@/components/analytics/Track";
import { BookIcon, PlayIcon, SparkleIcon } from "@/components/calice/icons";

// Boas-vindas de quem acabou de comprar: explica os dois formatos (Livro de
// leitura livre + os 10 Dias de desbloqueio sequencial) antes de soltar a
// pessoa na home. Só aparece uma vez — assim que ela abre o 1º capítulo ou
// conclui o 1º dia, o progresso deixa de ser zero e a home
// (app/metodo-calice/page.tsx) para de redirecionar pra cá. Sem coluna nova
// só pra marcar "já viu", o próprio progresso zerado já é o sinal.
export default async function ComecarCalicePage() {
  const { contactId } = await requireProductAccess("metodo_calice");

  const [chapters, progress, lessons, firstName] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
    getLessonsWithProgress(contactId, "metodo_calice"),
    getContactFirstName(contactId),
  ]);

  const lessonsDone = lessons.filter((l) => l.completed).length;
  if (progress.last_chapter_order > 0 || lessonsDone > 0) redirect("/metodo-calice");

  const primeiroCapitulo = chapters[0]?.order_index;

  return (
    <CaliceShell nav={false}>
      <Track event="calice_onboarding_viewed" contactId={contactId} />
      <div className="flex min-h-[85dvh] flex-col justify-center py-6">
        <div className="veil-arch glass-card relative mx-auto h-[190px] w-[190px] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 85%, rgba(217,168,84,0.22), transparent 60%)" }}
          />
          <div className="float-slow absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
            <CaliceBook width={90} height={128} />
          </div>
        </div>

        <h1 className="mt-6 text-center font-display text-[26px] leading-tight">
          Que bom ter você aqui{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mx-auto mt-2 max-w-[300px] text-center font-veil-sans text-sm leading-relaxed opacity-65">
          O Método Cálice tem dois caminhos, e você decide como andar entre eles.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <div className="glass-card flex items-start gap-3 px-4 py-3.5">
            <span className="glass-orb shrink-0" style={{ borderColor: "var(--gold)" }}>
              <BookIcon />
            </span>
            <div>
              <p className="font-veil-sans text-sm font-bold">O Livro</p>
              <p className="mt-0.5 font-veil-sans text-[13px] leading-relaxed opacity-65">
                13 capítulos, leia na ordem que fizer sentido pra você — nada é bloqueado.
              </p>
            </div>
          </div>
          <div className="glass-card flex items-start gap-3 px-4 py-3.5">
            <span className="glass-orb shrink-0" style={{ borderColor: "var(--sage)" }}>
              <PlayIcon />
            </span>
            <div>
              <p className="font-veil-sans text-sm font-bold">Os 10 Dias de Prática</p>
              <p className="mt-0.5 font-veil-sans text-[13px] leading-relaxed opacity-65">
                Um dia de cada vez — cada dia desbloqueia o próximo assim que você conclui.
              </p>
            </div>
          </div>
        </div>

        {primeiroCapitulo != null && (
          <Link
            href={`/metodo-calice/livro/${primeiroCapitulo}`}
            className="glass-card glass-card-strong mt-7 flex items-center justify-center gap-2 px-4 py-4 font-veil-sans text-sm font-bold"
            style={{ color: "var(--accent)" }}
          >
            <SparkleIcon size={16} /> Começar pelo Capítulo 1
          </Link>
        )}
      </div>
    </CaliceShell>
  );
}

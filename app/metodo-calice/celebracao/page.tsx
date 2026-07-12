import { redirect } from "next/navigation";
import Link from "next/link";
import { requireProductAccess, getContactFirstName } from "@/lib/access";
import { getChapters, getBookProgress, getLessonsWithProgress } from "@/lib/calice";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { CaliceBook } from "@/components/calice/CaliceBook";
import { ShareActions } from "@/components/ShareActions";
import { Track } from "@/components/analytics/Track";
import { ChevronLeftIcon } from "@/components/calice/icons";

// O marco do Cálice completo (livro lido + práticas vividas) — tela composta
// pra print/story. Quem chegar por URL sem completar volta pra home.
export default async function CelebracaoCalicePage() {
  const { contactId } = await requireProductAccess("metodo_calice");

  const [chapters, book, lessons, firstName] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
    getLessonsWithProgress(contactId, "metodo_calice"),
    getContactFirstName(contactId),
  ]);

  const praticasFeitas = lessons.filter((l) => l.completed).length;
  const completo = book.completed && lessons.length > 0 && praticasFeitas === lessons.length;
  if (!completo) redirect("/metodo-calice");

  const textoShare = `Terminei o Método Cálice — ${chapters.length} capítulos lidos e ${lessons.length} dias de prática de reprogramação mental. ✨ Serena Mente Feliz`;

  return (
    <CaliceShell nav={false}>
      <Track event="share_card_viewed" contactId={contactId} props={{ product: "metodo_calice" }} />

      <div className="flex items-center justify-between">
        <Link
          href="/metodo-calice"
          aria-label="Voltar"
          className="-ml-1 p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <ChevronLeftIcon />
        </Link>
        <span className="w-7" aria-hidden />
      </div>

      {/* o card em si — composto pra caber num story */}
      <div className="veil-arch glass-card glass-card-strong relative mt-4 overflow-hidden px-6 pb-9 pt-14 text-center">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 28%, rgba(217,168,84,0.3), transparent 65%)" }}
        />
        <div
          className="absolute left-1/2 top-8 h-[140px] w-[140px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--gold) 50%, transparent)" }}
        />
        <div className="relative">
          <div className="flex justify-center pt-2">
            <CaliceBook width={72} height={102} />
          </div>

          <p className="font-veil-sans mt-6 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
            Método Cálice · completo{firstName ? ` · ${firstName}` : ""}
          </p>
          {/* 1ª pessoa de propósito: o card é a própria pessoa contando no story */}
          <h1 className="font-display mt-2 text-[26px] italic leading-snug">
            Reescrevi
            <br />a minha história
          </h1>

          <div className="mx-auto mt-5 flex max-w-[260px] items-center justify-center gap-6">
            <div>
              <p className="font-display text-[22px]" style={{ color: "var(--accent)" }}>
                {chapters.length}
              </p>
              <p className="font-veil-sans text-[10px] uppercase tracking-[0.08em] opacity-55">capítulos lidos</p>
            </div>
            <div className="h-8 w-px" style={{ background: "color-mix(in srgb, var(--gold) 45%, transparent)" }} />
            <div>
              <p className="font-display text-[22px]" style={{ color: "var(--accent)" }}>
                {lessons.length}
              </p>
              <p className="font-veil-sans text-[10px] uppercase tracking-[0.08em] opacity-55">dias de prática</p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-[30ch] font-display text-[15px] italic leading-relaxed opacity-70">
            “Quem você decide ser hoje já começou a existir.”
          </p>

          <p className="font-veil-sans mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-40">
            Método Cálice · Serena Mente Feliz
          </p>
        </div>
      </div>

      <ShareActions texto={textoShare} />
    </CaliceShell>
  );
}

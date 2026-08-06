import Link from "next/link";
import { redirect } from "next/navigation";
import { getProductAccessState, getContactFirstName } from "@/lib/access";
import { getChapters, getBookProgress, getLessonsWithProgress } from "@/lib/calice";
import { notesFeatureEnabled } from "@/lib/calice-notes";
import { getGreeting, getDailyQuote } from "@/lib/calice-daily";
import { getConstancia, fraseConstancia } from "@/lib/constancia";
import { CaliceShell } from "@/components/calice/CaliceShell";
import { CaliceBook } from "@/components/calice/CaliceBook";
import { Track } from "@/components/analytics/Track";
import { PRODUCT_PRICE, formatPrice } from "@/lib/pricing";
import {
  BookIcon,
  PlayIcon,
  PenIcon,
  UserIcon,
  ChevronRightIcon,
  CheckIcon,
  SparkleIcon,
  LockIcon,
} from "@/components/calice/icons";

export default async function MetodoCalicePage() {
  const { contactId, owned } = await getProductAccessState("metodo_calice");

  if (!owned) return <PreviewCalice contactId={contactId} />;

  const [chapters, progress, lessons, constancia, firstName, notasOn] = await Promise.all([
    getChapters("metodo_calice"),
    getBookProgress(contactId, "metodo_calice"),
    getLessonsWithProgress(contactId, "metodo_calice"),
    getConstancia(contactId),
    getContactFirstName(contactId),
    notesFeatureEnabled(),
  ]);

  const lessonsDone = lessons.filter((l) => l.completed).length;
  // Nunca abriu um capítulo nem concluiu um dia: primeira entrada pós-compra,
  // manda pras boas-vindas antes da home de verdade.
  if (progress.last_chapter_order === 0 && lessonsDone === 0) {
    redirect("/metodo-calice/comecar");
  }

  const frase = fraseConstancia(constancia);

  // Pra onde o toque no livro leva: próximo capítulo não lido, ou a lista
  // quando terminou (reler é escolha, não loop automático).
  const nextChapter =
    chapters.find((c) => c.order_index > progress.last_chapter_order)?.order_index ??
    chapters[0]?.order_index;
  const continueHref = progress.completed
    ? "/metodo-calice/livro"
    : nextChapter != null
      ? `/metodo-calice/livro/${nextChapter}`
      : "/metodo-calice/livro";

  const percent =
    chapters.length > 0
      ? Math.round((Math.min(progress.last_chapter_order, chapters.length) / chapters.length) * 100)
      : 0;
  // sem "cap. N": a numeração real dos títulos (3.1, 3.2...) não bate com order_index
  const continueLabel = progress.completed
    ? "livro concluído · toque para reler"
    : progress.last_chapter_order > 0
      ? `toque para continuar a leitura · ${percent}%`
      : "toque para começar o livro";

  const nextLesson = lessons.find((l) => !l.completed && !l.locked);

  const categorias = [
    { href: "/metodo-calice/livro", label: "Livro", border: "var(--gold)", icon: <BookIcon /> },
    { href: "/metodo-calice/aulas", label: "Aulas", border: "var(--sage)", icon: <PlayIcon /> },
    ...(notasOn
      ? [{ href: "/metodo-calice/notas", label: "Notas", border: "var(--lavender)", icon: <PenIcon /> }]
      : []),
    { href: "/perfil", label: "Perfil", border: "var(--rose)", icon: <UserIcon /> },
  ];

  const jornadaCompleta = progress.completed && lessons.length > 0 && !nextLesson && lessonsDone === lessons.length;

  return (
    <CaliceShell>
      <Track event="login" contactId={contactId} oncePerSession />
      {/* saudação */}
      <header className="flex items-center justify-between">
        <div>
          <p className="font-veil-sans text-[11px] font-semibold uppercase tracking-[0.12em] opacity-55">
            {getGreeting()}
          </p>
          <p className="font-display text-[26px] leading-tight">{firstName ?? "que bom te ver"}</p>
        </div>
        <Link
          href="/perfil"
          aria-label="Perfil"
          className="glass-orb h-[42px] w-[42px]"
          style={{ borderColor: "color-mix(in srgb, var(--gold) 50%, transparent)" }}
        >
          <span className="font-display text-lg" style={{ color: "var(--accent)" }}>
            {(firstName ?? "S").charAt(0)}
          </span>
        </Link>
      </header>

      {/* hero: santuário em arco com o livro flutuando */}
      <Link href={continueHref} className="veil-arch glass-card group relative mt-5 block h-[246px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 85%, rgba(217,168,84,0.22), transparent 60%)" }}
        />
        <div
          className="absolute left-1/2 top-5 h-[150px] w-[150px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--gold) 50%, transparent)" }}
        />
        <div className="float-slow absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-[1.04]">
          <CaliceBook />
        </div>
      </Link>
      <p className="mt-3 text-center font-veil-sans text-xs opacity-60">{continueLabel}</p>

      {/* constância — acompanhamento gentil, nunca cobrança (sem "0 dias") */}
      {frase && (
        <p className="mt-2 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-veil-sans text-[11px] font-semibold"
            style={{ background: "color-mix(in srgb, var(--gold) 14%, transparent)", color: "var(--accent)" }}
          >
            <SparkleIcon size={12} /> {frase}
          </span>
        </p>
      )}

      {/* categorias */}
      <div className="mt-5 flex justify-between px-2">
        {categorias.map((cat) => (
          <Link key={cat.href} href={cat.href} className="flex flex-col items-center gap-1.5">
            <span className="glass-orb" style={{ borderColor: cat.border }}>
              {cat.icon}
            </span>
            <span className="font-veil-sans text-[11px] font-semibold">{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* prática do dia */}
      {lessons.length > 0 && (
        <div className="mt-5">
          {nextLesson ? (
            <Link href={`/metodo-calice/aulas/${nextLesson.order_index}`} className="glass-card flex items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
                  Sua prática de hoje
                </p>
                <p className="mt-0.5 truncate font-veil-sans text-sm font-medium">{nextLesson.title}</p>
              </div>
              <ChevronRightIcon className="shrink-0 opacity-50" />
            </Link>
          ) : (
            <>
              <div className="glass-card flex items-center gap-3 px-4 py-3.5">
                <CheckIcon className="shrink-0" />
                <p className="font-veil-sans text-sm font-medium">
                  As {lessonsDone} práticas concluídas — jornada completa
                </p>
              </div>
              {jornadaCompleta && (
                <Link
                  href="/metodo-calice/celebracao"
                  className="glass-card glass-card-strong mt-2 flex items-center justify-center gap-2 px-4 py-3.5 font-veil-sans text-sm font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  <SparkleIcon size={16} /> Seu marco do Cálice — veja e compartilhe
                </Link>
              )}
            </>
          )}
        </div>
      )}

      {/* pensamento do dia */}
      <div className="surface-card-dark relative mt-4 overflow-hidden px-[18px] py-4">
        <div
          className="absolute -right-2.5 -top-2.5 h-[60px] w-[60px] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
        <p className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--gold-soft)" }}>
          Pensamento do dia
        </p>
        <p className="mt-1.5 font-display text-base italic leading-snug">“{getDailyQuote()}”</p>
      </div>
    </CaliceShell>
  );
}

// Quem ainda não comprou vê o sumário do livro e a lista dos 10 dias, com o
// 1º capítulo e o 1º dia liberados de verdade pra leitura — decisão de
// 01/08/2026 (ver "Método Cálice - Plano de Funil Completo" no vault). O
// resto aparece com cadeado, sem link. CTA fixo leva pro checkout.
async function PreviewCalice({ contactId }: { contactId: string }) {
  const [chapters, lessons, firstName] = await Promise.all([
    getChapters("metodo_calice"),
    getLessonsWithProgress(contactId, "metodo_calice"),
    getContactFirstName(contactId),
  ]);
  const { value } = PRODUCT_PRICE.metodo_calice;
  const primeiroCapitulo = chapters[0]?.order_index;

  return (
    <CaliceShell nav={false}>
      <Track event="calice_preview_viewed" contactId={contactId} />
      <header>
        <p className="font-veil-sans text-[11px] font-semibold uppercase tracking-[0.12em] opacity-55">
          {getGreeting()}
        </p>
        <p className="font-display text-[26px] leading-tight">{firstName ?? "que bom te ver"}</p>
      </header>

      <div className="veil-arch glass-card relative mt-5 h-[200px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 85%, rgba(217,168,84,0.22), transparent 60%)" }}
        />
        <div
          className="absolute left-1/2 top-4 h-[130px] w-[130px] -translate-x-1/2 rounded-full"
          style={{ border: "1px dashed color-mix(in srgb, var(--gold) 50%, transparent)" }}
        />
        <div className="float-slow absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
          <CaliceBook width={90} height={128} />
        </div>
      </div>
      <p className="mt-3 text-center font-veil-sans text-sm leading-relaxed opacity-70">
        O Livro (13 capítulos) + os 10 Dias de Prática Guiada. Comece grátis pelo primeiro capítulo e o primeiro dia.
      </p>

      <p className="mt-6 font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em] opacity-45">O Livro</p>
      <ol className="mt-2 flex flex-col gap-2">
        {chapters.map((c) => {
          const gratis = c.order_index === primeiroCapitulo;
          return (
            <li key={c.order_index}>
              {gratis ? (
                <Link
                  href={`/metodo-calice/livro/${c.order_index}`}
                  className="glass-card glass-card-strong flex items-center gap-3 px-4 py-3.5"
                >
                  <span className="min-w-0 flex-1 font-veil-sans text-sm font-bold leading-snug">{c.title}</span>
                  <span className="shrink-0 font-veil-sans text-[10.5px] font-bold" style={{ color: "var(--accent)" }}>
                    ler grátis
                  </span>
                </Link>
              ) : (
                <div className="glass-card flex items-center gap-3 px-4 py-3.5" style={{ background: "rgba(255,255,255,0.4)" }}>
                  <span className="min-w-0 flex-1 font-veil-sans text-sm font-medium leading-snug opacity-40">
                    {c.title}
                  </span>
                  <LockIcon className="shrink-0 opacity-35" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 font-veil-sans text-[10px] font-bold uppercase tracking-[0.1em] opacity-45">Os 10 Dias de Prática</p>
      <ol className="mt-2 flex flex-col gap-2">
        {lessons.map((l) => {
          // regra sequencial já existente (lib/calice.ts): só o 1º dia nunca
          // fica locked, mesmo sem nenhum progresso salvo — é o que abre a
          // prévia sozinho, sem precisar de lógica nova aqui
          const gratis = !l.locked;
          return (
            <li key={l.id}>
              {gratis ? (
                <Link
                  href={`/metodo-calice/aulas/${l.order_index}`}
                  className="glass-card glass-card-strong flex items-center gap-3 px-4 py-3.5"
                >
                  <span className="min-w-0 flex-1 font-veil-sans text-sm font-bold leading-snug">{l.title}</span>
                  <span className="shrink-0 font-veil-sans text-[10.5px] font-bold" style={{ color: "var(--accent)" }}>
                    fazer grátis
                  </span>
                </Link>
              ) : (
                <div className="glass-card flex items-center gap-3 px-4 py-3.5" style={{ background: "rgba(255,255,255,0.4)" }}>
                  <span className="min-w-0 flex-1 font-veil-sans text-sm font-medium leading-snug opacity-40">
                    {l.title}
                  </span>
                  <LockIcon className="shrink-0 opacity-35" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-4 mt-6">
        <Link
          href="/comprar/metodo-calice"
          className="glass-card glass-card-strong flex items-center justify-center gap-2 px-4 py-4 font-veil-sans text-sm font-bold"
          style={{ color: "var(--accent)" }}
        >
          <SparkleIcon size={16} /> Desbloquear tudo — {formatPrice(value)}
        </Link>
      </div>
    </CaliceShell>
  );
}

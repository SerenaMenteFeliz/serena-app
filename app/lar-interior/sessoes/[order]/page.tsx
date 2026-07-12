import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getPace, getLarSessions, getLarSession, tituloSessao } from "@/lib/lar";
import { concluirSessao, guardarReflexao } from "@/lib/actions/lar";
import { notesFeatureEnabled, getNote } from "@/lib/calice-notes";
import { LarShell } from "@/components/lar/LarShell";
import { LessonBlockRenderer } from "@/components/LessonBlockRenderer";
import { SessionReflection } from "@/components/lar/SessionReflection";
import { Track } from "@/components/analytics/Track";
import { ChevronLeftIcon, CheckIcon, SunIcon, SparkleIcon } from "@/components/icons";

export default async function SessaoPage({ params }: { params: Promise<{ order: string }> }) {
  const { order } = await params;
  const orderNum = Number(order);

  const { contactId } = await requireProductAccess("lar_interior");
  const pace = await getPace(contactId);
  if (!pace) redirect("/lar-interior/comecar");

  const [sessao, { sessions }] = await Promise.all([
    getLarSession(orderNum),
    getLarSessions(contactId, pace),
  ]);
  if (!sessao) notFound();

  const estado = sessions.find((s) => s.id === sessao.id);
  // bloqueada ou fora da cota do dia → volta pra lista (o desbloqueio diário
  // é parte do produto, não só visual)
  if (!estado || estado.status === "bloqueada" || estado.status === "amanha") {
    redirect("/lar-interior/sessoes");
  }

  const { tema, subtitulo } = tituloSessao(sessao.title);
  const vivida = estado.status === "concluida";
  const proxima = sessions.find((s) => s.order_index === orderNum + 1);
  const temVideo = sessao.blocks.some((b) => b.block_type === "video");
  const desafioCompleto = sessions.length > 0 && sessions.every((s) => s.status === "concluida");

  // diário da sessão — mesma infra das notas do Cálice (gate da migration 0006)
  const [reflexaoOn, reflexao] = vivida
    ? await Promise.all([notesFeatureEnabled(), getNote(contactId, "lar_interior", orderNum)])
    : [false, null];

  const concluirComArgs = concluirSessao.bind(null, sessao.id, orderNum);
  const guardarComOrder = guardarReflexao.bind(null, orderNum);

  return (
    <LarShell nav={false}>
      <Track
        event="lar_session_started"
        contactId={contactId}
        props={{ order: orderNum, tema, ja_vivida: vivida }}
      />
      <div className="flex items-center justify-between">
        <Link
          href="/lar-interior/sessoes"
          aria-label="Voltar pras sessões"
          className="-ml-1 p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <ChevronLeftIcon />
        </Link>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-55">
          Tema {estado.temaIndex} de 7 · {estado.pratica ? "Prática" : "Aula"}
        </span>
        <span className="w-7" aria-hidden />
      </div>

      <h1 className="font-display mt-3 text-[22px] italic leading-snug">{tema}</h1>
      <p className="mt-1 text-[13px] opacity-60">
        {subtitulo} · ~{estado.minutos} min
      </p>

      {!temVideo && (
        <p
          className="mt-4 rounded-2xl px-4 py-3 text-[12.5px] italic leading-relaxed"
          style={{
            background: "color-mix(in srgb, var(--sun) 10%, transparent)",
            color: "color-mix(in srgb, var(--accent) 80%, var(--ink))",
          }}
        >
          Esta sessão ainda vai ganhar a voz da Liz. Por enquanto, viva a prática em forma de
          leitura guiada — sem pressa, pausando onde o corpo pedir.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {sessao.blocks.map((block) => (
          <LessonBlockRenderer key={block.id} block={block} />
        ))}
      </div>

      <div className="mt-6">
        {vivida ? (
          <>
            <div
              className="flex items-center justify-center gap-2 rounded-[20px] py-3.5 text-sm font-bold"
              style={{ background: "color-mix(in srgb, var(--sun) 16%, transparent)", color: "var(--accent)" }}
            >
              <CheckIcon /> Sessão vivida
            </div>
            {proxima && proxima.status === "hoje" && (
              <Link
                href={`/lar-interior/sessoes/${proxima.order_index}`}
                className="mt-3 block text-center text-sm font-bold"
                style={{ color: "var(--accent)" }}
              >
                Seguir pra {proxima.pratica ? "prática" : "aula"} de {proxima.tema} ›
              </Link>
            )}
            {proxima && proxima.status === "amanha" && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs opacity-55">
                <SunIcon size={14} /> amanhã o sol nasce pro próximo passo: {proxima.tema}
              </p>
            )}
            {desafioCompleto && (
              <Link
                href="/lar-interior/celebracao"
                className="glass-card glass-card-strong mt-3 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold"
                style={{ color: "var(--accent)" }}
              >
                <SparkleIcon size={16} /> Jornada completa — veja seu marco
              </Link>
            )}
            {reflexaoOn && (
              <SessionReflection initialBody={reflexao?.body ?? ""} action={guardarComOrder} />
            )}
          </>
        ) : (
          <form action={concluirComArgs}>
            <button
              type="submit"
              className="surface-card-dark w-full cursor-pointer rounded-[20px] py-3.5 text-sm font-bold transition-transform active:scale-[0.99]"
              style={{ color: "var(--sun-soft)" }}
            >
              Concluir sessão de hoje
            </button>
          </form>
        )}
      </div>
    </LarShell>
  );
}

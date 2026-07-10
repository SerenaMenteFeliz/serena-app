import Link from "next/link";
import { requireAuth, getActiveProducts } from "@/lib/access";
import { getChapters, getBookProgress, getLessonsWithProgress } from "@/lib/calice";
import { notesFeatureEnabled, getNotes } from "@/lib/calice-notes";
import { getPace, getLarSessions } from "@/lib/lar";
import { sair } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

// Perfil é do guarda-chuva (tema hub), não de um produto — mas fala a mesma
// linguagem de vidro. Um painel por produto ativo, com o progresso real dele.
export default async function PerfilPage() {
  const { user, contactId } = await requireAuth();
  const produtos = await getActiveProducts(contactId);

  const supabase = await createClient();
  const { data: contact } = await supabase
    .from("contacts")
    .select("nome, created_at")
    .eq("id", contactId)
    .maybeSingle();

  const primeiroNome = contact?.nome?.trim().split(/\s+/)[0] ?? null;
  const desde = contact?.created_at
    ? new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date(contact.created_at))
    : null;

  // stats do Método Cálice
  const temCalice = produtos.includes("metodo_calice");
  const [chapters, bookProgress, lessons, notasOn] = temCalice
    ? await Promise.all([
        getChapters("metodo_calice"),
        getBookProgress(contactId, "metodo_calice"),
        getLessonsWithProgress(contactId, "metodo_calice"),
        notesFeatureEnabled(),
      ])
    : [[], { last_chapter_order: 0, completed: false }, [], false];
  const notas = temCalice && notasOn ? await getNotes(contactId, "metodo_calice") : [];
  const capitulosLidos = Math.min(bookProgress.last_chapter_order, chapters.length);
  const aulasConcluidas = lessons.filter((l) => l.completed).length;

  // stats do Lar Interior
  const temLar = produtos.includes("lar_interior");
  const pace = temLar ? await getPace(contactId) : null;
  const lar = temLar && pace ? await getLarSessions(contactId, pace) : null;

  return (
    <div className="theme-hub veil-bg" style={{ color: "var(--ink)" }}>
      <main className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <Link href="/hub" className="text-xs opacity-55 transition-opacity hover:opacity-100">
          ‹ Serena Mente Feliz
        </Link>

        <div className="mt-6 flex flex-col items-center gap-2.5 text-center">
          <div
            className="glass-orb h-[84px] w-[84px]"
            style={{ borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)" }}
          >
            <span className="font-display text-3xl" style={{ color: "var(--accent)" }}>
              {(primeiroNome ?? user.email ?? "S").charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="font-display text-[22px]">{primeiroNome ?? "Seu perfil"}</p>
          <div className="text-xs opacity-55">
            <p>{user.email}</p>
            {desde && <p className="mt-0.5">por aqui desde {desde}</p>}
          </div>
        </div>

        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.1em] opacity-45">Seus caminhos</p>
        <div className="mt-2 flex flex-col gap-2.5">
          {produtos.length === 0 && <p className="text-sm opacity-60">Nenhum produto ativo.</p>}

          {temLar && (
            <div className="glass-card px-4 py-4">
              <Link href="/lar-interior" className="flex items-center justify-between">
                <span className="text-sm font-bold">Lar Interior</span>
                <span className="text-xs opacity-45">abrir ›</span>
              </Link>
              {lar ? (
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 rounded-xl bg-white/45 px-2 py-2.5 text-center">
                    <p className="font-display text-lg leading-none">
                      {lar.diaAtual}
                      <span className="text-xs opacity-50">/{lar.totalDias}</span>
                    </p>
                    <p className="mt-1 text-[10px] opacity-55">dia da jornada</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/45 px-2 py-2.5 text-center">
                    <p className="font-display text-lg leading-none">
                      {lar.concluidas}
                      <span className="text-xs opacity-50">/{lar.sessions.length}</span>
                    </p>
                    <p className="mt-1 text-[10px] opacity-55">sessões vividas</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/45 px-2 py-2.5 text-center">
                    <p className="font-display text-lg leading-none">{pace}d</p>
                    <p className="mt-1 text-[10px] opacity-55">seu ritmo</p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs opacity-55">o desafio ainda não começou — escolha seu ritmo</p>
              )}
            </div>
          )}

          {temCalice && (
            <div className="glass-card px-4 py-4">
              <Link href="/metodo-calice" className="flex items-center justify-between">
                <span className="text-sm font-bold">Método Cálice</span>
                <span className="text-xs opacity-45">abrir ›</span>
              </Link>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 rounded-xl bg-white/45 px-2 py-2.5 text-center">
                  <p className="font-display text-lg leading-none">
                    {capitulosLidos}
                    <span className="text-xs opacity-50">/{chapters.length}</span>
                  </p>
                  <p className="mt-1 text-[10px] opacity-55">capítulos lidos</p>
                </div>
                <div className="flex-1 rounded-xl bg-white/45 px-2 py-2.5 text-center">
                  <p className="font-display text-lg leading-none">
                    {aulasConcluidas}
                    <span className="text-xs opacity-50">/{lessons.length}</span>
                  </p>
                  <p className="mt-1 text-[10px] opacity-55">aulas concluídas</p>
                </div>
                {notasOn && (
                  <div className="flex-1 rounded-xl bg-white/45 px-2 py-2.5 text-center">
                    <p className="font-display text-lg leading-none">{notas.length}</p>
                    <p className="mt-1 text-[10px] opacity-55">anotações</p>
                  </div>
                )}
              </div>
              {notasOn && (
                <Link
                  href="/metodo-calice/notas"
                  className="mt-2.5 flex items-center justify-between rounded-xl bg-white/45 px-3 py-2.5"
                >
                  <span className="text-xs font-semibold">Minhas anotações</span>
                  <span className="text-xs" style={{ color: "var(--accent)" }}>
                    {notas.length} ›
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>

        <form action={sair} className="mt-7">
          <button
            type="submit"
            className="glass-card w-full cursor-pointer px-4 py-3.5 text-left text-sm font-medium transition-transform active:scale-[0.99]"
            style={{ color: "#b4756b" }}
          >
            Sair da conta
          </button>
        </form>
      </main>
    </div>
  );
}

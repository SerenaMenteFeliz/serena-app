import Link from "next/link";
import { requireAuth, getActiveProducts } from "@/lib/access";
import { getChapters, getBookProgress, getLessonsWithProgress } from "@/lib/calice";
import { notesFeatureEnabled, getNotes } from "@/lib/calice-notes";
import { sair } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

const PRODUTOS: Record<string, { nome: string; href: string }> = {
  metodo_calice: { nome: "Método Cálice", href: "/metodo-calice" },
  lar_interior: { nome: "Lar Interior", href: "/lar-interior" },
};

// Perfil é do guarda-chuva (tema hub), não de um produto — mas fala a mesma
// linguagem de vidro. Mostra progresso real por produto ativo.
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

        {temCalice && (
          <>
            <div className="mt-6 flex gap-2">
              <div className="glass-card flex-1 px-2 py-3 text-center">
                <p className="font-display text-xl">
                  {capitulosLidos}/{chapters.length}
                </p>
                <p className="mt-0.5 text-[10px] opacity-55">capítulos lidos</p>
              </div>
              <div className="glass-card flex-1 px-2 py-3 text-center">
                <p className="font-display text-xl">
                  {aulasConcluidas}/{lessons.length}
                </p>
                <p className="mt-0.5 text-[10px] opacity-55">aulas concluídas</p>
              </div>
              {notasOn && (
                <div className="glass-card flex-1 px-2 py-3 text-center">
                  <p className="font-display text-xl">{notas.length}</p>
                  <p className="mt-0.5 text-[10px] opacity-55">anotações</p>
                </div>
              )}
            </div>
            {notasOn && (
              <Link href="/metodo-calice/notas" className="glass-card mt-3 flex items-center justify-between px-4 py-3.5">
                <span className="text-sm font-medium">Minhas anotações</span>
                <span className="text-xs" style={{ color: "var(--accent)" }}>
                  {notas.length} ›
                </span>
              </Link>
            )}
          </>
        )}

        <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.1em] opacity-45">Seus produtos</p>
        <div className="mt-2 flex flex-col gap-2">
          {produtos.length === 0 && <p className="text-sm opacity-60">Nenhum produto ativo.</p>}
          {produtos.map((slug) => {
            const p = PRODUTOS[slug];
            if (!p) return null;
            return (
              <Link key={slug} href={p.href} className="glass-card flex items-center justify-between px-4 py-3.5">
                <span className="text-sm font-medium">{p.nome}</span>
                <span className="text-xs opacity-45">abrir ›</span>
              </Link>
            );
          })}
        </div>

        <form action={sair} className="mt-7">
          <button
            type="submit"
            className="glass-card w-full cursor-pointer px-4 py-3.5 text-left text-sm font-medium"
            style={{ color: "#b4756b" }}
          >
            Sair da conta
          </button>
        </form>
      </main>
    </div>
  );
}

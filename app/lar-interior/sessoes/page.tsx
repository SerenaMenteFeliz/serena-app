import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProductAccess } from "@/lib/access";
import { getPace, getLarSessions, type LarSession } from "@/lib/lar";
import { LarShell } from "@/components/lar/LarShell";
import { LockIcon, CheckIcon, MoonIcon } from "@/components/icons";

// Lista agrupada por tema: o desafio são 7 temas, cada um com a aula teórica
// e a prática guiada — o par vive junto no mesmo card, como no produto.
export default async function SessoesPage() {
  const { contactId } = await requireProductAccess("lar_interior");
  const pace = await getPace(contactId);
  if (!pace) redirect("/lar-interior/comecar");

  const { sessions, concluidas } = await getLarSessions(contactId, pace);

  const temas = Array.from({ length: 7 }, (_, i) => ({
    num: i + 1,
    tema: sessions[i * 2]?.tema ?? "",
    par: [sessions[i * 2], sessions[i * 2 + 1]].filter(Boolean) as LarSession[],
  }));

  return (
    <LarShell>
      <h1 className="font-display text-2xl">Sessões</h1>
      <p className="mt-0.5 text-xs opacity-55">
        {concluidas} de {sessions.length} vividas
      </p>

      <ol className="mt-4 flex flex-col gap-3">
        {temas.map((t) => {
          const temaCompleto = t.par.every((s) => s.status === "concluida");
          const temaAtivo = t.par.some((s) => s.status === "hoje" || s.status === "amanha");
          return (
            <li
              key={t.num}
              className={`glass-card px-4 py-3.5 ${temaAtivo ? "glass-card-strong" : ""}`}
              style={!temaCompleto && !temaAtivo ? { background: "rgba(255,255,255,0.4)" } : undefined}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.1em] ${temaCompleto || temaAtivo ? "" : "opacity-40"}`}
                  style={temaCompleto || temaAtivo ? { color: "var(--accent)" } : undefined}
                >
                  Tema {t.num} de 7
                </p>
                {temaCompleto && <CheckIcon size={14} className="shrink-0" />}
              </div>
              <p className={`mt-0.5 font-display text-[17px] leading-snug ${temaCompleto || temaAtivo ? "" : "opacity-40"}`}>
                {t.tema}
              </p>

              <div className="mt-2.5 flex flex-col gap-1.5">
                {t.par.map((s) => {
                  const rotulo = s.pratica ? "Prática guiada" : "Aula";
                  const linha = (
                    <span className="flex w-full items-center gap-2.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{
                          background:
                            s.status === "concluida"
                              ? "var(--sun)"
                              : s.status === "hoje"
                                ? "var(--terracotta)"
                                : "color-mix(in srgb, var(--ink) 20%, transparent)",
                        }}
                      />
                      <span className={`min-w-0 flex-1 text-[13px] ${s.status === "hoje" ? "font-bold" : "font-medium"}`}>
                        {rotulo} · ~{s.minutos} min
                      </span>
                      {s.status === "concluida" && (
                        <span className="shrink-0 text-[10.5px] font-bold" style={{ color: "var(--accent)" }}>
                          vivida
                        </span>
                      )}
                      {s.status === "hoje" && (
                        <span className="shrink-0 text-[10.5px] font-bold" style={{ color: "var(--terracotta)" }}>
                          hoje
                        </span>
                      )}
                      {s.status === "amanha" && (
                        <span className="flex shrink-0 items-center gap-1 text-[10.5px] font-semibold opacity-55">
                          <MoonIcon size={12} /> amanhã
                        </span>
                      )}
                      {s.status === "bloqueada" && <LockIcon size={13} className="shrink-0 opacity-35" />}
                    </span>
                  );

                  return s.status === "concluida" || s.status === "hoje" ? (
                    <Link
                      key={s.id}
                      href={`/lar-interior/sessoes/${s.order_index}`}
                      className="-mx-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/45"
                    >
                      {linha}
                    </Link>
                  ) : (
                    <span key={s.id} className={`px-0 py-1 ${s.status === "bloqueada" ? "opacity-45" : ""}`}>
                      {linha}
                    </span>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </LarShell>
  );
}

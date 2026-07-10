import Link from "next/link";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { requireProductAccess } from "@/lib/access";
import { getPace, getLarSessions } from "@/lib/lar";
import { CARTA_DA_LIZ } from "@/lib/lar-carta";
import { LarShell } from "@/components/lar/LarShell";
import { LeafIcon, MoonIcon, DownloadIcon, SparkleIcon, ChevronRightIcon } from "@/components/icons";

export default async function BonusPage() {
  const { contactId } = await requireProductAccess("lar_interior");
  const pace = await getPace(contactId);
  if (!pace) redirect("/lar-interior/comecar");

  const { sessions, concluidas } = await getLarSessions(contactId, pace);
  const jornadaCompleta = sessions.length > 0 && concluidas === sessions.length;
  const praticasVividas = sessions.filter((s) => s.pratica && s.status === "concluida").length;

  return (
    <LarShell>
      <h1 className="font-display text-2xl">Seus bônus</h1>
      <p className="mt-0.5 text-xs opacity-55">presentes que acompanham o desafio</p>

      <div className="mt-4 flex flex-col gap-3">
        {/* práticas aprofundadas — o bônus principal, vive no fluxo das sessões */}
        <Link href="/lar-interior/sessoes" className="glass-card glass-card-strong flex items-center gap-3.5 px-4 py-4">
          <span className="glass-orb shrink-0" style={{ borderColor: "var(--sun)" }}>
            <LeafIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">7 Práticas Aprofundadas</span>
            <span className="mt-0.5 block text-xs leading-relaxed opacity-60">
              As meditações guiadas de cada tema — {praticasVividas} de 7 já vividas.
            </span>
          </span>
          <ChevronRightIcon className="shrink-0 opacity-50" />
        </Link>

        {/* meditação para dormir */}
        <div className="glass-card flex items-center gap-3.5 px-4 py-4">
          <span className="glass-orb shrink-0" style={{ borderColor: "var(--sky)" }}>
            <MoonIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Meditação para Dormir</span>
            <span className="mt-0.5 block text-xs leading-relaxed opacity-60">
              ~12 minutos guiados pela Liz pra fechar o dia em paz.
            </span>
          </span>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]"
            style={{ background: "color-mix(in srgb, var(--sky) 25%, transparent)", color: "var(--ink)" }}
          >
            em gravação
          </span>
        </div>

        {/* SOS ansiedade */}
        <div className="glass-card flex items-center gap-3.5 px-4 py-4">
          <span className="glass-orb shrink-0" style={{ borderColor: "var(--terracotta)" }}>
            <SparkleIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">SOS Ansiedade</span>
            <span className="mt-0.5 block text-xs leading-relaxed opacity-60">
              Áudios curtos de 3 minutos pra momentos de aperto.
            </span>
          </span>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]"
            style={{ background: "color-mix(in srgb, var(--terracotta) 22%, transparent)", color: "var(--ink)" }}
          >
            em gravação
          </span>
        </div>

        {/* rastreador PDF */}
        <div className="glass-card flex items-center gap-3.5 px-4 py-4">
          <span className="glass-orb shrink-0" style={{ borderColor: "var(--sage)" }}>
            <DownloadIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Rastreador dos 7 Dias</span>
            <span className="mt-0.5 block text-xs leading-relaxed opacity-60">
              PDF pra imprimir e marcar cada dia da jornada no papel.
            </span>
          </span>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]"
            style={{ background: "color-mix(in srgb, var(--sage) 30%, transparent)", color: "var(--ink)" }}
          >
            em breve
          </span>
        </div>

        {/* carta da Liz — surpresa do fim da jornada: não anunciada, só aparece
            com a jornada completa E o texto escrito */}
        {jornadaCompleta && CARTA_DA_LIZ.trim() !== "" && (
          <div className="surface-card-dark relative overflow-hidden px-5 py-5">
            <div
              className="absolute -right-3 -top-3 h-[70px] w-[70px] rounded-full opacity-50"
              style={{ background: "radial-gradient(circle, var(--sun-soft), transparent 70%)" }}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--sun-soft)" }}>
              Uma carta pra você
            </p>
            <div className="reading-content mt-2 text-[15px]">
              <ReactMarkdown>{CARTA_DA_LIZ}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed opacity-45">
        Os bônus em gravação chegam aqui sozinhos — você não precisa fazer nada.
      </p>
    </LarShell>
  );
}

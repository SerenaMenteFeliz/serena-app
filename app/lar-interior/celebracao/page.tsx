import { redirect } from "next/navigation";
import Link from "next/link";
import { requireProductAccess, getContactFirstName } from "@/lib/access";
import { getPace, getLarSessions } from "@/lib/lar";
import { LarShell } from "@/components/lar/LarShell";
import { LarSun } from "@/components/lar/LarSun";
import { ShareActions } from "@/components/ShareActions";
import { Track } from "@/components/analytics/Track";
import { ChevronLeftIcon } from "@/components/icons";

// O marco do desafio completo — uma tela composta pra print/story (proporção
// vertical, marca discreta no rodapé). Só existe pra quem viveu as 14 sessões;
// quem chegar por URL sem completar volta pra home do produto.
export default async function CelebracaoLarPage() {
  const { contactId } = await requireProductAccess("lar_interior");

  const pace = await getPace(contactId);
  if (!pace) redirect("/lar-interior/comecar");

  const [{ sessions, concluidas }, firstName] = await Promise.all([
    getLarSessions(contactId, pace),
    getContactFirstName(contactId),
  ]);

  const completo = sessions.length > 0 && concluidas === sessions.length;
  if (!completo) redirect("/lar-interior");

  const temas = Math.ceil(sessions.length / 2);
  const textoShare = `Completei o Desafio de 7 Dias do Lar Interior — ${sessions.length} sessões de meditação vividas, no meu ritmo. 🌅 Serena Mente Feliz`;

  return (
    <LarShell nav={false}>
      <Track event="share_card_viewed" contactId={contactId} props={{ product: "lar_interior" }} />

      <div className="flex items-center justify-between">
        <Link
          href="/lar-interior"
          aria-label="Voltar"
          className="-ml-1 p-1 opacity-70 transition-opacity hover:opacity-100"
        >
          <ChevronLeftIcon />
        </Link>
        <span className="w-7" aria-hidden />
      </div>

      {/* o card em si — composto pra caber num story */}
      <div className="veil-arch glass-card glass-card-strong relative mt-4 overflow-hidden px-6 pb-9 pt-16 text-center">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 30%, rgba(236,194,124,0.35), transparent 65%)" }}
        />
        <div className="relative">
          <div className="flex justify-center">
            <LarSun width={170} height={120} />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
            Desafio de 7 Dias · completo{firstName ? ` · ${firstName}` : ""}
          </p>
          {/* 1ª pessoa de propósito: o card é a própria pessoa contando no story */}
          <h1 className="font-display mt-2 text-[26px] italic leading-snug">
            Cheguei até aqui
            <br />
            comigo mesma
          </h1>

          <div className="mx-auto mt-5 flex max-w-[260px] items-center justify-center gap-6">
            <div>
              <p className="font-display text-[22px]" style={{ color: "var(--accent)" }}>
                {sessions.length}
              </p>
              <p className="text-[10px] uppercase tracking-[0.08em] opacity-55">sessões vividas</p>
            </div>
            <div className="h-8 w-px" style={{ background: "color-mix(in srgb, var(--sun) 40%, transparent)" }} />
            <div>
              <p className="font-display text-[22px]" style={{ color: "var(--accent)" }}>
                {temas}
              </p>
              <p className="text-[10px] uppercase tracking-[0.08em] opacity-55">temas percorridos</p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-[30ch] font-display text-[15px] italic leading-relaxed opacity-70">
            “Voltar pra casa, dentro.”
          </p>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-40">
            Lar Interior · Serena Mente Feliz
          </p>
        </div>
      </div>

      <ShareActions texto={textoShare} />
    </LarShell>
  );
}

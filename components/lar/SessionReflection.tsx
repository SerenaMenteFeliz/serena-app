"use client";

import { useState, useTransition } from "react";
import { PenIcon } from "@/components/icons";

// Diário da sessão — irmão do ChapterNote do Cálice, na voz e paleta do Lar
// (âmbar/sol, sem a Jost). Aparece depois de viver a sessão: anotar vem
// depois de sentir. Corpo vazio apaga a reflexão.
export function SessionReflection({
  initialBody,
  action,
}: {
  initialBody: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(initialBody);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      setSaved(String(formData.get("body") ?? "").trim());
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass-card mt-4 flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="shrink-0" style={{ color: "var(--accent)" }}>
          <PenIcon size={16} />
        </span>
        {saved ? (
          <span className="min-w-0 flex-1 truncate text-[13px] opacity-80">{saved}</span>
        ) : (
          <span className="text-[13px] opacity-60">O que você sentiu hoje?</span>
        )}
      </button>
    );
  }

  return (
    <form
      action={submit}
      className="mt-4 rounded-[14px] p-3"
      style={{
        background: "color-mix(in srgb, var(--sun-soft) 20%, white)",
        border: "1px solid color-mix(in srgb, var(--sun) 35%, transparent)",
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--accent)" }}>
        O que você sentiu hoje?
      </p>
      <textarea
        name="body"
        defaultValue={saved}
        placeholder="Sem certo ou errado — só o que ficou com você depois da prática..."
        rows={3}
        autoFocus
        className="mt-1.5 w-full resize-y border-none bg-transparent text-[13px] outline-none"
        style={{ color: "var(--ink)" }}
      />
      <div className="mt-1.5 flex items-center justify-end gap-2.5">
        <button type="button" onClick={() => setOpen(false)} className="px-2.5 py-1.5 text-xs opacity-55">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-[14px] px-3.5 py-1.5 text-xs font-semibold disabled:opacity-60"
          style={{ background: "var(--surface-dark)", color: "var(--surface-dark-foreground)" }}
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

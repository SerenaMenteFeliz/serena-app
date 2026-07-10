"use client";

import { useState, useTransition } from "react";
import { PenIcon } from "./icons";

// Anotação do capítulo — fica recolhida abaixo do leitor (anotar vem depois
// de ler) e expande num painel de vidro quente. Corpo vazio apaga a nota.
export function ChapterNote({
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
        <PenIcon size={16} className="shrink-0" />
        {saved ? (
          <span className="font-veil-sans min-w-0 flex-1 truncate text-[13px] opacity-80">{saved}</span>
        ) : (
          <span className="font-veil-sans text-[13px] opacity-60">Anotar este capítulo</span>
        )}
      </button>
    );
  }

  return (
    <form
      action={submit}
      className="mt-4 rounded-[14px] p-3"
      style={{ background: "rgba(247,239,227,0.8)", border: "1px solid color-mix(in srgb, var(--gold) 35%, transparent)" }}
    >
      <p className="font-veil-sans text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--accent)" }}>
        Sua anotação neste capítulo
      </p>
      <textarea
        name="body"
        defaultValue={saved}
        placeholder="Escreva o que este capítulo te fez pensar..."
        rows={3}
        autoFocus
        className="font-veil-sans mt-1.5 w-full resize-y border-none bg-transparent text-[13px] outline-none"
        style={{ color: "var(--ink)" }}
      />
      <div className="mt-1.5 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-veil-sans px-2.5 py-1.5 text-xs opacity-55"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="font-veil-sans rounded-[14px] px-3.5 py-1.5 text-xs font-semibold disabled:opacity-60"
          style={{ background: "var(--surface-dark)", color: "var(--surface-dark-foreground)" }}
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

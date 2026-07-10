"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ produto }: { produto?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "enviado" | "erro">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setStatus(error ? "erro" : "enviado");
  }

  if (status === "enviado") {
    return (
      <p className="glass-card rounded-[20px] px-5 py-4 text-center">
        Te mandamos um link de acesso para <strong>{email}</strong>. Confira seu e-mail.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card flex w-full max-w-sm flex-col gap-3 rounded-[20px] px-6 py-6">
      <label htmlFor="email" className="text-sm opacity-80">
        {produto ? `Entrar em ${produto}` : "Entrar no Serena Mente Feliz"}
      </label>
      <input
        id="email"
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg px-3 py-2 outline-none placeholder:opacity-50"
        style={{
          border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
          background: "color-mix(in srgb, var(--accent) 6%, white)",
          color: "var(--ink)",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="cursor-pointer rounded-full px-4 py-2.5 font-semibold transition-transform active:scale-[0.98] disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {status === "loading" ? "Enviando…" : "Receber link de acesso"}
      </button>
      {status === "erro" && (
        <p role="alert" className="text-sm" style={{ color: "#b91c1c" }}>
          Não deu certo, tenta de novo.
        </p>
      )}
    </form>
  );
}

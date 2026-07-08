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
    return <p>Te mandamos um link de acesso para <strong>{email}</strong>. Confira seu e-mail.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <label htmlFor="email">
        {produto ? `Entrar em ${produto}` : "Entrar no Serena Mente Feliz"}
      </label>
      <input
        id="email"
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded px-4 py-2"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {status === "loading" ? "Enviando..." : "Receber link de acesso"}
      </button>
      {status === "erro" && <p role="alert">Não deu certo, tenta de novo.</p>}
    </form>
  );
}

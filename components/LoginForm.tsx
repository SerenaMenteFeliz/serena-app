"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "senha" | "recuperar";
type Status = "idle" | "loading" | "enviado" | "erro";

export function LoginForm({ produto }: { produto?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("senha");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  function trocarModo(next: Mode) {
    setMode(next);
    setStatus("idle");
    setErro(null);
  }

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErro(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Supabase não distingue "senha errada" de "e-mail não existe" na
      // mensagem — não vazar qual dos dois é, e cobrir o caso mais comum
      // (quem comprou mas ainda não criou a senha, ou esqueceu).
      setErro("E-mail ou senha incorretos. Ainda não tem senha? Use \"esqueci minha senha\" abaixo.");
      setStatus("erro");
      return;
    }

    router.push("/pos-login");
  }

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErro(null);

    try {
      const resp = await fetch("/api/auth/recuperar-senha", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error();
    } catch {
      setErro("Não deu certo enviar o e-mail. Tenta de novo em alguns minutos.");
      setStatus("erro");
      return;
    }
    setStatus("enviado");
  }

  const titulo = produto ? `Entrar em ${produto}` : "Entrar no Serena Mente Feliz";

  if (status === "enviado" && mode === "recuperar") {
    return (
      <p className="glass-card rounded-[20px] px-5 py-4 text-center">
        Te mandamos um link para redefinir sua senha em <strong>{email}</strong>. Confira seu e-mail.
      </p>
    );
  }

  return (
    <form
      onSubmit={mode === "senha" ? handleSenha : handleRecuperar}
      className="glass-card flex w-full max-w-sm flex-col gap-3 rounded-[20px] px-6 py-6"
    >
      <label htmlFor="email" className="text-sm opacity-80">
        {mode === "recuperar" ? "Redefinir senha" : titulo}
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

      {mode === "senha" && (
        <input
          id="password"
          type="password"
          required
          placeholder="sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg px-3 py-2 outline-none placeholder:opacity-50"
          style={{
            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
            background: "color-mix(in srgb, var(--accent) 6%, white)",
            color: "var(--ink)",
          }}
        />
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="cursor-pointer rounded-full px-4 py-2.5 font-semibold transition-transform active:scale-[0.98] disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {status === "loading" ? "Enviando…" : mode === "senha" ? "Entrar" : "Enviar link de redefinição"}
      </button>

      {erro && (
        <p role="alert" className="text-sm" style={{ color: "#b91c1c" }}>
          {erro}
        </p>
      )}

      <div className="mt-1 flex flex-col items-center gap-1.5 text-center text-xs opacity-70">
        {mode === "senha" && (
          <button type="button" onClick={() => trocarModo("recuperar")} className="underline underline-offset-2">
            Esqueci minha senha
          </button>
        )}
        {mode === "recuperar" && (
          <button type="button" onClick={() => trocarModo("senha")} className="underline underline-offset-2">
            Voltar para o login
          </button>
        )}
      </div>
    </form>
  );
}

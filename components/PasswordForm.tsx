"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Reaproveitado em 2 telas: /redefinir-senha (depois de clicar no link de
// recuperação, sessão já ativa) e /perfil (definir ou trocar senha estando
// logado). Nos dois casos a sessão já existe — só chama updateUser.
export function PasswordForm({
  title,
  redirectTo,
  successMessage = "Senha atualizada.",
}: {
  title: string;
  redirectTo?: string;
  successMessage?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (password.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      setStatus("erro");
      return;
    }
    if (password !== confirmar) {
      setErro("As senhas não são iguais.");
      setStatus("erro");
      return;
    }

    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErro("Não deu certo salvar a senha. Tenta de novo.");
      setStatus("erro");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
      return;
    }
    setStatus("ok");
    setPassword("");
    setConfirmar("");
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card flex w-full max-w-sm flex-col gap-3 rounded-[20px] px-6 py-6">
      <label htmlFor="new-password" className="text-sm opacity-80">
        {title}
      </label>
      <input
        id="new-password"
        type="password"
        required
        placeholder="nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg px-3 py-2 outline-none placeholder:opacity-50"
        style={{
          border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
          background: "color-mix(in srgb, var(--accent) 6%, white)",
          color: "var(--ink)",
        }}
      />
      <input
        id="confirm-password"
        type="password"
        required
        placeholder="confirmar nova senha"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
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
        {status === "loading" ? "Salvando…" : "Salvar senha"}
      </button>
      {erro && (
        <p role="alert" className="text-sm" style={{ color: "#b91c1c" }}>
          {erro}
        </p>
      )}
      {status === "ok" && (
        <p className="text-sm" style={{ color: "var(--accent)" }}>
          {successMessage}
        </p>
      )}
    </form>
  );
}

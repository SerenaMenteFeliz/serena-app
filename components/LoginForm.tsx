"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "senha" | "recuperar" | "cadastro";
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

  // Cadastro direto (sem passar por compra) — cobre quem chegou pelo quiz/
  // material e quer ver a prévia antes de comprar. `ensureContactLink`
  // (lib/access.ts) cria o `contact` sozinho no primeiro `requireAuth()`,
  // então não precisa de nenhum passo extra aqui além do signUp.
  // Se "Confirm email" estiver ligado no Supabase Auth, `data.session` vem
  // nulo e a pessoa precisa confirmar por e-mail antes de logar — mesmo
  // mailer com rate limit que já mordeu o link mágico, então o ideal é essa
  // opção estar desligada (Authentication → Sign In / Providers) enquanto
  // não tiver SMTP próprio configurado.
  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErro(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErro(
        error.message.includes("already registered") || error.message.includes("already been registered")
          ? "Já existe conta com esse e-mail. Tenta entrar, ou \"esqueci minha senha\" se não lembrar."
          : "Não deu certo criar a conta. Confere o e-mail e tenta de novo."
      );
      setStatus("erro");
      return;
    }

    if (data.session) {
      router.push("/pos-login");
      return;
    }

    // Confirm email ligado no Supabase Auth — sem sessão até confirmar.
    setStatus("enviado");
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
  const tituloModo = mode === "recuperar" ? "Redefinir senha" : mode === "cadastro" ? "Criar conta" : titulo;

  if (status === "enviado" && mode === "recuperar") {
    return (
      <p className="glass-card rounded-[20px] px-5 py-4 text-center">
        Te mandamos um link para redefinir sua senha em <strong>{email}</strong>. Confira seu e-mail.
      </p>
    );
  }

  if (status === "enviado" && mode === "cadastro") {
    return (
      <p className="glass-card rounded-[20px] px-5 py-4 text-center">
        Falta só confirmar: mandamos um link pra <strong>{email}</strong>. Confira seu e-mail pra ativar a conta.
      </p>
    );
  }

  const handleSubmit = mode === "senha" ? handleSenha : mode === "cadastro" ? handleCadastro : handleRecuperar;

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card flex w-full max-w-sm flex-col gap-3 rounded-[20px] px-6 py-6"
    >
      <label htmlFor="email" className="text-sm opacity-80">
        {tituloModo}
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

      {(mode === "senha" || mode === "cadastro") && (
        <input
          id="password"
          type="password"
          required
          minLength={mode === "cadastro" ? 6 : undefined}
          placeholder={mode === "cadastro" ? "crie uma senha (mín. 6 caracteres)" : "sua senha"}
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
        {status === "loading"
          ? "Enviando…"
          : mode === "senha"
            ? "Entrar"
            : mode === "cadastro"
              ? "Criar conta"
              : "Enviar link de redefinição"}
      </button>

      {erro && (
        <p role="alert" className="text-sm" style={{ color: "#b91c1c" }}>
          {erro}
        </p>
      )}

      <div className="mt-1 flex flex-col items-center gap-1.5 text-center text-xs opacity-70">
        {mode === "senha" && (
          <>
            <button type="button" onClick={() => trocarModo("recuperar")} className="underline underline-offset-2">
              Esqueci minha senha
            </button>
            <button type="button" onClick={() => trocarModo("cadastro")} className="underline underline-offset-2">
              Ainda não tenho conta
            </button>
          </>
        )}
        {mode === "cadastro" && (
          <button type="button" onClick={() => trocarModo("senha")} className="underline underline-offset-2">
            Já tenho conta
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

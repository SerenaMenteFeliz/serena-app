"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductSlug } from "@/lib/access";

type CheckoutResult = {
  contactId: string;
  paymentId: string;
  qrCodeImage: string;
  copyPaste: string;
};

const inputStyle = {
  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
  background: "color-mix(in srgb, var(--accent) 6%, white)",
  color: "var(--ink)",
};

export function CheckoutForm({ product, entryHref }: { product: ProductSlug; entryHref: string }) {
  const [step, setStep] = useState<"form" | "gerando" | "pix" | "confirmado" | "erro">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("gerando");
    setErrorMsg("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, name, email, cpfCnpj: cpf }),
    });
    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error ?? "não deu pra gerar a cobrança");
      setStep("erro");
      return;
    }

    setResult(data);
    setStep("pix");
  }

  useEffect(() => {
    if (step !== "pix" || !result) return;

    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/checkout/status?contactId=${result.contactId}&product=${product}`);
      const data = await res.json();
      if (data.granted) {
        if (pollRef.current) clearInterval(pollRef.current);
        setStep("confirmado");
      }
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [step, result, product]);

  if (step === "confirmado") {
    return (
      <div className="glass-card flex flex-col items-center gap-3 rounded-[20px] px-6 py-8 text-center">
        <p className="font-display text-lg">Pagamento confirmado!</p>
        <p className="text-sm opacity-70">Seu acesso já está liberado.</p>
        <a
          href={entryHref}
          className="mt-2 rounded-full px-5 py-2.5 font-semibold"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          Entrar agora
        </a>
      </div>
    );
  }

  if (step === "pix" && result) {
    return (
      <div className="glass-card flex w-full max-w-sm flex-col items-center gap-3 rounded-[20px] px-6 py-6 text-center">
        <p className="text-sm opacity-80">Escaneie o QR Code ou copie o código Pix</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${result.qrCodeImage}`}
          alt="QR Code Pix"
          className="h-48 w-48 rounded-lg bg-white p-2"
        />
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(result.copyPaste)}
          className="w-full cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
        >
          Copiar código Pix
        </button>
        <p className="text-xs opacity-60">Assim que o pagamento cair, esta página libera sozinha.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card flex w-full max-w-sm flex-col gap-3 rounded-[20px] px-6 py-6">
      <input
        required
        placeholder="Nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg px-3 py-2 outline-none placeholder:opacity-50"
        style={inputStyle}
      />
      <input
        required
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg px-3 py-2 outline-none placeholder:opacity-50"
        style={inputStyle}
      />
      <input
        required
        placeholder="CPF (só números)"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        className="rounded-lg px-3 py-2 outline-none placeholder:opacity-50"
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={step === "gerando"}
        className="cursor-pointer rounded-full px-4 py-2.5 font-semibold transition-transform active:scale-[0.98] disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      >
        {step === "gerando" ? "Gerando cobrança…" : "Gerar Pix"}
      </button>
      {step === "erro" && (
        <p role="alert" className="text-sm" style={{ color: "#b91c1c" }}>
          {errorMsg}
        </p>
      )}
    </form>
  );
}

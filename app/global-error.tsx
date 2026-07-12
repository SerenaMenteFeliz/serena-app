"use client";

// Falha no próprio root layout — aqui o CSS global e as fonts podem não ter
// carregado, então tudo é inline e autocontido (exigência do global-error:
// html/body próprios). Eco da linguagem de vidro em versão à prova de tudo.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "linear-gradient(170deg, #fbfdfd 0%, #eff8f6 55%, #e2f1ec 100%)",
          color: "#113330",
          fontFamily: "Georgia, 'Times New Roman', serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: "130px 130px 18px 18px",
            padding: "56px 28px 32px",
            boxShadow: "0 8px 20px -14px rgba(94,182,166,0.3)",
          }}
        >
          <p style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.55, margin: 0 }}>
            Serena Mente Feliz
          </p>
          <h1 style={{ fontStyle: "italic", fontSize: "22px", lineHeight: 1.35, margin: "14px 0 0" }}>
            Algo saiu do lugar por aqui
          </h1>
          <p style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.6, margin: "10px auto 0", maxWidth: "34ch" }}>
            Não foi nada que você fez. Respire fundo — seu progresso está guardado — e tente de novo.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: "24px",
              width: "100%",
              padding: "14px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: "#0e2a26",
              color: "#e3f5f1",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "inherit",
            }}
          >
            Tentar de novo
          </button>
          {error.digest && (
            <p style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.3, margin: "16px 0 0" }}>
              código {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}

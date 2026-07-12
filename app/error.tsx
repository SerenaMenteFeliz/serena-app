"use client";

import { ErrorVeil } from "@/components/ErrorVeil";

// Boundary raiz — cobre hub, perfil, login e qualquer rota sem boundary
// próprio, no tema neutro da marca-mãe (Clareira).
export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return <ErrorVeil theme="theme-hub" error={error} retry={unstable_retry} homeHref="/hub" homeLabel="voltar pra clareira" />;
}

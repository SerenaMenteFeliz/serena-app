"use client";

import { ErrorVeil } from "@/components/ErrorVeil";

export default function LarError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorVeil
      theme="theme-lar-interior"
      error={error}
      retry={unstable_retry}
      homeHref="/lar-interior"
      homeLabel="voltar pro Lar Interior"
    />
  );
}

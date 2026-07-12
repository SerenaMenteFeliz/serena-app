"use client";

import { ErrorVeil } from "@/components/ErrorVeil";

export default function CaliceError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <ErrorVeil
      theme="theme-metodo-calice"
      error={error}
      retry={unstable_retry}
      homeHref="/metodo-calice"
      homeLabel="voltar pro santuário"
    />
  );
}

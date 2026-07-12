"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Dispara um evento no mount — jeito de páginas server component medirem
// "vi esta tela" sem virarem client. `contactId` identifica a pessoa (mesmo
// distinct_id que o servidor usa, então client e server juntam no PostHog).
// `oncePerSession` evita repetir evento de "sessão de uso" (ex: login) a cada
// navegação — sessionStorage zera quando o navegador/aba fecha.
export function Track({
  event,
  props,
  contactId,
  oncePerSession = false,
}: {
  event: string;
  props?: Record<string, string | number | boolean>;
  contactId?: string;
  oncePerSession?: boolean;
}) {
  useEffect(() => {
    if (!posthog.__loaded) return;

    if (contactId && posthog.get_distinct_id() !== contactId) {
      posthog.identify(contactId);
    }

    if (oncePerSession) {
      const key = `ph_once_${event}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    }

    posthog.capture(event, props);
    // evento é definido pelo mount da tela; re-disparar em re-render seria ruído
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

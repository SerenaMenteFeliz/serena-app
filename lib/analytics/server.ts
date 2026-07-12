import "server-only";
import { PostHog } from "posthog-node";

// Captura server-side (ground truth de conclusões — o client pode fechar a
// aba antes do evento sair). Mesmo distinct_id (contactId) dos eventos do
// client. Sem NEXT_PUBLIC_POSTHOG_KEY, vira no-op silencioso.
let client: PostHog | null = null;

function getClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      // serverless: sem batch — cada evento sai na hora, flush explícito abaixo
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

export async function captureServer(
  contactId: string,
  event: string,
  properties?: Record<string, string | number | boolean>
) {
  const ph = getClient();
  if (!ph) return;
  try {
    ph.capture({ distinctId: contactId, event, properties });
    await ph.flush();
  } catch (error) {
    // medir nunca pode quebrar o fluxo real (concluir sessão, ler capítulo)
    console.error("captureServer falhou", event, error);
  }
}

import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// service_role bypassa RLS — só usar em código de servidor de confiança
// (nunca importar isso de um Client Component). Usado pra ligar contacts
// pré-existentes (da captura de lead) ao auth.uid() no primeiro login.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export type ProductSlug = "lar_interior" | "metodo_calice";

const PRODUCT_ROUTES: Record<ProductSlug, string> = {
  lar_interior: "/lar-interior",
  metodo_calice: "/metodo-calice",
};

// `contacts` nasce na captura do lead (antes de qualquer login), com um id
// próprio — nunca é igual ao auth.uid(). No primeiro login, ligamos o
// contato existente (mesmo e-mail) ao auth.uid() da pessoa. Precisa de
// service_role porque o client autenticado não pode ler um contato ainda não
// vinculado a ele (RLS). Retorna o contacts.id a usar no resto da sessão.
export async function ensureContactLink(user: User): Promise<string | null> {
  if (!user.email) return null;
  const admin = createAdminClient();

  // Nome dado no cadastro direto pelo app (LoginForm manda em options.data).
  // Quem veio pelo quiz já tem nome no contact e nunca passa por aqui.
  const nomeDoCadastro =
    typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() || null : null;

  const { data: existing, error: selectError } = await admin
    .from("contacts")
    .select("id, name, auth_user_id")
    .eq("email", user.email)
    .maybeSingle();

  if (selectError) {
    console.error("ensureContactLink: falha ao buscar contact", selectError);
    return null;
  }

  if (existing) {
    // Só completa o que falta: nome vindo da captura do lead tem precedência
    // sobre o do cadastro (é o que a pessoa digitou pro funil primeiro).
    const patch: { auth_user_id?: string; name?: string } = {};
    if (!existing.auth_user_id) patch.auth_user_id = user.id;
    if (!existing.name && nomeDoCadastro) patch.name = nomeDoCadastro;

    if (Object.keys(patch).length > 0) {
      const { error: updateError } = await admin.from("contacts").update(patch).eq("id", existing.id);
      if (updateError) console.error("ensureContactLink: falha ao atualizar", updateError);
    }
    return existing.id;
  }

  // Ninguém comprou nada ainda com esse e-mail — cria o contato já vinculado.
  const { data: created, error: insertError } = await admin
    .from("contacts")
    .insert({ email: user.email, auth_user_id: user.id, name: nomeDoCadastro })
    .select("id")
    .single();

  if (insertError) {
    console.error("ensureContactLink: falha ao criar contact", insertError);
    return null;
  }

  return created.id;
}

// Nome de exibição (primeiro nome, capitalizado) — `name` vem da captura do
// lead e pode estar vazio pra quem entrou só pelo login.
export async function getContactFirstName(contactId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("contacts").select("name").eq("id", contactId).maybeSingle();
  const first = data?.name?.trim().split(/\s+/)[0];
  if (!first) return null;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export async function getActiveProducts(contactId: string): Promise<ProductSlug[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_access")
    .select("product")
    .eq("contact_id", contactId)
    .eq("status", "active");

  if (error) {
    console.error("getActiveProducts falhou", error);
    return [];
  }

  return (data ?? []).map((row) => row.product as ProductSlug);
}

// Produtos ativos que a pessoa já completou (product_access.completed_at
// preenchido pelo evaluateCompletion). Leitura pura — alimenta o cross-sell
// do hub: completou um mundo, o outro ganha destaque.
export async function getCompletedProducts(contactId: string): Promise<ProductSlug[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_access")
    .select("product")
    .eq("contact_id", contactId)
    .eq("status", "active")
    .not("completed_at", "is", null);

  if (error) {
    console.error("getCompletedProducts falhou", error);
    return [];
  }

  return (data ?? []).map((row) => row.product as ProductSlug);
}

// 0 produtos: manda pro Método Cálice, hoje o único com prévia gratuita
// construída (metodo-calice/page.tsx mostra PreviewCalice pra quem não
// comprou) — cobre tanto quem se cadastrou direto (sem comprar nada ainda)
// quanto o fallback antigo de "acabou de comprar, webhook ainda processando"
// (nesse caso a prévia mostra normal até o acesso cair). 1 produto: cai
// direto na seção comprada. 2+: cai no hub.
// TODO: quando o Lar Interior ganhar prévia própria, 0 produtos deixa de
// poder assumir "é o Cálice" — vira um catálogo/hub mesmo sem compra.
export function resolveEntryRoute(products: ProductSlug[]): string {
  if (products.length === 0) return PRODUCT_ROUTES.metodo_calice;
  if (products.length === 1) return PRODUCT_ROUTES[products[0]];
  return "/hub";
}

// Usar no topo de cada page.tsx protegida — garante a checagem de acesso
// perto da fonte de dados (recomendação Next.js), não só no proxy otimista.
// Retorna o auth user + o contactId (uso interno das queries de progresso).
export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const contactId = await ensureContactLink(user);
  if (!contactId) redirect("/sem-acesso");

  return { user, contactId };
}

export async function requireProductAccess(product: ProductSlug) {
  const { user, contactId } = await requireAuth();

  const products = await getActiveProducts(contactId);
  if (!products.includes(product)) redirect("/hub");

  return { user, contactId };
}

// Como requireProductAccess, mas não redireciona quem não comprou — usado
// pelas telas que mostram uma prévia (sumário + 1º capítulo/dia grátis) em
// vez de simplesmente barrar o acesso.
export async function getProductAccessState(product: ProductSlug) {
  const { user, contactId } = await requireAuth();
  const products = await getActiveProducts(contactId);
  return { user, contactId, owned: products.includes(product) };
}

import { createClient } from "@supabase/supabase-js";

const url = "https://ddgtoebsmmyneumolycy.supabase.co";
const serviceKey = process.argv[2];
const email = process.argv[3] ?? "preview-serena-app@example.com";
const supabase = createClient(url, serviceKey);

async function main() {
  // Cria (ou reaproveita) um usuário de Auth só pra preview local — não é
  // lead real. Depois cria/atualiza o contact correspondente já vinculado
  // e libera o Método Cálice pra esse contato, pra dar pra ver o fluxo
  // completo (login -> pos-login -> seção -> livro/aulas) de ponta a ponta.
  let userId;
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (createError && createError.message.includes("already been registered")) {
    const { data: list } = await supabase.auth.admin.listUsers();
    userId = list.users.find((u) => u.email === email)?.id;
  } else if (createError) {
    throw createError;
  } else {
    userId = created.user.id;
  }

  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert({ email, auth_user_id: userId }, { onConflict: "email" })
    .select("id")
    .single();
  if (contactError) throw contactError;

  const { error: accessError } = await supabase
    .from("product_access")
    .upsert(
      { contact_id: contact.id, product: "metodo_calice", status: "active" },
      { onConflict: "contact_id,product" }
    );
  if (accessError) throw accessError;

  const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "http://localhost:3000/auth/callback" },
  });
  if (linkError) throw linkError;

  console.log("contact_id:", contact.id);
  console.log("action_link:", link.properties.action_link);
}

main().catch((e) => {
  console.error("ERRO:", e);
  process.exit(1);
});

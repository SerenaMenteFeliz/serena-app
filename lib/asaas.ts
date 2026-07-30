import "server-only";

// Cliente mínimo pra API do Asaas (Pix). Autenticação é via header
// `access_token` (não é Bearer) — confirmado na doc oficial. Sandbox e
// produção usam chaves diferentes; a URL base muda junto (ASAAS_API_URL).
const ASAAS_API_URL = process.env.ASAAS_API_URL ?? "https://api-sandbox.asaas.com/v3";

function authHeaders() {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("ASAAS_API_KEY não configurada");
  return {
    "Content-Type": "application/json",
    access_token: apiKey,
  };
}

export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  cpfCnpj: string;
  externalReference: string;
}): Promise<string> {
  const cpf = params.cpfCnpj.replace(/\D/g, "");

  const search = await fetch(`${ASAAS_API_URL}/customers?cpfCnpj=${cpf}`, {
    headers: authHeaders(),
  });
  const searchData = await search.json();
  const existingId = searchData?.data?.[0]?.id;
  if (existingId) return existingId as string;

  const created = await fetch(`${ASAAS_API_URL}/customers`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: params.name,
      email: params.email,
      cpfCnpj: cpf,
      externalReference: params.externalReference,
    }),
  });
  const createdData = await created.json();
  if (!created.ok || !createdData.id) {
    throw new Error(`Asaas: falha ao criar cliente — ${JSON.stringify(createdData)}`);
  }
  return createdData.id as string;
}

export async function createPixPayment(params: {
  customerId: string;
  value: number;
  description: string;
  externalReference: string;
}): Promise<{ paymentId: string }> {
  // Pix gerado na hora — vencimento de 1 dia é só formalidade da cobrança,
  // não trava o pagamento (Pix compensa na hora, o vencimento é prazo limite).
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);

  const res = await fetch(`${ASAAS_API_URL}/payments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      customer: params.customerId,
      billingType: "PIX",
      value: params.value,
      dueDate: dueDate.toISOString().slice(0, 10),
      description: params.description,
      externalReference: params.externalReference,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.id) {
    throw new Error(`Asaas: falha ao criar cobrança — ${JSON.stringify(data)}`);
  }
  return { paymentId: data.id as string };
}

export async function getPixQrCode(paymentId: string): Promise<{
  encodedImage: string;
  payload: string;
  expirationDate: string;
}> {
  const res = await fetch(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Asaas: falha ao obter QR code — ${JSON.stringify(data)}`);
  }
  return data;
}

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

// QR Code estático não pede CPF/CNPJ nem cadastro de cliente — quem paga só
// precisa de uma chave Pix (addressKey) pra receber. Reaproveita a primeira
// chave ativa da conta; se não existir nenhuma, cria uma aleatória (EVP) na
// hora. Isso torna o checkout plugável sem nenhuma configuração manual do
// Yan além da API key.
export async function getActiveAddressKey(): Promise<string> {
  const list = await fetch(`${ASAAS_API_URL}/pix/addressKeys?status=ACTIVE`, {
    headers: authHeaders(),
  });
  const listData = await list.json();
  const existingKey = listData?.data?.[0]?.key;
  if (existingKey) return existingKey as string;

  const created = await fetch(`${ASAAS_API_URL}/pix/addressKeys`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ type: "EVP" }),
  });
  const createdData = await created.json();
  if (!created.ok || !createdData.key) {
    throw new Error(`Asaas: falha ao criar chave Pix — ${JSON.stringify(createdData)}`);
  }
  return createdData.key as string;
}

export async function createStaticPixCharge(params: {
  value: number;
  description: string;
  externalReference: string;
  expirationSeconds?: number;
}): Promise<{ id: string; encodedImage: string; payload: string }> {
  const addressKey = await getActiveAddressKey();

  const res = await fetch(`${ASAAS_API_URL}/pix/qrCodes/static`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      addressKey,
      value: params.value,
      description: params.description,
      externalReference: params.externalReference,
      expirationSeconds: params.expirationSeconds ?? 3600,
      allowsMultiplePayments: false,
      format: "ALL",
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.id) {
    throw new Error(`Asaas: falha ao criar QR code Pix — ${JSON.stringify(data)}`);
  }
  return { id: data.id, encodedImage: data.encodedImage, payload: data.payload };
}

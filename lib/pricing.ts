import type { ProductSlug } from "@/lib/access";

// Preço placeholder — TODO(yan): confirmar preço final de cada produto
// antes de divulgar qualquer link de venda. Método Cálice nunca teve
// proposta de valor/preço fechada (ver Método Cálice - Visão Geral no vault).
export const PRODUCT_PRICE: Record<ProductSlug, { value: number; label: string }> = {
  metodo_calice: { value: 47, label: "Método Cálice" },
  lar_interior: { value: 29.9, label: "Lar Interior — Desafio de 7 Dias" },
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

import type { ProductSlug } from "@/lib/access";

// Preço de fundação — decidido 30/07/2026 (valor simbólico total R$341,
// riscado uma vez). Método Cálice ajustado para R$37 em 01/08/2026.
// Turma fundadora: sobe depois, sem data fixa ainda. Ver Método Cálice -
// Visão Geral no vault.
export const PRODUCT_PRICE: Record<ProductSlug, { value: number; label: string }> = {
  metodo_calice: { value: 37, label: "Método Cálice" },
  lar_interior: { value: 29.9, label: "Lar Interior — Desafio de 7 Dias" },
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

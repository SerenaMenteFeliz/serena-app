import type { MetadataRoute } from "next";

// PWA instalável (decisão de formato do produto: sem App Store). start_url
// no /pos-login: quem abre o app instalado cai direto na sua seção (1
// produto) ou no hub (2+) — e no login se a sessão tiver expirado.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Serena Mente Feliz",
    short_name: "Serena",
    description:
      "Um lar pra sua mente — meditação com o Lar Interior e reprogramação mental com o Método Cálice.",
    start_url: "/pos-login",
    display: "standalone",
    background_color: "#eff8f6",
    theme_color: "#eff8f6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

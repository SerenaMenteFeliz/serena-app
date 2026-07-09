// Saudação e "Pensamento do dia" — tudo derivado do relógio de Brasília,
// sem estado no banco. As frases são destilações dos temas dos capítulos
// (piloto automático, crenças, silêncio, ambiente), uma por dia em rodízio.

const QUOTES = [
  "Você não precisa se convencer. Só precisa se lembrar.",
  "O familiar nem sempre é o seguro — às vezes é só o conhecido.",
  "A voz que narra a sua vida não é a sua voz.",
  "Nenhuma crença chega anunciada. Ela chega repetida.",
  "O silêncio não está vazio. Ele está cheio de você.",
  "A mudança de verdade começa no corpo, antes do pensamento.",
  "O platô também é avanço — só que em silêncio.",
  "Seu ambiente fala com a sua mente o dia inteiro. Escolha o que ele diz.",
  "A intuição sussurra. O medo grita.",
  "Repetição com emoção: é assim que se escreve um caminho novo.",
  "As coincidências são a realidade respondendo primeiro.",
  "Não se discute com uma crença. Vive-se uma prova contra ela.",
  "Quem você decide ser hoje já começou a existir.",
  "Pare. Respire. Observe o que estava invisível.",
];

function brasiliaNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour") % 24 };
}

export function getGreeting(): string {
  const { hour } = brasiliaNow();
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getDailyQuote(): string {
  const { year, month, day } = brasiliaNow();
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86_400_000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

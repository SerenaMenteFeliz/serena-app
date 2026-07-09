// Os títulos no banco já se auto-descrevem ("Capítulo 3.1 · O Papel da
// Intuição", "Dia 4 — A Voz Invisível") e a numeração deles NÃO bate com
// order_index (order 3 é o "Capítulo 3.1"). A UI nunca deve numerar por
// conta própria — ou mostra o título inteiro, ou separa rótulo/nome aqui.

export function tituloCapitulo(title: string): { rotulo: string | null; nome: string } {
  const m = title.match(/^(cap[ií]tulo\s*[\d.]+)\s*[·—–-]\s*(.+)$/i);
  return m ? { rotulo: m[1], nome: m[2] } : { rotulo: null, nome: title };
}

export function tituloAula(title: string): string {
  return title.replace(/^dia\s*\d+\s*[—–·-]\s*/i, "");
}

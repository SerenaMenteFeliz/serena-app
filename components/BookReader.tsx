"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

// Simula uma página de livro com altura máxima: o texto do capítulo é
// paginado automaticamente via CSS multi-coluna (uma coluna = uma página,
// do tamanho exato da "janela" de recorte), e arrastar pro lado desliza
// entre páginas. A janela de recorte (overflow: hidden) tem exatamente a
// largura de uma página — o padding visual fica como `inset` dela dentro
// do quadro maior, nunca dentro da própria caixa recortada, senão uma
// fatia da próxima coluna vaza pela margem. Ao passar da última/primeira
// página, continua pro próximo/anterior capítulo — a navegação por
// capítulo é o que já existe e salva progresso; a paginação aqui é só a
// experiência de leitura.
//
// Toque (sem arrastar) e arrasto são tratados num handler só: usar um
// <button> de clique separado por cima do mesmo pointer capture causa
// disparo duplo de navegação (o pointerup solta no elemento capturado E
// dispara o onClick nativo dele).
export function BookReader({
  bodyMd,
  prevHref,
  nextHref,
}: {
  bodyMd: string;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();
  const frameRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const dragStartX = useRef(0);
  const tapRelativeX = useRef(0);

  function measure() {
    const columns = columnsRef.current;
    if (!columns) return;
    const width = columns.clientWidth;
    if (width === 0) return;
    setPageWidth(width);
    const pages = Math.max(1, Math.round(columns.scrollWidth / width));
    setTotalPages(pages);
    setPageIndex((i) => Math.min(i, pages - 1));
  }

  useLayoutEffect(() => {
    setPageIndex(0);
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyMd]);

  useEffect(() => {
    const columns = columnsRef.current;
    if (!columns) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(columns);
    return () => observer.disconnect();
  }, []);

  function goToPage(next: number) {
    if (next < 0) {
      if (prevHref) router.push(prevHref);
      return;
    }
    if (next > totalPages - 1) {
      if (nextHref) router.push(nextHref);
      return;
    }
    setPageIndex(next);
  }

  function onPointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    const rect = frameRef.current?.getBoundingClientRect();
    tapRelativeX.current = rect ? (e.clientX - rect.left) / rect.width : 0.5;
    setDragX(0);
    frameRef.current?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragX === null) return;
    setDragX(e.clientX - dragStartX.current);
  }

  function onPointerUp() {
    if (dragX === null) return;
    const swipeThreshold = Math.max(50, pageWidth * 0.18);

    if (Math.abs(dragX) > swipeThreshold) {
      goToPage(dragX < 0 ? pageIndex + 1 : pageIndex - 1);
    } else if (Math.abs(dragX) < 8) {
      // toque sem arrasto — lado esquerdo/direito da página vira atalho
      if (tapRelativeX.current < 0.3) goToPage(pageIndex - 1);
      else if (tapRelativeX.current > 0.7) goToPage(pageIndex + 1);
    }
    setDragX(null);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") goToPage(pageIndex + 1);
    else if (e.key === "ArrowLeft") goToPage(pageIndex - 1);
  }

  const baseOffset = -pageIndex * pageWidth;
  const offset = dragX !== null ? baseOffset + dragX : baseOffset;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
      <div
        ref={frameRef}
        role="group"
        aria-label="Página do livro — arraste ou toque nas laterais para navegar"
        tabIndex={0}
        className="book-page-frame relative w-full touch-pan-y select-none rounded-2xl outline-none"
        style={{ height: "62vh" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {/* janela de recorte — largura exata de uma página, o padding vem
            do `inset`, nunca de padding interno (senão a coluna 2 vaza) */}
        <div className="pointer-events-none absolute overflow-hidden" style={{ inset: "1.75rem 1.5rem" }}>
          <div
            ref={columnsRef}
            className="reading-content book-page-columns h-full"
            style={{
              transform: `translateX(${offset}px)`,
              transition: dragX === null ? "transform 0.3s ease" : "none",
              columnWidth: pageWidth > 0 ? `${pageWidth}px` : undefined,
            }}
          >
            <ReactMarkdown>{bodyMd}</ReactMarkdown>
          </div>
        </div>
      </div>

      <p className="text-xs opacity-50">
        página {pageIndex + 1} de {totalPages}
      </p>
    </div>
  );
}

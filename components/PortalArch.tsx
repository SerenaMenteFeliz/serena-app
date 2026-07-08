// Moldura em arco decorativa (a "porta" pro mundo do produto). Usada atrás
// de logo/título nas telas de entrada, e atrás da capa do livro.
export function PortalArch({
  children,
  width = 220,
  height = 300,
}: {
  children?: React.ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className="portal-arch flex items-center justify-center"
      style={{ width, height }}
    >
      {children}
    </div>
  );
}

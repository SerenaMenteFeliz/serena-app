// Esqueleto da troca de rota — mesmo véu do guarda-chuva, sem tela branca.
export default function LoadingHub() {
  return (
    <div className="theme-hub veil-bg">
      <main className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <div className="skeleton h-10 w-44 rounded-xl" />
        <div className="mt-9 grid grid-cols-2 gap-3">
          <div className="skeleton h-[240px]" style={{ borderRadius: "137px 137px 25px 25px" }} />
          <div className="skeleton h-[240px]" style={{ borderRadius: "137px 137px 25px 25px" }} />
        </div>
        <div className="skeleton mt-7 h-16 rounded-2xl" />
        <div className="skeleton mt-2 h-16 rounded-2xl" />
      </main>
    </div>
  );
}

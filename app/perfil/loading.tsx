// Esqueleto da troca de rota — mesmo véu do guarda-chuva, sem tela branca.
export default function LoadingPerfil() {
  return (
    <div className="theme-hub veil-bg">
      <main className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="skeleton h-[84px] w-[84px] rounded-full" />
          <div className="skeleton h-6 w-32 rounded-lg" />
        </div>
        <div className="skeleton mt-9 h-28 rounded-2xl" />
        <div className="skeleton mt-2.5 h-28 rounded-2xl" />
        <div className="skeleton mt-7 h-12 rounded-2xl" />
      </main>
    </div>
  );
}

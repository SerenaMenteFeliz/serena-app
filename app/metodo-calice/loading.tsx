// Esqueleto da troca de rota — mesmo véu do produto, sem tela branca.
export default function LoadingCalice() {
  return (
    <div className="theme-metodo-calice veil-bg">
      <main className="mx-auto w-full max-w-md px-5 pb-32 pt-6">
        <div className="skeleton h-10 w-40 rounded-xl" />
        <div className="skeleton veil-arch mt-5 h-[246px]" />
        <div className="skeleton mt-5 h-16 rounded-2xl" />
        <div className="skeleton mt-4 h-14 rounded-2xl" />
        <div className="skeleton mt-4 h-20 rounded-2xl" />
      </main>
    </div>
  );
}

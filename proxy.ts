import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRODUCT_ENTRY_ROUTES = ["/lar-interior", "/metodo-calice", "/hub"];

// Checagem otimista: só confirma se existe sessão (via cookie), nunca consulta
// o banco aqui. A decisão de PARA QUAL produto redirecionar (hub vs seção
// única) é feita em /pos-login, que tem acesso ao banco.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isEntryRoute = pathname === "/entrar" || /^\/(lar-interior|metodo-calice)\/entrar\/?$/.test(pathname);
  const isProtectedRoute = !isEntryRoute && PRODUCT_ENTRY_ROUTES.some((r) => pathname.startsWith(r));

  if (!user && isProtectedRoute) {
    // Manda pro login temático do produto que a pessoa tentou acessar
    // (/lar-interior/* -> /lar-interior/entrar), não pro genérico.
    const produto = pathname.startsWith("/lar-interior")
      ? "/lar-interior/entrar"
      : pathname.startsWith("/metodo-calice")
        ? "/metodo-calice/entrar"
        : "/entrar";
    return NextResponse.redirect(new URL(produto, request.url));
  }

  if (user && isEntryRoute) {
    return NextResponse.redirect(new URL("/pos-login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

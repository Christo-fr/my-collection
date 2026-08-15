import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. On prépare la réponse initiale de Next.js
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. On configure le client Supabase avec accès aux cookies de la requête HTTP
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. On rafraîchit la session Supabase si nécessaire
  await supabase.auth.getUser();

  // 4. RÉCUPÉRATION DU CHEMIN ACTUEL ET COMPTAGE DES COMPTES
  const pathname = request.nextUrl.pathname;

  // On ignore les Server Actions, les routes API et les requêtes RSC internes
  const isServerAction = request.headers.has("next-action");
  const isRscRequest = request.headers
    .get("accept")
    ?.includes("text/x-component");

  if (pathname.startsWith("/api") || isServerAction || isRscRequest) {
    return supabaseResponse;
  }

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const totalProfiles = count ?? 0;

  // RÈGLE 1 : Aucun compte n'existe encore -> On force la redirection vers /signup
  if (totalProfiles === 0 && pathname !== "/signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/signup";
    return NextResponse.redirect(url);
  }

  // RÈGLE 2 : Un compte existe déjà ET l'utilisateur tente d'aller sur /signup -> Redirection vers /login
  if (totalProfiles > 0 && pathname === "/signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

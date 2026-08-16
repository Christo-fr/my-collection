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

  // 3. On rafraîchit la session Supabase et on récupère l'utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Helper interne pour effectuer une redirection tout en conservant
  // l'intégralité des cookies de session rafraîchis par Supabase
  const redirectWithCookies = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    const redirectResponse = NextResponse.redirect(url);

    // On recopie tous les cookies de supabaseResponse vers redirectResponse
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  };

  // 4. RÉCUPÉRATION DU CHEMIN ACTUEL ET EXCLUSION DES API / SERVER ACTIONS
  const pathname = request.nextUrl.pathname;
  const isServerAction = request.headers.has("next-action");

  // On ignore uniquement les Server Actions et les routes d'API
  if (pathname.startsWith("/api") || isServerAction) {
    return supabaseResponse;
  }

  // 5. VÉRIFICATION DU NOMBRE DE COMPTES CRÉÉS
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const totalProfiles = count ?? 0;

  // RÈGLE 1 : Aucun compte n'existe encore -> On force la redirection vers /signup
  if (totalProfiles === 0 && pathname !== "/signup") {
    return redirectWithCookies("/signup");
  }

  // RÈGLE 2 : Un compte existe déjà ET l'utilisateur tente d'aller sur /signup -> Redirection vers /login
  if (totalProfiles > 0 && pathname === "/signup") {
    return redirectWithCookies("/login");
  }

  // RÈGLE 3 : Utilisateur NON connecté essayant d'accéder à l'administration -> Redirection vers /login
  if (!user && pathname.startsWith("/administration")) {
    return redirectWithCookies("/login");
  }

  // RÈGLE 4 : Utilisateur CONNECTÉ essayant d'accéder à /login ou /signup -> Redirection vers /administration
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return redirectWithCookies("/administration");
  }

  return supabaseResponse;
}

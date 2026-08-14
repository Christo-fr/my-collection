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
          // Si Supabase doit rafraîchir la session, on applique les nouveaux cookies
          // sur la requête ET sur la réponse qui partira vers le navigateur.
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

  // 3. Cette ligne déclenche la vérification de session auprès de Supabase.
  // Si le cookie a besoin d'être renouvelé, la fonction `setAll` ci-dessus s'exécute automatiquement.
  await supabase.auth.getUser();

  return supabaseResponse;
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crée une instance du client Supabase adaptée aux composants et API exécutés côté serveur.
 * Cette fonction doit être asynchrone (`async`) car l'accès aux cookies dans Next.js (depuis Next 15) est asynchrone.
 */
export async function createClient() {
  // 1. On récupère le magasin de cookies de la requête HTTP en cours
  const cookieStore = await cookies();

  // 2. On initialise le client Supabase serveur avec la gestion personnalisée des cookies
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // PERMET À SUPABASE DE LIRE LA SESSION :
        // Récupère tous les cookies envoyés par le navigateur dans la requête.
        // C'est ainsi que Supabase sait si la personne qui demande la page est connectée.
        getAll() {
          return cookieStore.getAll();
        },

        // PERMET À SUPABASE D'ÉCRIRE / METTRE À JOUR LA SESSION :
        // Appelé lors de la connexion, de la déconnexion ou du rafraîchissement d'un token.
        setAll(cookiesToSet) {
          try {
            // Pour chaque cookie renvoyé par Supabase, on le sauvegarde dans les en-têtes HTTP de la réponse Next.js.
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Pourquoi ce try / catch ?
            // Dans Next.js, un "Server Component" a le droit de LIRE les cookies, mais PAS d'en ÉCRIRE.
            // Seules les Server Actions et les API Routes peuvent en écrire.
            // Si cette fonction est appelée depuis un Server Component, l'écriture échouera silencieusement sans faire planter l'application.
          }
        },
      },
    },
  );
}

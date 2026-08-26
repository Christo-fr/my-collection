// Force Next.js à exécuter cette route à chaque requête HTTP sans la mettre en cache statique
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =========================================================================
// RECUPERATION DES JEUX
// =========================================================================
/** Récupère la liste globale des jeux dans Supabase, filtrable par franchise via query params */
export async function GET() {
  // Initialise le client Supabase serveur avec accès sécurisé aux cookies HTTP
  const supabase = await createClient();

  // Exécute la requête de manière asynchrone auprès du serveur Supabase
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("id", { ascending: true });

  // Intercepte les erreurs réseau/BDD et renvoie une réponse HTTP 500
  if (error) {
    console.error("Erreur Supabase :", error.message);
    return NextResponse.json(
      { error: "Impossible de récupérer les jeux" },
      { status: 500 },
    );
  }

  // Renvoie le tableau d'objets JSON lues en direct dans PostgreSQL
  return NextResponse.json(data);
}

export const dynamic = "force-dynamic"; // Empeche Next.js de mettre l'API en cache statique
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const franchise = searchParams.get("franchise");

  // 1. On prépare la requête PostgreSQL de base
  let query = supabase
    .from("games")
    .select("*")
    .order("id", { ascending: true });

  // 2. Si le paramètre "franchise" existe dans l'URL, on ajoute le filtre WHERE
  if (franchise) {
    query = query.eq("franchise", franchise);
  }

  // 3. On exécute la requête auprès de Supabase
  const { data, error } = await query;

  // 4. Gestion d'erreur si la BDD ne répond pas
  if (error) {
    console.error("Erreur Supabase :", error.message);
    return NextResponse.json(
      { error: "Impossible de récupérer les jeux" },
      { status: 500 },
    );
  }

  // 5. On renvoie les données JSON lues en direct dans PostgreSQL
  return NextResponse.json(data);
}

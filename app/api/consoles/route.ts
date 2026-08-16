export const dynamic = "force-dynamic"; // Empeche Next.js de mettre l'API en cache statique
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // 1. On prépare la requête PostgreSQL de base
  let query = supabase
    .from("consoles")
    .select("*")
    .order("display_order", { ascending: true });

  // 2. On exécute la requête auprès de Supabase
  const { data, error } = await query;

  // 3. Gestion d'erreur si la BDD ne répond pas
  if (error) {
    console.error("Erreur Supabase :", error.message);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des consoles" },
      { status: 500 },
    );
  }

  // 4. On renvoie les données JSON lues en direct dans PostgreSQL
  return NextResponse.json(data);
}

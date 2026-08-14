export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  // On demande à Supabase le jeu qui a cet ID précis
  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", Number(id))
    .single(); // .single() dit à Supabase : "Renvoie-moi un seul objet, pas un tableau"

  if (error || !game) {
    return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
  }

  return NextResponse.json(game);
}

import { NextResponse } from "next/server";
import gamesData from "@/data/games.json";

//Traitement de la requête GET pour l'API pour recupérer un jeu en fonction de son ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const game = gamesData.find((game) => game.id === Number(id));

  if (game) {
    return NextResponse.json(game);
  } else {
    return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
  }
}

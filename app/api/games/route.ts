import { NextResponse } from "next/server";
import gamesData from "@/data/games.json";

//Traitement de la requête GET pour l'API des jeux
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const franchise = searchParams.get("franchise");

  if (franchise) {
    const gamesFranchise = gamesData.filter(
      (game) => game.franchise === franchise,
    );
    return NextResponse.json(gamesFranchise);
  } else {
    return NextResponse.json(gamesData);
  }
}

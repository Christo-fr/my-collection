import { NextResponse } from "next/server";
import gamesData from "@/data/games.json";

//Traitement de la requête GET pour l'API des jeux
export async function GET() {
  return NextResponse.json(gamesData);
}

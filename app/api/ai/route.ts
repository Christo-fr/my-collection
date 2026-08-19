import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialisation du client avec la clé d'API serveur
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    // 1. On extrait les données envoyées par le client
    const body = await request.json();
    const { title } = body;

    // 2. Sécurité : Que fait-on si "title" n'existe pas ou n'est pas du texte ?
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Le titre du jeu est obligatoire." },
        { status: 400 },
      );
    }

    // 1. Définition des consignes pour Gemini
    const prompt = `
      Tu es un expert en jeux vidéo et en bases de données rétro/modernes.
      Analyse le jeu vidéo suivant : "${title}".
      
      Fournis-moi ses informations au format JSON strict, sans bloc de code markdown autour, avec exactement ces clés :
      - "developer": Le nom du studio de développement principal (texte).
      - "genre": Le genre principal du jeu (ex: "Action-RPG", "Platformer", "Course") (texte).
      - "pegi": L'âge minimal sous forme de nombre entier strict (uniquement 3, 7, 12, 16 ou 18).
      - "releaseDate": La date de sortie initiale au format "YYYY-MM" (ex: "2017-03").
      - "estimatedPlaytime": Le temps de jeu estimé pour l'histoire principale en heures (nombre entier).
      - "description": Un synopsis court et informatif en français (3 à 4 phrases).
      - "franchise": Le nom de la saga/série (ex: "Mario Kart", "The Legend of Zelda", ou le nom du jeu si licence unique).
      - "youtubeId": L'ID d'une vidéo YouTube officielle (ex: trailer de 11 caractères, ou chaîne vide si introuvable).
    `;

    // 2. Envoi de la requête à Gemini Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    // 3. Récupération du texte brut généré par l'IA
    const textResponse = response.text;

    if (!textResponse) {
      return NextResponse.json(
        { error: "L'IA n'a renvoyé aucune donnée." },
        { status: 500 },
      );
    }

    // 4. Nettoyage des éventuelles balises markdown
    const cleanJsonString = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 5. Conversion du texte nettoyé en objet JavaScript
    const gameData = JSON.parse(cleanJsonString);

    // 6. Renvoi de la réponse au client
    return NextResponse.json(gameData, { status: 200 });
  } catch (error) {
    console.error("Erreur serveur API AI :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue sur le serveur." },
      { status: 500 },
    );
  }
}

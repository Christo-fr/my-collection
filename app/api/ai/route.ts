import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialisation du client Google Gen AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // 1. Extraction et validation des données de la requête
    const body = await req.json();
    const { title, console: consoleName, existingOptions = {} } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est obligatoire." },
        { status: 400 },
      );
    }

    // 2. Construction du prompt détaillé pour Gemini Flash
    const fallbackConsoleLabel =
      "Nom de la console (priorité à la liste des consoles existantes si non spécifiée)";
    const targetConsole = consoleName ? consoleName : fallbackConsoleLabel;

    const prompt = `
Tu es un expert en jeux vidéo. Récupère les métadonnées du jeu « ${title} »${
      consoleName ? ` spécifiquement pour la plateforme « ${consoleName} »` : ""
    }.

Règle générale de provenance / région :
Le jeu est considéré comme acheté en France.
1. Utilise en priorité les données de la version française (sortie française, PEGI, etc.).
2. Si le jeu n'est pas sorti en France, utilise les données de la version européenne (PAL).
3. Si le jeu n'est pas sorti en Europe, utilise les données du pays d'origine (ex: Japon ou USA).

Consignes de correspondance avec la base de données :
Pour les champs ci-dessous, tu DOIS vérifier la liste fournie. Si le jeu correspond à une option existante, réutilise EXACTEMENT la même chaîne de caractères :
- Consoles existantes : ${JSON.stringify(existingOptions.consoles || [])}
- Genres existants : ${JSON.stringify(existingOptions.genres || [])}
- Développeurs existants : ${JSON.stringify(existingOptions.developers || [])}
- Franchises existantes : ${JSON.stringify(existingOptions.franchises || [])}
- Langues existantes : ${JSON.stringify(existingOptions.languages || [])}

Règles strictes de gestion du champ "language" :
Textes/sous-titres (ordre de priorité) :
1. "FR" (si le français est présent)
2. "UK" (sinon, si l'anglais est présent)
3. Code à 2 lettres du pays d'origine (ex: JP, ES, DE)

Voix (ordre de priorité STRICT si le jeu comporte des doublages vocaux) :
1. "FR" : Si un doublage français existe (à appliquer aux productions majeures sorties en France/Europe).
2. "JP" : Si aucun doublage FR n'existe, mais qu'un doublage japonais est présent.
3. "UK" : Si aucun doublage FR ni JP n'existe, mais qu'un doublage anglais est présent.
4. Code à 2 lettres du pays d'origine si aucune de ces trois langues n'est disponible.

Formatage de la chaîne "language" :
- Texte seul : "[Code Texte]" (ex: "FR")
- Avec voix : "[Code Texte] / Voix : [Code Voix]" (ex: "FR / Voix : FR", "FR / Voix : JP", "FR / Voix : UK")
- PRIORITÉ ABSOLUE : Si la chaîne générée correspond à une option existante dans la liste des langues transmise, réutilise exactement l'option de la liste.

Règles de rédaction de la "description" :
- Le texte doit être un résumé/synopsis accrocheur en français (4 à 5 phrases).
- Hiérarchie des sources à privilégier pour le contenu :
  1. Si la console est une PlayStation (ex: PS1, PS2, PS3, PS4, PS5, PSP, Vita) : Reprends/adapte le synopsis du PlayStation Store (store.playstation.com).
  2. Si la console est une Nintendo (ex: NES, SNES, N64, GC, Wii, Switch, GB, DS, 3DS) : Reprends/adapte le synopsis du site Nintendo (nintendo.com/fr-fr).
  3. Si le jeu n'est pas présent sur ces stores : Reprends le synopsis de sa page Steam.
  4. En dernier recours : Rédige un résumé accrocheur fondé sur tes connaissances.

Format du JSON attendu :
{
  "console": "${targetConsole}",
  "developer": "Nom du studio développeur (priorité à la liste)",
  "franchise": "Nom de la franchise/licence (priorité à la liste)",
  "genre": "Genre principal (priorité à la liste)",
  "language": "FR / Voix : JP",
  "pegi": 12,
  "releaseDate": "AAAA-MM",
  "estimatedPlaytime": 20,
  "description": "Résumé accrocheur en français (4 à 5 phrases).",
  "youtubeId": "dQw4w9WgXcQ"
}

Règles de formatage strictes :
- "console" : Utilise SYSTÉMATIQUEMENT le diminutif ou le sigle usuel de la plateforme (ex: "PS2" au lieu de "PlayStation 2", "NES", "SNES", "GBA", "PC", "N64", "GC", "Switch", "3DS"). PRIORITÉ ABSOLUE : Si le diminutif correspond à une option dans la liste des consoles existantes transmise, réutilise exactement la chaîne de la liste.
- "pegi" : Utilise en priorité la classification PEGI officielle (FR/EU). Si le jeu n'a pas de PEGI officiel, convertis la classification de son pays d'origine (ex: ESRB pour les USA, CERO pour le Japon) vers la valeur PEGI équivalente la plus proche. Le résultat DOIT obligatoirement être un nombre entier parmi [3, 7, 12, 16, 18].
- "releaseDate" doit être au format "AAAA-MM" (ex: "1995-03") basé sur la date de sortie FR (ou EU / Origine si non disponible).
- "estimatedPlaytime" doit être un nombre entier sans décimale représentant les heures de jeu pour la trame principale uniquement ("Main Story" sur HowLongToBeat).
- "youtubeId" doit être l'identifiant exact de 11 caractères d'un trailer officiel sur YouTube. Si tu n'es pas certain à 100 % de l'ID exact, renvoie une chaîne vide "".
- Réponds UNIQUEMENT avec l'objet JSON brut sans balises Markdown (\`\`\`json).
`;

    // 3. Envoi de la requête à Gemini Flash
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    // 4. Nettoyage de la réponse et parsing du JSON
    const text = response.text || "";
    const sanitizedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(sanitizedText);

    // 5. Renvoi des métadonnées sous forme de réponse JSON
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Erreur serveur API AI :", error);

    // 6. Gestion spécifique des erreurs de quota (HTTP 429)
    if (
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        {
          error: "Quota de l'API Gemini dépassé pour aujourd'hui.",
        },
        { status: 429 },
      );
    }
    if (
      error.status === 503 ||
      error.message?.includes("503") ||
      error.message?.includes("UNAVAILABLE")
    ) {
      return NextResponse.json(
        {
          error:
            "Les serveurs de Google sont temporairement surchargés. Réessaie dans quelques secondes.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error:
          error.message ||
          "Erreur lors de la génération des métadonnées avec l'IA.",
      },
      { status: 500 },
    );
  }
}

import { GoogleGenAI } from "@google/genai";
import { ImageCandidate } from "@/lib/brave/search";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchImageAsBase64(
  url: string,
): Promise<{ mimeType: string; data: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const mimeType = contentType.split(";")[0].trim();

    return {
      mimeType,
      data: Buffer.from(buffer).toString("base64"),
    };
  } catch {
    return null;
  }
}

/**
 * Soumet les miniatures d'images candidates à Gemini Vision
 * et retourne l'index du meilleur visuel retenu.
 */
export async function selectBestImageWithVision(
  candidates: ImageCandidate[],
  type: "logo" | "cover" | "parallax",
  title: string,
  consoleName?: string,
): Promise<number> {
  if (candidates.length === 0) return -1;
  if (candidates.length === 1) return 0;

  try {
    const imagePromises = candidates.map((c) =>
      fetchImageAsBase64(c.thumbnailUrl || c.url),
    );
    const imagesBase64 = await Promise.all(imagePromises);

    const validImages: {
      index: number;
      inlineData: { mimeType: string; data: string };
    }[] = [];

    imagesBase64.forEach((img, idx) => {
      if (img) {
        validImages.push({ index: idx, inlineData: img });
      }
    });

    if (validImages.length === 0) return 0;

    const platformContext = consoleName
      ? ` spécifiquement pour la plateforme « ${consoleName} »`
      : "";

    let criteria = "";
    if (type === "logo") {
      criteria = `Choisis le logo officiel correspondant EXACTEMENT au jeu « ${title} »${platformContext}. VÉRIFIE ATTENTIVEMENT le numéro, le sous-titre ou la plateforme figurant sur le logo (ex: ne choisis pas un autre opus ou une édition d'une autre console). L'image doit être un logo propre détouré sur fond transparent (PNG/WebP). Le nom du jeu doit être bien visible. REJETTE IMPÉRATIVEMENT tout visuel possédant un fond blanc, noir ou un faux quadrillage de transparence opaque. Il ne doit y avoir aucun fond derrière le logo.`;
    } else if (type === "cover") {
      criteria = `Choisis la meilleure bannière/illustration officielle pour « ${title} »${platformContext} : le format DOIT être strictly HORIZONTAL (paysage / wallpaper), de très haute résolution (1920px+), idéale comme fond de présentation. VÉRIFIE ATTENTIVEMENT qu'il s'agit bien de ce jeu précis (ne choisis pas un autre opus, une autre édition ou un jeu d'une franchise proche). Le logo du jeu ou du texte ne doit surtout pas apparaitre sur l'illustration, pour des questions de visibilité.`;
    } else if (type === "parallax") {
      criteria = `Choisis l'illustration/render de personnage pour « ${title} »${platformContext} le plus net, PARFAITEMENT DÉTOURÉ sur fond transparent (PNG/WebP). VÉRIFIE ATTENTIVEMENT qu'il s'agit bien de ce jeu précis (ne choisis pas un autre opus, une autre édition ou un jeu d'une franchise proche). REJETTE IMPÉRATIVEMENT tout visuel possédant un carré de fond blanc, noir ou gris opaque derrière le personnage.`;
    }

    const promptText = `
Tu es un directeur artistique expert dans le domaine des jeux vidéo. Examine ces ${validImages.length} images fournies dans l'ordre.
Consigne : ${criteria}

Réponds UNIQUEMENT avec un objet JSON brut sous ce format exact, sans balises Markdown :
{"selectedIndex": N}
Où N est l'index relatif de la meilleure image (de 0 à ${validImages.length - 1}).
`;

    const contents: any[] = [promptText];
    validImages.forEach((v) => {
      contents.push({ inlineData: v.inlineData });
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
    });

    const text = response.text || "";
    const sanitized = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(sanitized);

    if (
      typeof parsed.selectedIndex === "number" &&
      parsed.selectedIndex >= 0 &&
      parsed.selectedIndex < validImages.length
    ) {
      return validImages[parsed.selectedIndex].index;
    }

    return 0;
  } catch (error) {
    console.warn(
      `[Gemini Vision Warning] Analyse visuelle échouée pour « ${type} », fallback automatique sur le premier résultat.`,
      error,
    );
    return 0;
  }
}

import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    // 1. Récupération des données FormData transmises par le client
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    // 2. Validation de base : Au moins une source d'image doit être fournie
    if (!file && !url) {
      return NextResponse.json(
        { error: "Aucun fichier ou URL n'a été fourni." },
        { status: 400 },
      );
    }

    // Déclaration de la variable qui accueillera le contenu binaire brut de l'image
    let inputBuffer: Buffer;

    // ---------------------------------------------------------------------
    // CAS A : Traitement d'un Fichier local
    // ---------------------------------------------------------------------
    if (file) {
      // Vérification du type MIME (doit commencer par "image/", ex: image/png, image/jpeg)
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Le fichier envoyé n'est pas une image valide." },
          { status: 400 },
        );
      }

      // Conversion de l'objet File en Buffer Node.js
      const bytes = await file.arrayBuffer();
      inputBuffer = Buffer.from(bytes);
    }
    // ---------------------------------------------------------------------
    // CAS B : Traitement d'une URL distante
    // ---------------------------------------------------------------------
    else if (url) {
      // Téléchargement de l'image depuis l'URL externe (évite les soucis CORS côté navigateur)
      const response = await fetch(url);

      // Vérification du statut HTTP (200 OK)
      if (!response.ok) {
        return NextResponse.json(
          { error: "Impossible de télécharger l'image depuis l'URL fournie." },
          { status: 400 },
        );
      }

      // Vérification que le serveur distant renvoie bien une image
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        return NextResponse.json(
          { error: "L'URL ne pointe pas vers un fichier image valide." },
          { status: 400 },
        );
      }

      // Conversion du flux téléchargé en Buffer Node.js
      const arrayBuffer = await response.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json(
        { error: "Source d'image invalide." },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------------------
    // 3. Conversion de l'image en WebP grâce à Sharp
    // ---------------------------------------------------------------------
    const webpBuffer = await sharp(inputBuffer)
      .toColorspace("srgb")
      .webp({ quality: 90 }) // Compression optimisée à 90%
      .toBuffer();

    // ---------------------------------------------------------------------
    // 4. Renvoi du fichier WebP binaire converti
    // ---------------------------------------------------------------------
    return new Response(webpBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": 'inline; filename="converted.webp"',
      },
    });
  } catch (error: any) {
    // Si Sharp ne parvient pas à lire l'image (fichier corrompu ou format non supporté)
    console.error("Erreur lors de la conversion WebP :", error);
    return NextResponse.json(
      {
        error:
          "Échec de la conversion (fichier corrompu ou format d'image non supporté).",
      },
      { status: 500 },
    );
  }
}

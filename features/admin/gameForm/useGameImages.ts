import { useState } from "react";
import { Game } from "@/types/game";
import { createClient } from "@/lib/supabase/client";

export function useGameImages(editGame?: Game) {
  // Instance du client Supabase pour interagir avec la BDD et le Storage cloud
  const supabase = createClient();

  // =========================================================================
  // 1. ÉTATS (STATES)
  // =========================================================================

  // --- Cover ---
  // Onglet actuellement sélectionné par l'utilisateur ("file" pour fichier, "url" pour lien web)
  const [coverSourceType, setCoverSourceType] = useState<"file" | "url">(
    "file",
  );
  // Fichier brut sélectionné depuis le disque local (objet JS File) ou null
  const [uploadCover, setUploadCover] = useState<File | null>(null);
  // Lien texte saisi manuellement dans l'onglet URL
  const [urlCover, setUrlCover] = useState<string>("");

  // --- Logo ---
  const [uploadLogo, setUploadLogo] = useState<File | null>(null);
  const [urlLogo, setUrlLogo] = useState<string>("");
  const [logoSourceType, setLogoSourceType] = useState<"file" | "url">("file");

  // --- Parallax ---
  const [uploadParallax, setUploadParallax] = useState<File | null>(null);
  const [urlParallax, setUrlParallax] = useState<string>("");
  const [parallaxSourceType, setParallaxSourceType] = useState<"file" | "url">(
    "file",
  );
  const [parallaxTruncated, setParallaxTruncated] = useState<boolean>(
    editGame?.images?.parallax?.truncated || false,
  );

  // =========================================================================
  // 2. HELPER CONVERSION WEBP & UPLOAD SUPABASE
  // =========================================================================

  /**
   * Fonction utilitaire : prend un fichier ou une URL, convertit l'image en .webp
   * via notre route API locale, puis l'envoie dans le bucket Supabase ciblé.
   */
  const uploadImageToSupabase = async (
    source: File | string,
    bucket: string,
  ): Promise<string | null> => {
    try {
      // FormData : conteneur HTML/JS pour envoyer un fichier ou du texte via HTTP multipart
      const formData = new FormData();
      if (typeof source === "string") {
        formData.append("url", source);
      } else {
        formData.append("file", source);
      }

      // Appel de notre API interne /api/webp pour recompresser l'image en WebP
      const response = await fetch("/api/webp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur de conversion de l'image.");
      }

      // Blob (Binary Large Object) : extrait les données binaires brutes de l'image convertie
      const blob = await response.blob();
      // Reconstitue un fichier JavaScript complet prêt pour l'upload
      const webpFile = new File([blob], `${Date.now()}.webp`, {
        type: "image/webp",
      });

      // Upload physique du fichier .webp vers le dossier Cloud Supabase (bucket)
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(webpFile.name, webpFile);

      if (error) {
        console.error(
          `Erreur d'upload sur le bucket "${bucket}" :`,
          error.message,
        );
        return null;
      }

      // Génère l'URL publique HTTPS finale pour afficher l'image sur l'application
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Erreur durant le traitement de l'image :", error);
      return null;
    }
  };

  /**
   * Fonction décisionnelle : vérifie la source choisie ("file" ou "url") et si une
   * nouvelle image a été fournie. Si rien n'a changé, conserve l'image BDD d'origine.
   */
  const processImage = async (
    sourceType: "file" | "url",
    file: File | null,
    newUrl: string,
    existingUrl: string | undefined,
    bucket: string,
  ) => {
    // 1. Un nouveau fichier local a été déposé
    if (sourceType === "file" && file) {
      return uploadImageToSupabase(file, bucket);
    }
    // 2. Une nouvelle URL valide a été saisie
    if (sourceType === "url" && newUrl.trim() !== "") {
      return uploadImageToSupabase(newUrl.trim(), bucket);
    }
    // 3. Aucun changement : on renvoie simplement l'URL déjà enregistrée en BDD
    return existingUrl || null;
  };

  // =========================================================================
  // 3. VALEURS DE RETOUR (RETURN)
  // =========================================================================
  return {
    uploadCover,
    setUploadCover,
    urlCover,
    setUrlCover,
    coverSourceType,
    setCoverSourceType,

    uploadLogo,
    setUploadLogo,
    urlLogo,
    setUrlLogo,
    logoSourceType,
    setLogoSourceType,

    uploadParallax,
    setUploadParallax,
    urlParallax,
    setUrlParallax,
    parallaxSourceType,
    setParallaxSourceType,
    parallaxTruncated,
    setParallaxTruncated,

    initialImages: editGame?.images, // Expose les images initiales en BDD
    processImage,
  };
}

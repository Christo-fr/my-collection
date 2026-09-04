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
  // 2. HELPERS NETTOYAGE STORAGE & UPLOAD
  // =========================================================================

  /**
   * Helper d'extraction : extrait le nom de fichier relatif dans le bucket Supabase
   * à partir d'une URL publique complète (ex: ".../storage/v1/object/public/logos/1234.webp" -> "1234.webp").
   */
  const extractStoragePath = (url: string, bucket: string): string | null => {
    try {
      // 1. Isole l'URL avant d'éventuels paramètres de requête HTTP (?t=123...)
      const cleanUrl = url.split("?")[0];
      // 2. Expression rationnelle pour capturer tout ce qui se trouve après le nom du bucket
      const match = cleanUrl.match(
        new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`),
      );
      // 3. Décode les caractères spéciaux Web (espaces encodés %20, etc.)
      return match ? decodeURIComponent(match[1]) : null;
    } catch {
      return null;
    }
  };

  /**
   * Helper de suppression : retire un ancien fichier du bucket Supabase
   * s'il s'agit bien d'une image hébergée sur ton Cloud Supabase.
   */
  const deleteImageFromSupabase = async (url: string, bucket: string) => {
    const filePath = extractStoragePath(url, bucket);
    // Si l'image de base n'était pas stockée sur Supabase (ex: URL externe), on ignore
    if (!filePath) return;

    // Supabase remove() attend uniquement le chemin relatif dans le bucket (ex: "1234.webp")
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.warn(
        `[Storage Clean Warning] Impossible de supprimer ${filePath} :`,
        error.message,
      );
    }
  };

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
   * Fonction décisionnelle : orchestre l'upload de la nouvelle image et supprime
   * l'ancienne du bucket Supabase si la nouvelle image a été envoyée avec succès.
   */
  const processImage = async (
    sourceType: "file" | "url",
    file: File | null,
    newUrl: string,
    existingUrl: string | undefined,
    bucket: string,
  ) => {
    let uploadedPublicUrl: string | null = null;

    // 1. Un nouveau fichier local a été déposé
    if (sourceType === "file" && file) {
      uploadedPublicUrl = await uploadImageToSupabase(file, bucket);
    }
    // 2. Une nouvelle URL valide a été saisie
    else if (sourceType === "url" && newUrl.trim() !== "") {
      uploadedPublicUrl = await uploadImageToSupabase(newUrl.trim(), bucket);
    }
    // 3. Aucun changement : on renvoie simplement l'URL déjà enregistrée en BDD
    else {
      return existingUrl || null;
    }

    // 4. Si la nouvelle image a bien été uploadée
    if (uploadedPublicUrl) {
      // Si une ancienne image existait et qu'elle est remplacée, on purge l'ancien fichier du bucket
      if (existingUrl && existingUrl !== uploadedPublicUrl) {
        await deleteImageFromSupabase(existingUrl, bucket);
      }
      return uploadedPublicUrl;
    }

    return null;
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

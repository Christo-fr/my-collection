"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/types/game";
import { createClient } from "@/lib/supabase/client";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { toast } from "sonner";

// Importation de nos 4 sous-hooks spécialisés
import { useGameInformations } from "./useGameInformations";
import { useGameImages } from "./useGameImages";
import { useGameReview } from "./useGameReview";
import { useGameAI } from "./useGameAI";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

export function useGameForm({ mode, editGame }: GameFormProps) {
  const router = useRouter();
  const { refetchGames } = useGamesContext();
  const supabase = createClient();

  // =========================================================================
  // 1. INSTANCIATION DES SOUS-HOOKS (L'ORCHESTRATION)
  // =========================================================================
  // On respecte l'ordre : info et img d'abord, puis review, puis ai qui en dépend
  const info = useGameInformations(editGame);
  const img = useGameImages(editGame);
  const review = useGameReview(editGame);
  const ai = useGameAI(info, img);

  // =========================================================================
  // 2. ÉTATS GLOBAUX DU FORMULAIRE (SAUVEGARDE & ERREURS)
  // =========================================================================
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // =========================================================================
  // 3. GESTION DES ERREURS & NETTOYAGE
  // =========================================================================
  /**
   * Efface l'erreur d'un champ spécifique lorsque l'utilisateur commence à le corriger.
   */
  const clearField = (fieldKey: string) => {
    setFieldErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[fieldKey];
      if (Object.keys(nextErrors).length === 0) {
        setFormError(null);
      }
      return nextErrors;
    });

    // Retire également la surbrillance IA si le champ est modifié par l'user
    ai.setFieldAIGenerated((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  // Enveloppe la fonction IA pour capturer les erreurs et les afficher dans le formulaire global
  const handleGenerateAI = () => {
    ai.handleGenerateAI(
      (errMessage) => setFormError(errMessage),
      () =>
        setFieldErrors((prev) => ({
          ...prev,
          title: "Saisissez un titre pour générer les infos avec l'IA.",
        })),
    );
  };

  // =========================================================================
  // 4. SOUMISSION & VALIDATION DU FORMULAIRE (SUBMIT)
  // =========================================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ai.setFieldAIGenerated({});

    // --- A. Sanitisation des textes (suppression des espaces superflus) ---
    const cleanTitle = info.title.trim();
    const cleanConsole = info.selectedConsole.trim();
    const cleanDeveloper = info.selectedDeveloper.trim();
    const cleanLanguage = info.selectedLanguage.trim();
    const cleanGenre = info.selectedGenre.trim();
    const cleanDescription = info.description.trim();
    const cleanFranchise = info.selectedFranchise.trim();
    const cleanYoutubeId = info.youtubeId.trim();
    const cleanPros = review.pros.map((p) => p.trim()).filter(Boolean);
    const cleanCons = review.cons.map((c) => c.trim()).filter(Boolean);

    const newErrors: Record<string, string> = {};

    // --- B. Validation des textes obligatoires ---
    if (!cleanTitle) newErrors.title = "Le titre est obligatoire";
    if (!cleanConsole) newErrors.selectedConsole = "La console est obligatoire";
    if (!cleanFranchise)
      newErrors.selectedFranchise = "La franchise est obligatoire";
    if (!cleanYoutubeId)
      newErrors.youtubeId = "L'ID vidéo YouTube est obligatoire";
    if (!cleanDeveloper)
      newErrors.selectedDeveloper = "Le développeur est obligatoire";
    if (!info.selectedSupport)
      newErrors.selectedSupport = "Le support est obligatoire";
    if (!info.selectedPegi) newErrors.selectedPegi = "Le PEGI est obligatoire";
    if (!cleanLanguage)
      newErrors.selectedLanguage = "La langue est obligatoire";
    if (!cleanGenre) newErrors.selectedGenre = "Le genre est obligatoire";
    if (!cleanDescription)
      newErrors.description = "La description est obligatoire";

    if (!info.releaseDate || isNaN(Date.parse(info.releaseDate))) {
      newErrors.releaseDate = "La date de sortie est invalide ou manquante";
    }

    if (!info.estimatedPlaytime || info.estimatedPlaytime < 1) {
      newErrors.estimatedPlaytime = "Durée estimée invalide (1 h min.)";
    }

    // Fonction utilitaire pour valider le format d'une URL web
    const isValidHttpUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    };

    // --- C. Validation de la présence des images ---
    const hasExistingLogo = Boolean(editGame?.images?.logo);
    const hasExistingCover = Boolean(editGame?.images?.cover);
    const hasExistingParallax = Boolean(editGame?.images?.parallax?.url);

    if (img.logoSourceType === "file") {
      if (!img.uploadLogo && !hasExistingLogo)
        newErrors.logo = "Le logo est obligatoire";
    } else {
      if (!img.urlLogo.trim() && !hasExistingLogo) {
        newErrors.logo = "L'URL du logo est obligatoire";
      } else if (img.urlLogo.trim() && !isValidHttpUrl(img.urlLogo.trim())) {
        newErrors.logo = "L'URL du logo est invalide";
      }
    }

    if (img.coverSourceType === "file") {
      if (!img.uploadCover && !hasExistingCover)
        newErrors.cover = "La cover est obligatoire";
    } else {
      if (!img.urlCover.trim() && !hasExistingCover) {
        newErrors.cover = "L'URL de la cover est obligatoire";
      } else if (img.urlCover.trim() && !isValidHttpUrl(img.urlCover.trim())) {
        newErrors.cover = "L'URL de la cover est invalide";
      }
    }

    if (img.parallaxSourceType === "file") {
      if (!img.uploadParallax && !hasExistingParallax)
        newErrors.parallax = "Le parallax est obligatoire";
    } else {
      if (!img.urlParallax.trim() && !hasExistingParallax) {
        newErrors.parallax = "L'URL du parallax est obligatoire";
      } else if (
        img.urlParallax.trim() &&
        !isValidHttpUrl(img.urlParallax.trim())
      ) {
        newErrors.parallax = "L'URL du parallax est invalide";
      }
    }

    // --- D. Validation optionnelle de l'onglet Avis ---
    if (review.completedDate && isNaN(Date.parse(review.completedDate))) {
      newErrors.completedDate = "La date de complétion est invalide";
    }
    if (
      review.score !== null &&
      (isNaN(review.score) || review.score < 0 || review.score > 10)
    ) {
      newErrors.score = "La note doit être comprise entre 0 et 10";
    }
    if (
      review.playtime !== null &&
      (isNaN(review.playtime) || review.playtime < 1)
    ) {
      newErrors.playtime = "Le temps de jeu doit être d'au moins 1 heure";
    }

    // Si des erreurs sont détectées, on bloque l'enregistrement
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setFormError("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setIsSaving(true);

    // --- E. Traitement et upload des images vers Supabase ---
    // JavaScript lance les trois traitements en même temps. Les trois fichiers partent simultanément vers le serveur.
    const [logoPublicUrl, coverPublicUrl, parallaxPublicUrl] =
      await Promise.all([
        img.processImage(
          img.logoSourceType,
          img.uploadLogo,
          img.urlLogo.trim(),
          editGame?.images?.logo,
          "logos",
        ),
        img.processImage(
          img.coverSourceType,
          img.uploadCover,
          img.urlCover.trim(),
          editGame?.images?.cover,
          "covers",
        ),
        img.processImage(
          img.parallaxSourceType,
          img.uploadParallax,
          img.urlParallax.trim(),
          editGame?.images?.parallax?.url,
          "parallaxes",
        ),
      ]);

    if (!logoPublicUrl || !coverPublicUrl || !parallaxPublicUrl) {
      setFormError("Une erreur est survenue lors du traitement des images.");
      setIsSaving(false);
      return;
    }

    // --- F. Assemblage du Payload final pour la BDD ---
    const hasReview =
      review.completedDate ||
      review.playtime ||
      review.score !== null ||
      cleanPros.length > 0 ||
      cleanCons.length > 0 ||
      review.summary.trim();

    const gamePayload = {
      title: cleanTitle,
      franchise: cleanFranchise,
      console: cleanConsole,
      format: info.selectedSupport,
      developer: cleanDeveloper,
      genre: cleanGenre,
      pegi: Number(info.selectedPegi),
      language: cleanLanguage,
      releaseDate: info.releaseDate,
      estimatedPlaytime: Number(info.estimatedPlaytime),
      description: cleanDescription,
      youtubeId: cleanYoutubeId,
      images: {
        logo: logoPublicUrl,
        cover: coverPublicUrl,
        parallax: {
          url: parallaxPublicUrl,
          truncated: img.parallaxTruncated,
        },
      },
      review: hasReview
        ? {
            playtime: review.playtime || undefined,
            completedDate: review.completedDate || undefined,
            score: review.score !== null ? review.score : undefined,
            pros: cleanPros.length > 0 ? cleanPros : undefined,
            cons: cleanCons.length > 0 ? cleanCons : undefined,
            summary: review.summary.trim() || undefined,
          }
        : null,
    };

    // --- G. Enregistrement en base de données Supabase ---
    let error = null;

    if (mode === "insert") {
      const res = await supabase.from("games").insert([gamePayload]);
      error = res.error;
    } else if (mode === "update" && editGame?.id) {
      const res = await supabase
        .from("games")
        .update(gamePayload)
        .eq("id", editGame.id);
      error = res.error;
    }

    if (error) {
      console.error("Erreur BDD :", error.message);
      setFormError(error.message);
      setIsSaving(false);
    } else {
      toast.success(
        mode === "insert"
          ? "Jeu ajouté avec succès !"
          : "Jeu mis à jour avec succès !",
      );
      await refetchGames();
      router.push("/administration");
      setIsSaving(false);
    }
  };

  // =========================================================================
  // 5. VALEURS DE RETOUR (RETURN)
  // =========================================================================
  return {
    // On déverse toutes les propriétés des sous-hooks pour ne pas casser le composant graphique
    // Décompose l'objet pour exposer ses variables directement à la racine (ex: "title" au lieu de "info.title") et éviter de casser l'UI.
    ...info,
    ...img,
    ...review,

    // États et handlers spécifiques à l'IA
    isGeneratingAI: ai.isGeneratingAI,
    fieldAIGenerated: ai.fieldAIGenerated,
    handleGenerateAI,

    // États et actions globaux du formulaire
    isSaving,
    formError,
    fieldErrors,
    clearField,
    handleSubmit,
  };
}

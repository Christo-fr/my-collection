import { useState } from "react";

export function useGameAI(info: any, img: any) {
  // =========================================================================
  // 1. ÉTATS (STATES)
  // =========================================================================
  const [fieldAIGenerated, setFieldAIGenerated] = useState<
    Record<string, boolean>
  >({});

  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // =========================================================================
  // 2. MÉCANIQUE DE GÉNÉRATION IA
  // =========================================================================
  /**
   * Fonction principale : envoie le titre à l'API Gemini et met à jour les champs vides de l'UI.
   */
  const handleGenerateAI = async (
    onError?: (message: string) => void,
    onTitleMissing?: () => void,
    onSuccess?: (generatedKeys: string[]) => void,
  ) => {
    const cleanTitle = info.title.trim();
    setFieldAIGenerated({}); // Réinitialise les surbrillances IA précédentes

    if (!cleanTitle) {
      onTitleMissing?.();
      return;
    }

    setIsGeneratingAI(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          console: info.selectedConsole.trim() || undefined,
          existingOptions: {
            genres: info.genreOptions.map((opt: any) => opt.value),
            developers: info.developerOptions.map((opt: any) => opt.value),
            franchises: info.franchiseOptions.map((opt: any) => opt.value),
            languages: info.languageOptions.map((opt: any) => opt.value),
            consoles: info.consoleOptions.map((opt: any) => opt.value),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération IA.");
      }

      // Objet temporaire pour accumuler les champs complétés par l'IA
      const newAiFields: Record<string, boolean> = {};

      // --- A. Métadonnées Texte ---
      if (data.developer && !info.selectedDeveloper) {
        info.setSelectedDeveloper(data.developer);
        newAiFields.selectedDeveloper = true;
      }
      if (data.console && !info.selectedConsole) {
        info.setSelectedConsole(data.console);
        newAiFields.selectedConsole = true;
      }
      if (data.genre && !info.selectedGenre) {
        info.setSelectedGenre(data.genre);
        newAiFields.selectedGenre = true;
      }
      if (data.language && !info.selectedLanguage) {
        info.setSelectedLanguage(data.language);
        newAiFields.selectedLanguage = true;
      }
      if (data.releaseDate && !info.releaseDate) {
        info.setReleaseDate(data.releaseDate);
        newAiFields.releaseDate = true;
      }
      if (data.description && !info.description) {
        info.setDescription(data.description);
        newAiFields.description = true;
      }
      if (data.franchise && !info.selectedFranchise) {
        info.setSelectedFranchise(data.franchise);
        newAiFields.selectedFranchise = true;
      }
      if (data.youtubeId && !info.youtubeId) {
        info.setYoutubeId(data.youtubeId);
        newAiFields.youtubeId = true;
      }
      if (data.pegi && (info.selectedPegi === 3 || !info.selectedPegi)) {
        info.setSelectedPegi(Number(data.pegi));
        newAiFields.selectedPegi = true;
      }
      if (
        data.estimatedPlaytime &&
        (info.estimatedPlaytime === 1 || !info.estimatedPlaytime)
      ) {
        info.setEstimatedPlaytime(Number(data.estimatedPlaytime));
        newAiFields.estimatedPlaytime = true;
      }

      // --- B. Visuels (Images) ---
      if (data.images?.logo && !img.urlLogo && !img.uploadLogo) {
        img.setUrlLogo(data.images.logo);
        img.setLogoSourceType("url");
        newAiFields.logo = true;
      }

      if (data.images?.cover && !img.urlCover && !img.uploadCover) {
        img.setUrlCover(data.images.cover);
        img.setCoverSourceType("url");
        newAiFields.cover = true;
      }

      if (
        data.images?.parallax?.url &&
        !img.urlParallax &&
        !img.uploadParallax
      ) {
        img.setUrlParallax(data.images.parallax.url);
        img.setParallaxSourceType("url");
        img.setParallaxTruncated(!!data.images.parallax.truncated);
        newAiFields.parallax = true;
      }

      // Met à jour la liste des champs marqués "Généré par l'IA"
      setFieldAIGenerated(newAiFields);

      // Transmet les clés générées au formulaire pour supprimer leurs erreurs rouges
      onSuccess?.(Object.keys(newAiFields));
    } catch (error: any) {
      console.error("Erreur génération IA :", error);
      onError?.(
        error.message || "Impossible de récupérer les métadonnées avec l'IA.",
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // =========================================================================
  // 3. RETOUR DU HOOK
  // =========================================================================
  return {
    fieldAIGenerated,
    setFieldAIGenerated,
    isGeneratingAI,
    handleGenerateAI,
  };
}

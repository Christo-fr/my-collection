import { useState } from "react";

export function useGameAI(info: any, img: any) {
  // =========================================================================
  // 1. ÉTATS (STATES)
  // =========================================================================
  // Dictionnaire de booléens pour suivre quels champs ont été générés par l'IA (ex: { selectedDeveloper: true })
  const [fieldAIGenerated, setFieldAIGenerated] = useState<
    Record<string, boolean>
  >({});

  // Indicateur de chargement pour afficher le spinner sur le bouton de la baguette magique
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
  ) => {
    const cleanTitle = info.title.trim();
    setFieldAIGenerated({}); // Réinitialise les surbrillances IA précédentes

    // Si le titre est vide, déclenche la fonction de secours pour afficher l'erreur
    if (!cleanTitle) {
      onTitleMissing?.(); // Syntaxe "Optional Chaining" : appelle la fonction uniquement si elle est définie
      return;
    }

    setIsGeneratingAI(true);

    try {
      // Appel de l'API Next.js locale (/api/ai) qui communique avec le modèle Gemini
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          console: info.selectedConsole.trim() || undefined,
          // .map() transforme chaque objet option en une simple chaîne de texte avec .value
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

      // Injecter UNIQUEMENT si le champ est vide côté utilisateur
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
        newAiFields.genre = true;
      }
      if (data.language && !info.selectedLanguage) {
        info.setSelectedLanguage(data.language);
        newAiFields.language = true;
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

      // Met à jour la liste des champs marqués "Généré par l'IA"
      setFieldAIGenerated(newAiFields);
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

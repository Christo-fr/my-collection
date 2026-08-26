import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { createClient } from "@/lib/supabase/client";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Console } from "@/types/console";

export function useConsoles() {
  // =========================================================================
  // 1. HOOKS & CONTEXTES
  // =========================================================================
  const router = useRouter();
  const supabase = createClient();
  const { consoles: dbConsoles, loading, refetchConsoles } = useGamesContext();

  // --- États locaux d'UI ---
  const [localConsoles, setLocalConsoles] = useState<Console[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Synchronisation initiale avec la BDD ---
  useEffect(() => {
    setLocalConsoles(dbConsoles);
  }, [dbConsoles]);

  // =========================================================================
  // 2. HANDLERS & TRAITEMENT METIER
  // =========================================================================

  // Retour vers /administration en conservant les derniers filtres utilisés
  const handleBack = () => {
    const lastCatalogUrl = sessionStorage.getItem("lastCatalogUrl");
    router.push(lastCatalogUrl ?? "/administration");
  };

  // A. Drag & Drop : Réordonnancement de la liste locale
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localConsoles.findIndex((item) => item.id === active.id);
      const newIndex = localConsoles.findIndex((item) => item.id === over.id);

      const reorderedList = arrayMove(localConsoles, oldIndex, newIndex);

      const listWithNewOrder = reorderedList.map((consoleItem, index) => ({
        ...consoleItem,
        display_order: index + 1,
      }));

      setLocalConsoles(listWithNewOrder);
    }
  };

  // B. Modification d'un champ individuel (Nom, Diminutif, Logo, Checkbox)
  const updateConsoleField = (
    id: number,
    field: string,
    value: string | boolean | File,
  ) => {
    setLocalConsoles((prevConsoles) =>
      prevConsoles.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // C. Soumission et sauvegarde globale
  const handleSave = async () => {
    setFormError(null);

    // 1. Validation locale : diminutifs obligatoires
    const hasInvalidConsole = localConsoles.some(
      (c) => !c.short_name || c.short_name.trim() === "",
    );

    if (hasInvalidConsole) {
      setShowErrors(true);
      setFormError("Un ou plusieurs champs diminutif sont absents.");
      return;
    }

    setIsSaving(true);
    const cleanConsolesToUpsert = [];

    // 2. Traitement des fichiers images (Storage)
    for (const consoleItem of localConsoles) {
      const item = consoleItem as Console & { file?: File; logo_file?: File };
      let finalLogoUrl = item.logo_url;

      const fileToUpload = item.file || item.logo_file;

      if (fileToUpload) {
        // 1. Récupération de la vraie ancienne URL depuis l'état d'origine de la BDD
        const originalConsole = dbConsoles.find((c) => c.id === item.id);
        const previousLogoUrl = originalConsole?.logo_url;

        // 2. Suppression de l'ancien fichier s'il existait sur Supabase
        if (previousLogoUrl && !previousLogoUrl.startsWith("blob:")) {
          try {
            const cleanUrl = previousLogoUrl.split("?")[0];
            const match = cleanUrl.match(
              /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/,
            );

            if (match) {
              const targetBucket = match[1];
              const rawFilePath = match[2];
              const filePath = decodeURIComponent(rawFilePath);

              const { error: removeError } = await supabase.storage
                .from(targetBucket)
                .remove([filePath]);

              if (removeError) {
                console.error(
                  `[Storage Error] Échec suppression sur ${targetBucket}/${filePath} :`,
                  removeError.message,
                );
              }
            }
          } catch (err) {
            console.warn("[Storage] Erreur suppression ancien logo :", err);
          }
        }

        // 3. Upload du nouveau fichier
        const fileExt = fileToUpload.name.split(".").pop();
        const filePath = `${item.short_name.toLowerCase()}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("consoles")
          .upload(filePath, fileToUpload, { upsert: true });

        if (uploadError) {
          console.error("Erreur Storage :", uploadError);
          setShowErrors(true);
          setFormError(uploadError.message);
          setIsSaving(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("consoles")
          .getPublicUrl(filePath);

        finalLogoUrl = urlData.publicUrl;
      }

      // Nettoyage des clés temporaires
      const { file, logo_file, ...cleanConsole } = item;

      cleanConsolesToUpsert.push({
        ...cleanConsole,
        logo_url: finalLogoUrl,
      });
    }

    // 3. Enregistrement en BDD (Upsert)
    const { error } = await supabase
      .from("consoles")
      .upsert(cleanConsolesToUpsert);

    if (error) {
      console.error("Erreur BDD :", error.message);
      setShowErrors(true);
      setFormError(error.message);
    } else {
      await refetchConsoles();
      setShowErrors(false);
      toast.success("Liste des consoles mise à jour avec succès !");
      handleBack();
    }

    setIsSaving(false);
  };

  // =========================================================================
  // 3. RETOUR DU HOOK
  // =========================================================================
  return {
    localConsoles,
    loading,
    isSaving,
    formError,
    showErrors,
    handleDragEnd,
    updateConsoleField,
    handleSave,
    handleBack,
  };
}

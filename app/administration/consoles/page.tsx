"use client";

// 1. React & Hooks
import { useState, useEffect } from "react";

// 2. Icônes & Drag and Drop (DndKit)
import { Undo2, Gamepad, LoaderCircle } from "lucide-react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

// 3. Composants UI & Layout
import LayoutFull from "@/components/layout/LayoutFull";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import FormError from "@/components/ui/FormError";
import SortableConsoleItem from "@/components/admin/SortableConsoleItem";
import { toast } from "sonner";

// 4. Types & Utilitaires
import { Console } from "@/types/console";
import { useGamesContext } from "@/components/providers/GamesProvider";
import {
  updateConsoleInList,
  saveConsoles,
} from "@/features/admin/updateConsoles";

// =========================================================================
// 2. COMPOSANT PRINCIPAL
// =========================================================================
export default function Consoles() {
  // --- A. Données du Context & États locaux ---
  const { consoles: dbConsoles, loading, refetchConsoles } = useGamesContext();
  const [localConsoles, setLocalConsoles] = useState<Console[]>([]);

  // --- B. États d'UI (Chargement & Erreurs) ---
  const [formError, setFormError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- C. Synchronisation initiale avec la BDD ---
  useEffect(() => {
    setLocalConsoles(dbConsoles);
  }, [dbConsoles]);

  // =========================================================================
  // 3. HANDLERS (GESTIONNAIRES D'ÉVÉNEMENTS)
  // =========================================================================

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
      updateConsoleInList(prevConsoles, id, field, value),
    );
  };

  // C. Soumission et sauvegarde globale
  const handleSave = async () => {
    setFormError(null);

    // 1. Validation : vérifier que tous les diminutifs sont renseignés
    const hasInvalidConsole = localConsoles.some(
      (c) => !c.short_name || c.short_name.trim() === "",
    );

    if (hasInvalidConsole) {
      setShowErrors(true);
      setFormError("Un ou plusieurs champs diminutif sont absents.");
      return;
    }

    // 2. Traitement de la sauvegarde
    setIsSaving(true);
    const result = await saveConsoles(localConsoles);

    if (result.error) {
      setShowErrors(true);
      setFormError(result.error); // Corrigé : result.error est directement la chaîne de caractères
    } else {
      setShowErrors(false);
      toast.success("Liste des consoles mise à jour avec succès !");
      await refetchConsoles();
    }

    setIsSaving(false);
  };

  // =========================================================================
  // 4. RENDU UI (JSX)
  // =========================================================================
  return (
    <LayoutFull title="Gestion des consoles">
      {loading ? (
        <p className="p-8 text-gray-400">Chargement des consoles...</p>
      ) : localConsoles.length === 0 ? (
        <p className="text-main/60 text-sm">Aucune console trouvée</p>
      ) : (
        <section className="w-full flex flex-col h-auto lg:h-full min-h-0 overflow-x-hidden">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-main/10 px-2 md:h-12 lg:flex-shrink-0">
            <div className="flex items-baseline gap-2">
              <Heading
                as="h2"
                size="md"
                className="font-semibold tracking-wide uppercase"
              >
                Consoles
              </Heading>
            </div>
          </div>

          {/* Zone de Drag & Drop (Liste des consoles) */}
          <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto h-auto lg:h-full overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={localConsoles.map((c) => c.id)}>
                {localConsoles.map((c) => (
                  <SortableConsoleItem
                    key={c.id}
                    id={c.id}
                    shortName={c.short_name}
                    fullName={c.full_name}
                    logoUrl={c.logo_url}
                    isBw={c.is_bw}
                    showErrors={showErrors}
                    onUpdate={updateConsoleField}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Pied de page (Message d'erreur & Boutons) */}
          <div className="flex flex-col px-2 lg:flex-shrink-0 pb-4">
            {formError && (
              <div className="pt-2">
                <FormError message={formError} />
              </div>
            )}

            <div className="w-full flex flex-row flex-wrap items-center justify-between gap-2 pt-4">
              <Button
                href="/administration"
                variant="secondary"
                icon={<Undo2 className="w-5 h-5" />}
              >
                Retour
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={isSaving}
                icon={
                  isSaving ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    <Gamepad className="w-5 h-5" />
                  )
                }
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </section>
      )}
    </LayoutFull>
  );
}

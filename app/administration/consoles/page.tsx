"use client";

// 1. React & Hooks
import { useState, useEffect } from "react";

// 2. Icônes & Drag and Drop (DndKit)
import { Undo2, Gamepad } from "lucide-react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

// 3. Composants UI & Layout
import LayoutFull from "@/components/layout/LayoutFull";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import FormError from "@/components/ui/FormError";
import SortableConsoleItem from "@/components/admin/SortableConsoleItem";

// 4. Types & Utilitaires
import { Console } from "@/types/console";
import { useGamesContext } from "@/components/providers/GamesProvider";
import { updateConsoleInList } from "@/features/admin/updateConsoles";

export default function Consoles() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================

  // Données brutes venues du Provider (la "source de vérité")
  const { consoles: dbConsoles, loading } = useGamesContext();

  // État local ("brouillon") pour les modifications et le réordonnancement
  const [localConsoles, setLocalConsoles] = useState<Console[]>([]);

  // États pour la gestion des erreurs de validation
  const [formError, setFormError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // =========================================================================
  // 2. EFFETS (SYNCHRONISATION)
  // =========================================================================

  // Injection initiale : dés que dbConsoles est chargé depuis Supabase,
  // on remplit notre état brouillon
  useEffect(() => {
    setLocalConsoles(dbConsoles);
  }, [dbConsoles]);

  // =========================================================================
  // 3. GESTIONNAIRES D'ÉVÉNEMENTS (HANDLERS)
  // =========================================================================

  // A. Drag & Drop : réordonne la liste locale au relâchement d'un élément
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localConsoles.findIndex((item) => item.id === active.id);
      const newIndex = localConsoles.findIndex((item) => item.id === over.id);

      // 1. On déplace physiquement les éléments dans le tableau
      const reorderedList = arrayMove(localConsoles, oldIndex, newIndex);

      // 2. On met à jour le display_order de chaque console (Ton code !)
      const listWithNewOrder = reorderedList.map((console, index) => ({
        ...console,
        display_order: index + 1,
      }));

      // 3. On sauvegarde ce nouveau tableau parfait dans notre brouillon
      setLocalConsoles(listWithNewOrder);
    }
  };

  // B. Modification d'un champ (Nom, Diminutif, Checkbox, Image File)
  const updateConsoleField = (
    id: number,
    field: string,
    value: string | boolean | File,
  ) => {
    const updateLocalConsole = localConsoles.map((consoleItem) => {
      // 1. Est-ce que c'est la console qu'on est en train de modifier ?

      if (consoleItem.id === id) {
        return { ...consoleItem, [field]: value };
      } else {
        return consoleItem;
      }
    });

    setLocalConsoles(updateLocalConsole);
  };

  // C. Soumission et Validation du formulaire
  const handleSave = () => {
    setFormError(null);

    // Règle de validation : aucun diminutif ne doit être vide
    const hasInvalidConsole = localConsoles.some(
      (c) => !c.short_name || c.short_name.trim() === "",
    );

    if (hasInvalidConsole) {
      setShowErrors(true); // Active la bordure rouge sur les Inputs concernés
      setFormError("Un ou plusieurs champs diminutif sont absents.");
      return;
    }

    // TODO: Déclencher la sauvegarde Supabase via notre hook
  };

  // =========================================================================
  // 4. RENDU DU COMPOSANT (JSX)
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

          {/* Zone de Drag & Drop (Liste interactive) */}
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

          {/* Pied de page et Boutons d'action */}
          <div className="flex flex-col px-2 lg:flex-shrink-0 pb-4">
            {/* Affichage conditionnel de l'erreur globale */}
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
                icon={<Gamepad className="w-5 h-5" />}
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

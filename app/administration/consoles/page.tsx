"use client";
import { useState, useEffect } from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { Undo2, Gamepad } from "lucide-react";
import FormError from "@/components/ui/FormError";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SortableConsoleItem from "@/components/admin/SortableConsoleItem";

import { Console } from "@/types/console";
import { useGamesContext } from "@/components/providers/GamesProvider";
import {
  updateConsoleInList,
  saveConsoles,
} from "@/features/admin/updateConsoles";

export default function Consoles() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  // 2. On renomme la liste venant du Provider en "dbConsoles" (la source de vérité)
  const { consoles: dbConsoles, loading } = useGamesContext();

  // 3. On crée notre état "Brouillon" qu'on appelle "localConsoles"
  const [localConsoles, setLocalConsoles] = useState<Console[]>([]);

  // 4. Synchronisation : quand dbConsoles est chargé/modifié, on met à jour le brouillon
  useEffect(() => {
    setLocalConsoles(dbConsoles);
  }, [dbConsoles]);

  // Gestionnaire de fin de survol / déplacement
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalConsoles((prevConsoles) => {
        const oldIndex = prevConsoles.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = prevConsoles.findIndex((item) => item.id === over.id);

        return arrayMove(prevConsoles, oldIndex, newIndex);
      });
    }
  }

  const updateConsoleField = (
    id: number,
    field: string,
    value: string | boolean | File,
  ) => {
    setLocalConsoles(updateConsoleInList(localConsoles, id, field, value));
  };

  // =========================================================================
  // 2. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <LayoutFull title="Gestion des consoles">
      {loading ? (
        <p className="p-8 text-gray-400">Chargement des consoles...</p>
      ) : localConsoles.length === 0 ? (
        <p className="text-main/60 text-sm">Aucune console trouvée</p>
      ) : (
        <>
          <section className="w-full flex flex-col h-auto lg:h-full min-h-0 overflow-x-hidden">
            {/* En-tête*/}
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

            {/* Grille de jeux */}

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
                      onUpdate={updateConsoleField}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <div className="flex flex-col px-2 lg:flex-shrink-0">
              {/* Message d'erreur global */}

              <div className="pt-4">
                <FormError message={""} />
              </div>

              <div className="w-full flex flex-row flex-wrap items-center justify-between items-baseline gap-2 pt-4">
                <Button
                  href="/administration"
                  variant="secondary"
                  onClick={() => {}}
                  icon={<Undo2 className="w-5 h-5" />}
                >
                  Retour
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {}}
                  icon={<Gamepad className="w-5 h-5" />}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </LayoutFull>
  );
}

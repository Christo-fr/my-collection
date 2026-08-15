"use client";
import { useState } from "react";
import { useGames } from "@/features/game/useGames";

import LayoutFull from "@/components/layout/LayoutFull";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { Undo2, Gamepad } from "lucide-react";
import FormError from "@/components/ui/FormError";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SortableConsoleItem from "@/components/game/SortableConsoleItem";

export default function Console() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const { games, loading } = useGames();

  // Clé composite pour rejouer l'animation de fondu à chaque changement de filtre

  // State local pour la liste réordonnable
  const [consoles, setConsoles] = useState([
    { id: 1, name: "PlayStation 5" },
    { id: 2, name: "Nintendo Switch" },
    { id: 3, name: "PC" },
    { id: 4, name: "Xbox Series X" },
  ]);

  // Gestionnaire de fin de survol / déplacement
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setConsoles((prevConsoles) => {
        const oldIndex = prevConsoles.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = prevConsoles.findIndex((item) => item.id === over.id);

        return arrayMove(prevConsoles, oldIndex, newIndex);
      });
    }
  }
  // =========================================================================
  // 2. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <LayoutFull title="Gestion des consoles">
      {loading ? (
        <p className="p-8 text-gray-400">Chargement des jeux...</p>
      ) : games.length === 0 ? (
        <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
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
                <SortableContext items={consoles.map((c) => c.id)}>
                  {consoles.map((c) => (
                    <SortableConsoleItem key={c.id} id={c.id} name={c.name} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <div className="flex flex-col px-2 md:h-12 lg:flex-shrink-0">
              {/* Message d'erreur global */}
              <FormError message={""} />

              <div className="w-full flex flex-row flex-wrap items-center justify-between items-baseline gap-2">
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

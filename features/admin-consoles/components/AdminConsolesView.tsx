"use client";

// 1. Icônes & Drag and Drop (DndKit)
import { Gamepad, LoaderCircle } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

// 2. Composants UI & Layout
import Button from "@/components/ui/Button";
import { ButtonBack } from "@/components/layout/ButtonBack";
import Heading from "@/components/ui/Heading";
import FormError from "@/components/ui/FormError";
import AdminConsolesItem from "@/features/admin-consoles/components/AdminConsolesItem";

// 3. Custom Hook
import { useAdminConsoles } from "@/features/admin-consoles/hooks/useAdminConsoles";

// =========================================================================
// COMPOSANT PRINCIPAL
// =========================================================================
export default function AdminConsolesView() {
  const {
    localConsoles,
    loading,
    isSaving,
    formError,
    showErrors,
    handleDragEnd,
    updateConsoleField,
    handleSave,
  } = useAdminConsoles();

  // =========================================================================
  // RENDU UI (JSX)
  // =========================================================================
  return (
    <>
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
                  <AdminConsolesItem
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
              <ButtonBack link="administration" />
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
    </>
  );
}

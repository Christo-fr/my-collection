"use client";

import { Game } from "@/types/game";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";
import Tabs from "@/components/ui/Tabs";
import TabInformations from "@/components/admin/gameForm/TabGameInformations";
import TabReview from "@/components/admin/gameForm/TabGameReview";
import { useGameForm } from "@/hooks/admin/gameForm/useGameForm";
import { Undo2, FilePlus, Save, LoaderCircle } from "lucide-react";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

// =========================================================================
// 1. COMPOSANT PRINCIPAL : FORMULAIRE ADMIN JEU
// =========================================================================
export default function GameForm({ mode, editGame }: GameFormProps) {
  // Extraction des sous-groupes d'états depuis le master hook
  const {
    info,
    img,
    ai,
    review,
    fieldErrors,
    formError,
    isSaving,
    clearField,
    handleSubmit,
    handleGenerateAI,
    handleBack,
  } = useGameForm({ mode, editGame });

  // =========================================================================
  // 2. CONFIGURATION DES ONGLETS
  // =========================================================================
  const formTabs = [
    {
      label: "Informations",
      content: (
        <TabInformations
          info={info}
          img={img}
          ai={ai}
          fieldErrors={fieldErrors}
          clearField={clearField}
          handleGenerateAI={handleGenerateAI}
        />
      ),
    },
    {
      label: "Avis",
      content: (
        <TabReview
          review={review}
          fieldErrors={fieldErrors}
          clearField={clearField}
        />
      ),
    },
  ];

  // =========================================================================
  // 3. RENDU UI (FORMULAIRE & PIED DE PAGE)
  // =========================================================================
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 min-h-0 flex flex-col gap-4"
    >
      {/* 1. Onglets principaux */}
      <Tabs items={formTabs} className="p-2" />

      {/* 2. Pied de page (Erreurs globales & Actions) */}
      <div className="flex flex-col px-2 lg:flex-shrink-0 pb-4">
        {formError && (
          <div className="pt-2">
            <FormError message={formError} />
          </div>
        )}

        <div className="w-full flex flex-row flex-wrap items-center justify-between gap-2 pt-4">
          <Button
            onClick={handleBack}
            variant="secondary"
            icon={<Undo2 className="w-5 h-5" />}
          >
            Retour
          </Button>

          <Button
            type="submit"
            variant="secondary"
            disabled={ai.isGeneratingAI || isSaving}
            icon={
              isSaving ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : mode === "insert" ? (
                <FilePlus className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )
            }
          >
            {isSaving
              ? "Enregistrement..."
              : mode === "insert"
                ? "Ajouter un jeu"
                : "Éditer"}
          </Button>
        </div>
      </div>
    </form>
  );
}

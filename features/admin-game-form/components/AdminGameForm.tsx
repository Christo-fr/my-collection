"use client";

import { Game } from "@/types/game";
import Button from "@/components/ui/Button";
import { ButtonBack } from "@/components/layout/ButtonBack";
import FormError from "@/components/ui/FormError";
import Tabs from "@/components/ui/Tabs";
import AdminGameFormTabInformations from "@/features/admin-game-form/components/AdminGameFormTabInformations";
import AdminGameFormTabReview from "@/features/admin-game-form/components/AdminGameFormTabReview";
import { useGameForm } from "@/features/admin-game-form/hooks/useGameForm";
import { FilePlus, Save, LoaderCircle } from "lucide-react";

interface AdminGameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

// =========================================================================
// 1. COMPOSANT PRINCIPAL : FORMULAIRE ADMIN JEU
// =========================================================================
export default function AdminGameForm({ mode, editGame }: AdminGameFormProps) {
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
  } = useGameForm({ mode, editGame });

  // =========================================================================
  // 2. CONFIGURATION DES ONGLETS
  // =========================================================================
  const formTabs = [
    {
      label: "Informations",
      content: (
        <AdminGameFormTabInformations
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
        <AdminGameFormTabReview
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
          <ButtonBack link="administration" />

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

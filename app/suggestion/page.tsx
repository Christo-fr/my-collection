"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

// Contextes & Hooks
import { useGames } from "@/features/game/useGames";
import { useGamesContext } from "@/components/providers/GamesProvider";

// Layout & UI Globales
import LayoutSplit from "@/components/layout/LayoutSplit";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import RangeInput from "@/components/ui/RangeInput";

// Composants Métier
import FilterPanel from "@/components/game/FilterPanel";
import SuggestionDialog from "@/components/game/SuggestionDialog";

// Utils & Types
import {
  getGachaSuggestion,
  OPTIONS_STATUS,
  SuggestionResult,
} from "@/features/game/gameUtils";

export default function Suggestion() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  // 1. Branchement sur le hook global pour orchestrer l'état des filtres
  const { bounds, consoleOptions, genreOptions, filters, setters, loading } =
    useGames();

  // 2. Extraction du catalogue brut complet stocké en RAM
  const { games: gamesList } = useGamesContext();

  // 3. État local conservant le jeu tiré (ou null si aucun tirage en cours)
  // Typage TypeScript : l'état vaut null par défaut, mais recevra un objet SuggestionResult après le tirage
  const [result, setResult] = useState<SuggestionResult | null>(null);

  // =========================================================================
  // 2. TRAITEMENT DU TIRAGE
  // =========================================================================

  // 4. Lancement de l'algorithme de sélection au clic sur le bouton
  const handlePoll = () => {
    setResult(getGachaSuggestion(filters, gamesList));
  };

  // =========================================================================
  // 3. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <>
      <LayoutSplit
        image={{ url: "/parallax/suggestion.webp", truncated: true }}
      >
        <Heading as="h1" size="xl">
          Suggestion
        </Heading>
        {/* Panneau principal de configuration des critères */}
        <section className="w-full xl:w-1/2 lg:h-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          {loading ? (
            <p className="p-8 text-gray-400">Chargement des jeux...</p>
          ) : gamesList.length === 0 ? (
            <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
          ) : (
            <FilterPanel>
              <p className="text-main/80 text-sm">
                Pas d'idée pour votre prochaine session ? Ajustez vos critères
                selon vos envies et on vous déniche la pépite idéale dans votre
                collection !
              </p>

              {/* Sélecteur de console */}
              <Select
                label="Console"
                options={consoleOptions}
                selectedValue={filters.selectedConsole}
                onChange={setters.setSelectedConsole}
              />

              {/* Sélecteur de genre */}
              <Select
                label="Genre"
                options={genreOptions}
                selectedValue={filters.selectedGenre}
                onChange={setters.setSelectedGenre}
              />

              {/* Sélecteur d'état (Terminé / Non terminé) */}
              <Select
                label="Statut"
                options={OPTIONS_STATUS}
                selectedValue={filters.selectedStatus}
                onChange={setters.setSelectedStatus}
              />

              {/* Curseur de durée maximale */}
              <RangeInput
                label="Durée de vie maximale"
                value={filters.maxDuration}
                onChange={setters.setMaxDuration}
                min={bounds.min}
                max={bounds.max}
                step={1}
                unit="h"
              />

              {/* Bouton de déclenchement du tirage */}
              {gamesList.length > 0 && (
                <Button
                  onClick={handlePoll}
                  icon={<Sparkles className="w-5 h-5" />}
                  variant="secondary"
                  className="mt-8 w-full"
                >
                  Surprenez-moi !
                </Button>
              )}
            </FilterPanel>
          )}
        </section>
      </LayoutSplit>

      {/* Rendu de la modale de résultat si un tirage a été effectué */}
      {result && (
        <SuggestionDialog
          isOpen={!!result}
          onClose={() => setResult(null)}
          result={result}
          onRePoll={handlePoll}
        />
      )}
    </>
  );
}

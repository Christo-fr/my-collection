"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";

// Providers & Layouts
import LayoutSplit from "@/components/layout/LayoutSplit";

// UI Components Global
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

import FilterPanel from "@/components/game/FilterPanel";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import { useGames } from "@/features/game/useGames";
import { useGamesContext } from "@/components/providers/GamesProvider";
import SuggestionDialog from "@/components/game/SuggestionDialog";

import {
  getGachaSuggestion,
  OPTIONS_STATUS,
  SuggestionResult,
} from "@/features/game/gameUtils";

export default function Suggestion() {
  const { bounds, consoleOptions, styleOptions, filters, setters, games } =
    useGames();
  const [result, setResult] = useState<SuggestionResult | null>(null);

  const { games: rawGames } = useGamesContext();

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

        {/* Panneau principal d'informations */}
        <section className="w-full lg:w-1/2 h-full flex flex-col gap-2 mb-4 min-h-0 p-3 rounded-xl border border-main/10 bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          <FilterPanel>
            <Select
              label="Console"
              options={consoleOptions}
              selectedValue={filters.selectedConsole}
              onChange={setters.setSelectedConsole}
            />
            <Select
              label="Style"
              options={styleOptions}
              selectedValue={filters.selectedStyle}
              onChange={setters.setSelectedStyle}
            />
            <Select
              label="Statut"
              options={OPTIONS_STATUS}
              selectedValue={filters.selectedStatus}
              onChange={setters.setSelectedStatus}
            />
            <RangeInput
              label="Durée de vie maximale"
              value={filters.maxDuration}
              onChange={setters.setMaxDuration}
              min={bounds.min}
              max={bounds.max}
              step={1}
              unit="h"
            />
            <Button
              onClick={() => {
                console.log("Mes jeux :", rawGames);
                const suggestion = getGachaSuggestion(filters, rawGames);
                console.log("Résultat Gacha :", suggestion);
                setResult(suggestion);
              }}
              icon={<Sparkles className="w-5 h-5" />}
              variant="secondary"
              className="mt-8 w-full"
            >
              Suggère moi un jeu !
            </Button>
          </FilterPanel>
        </section>
      </LayoutSplit>

      {/* ========================================================================= */}
      {/* MODALES ET DIALOGS                                                       */}
      {/* ========================================================================= */}
      {/* Dialogue de la suggestion */}
      {result && (
        <SuggestionDialog
          isOpen={!!result}
          onClose={() => setResult(null)}
          result={result}
          onRePoll={() => setResult(getGachaSuggestion(filters, rawGames))}
        />
      )}
    </>
  );
}

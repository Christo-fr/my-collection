"use client";

import { useGames } from "@/hooks/game/useGames";
import ListHeader from "@/components/game/GameListHeader";
import GameCard from "@/components/game/GameCard";
import AdminGameCard from "@/components/admin/AdminGameCard";
import { OPTIONS_SORT, OPTIONS_STATUS } from "@/utils/game/gameUtils";

import FilterPanel from "@/components/game/GameFilterPanel";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import Heading from "@/components/ui/Heading";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Props configurant les données du jeu, la variante d'affichage et la priorité de chargement */
interface GameCatalogViewProps {
  cardStyle: "list" | "admin";
  actions?: React.ReactNode;
}

// =========================================================================
// 2. COMPOSANT & LOGIQUE DE RENDU
// =========================================================================
/** Composant UI affichant une carte dynamique de jeu avec fondu d'images et données de complétion */
export default function GameCatalogView({
  cardStyle = "list",
  actions,
}: GameCatalogViewProps) {
  // Récupère les données préparées et les fonctions d'action
  const {
    games,
    loading,
    bounds,
    consoleOptions,
    genreOptions,
    filters,
    setters,
  } = useGames();

  // Construit une clé composite unique basée sur les valeurs courantes de l'ensemble des filtres
  const gridKey = `${filters.selectedConsole}-${filters.selectedGenre}-${filters.selectedStatus}-${filters.sortBy}-${filters.searchQuery}-${filters.maxDuration}`;

  // Détermine la disposition par défaut selon le variant
  const defaultClassName =
    cardStyle === "admin"
      ? "flex flex-col gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]";

  // =========================================================================
  // 2. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <>
      {/* PANNEAU GAUCHE : BARRE DE FILTRES */}
      <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
        <FilterPanel>
          {/* Champ de recherche textuelle synchrone */}
          <Input
            placeholder="Rechercher un jeu..."
            value={filters.searchQuery}
            onChange={(e) => setters.setSearchQuery(e.target.value)}
          />
          {/* Liste déroulante des consoles issues de la BDD */}
          <Select
            label="Console"
            options={consoleOptions}
            selectedValue={filters.selectedConsole}
            onChange={setters.setSelectedConsole}
          />
          {/* Liste déroulante des genres uniques d'anciens jeux */}
          <Select
            label="Genre"
            options={genreOptions}
            selectedValue={filters.selectedGenre}
            onChange={setters.setSelectedGenre}
          />
          {/* Filtre sur le statut de complétion (Terminé / Non terminé) */}
          <Select
            label="Statut"
            options={OPTIONS_STATUS}
            selectedValue={filters.selectedStatus}
            onChange={setters.setSelectedStatus}
          />
          {/* Curseur de filtrage de durée de vie maximale en heures */}
          <RangeInput
            label="Durée de vie maximale"
            value={filters.maxDuration}
            onChange={setters.setMaxDuration}
            min={bounds.min}
            max={bounds.max}
            step={1}
            unit="h"
          />
          {/* BOUTONS D'ACTIONS */}
          {actions && (
            <>
              <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 ">
                <Heading
                  as="h2"
                  size="md"
                  className="font-semibold tracking-wide uppercase"
                >
                  Actions
                </Heading>
              </div>
              <div className="pr-2 pt-2 gap-4 text-main flex flex-col">
                {actions}
              </div>
            </>
          )}
        </FilterPanel>
      </section>

      {/* PANNEAU DROIT : EN-TÊTE DE TRI ET GRILLE DE CARTES */}
      <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
        {/* En-tête affichant le nombre de résultats et le sélecteur de tri */}
        <ListHeader
          title="Liste de jeux"
          totalResults={games.length}
          sortBy={filters.sortBy}
          onSortChange={setters.setSortBy}
          optionsSort={OPTIONS_SORT}
        />

        {/* Zone défilante contenant la grille de jeux */}
        <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          {/* État A : Chargement initial des données */}
          {loading ? (
            <p className="p-8 text-gray-400">Chargement des jeux...</p>
          ) : /* État B : Aucun jeu ne correspond aux filtres appliqués */
          games.length === 0 ? (
            <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
          ) : (
            /* État C : Affichage de la grille animée re-jouée grâce à key={gridKey} */
            <div key={gridKey} className={defaultClassName}>
              {games.map((game, index) =>
                cardStyle === "admin" ? (
                  <AdminGameCard
                    key={game.id}
                    game={game}
                    priority={index < 5}
                  />
                ) : (
                  <GameCard key={game.id} game={game} priority={index < 5} />
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

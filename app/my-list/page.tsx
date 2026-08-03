"use client";

import { useState, useEffect, useMemo } from "react";
import Heading from "@/components/ui/Heading";
import Input from "@/components/ui/Input";
import RangeInput from "@/components/ui/RangeInput";
import Select from "@/components/ui/Select";
import GameCard from "@/components/game/GameCard";
import { Game } from "@/types/game";

export default function MaListe() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConsole, setSelectedConsole] = useState<string>("Toutes");
  const [selectedStyle, setSelectedStyle] = useState<string>("Tous");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [maxDuration, setMaxDuration] = useState<number>(200);
  const [games, setGames] = useState<Game[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const reponse = await fetch("/api/games"); // Appel l'adresse web
        const data: Game[] = await reponse.json(); // Receptionne la réponse et la transforme en tableau d'objets
        setGames(data); // Elle dépose les valeurs grâce à  setGames
        if (data.length > 0) {
          // Sécurité si les données ne sont pas encore chargés, si c'est le cas, trouve le nombre de durée de vie max
          const maxTime = Math.max(
            ...data.map((game) => game.estimatedPlaytime),
          );
          setMaxDuration(maxTime);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des jeux :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames(); // 👈 Indispensable pour lancer l'appel au chargement de la page !
  }, []);

  // 1. Options pour les Consoles
  const optionsConsole = [
    // Option par défaut pour désactiver le filtre
    { label: "Toutes", value: "Toutes" },
    // 1. Premier .map() + Set : extraction et suppression des doublons
    // 2. Second .map() : mise au format { label, value } pour le composant <Select />
    ...Array.from(new Set(games.map((jeu) => jeu.console))).map(
      (nomConsole) => ({
        label: nomConsole,
        value: nomConsole,
      }),
    ),
  ];

  const optionsStyle = [
    { label: "Tous", value: "Tous" },
    ...Array.from(new Set(games.map((jeu) => jeu.genre))).map((nomGenre) => ({
      label: nomGenre,
      value: nomGenre,
    })),
  ];

  const optionsStatut = [
    { label: "Tous", value: "all" },
    { label: "Terminé", value: "completed" },
    { label: "Non terminé", value: "not_completed" },
  ];

  const maxEstimatedPlaytime =
    // Sécurité si les données ne sont pas encore chargés
    games.length > 0
      ? Math.max(...games.map((game) => game.estimatedPlaytime))
      : 200;

  const filteredGames = useMemo(
    () =>
      games
        .filter(
          (game) =>
            // 1. Filtre sur la durée
            game.estimatedPlaytime <= maxDuration &&
            // 2. Filtre sur la console
            (selectedConsole === "Toutes" ||
              game.console === selectedConsole) &&
            // 3. Filtre sur le style/genre
            (selectedStyle === "Tous" || game.genre === selectedStyle) &&
            // 4. Filtre sur le statut (terminé / non terminé)
            (selectedStatus === "all" ||
              (selectedStatus === "completed" && game.review?.score != null) ||
              (selectedStatus === "not_completed" &&
                game.review?.score == null)) &&
            // 5. Filtre sur la recherche textuelle
            game.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => a.title.localeCompare(b.title)), // Tri alphabétique par titre
    [
      games,
      searchQuery,
      selectedConsole,
      selectedStyle,
      selectedStatus,
      maxDuration,
    ],
  );

  return (
    <div className="relative w-full h-full flex flex-col px-12 py-8 gap-6">
      {/* Titre principal */}
      <Heading as="h1" size="xl">
        Ma liste
      </Heading>

      {/* Conteneur principal flex */}
      <div className="w-full flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* PANNEAU GAUCHE (Filtres - 25% desktop, 100% mobile) */}
        <section className="w-full lg:w-1/4 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] pr-2 space-y-6 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          {/* En-tête Filtres + Compteur */}
          <div className="flex items-center justify-between border-b border-main/10 pb-2">
            <h2 className="text-lg font-semibold tracking-wide uppercase">
              Filtres
            </h2>
            <span className="text-sm text-main/60">
              ({filteredGames.length} résultats)
            </span>
          </div>

          {/* Formulaire des filtres */}
          <div className="space-y-4">
            <Input
              placeholder="Rechercher un jeu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              label="Console"
              options={optionsConsole}
              selectedValue={selectedConsole}
              onChange={(val) => setSelectedConsole(val)}
            />

            <Select
              label="Style"
              options={optionsStyle}
              selectedValue={selectedStyle}
              onChange={(val) => setSelectedStyle(val)}
            />

            <Select
              label="Statut"
              options={optionsStatut}
              selectedValue={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
            />

            <RangeInput
              label="Durée de vie maximale"
              value={maxDuration}
              onChange={(val) => setMaxDuration(val)}
              min={5}
              max={maxEstimatedPlaytime}
              step={5}
              unit="h"
            />
          </div>
        </section>

        {/* PANNEAU DROIT (Grille de jeux - 75% desktop, 100% mobile) */}
        <div className="w-full lg:w-3/4 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] p-4 space-y-6 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
          {loading ? (
            <p className="p-8 text-gray-400">Chargement des jeux...</p>
          ) : filteredGames.length === 0 ? (
            <p className="text-main/60 text-sm">Aucun jeu trouvé</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

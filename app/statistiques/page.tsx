"use client";

import LayoutFull from "@/components/layout/LayoutFull";
import Tabs from "@/components/ui/Tabs";
import { useStats } from "@/features/stats/useStats";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import GameCard from "@/components/game/GameCard";

export default function StatsPage() {
  const {
    loading,
    consoleTabs,
    selectedConsole,
    setSelectedConsole,
    totalGames,
    totalCompletedGames,
    totalPlaytime,
    totalPhysical,
    totalAverageScore,
    topGenres,
    hallOfFame,
    hallOfShame,
  } = useStats();

  const [animation] = useAutoAnimate({
    duration: 200, // Légèrement plus rapide que le défaut (250ms)
    easing: "cubic-bezier(0.4, 0, 0.2, 1)", // Courbe "smooth" moderne
  });

  // 1. Récupération de l'index numérique correspondant à 'selectedConsole'
  const selectedIndex = consoleTabs.findIndex(
    (tab) => tab.value === selectedConsole,
  );

  // 2. Traduction de l'index cliqué vers le nom de la console
  const handleTabChange = (index: number) => {
    const targetTab = consoleTabs[index];
    if (targetTab) {
      setSelectedConsole(targetTab.value);
    }
  };

  // 3. Génération des onglets
  const tabItems = consoleTabs.map((tab) => ({
    label: tab.value,
    content: (
      <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        {/* PANNEAU GAUCHE : KPI */}
        <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
          <div className="pr-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            {/* CHIFFRES CLÉS */}
            <div className="space-y-1">
              <p className="text-sm text-gray-200">
                Temps de jeu passé :{" "}
                <span className="font-bold text-white">
                  {totalPlaytime} heures
                </span>
              </p>
              <p className="text-sm text-gray-200">
                Nombre de jeux :{" "}
                <span className="font-bold text-white">{totalGames}</span>
              </p>
            </div>

            {/* JAUGES PRINCIPALES */}
            <div className="space-y-4">
              <ProgressBar
                value={totalCompletedGames}
                label={`Statut de la collection : ${
                  totalGames > 0
                    ? Math.round((totalCompletedGames / totalGames) * 100)
                    : 0
                }% terminés`}
                max={totalGames}
                labelLeft="terminés"
                labelRight="en cours"
              />
              <ProgressBar
                value={totalPhysical}
                label="Répartition des supports :"
                max={totalGames}
                labelLeft="Physique"
                labelRight="Digital"
                showPercentage={true}
              />
              <ProgressBar
                value={totalAverageScore}
                label={`Moyenne des avis : ${totalAverageScore ? totalAverageScore.toFixed(1) : 0}/10`}
                max={10}
              />
            </div>

            {/* TOP GENRES */}
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold text-white">
                Le top 3 des genres de la collection
              </p>
              <div className="space-y-2">
                {topGenres.map(([genre, valeur]) => (
                  <ProgressBar
                    key={genre}
                    value={valeur}
                    labelLeft={genre}
                    max={totalGames}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANNEAU DROIT : LISTE DE JEUX / CARTES */}
        <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
          <div className="px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
            <div className="flex flex-col gap-3">
              {hallOfFame.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Aucun jeu noté pour le moment.
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-white">
                    Meilleurs avis {hallOfFame[0].review?.score}/10
                  </p>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
                    ref={animation}
                  >
                    {hallOfFame.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Avis modeste {hallOfShame[0].review?.score}/10
                  </p>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
                    ref={animation}
                  >
                    {hallOfShame.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    ),
  }));

  return (
    <LayoutFull title="Statistiques">
      {loading ? (
        <p className="p-8 text-gray-400">Chargement des statistiques...</p>
      ) : (
        <>
          <Tabs
            items={tabItems}
            selectedIndex={selectedIndex !== -1 ? selectedIndex : 0}
            onChange={handleTabChange}
            className="p-2"
          />
        </>
      )}
    </LayoutFull>
  );
}

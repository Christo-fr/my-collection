import ProgressBar from "@/components/ui/ProgressBar";

interface StatsKpiSidebarProps {
  totalGames: number;
  totalCompletedGames: number;
  totalPlaytime: number;
  totalPhysical: number;
  totalAverageScore: number;
  topGenres: [string, number][];
  topFranchises: [string, number][];
}

export default function StatsKpiSidebar({
  totalGames,
  totalCompletedGames,
  totalPlaytime,
  totalPhysical,
  totalAverageScore,
  topGenres,
  topFranchises,
}: StatsKpiSidebarProps) {
  return (
    <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
      <div className="pr-2 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        {/* CHIFFRES CLÉS */}
        <div className="mb-4">
          {totalCompletedGames > 0 && (
            <p className="text-sm">
              Temps de jeu passé :{" "}
              <span className="font-bold">{totalPlaytime} heures</span>
            </p>
          )}
          <p className="text-sm">
            Nombre de jeux : <span className="font-bold">{totalGames}</span>
          </p>
        </div>

        {/* JAUGES PRINCIPALES */}
        <div className="mb-4 space-y-2">
          {totalCompletedGames > 0 && (
            <ProgressBar
              value={totalCompletedGames}
              label={`Statut de la collection : ${
                totalGames > 0
                  ? Math.round((totalCompletedGames / totalGames) * 100)
                  : 0
              }% Terminés`}
              max={totalGames}
              labelLeft="Terminés"
              labelRight="En cours"
            />
          )}

          <ProgressBar
            value={totalPhysical}
            label="Répartition des supports :"
            max={totalGames}
            labelLeft="Physique"
            labelRight="Digital"
            showPercentage={true}
          />

          {totalCompletedGames > 0 && (
            <ProgressBar
              value={totalAverageScore}
              label={`Moyenne des avis : ${
                totalAverageScore ? totalAverageScore.toFixed(1) : 0
              }/10`}
              max={10}
            />
          )}
        </div>

        {/* TOP GENRES */}
        {topGenres.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Top 3 des genres</p>
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
        )}

        {/* TOP FRANCHISES */}
        {topFranchises.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Top 3 des franchises</p>
            <div className="space-y-2">
              {topFranchises.map(([franchise, valeur]) => (
                <ProgressBar
                  key={franchise}
                  value={valeur}
                  labelLeft={franchise}
                  max={totalGames}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

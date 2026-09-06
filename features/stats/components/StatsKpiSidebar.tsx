import ProgressBar from "@/components/ui/ProgressBar";
import Heading from "@/components/ui/Heading";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Contrat de propriétés regroupant l'ensemble des métriques de la sidebar */
interface StatsKpiSidebarProps {
  totalGames: number;
  totalDataGames: number;
  totalDataPlaytimeGames: number;
  totalEstimatedPlaytime: number;
  totalCompletedGames: number;
  totalPlaytime: number;
  totalPhysical: number;
  totalAverageScore: number;
  topGenres: [string, number][];
  topFranchises: [string, number][];
}

// =========================================================================
// 2. COMPOSANT SIDEBAR INDICATEURS
// =========================================================================
/** Panneau latéral affichant les indicateurs clés et jauges de progression */
export default function StatsKpiSidebar({
  totalGames,
  totalDataGames,
  totalDataPlaytimeGames,
  totalCompletedGames,
  totalEstimatedPlaytime,
  totalPlaytime,
  totalPhysical,
  totalAverageScore,
  topGenres,
  topFranchises,
}: StatsKpiSidebarProps) {
  // =========================================================================
  // 3. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
      {/* En-tête de la sidebar */}
      <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
        <Heading
          as="h2"
          size="md"
          className="font-semibold tracking-wide uppercase"
        >
          Indicateurs
        </Heading>
      </div>

      <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        {/* Blocs 1 : Chiffres clés (Volume, Supports, Moyenne) */}
        <div className="mb-6 space-y-1">
          {/* Progression du nombre de jeux par rapport au total BDD */}
          <ProgressBar
            value={totalGames}
            max={totalDataGames}
            label={`Nombre de jeux : ${totalGames} / ${totalDataGames}`}
          />

          {/* Jauge de répartition Physique vs Digital */}
          <ProgressBar
            value={totalPhysical}
            label="Répartition des supports :"
            max={totalGames}
            labelLeft="Physique"
            labelRight="Digital"
            showPercentage={true}
          />

          {/* Jauge de la moyenne générale des notes */}
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

        {/* Bloc 2 : Jauges principales (Statut & Temps de jeu) */}
        <div className="mb-6 space-y-1">
          {/* Ratio de complétion des jeux */}
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

          {/* Cumul des heures jouées vs somme totale des heures jouées */}
          {totalCompletedGames > 0 && (
            <ProgressBar
              value={totalPlaytime}
              max={totalDataPlaytimeGames}
              label={`Temps de jeu passé : ${totalPlaytime} / ${totalDataPlaytimeGames} heures`}
            />
          )}

          {/* Écart en pourcentage entre temps réel et temps estimé */}
          {totalCompletedGames > 0 && (
            <ProgressBar
              value={totalPlaytime}
              max={totalPlaytime + totalEstimatedPlaytime}
              label={`Temps de jeu passé VS Temps estimé : ${
                totalEstimatedPlaytime > 0
                  ? `${totalPlaytime >= totalEstimatedPlaytime ? "+" : ""}${Math.round(
                      ((totalPlaytime - totalEstimatedPlaytime) /
                        totalEstimatedPlaytime) *
                        100,
                    )}%`
                  : "0%"
              }`}
            />
          )}
        </div>

        {/* Bloc 3 : Top 3 des genres */}
        {topGenres.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Top 3 des genres</p>
            <div className="space-y-1">
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

        {/* Bloc 4 : Top 3 des franchises */}
        {topFranchises.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Top 3 des franchises</p>
            <div className="space-y-1">
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

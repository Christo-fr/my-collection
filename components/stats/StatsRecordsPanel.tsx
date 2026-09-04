import ListHeader from "@/components/game/ListHeader";
import GameCard from "@/components/game/GameCard";
import { OPTIONS_RECORD_METRICS } from "@/utils/game/gameUtils";
import { Game } from "@/types";

// =========================================================================
// 1. TYPAGE & INTERFACES
// =========================================================================
/** Contrat de propriétés nécessaires à l'affichage du panneau comparatif de records */
interface StatsRecordsPanelProps {
  recordMax: Game[];
  recordMin: Game[];
  recordMetric: string;
  setRecordMetric: (metric: string) => void;
  getRecordColumnTitle: (
    metric: string,
    game?: Game,
    type?: "max" | "min",
  ) => string;
}

// =========================================================================
// 2. COMPOSANT PANNEAU DES RECORDS
// =========================================================================
/** Panneau principal gérant le sélecteur de métriques et la grille comparative Max / Min */
export default function StatsRecordsPanel({
  recordMax,
  recordMin,
  recordMetric,
  setRecordMetric,
  getRecordColumnTitle,
}: StatsRecordsPanelProps) {
  // =========================================================================
  // 3. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
      {/* Barre d'en-tête intégrant le Select de métriques */}
      <ListHeader
        title="Comparatif"
        sortBy={recordMetric}
        onSortChange={setRecordMetric}
        optionsSort={OPTIONS_RECORD_METRICS}
      />

      <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* COLONNE MAX : Ajuste sa largeur selon la présence d'une colonne MIN */}
          <div
            className={`flex flex-col gap-3 text-main ${
              recordMin.length > 0 ? "lg:w-1/2" : "lg:w-full"
            }`}
          >
            {recordMax.length === 0 ? (
              <p className="text-sm">Aucune données...</p>
            ) : (
              <>
                {/* Intitulé dynamique de la colonne Max */}
                <p className="text-sm font-semibold">
                  {getRecordColumnTitle(recordMetric, recordMax[0], "max")}
                </p>

                {/* Grille des cartes Max : re-monte et re-anime le bloc lors d'un changement de métrique */}
                <div
                  key={recordMetric}
                  className={`grid ${
                    recordMin.length > 0
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  } gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]`}
                >
                  {recordMax.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* COLONNE MIN : Affichée uniquement si des éléments min sont présents */}
          {recordMin.length > 0 && (
            <>
              {/* Séparateur vertical visuel en mode bureau */}
              <div className="lg:w-[1px] lg:bg-main/10" />

              <div className="flex flex-col gap-3 text-main lg:w-1/2">
                {/* Intitulé dynamique de la colonne Min */}
                <p className="text-sm font-semibold">
                  {getRecordColumnTitle(recordMetric, recordMin[0], "min")}
                </p>

                {/* Grille des cartes Min avec optimisation du chargement des images prioritaires */}
                <div
                  key={recordMetric}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
                >
                  {recordMin.map((game, index) => (
                    <GameCard key={game.id} game={game} priority={index < 6} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

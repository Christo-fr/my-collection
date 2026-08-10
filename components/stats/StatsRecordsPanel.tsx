import ListHeader from "@/components/game/ListHeader";
import GameCard from "@/components/game/GameCard";
import { OPTIONS_RECORD_METRICS } from "@/features/game/gameUtils";
import { Game } from "@/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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

export default function StatsRecordsPanel({
  recordMax,
  recordMin,
  recordMetric,
  setRecordMetric,
  getRecordColumnTitle,
}: StatsRecordsPanelProps) {
  const [maxRef] = useAutoAnimate({
    duration: 200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });
  const [minRef] = useAutoAnimate({
    duration: 200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });

  const totalResults = recordMax.length + recordMin.length;

  return (
    <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
      <ListHeader
        title="Analyses & Records"
        totalResults={totalResults}
        sortBy={recordMetric}
        onSortChange={setRecordMetric}
        optionsSort={OPTIONS_RECORD_METRICS}
      />

      <div className="px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* COLONNE MAX */}
          <div className="flex flex-col gap-3 text-main lg:w-1/2">
            {recordMax.length === 0 ? (
              <p className="text-sm">Aucun jeu noté pour le moment.</p>
            ) : (
              <>
                <p className="text-sm font-semibold">
                  {getRecordColumnTitle(recordMetric, recordMax[0], "max")}
                </p>
                <div
                  ref={maxRef}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
                >
                  {recordMax.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:w-[1px] lg:bg-main/10" />

          {/* COLONNE MIN */}
          <div className="flex flex-col gap-3 text-main lg:w-1/2">
            {recordMin.length > 0 && (
              <>
                <p className="text-sm font-semibold">
                  {getRecordColumnTitle(recordMetric, recordMin[0], "min")}
                </p>
                <div
                  ref={minRef}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
                >
                  {recordMin.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

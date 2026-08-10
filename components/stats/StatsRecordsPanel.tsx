import ListHeader from "@/components/game/ListHeader";
import GameCard from "@/components/game/GameCard";
import { OPTIONS_RECORD_METRICS } from "@/features/game/gameUtils";
import { Game } from "@/types";

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
  return (
    <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0">
      <ListHeader
        title="Analyses & Records"
        sortBy={recordMetric}
        onSortChange={setRecordMetric}
        optionsSort={OPTIONS_RECORD_METRICS}
      />

      <div className="py-4 px-2 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* COLONNE MAX */}
          <div
            className={`flex flex-col gap-3 text-main ${recordMin.length > 0 ? "lg:w-1/2" : "lg:w-full"}`}
          >
            {recordMax.length === 0 ? (
              <p className="text-sm">Aucune données...</p>
            ) : (
              <>
                <p className="text-sm font-semibold">
                  {getRecordColumnTitle(recordMetric, recordMax[0], "max")}
                </p>
                <div
                  key={recordMetric}
                  className={`grid ${recordMin.length > 0 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"} gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]`}
                >
                  {recordMax.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* COLONNE MIN */}
          {recordMin.length > 0 && (
            <>
              <div className="lg:w-[1px] lg:bg-main/10" />

              <div className="flex flex-col gap-3 text-main lg:w-1/2">
                <p className="text-sm font-semibold">
                  {getRecordColumnTitle(recordMetric, recordMin[0], "min")}
                </p>
                <div
                  key={recordMetric}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-[fadeInGrid_0.4s_ease-out_forwards]"
                >
                  {recordMin.map((game) => (
                    <GameCard key={game.id} game={game} />
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

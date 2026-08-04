// src/components/game/ListHeader.tsx
import Select from "@/components/ui/Select";
import { OPTIONS_SORT } from "@/features/game";

interface ListHeaderProps {
  totalResults: number;
  sortBy: string;
  onSortChange: (val: string) => void;
}

/**
 * Composant ListHeader
 * En-tête fixe du panneau droit : affiche le titre, le nombre de résultats filtrés
 * et le menu déroulant de tri.
 */
export default function ListHeader({
  totalResults,
  sortBy,
  onSortChange,
}: ListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-main/10 px-2 md:h-12 lg:flex-shrink-0">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold tracking-wide uppercase">
          Liste de jeux
        </h2>
        <span className="text-sm text-main/60">({totalResults} résultats)</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <label className="text-xs font-medium text-main/80">Tri </label>
        <div className="w-full md:w-60">
          <Select
            options={OPTIONS_SORT}
            selectedValue={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
}

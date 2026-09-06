import Select from "@/components/ui/Select";
import Heading from "@/components/ui/Heading";

interface GameCatalogListHeaderProps {
  title: string;
  totalResults?: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  optionsSort: { label: string; value: string }[];
}

/**
 * Composant ListHeader
 * En-tête fixe du panneau droit : affiche le titre, le nombre de résultats filtrés
 * et le menu déroulant de tri.
 */
export default function GameCatalogListHeader({
  title,
  totalResults,
  sortBy,
  onSortChange,
  optionsSort,
}: GameCatalogListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-main/10 px-2 md:h-12 lg:flex-shrink-0">
      <div className="flex items-baseline gap-2">
        <Heading
          as="h2"
          size="md"
          className="font-semibold tracking-wide uppercase"
        >
          {title}
        </Heading>
        {totalResults && (
          <span className="text-sm text-main/60">
            ({totalResults} résultats)
          </span>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <label className="text-xs font-medium text-main/80">Tri </label>
        <div className="w-full md:w-60">
          <Select
            options={optionsSort}
            selectedValue={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>
    </div>
  );
}

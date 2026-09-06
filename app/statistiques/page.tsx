import LayoutFull from "@/components/layout/LayoutFull";
import StatsView from "@/features/stats/components/StatsView";

export default function StatsPage() {
  // =========================================================================
  // 1. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <LayoutFull title="Statistiques">
      <StatsView />
    </LayoutFull>
  );
}

"use client";

import LayoutFull from "@/components/layout/LayoutFull";
import Tabs from "@/components/ui/Tabs";
import { useStats } from "@/features/stats/useStats";
import StatsKpiSidebar from "@/components/stats/StatsKpiSidebar";
import StatsRecordsPanel from "@/components/stats/StatsRecordsPanel";

export default function StatsPage() {
  // =========================================================================
  // 1. HOOKS & ÉTATS LOCAUX
  // =========================================================================
  const stats = useStats();

  // =========================================================================
  // 2. GESTION DE LA NAVIGATION & ÉVÉNEMENTS
  // =========================================================================

  const selectedIndex = stats.consoleTabs.findIndex(
    (tab) => tab.value === stats.selectedConsole,
  );

  const handleTabChange = (index: number) => {
    const targetTab = stats.consoleTabs[index];
    if (targetTab) {
      stats.setSelectedConsole(targetTab.value);
    }
  };

  // =========================================================================
  // 3. CONSTRUCTION DE LA TAB STATS
  // =========================================================================
  const tabItems = stats.consoleTabs.map((tab) => ({
    label: tab.value,
    content: (
      <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        <StatsKpiSidebar
          totalGames={stats.totalGames}
          totalDataGames={stats.totalDataGames}
          totalDataPlaytimeGames={stats.totalDataPlaytimeGames}
          totalCompletedGames={stats.totalCompletedGames}
          totalEstimatedPlaytime={stats.totalEstimatedPlaytime}
          totalPlaytime={stats.totalPlaytime}
          totalPhysical={stats.totalPhysical}
          totalAverageScore={stats.totalAverageScore}
          topGenres={stats.topGenres}
          topFranchises={stats.topFranchises}
        />
        <StatsRecordsPanel
          recordMax={stats.recordMax}
          recordMin={stats.recordMin}
          recordMetric={stats.recordMetric}
          setRecordMetric={stats.setRecordMetric}
          getRecordColumnTitle={stats.getRecordColumnTitle}
        />
      </div>
    ),
  }));

  // =========================================================================
  // 4. RENDU DU COMPOSANT
  // =========================================================================
  return (
    <LayoutFull title="Statistiques">
      {stats.loading ? (
        <p className="p-8 text-main">Chargement des statistiques...</p>
      ) : (
        <Tabs
          items={tabItems}
          selectedIndex={selectedIndex !== -1 ? selectedIndex : 0}
          onChange={handleTabChange}
          className="p-2"
        />
      )}
    </LayoutFull>
  );
}

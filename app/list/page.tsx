import { Suspense } from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import GameCatalogView from "@/components/shared/GameCatalogView";

export default function MaListe() {
  return (
    <Suspense fallback={<p className="p-8 text-gray-400">Chargement...</p>}>
      <LayoutFull title="Ma liste">
        <GameCatalogView cardStyle="list" />
      </LayoutFull>
    </Suspense>
  );
}

import LayoutFull from "@/components/layout/LayoutFull";
import GameCatalogView from "@/components/shared/GameCatalogView";

export default function MaListe() {
  return (
    <LayoutFull title="Ma liste">
      <GameCatalogView cardStyle="list" />
    </LayoutFull>
  );
}

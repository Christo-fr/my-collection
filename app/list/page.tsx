import LayoutFull from "@/components/layout/LayoutFull";
import GameCatalogView from "@/components/game/GameCatalogView";

/** Page affichant la liste filtrable et triable des jeux de la collection */
export default function MaListe() {
  return (
    <LayoutFull title="Ma liste">
      <GameCatalogView cardStyle="list" />
    </LayoutFull>
  );
}

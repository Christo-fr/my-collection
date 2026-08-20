import LayoutFull from "@/components/layout/LayoutFull";
import GameForm from "@/components/admin/gameForm/GameForm";

export default function AddGamePage() {
  return (
    <LayoutFull title="Ajout">
      <GameForm mode="insert" />
    </LayoutFull>
  );
}

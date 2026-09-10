import { Suspense } from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import GameCatalogView from "@/components/shared/GameCatalogView";
import Button from "@/components/ui/Button";
import { Gamepad, FilePlus } from "lucide-react";

export default function Administration() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-gray-400">Chargement de l'interface...</p>
      }
    >
      <LayoutFull title="Administration">
        <GameCatalogView
          cardStyle="admin"
          actions={
            <>
              <Button
                href="/administration/add"
                variant="secondary"
                icon={<FilePlus className="w-5 h-5" />}
              >
                Nouveau jeu
              </Button>
              <Button
                variant="secondary"
                href="/administration/consoles"
                icon={<Gamepad className="w-5 h-5" />}
              >
                Gestion consoles
              </Button>
            </>
          }
        />
      </LayoutFull>
    </Suspense>
  );
}

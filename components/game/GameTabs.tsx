import { Play } from "lucide-react";

import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import GameInformationsPanel from "@/components/game/GameInformationsPanel";
import GameReviewPanel from "@/components/game/GameReviewPanel";

import { Game } from "@/types/game";

interface GameTabsProps {
  game: Game;
  relatedFranchiseGames: Game[];
  onOpenTrailer: () => void;
}

export default function GameTabs({
  game,
  relatedFranchiseGames,
  onOpenTrailer,
}: GameTabsProps) {
  const tabs = [
    {
      label: "Informations",
      content: (
        <GameInformationsPanel
          game={game}
          relatedFranchiseGames={relatedFranchiseGames}
        />
      ),
    },
    ...(game?.review?.score
      ? [
          {
            label: "Avis",
            content: <GameReviewPanel review={game.review} />,
          },
        ]
      : []),
  ];

  return (
    <Tabs
      className="pt-4"
      action={
        game.youtubeId && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Play className="w-5 h-5" />}
            onClick={onOpenTrailer}
          >
            Trailer
          </Button>
        )
      }
      items={tabs}
    />
  );
}

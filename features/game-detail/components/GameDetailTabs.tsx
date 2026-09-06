import { Play } from "lucide-react";

import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import GameDetailInformationsPanel from "@/features/game-detail/components/GameDetailInformationsPanel";
import GameDetailReviewPanel from "@/features/game-detail/components/GameDetailReviewPanel";

import { Game } from "@/types/game";

interface GameDetailTabsProps {
  game: Game;
  relatedFranchiseGames: Game[];
  onOpenTrailer: () => void;
}

export default function GameDetailTabs({
  game,
  relatedFranchiseGames,
  onOpenTrailer,
}: GameDetailTabsProps) {
  const tabs = [
    {
      label: "Informations",
      content: (
        <GameDetailInformationsPanel
          game={game}
          relatedFranchiseGames={relatedFranchiseGames}
        />
      ),
    },
    ...(game?.review?.score
      ? [
          {
            label: "Avis",
            content: <GameDetailReviewPanel review={game.review} />,
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

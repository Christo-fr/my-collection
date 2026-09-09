import GameDetailView from "@/features/game-detail/components/GameDetailView";

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  //Next.js passe les paramètres de route de manière asynchrone
  const { id } = await params;
  const idGame = id ? Number(id) : null;

  if (!idGame) return null;

  return <GameDetailView idGame={idGame} />;
}

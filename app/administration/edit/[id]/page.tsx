import GameFormView from "@/components/admin/gameForm/GameFormView";

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  //Next.js passe désormais les paramètres de route de manière asynchrone
  const { id } = await params;
  const idGame = id ? Number(id) : null;

  return <GameFormView mode="update" idGame={idGame} />;
}

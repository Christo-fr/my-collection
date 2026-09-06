import AdminGameFormView from "@/features/admin-game-form/components/AdminGameFormView";

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  //Next.js passe désormais les paramètres de route de manière asynchrone
  const { id } = await params;
  const idGame = id ? Number(id) : null;

  return <AdminGameFormView mode="update" idGame={idGame} />;
}

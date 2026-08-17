import { Console } from "@/types/console";

/**
 * 1. HELPER PURE : Met à jour un champ spécifique d'une console dans la liste locale.
 */
export function updateConsoleInList(
  consoles: Console[],
  id: number,
  field: string,
  value: string | boolean | File,
): Console[] {
  return consoles.map((item) =>
    item.id === id ? { ...item, [field]: value } : item,
  );
}

/**
 * 2. ACTION API : Envoie le tableau mis à jour au serveur / à la base de données.
 */
export async function saveConsoles(consoles: Console[]) {
  // On simulera ou branchera la vraie requête ici à l'étape suivante
  console.log("Données envoyées au serveur :", consoles);
  return { success: true };
}

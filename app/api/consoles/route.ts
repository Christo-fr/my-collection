export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // =========================================================================
  // 1. INITIALISATION DU CLIENT SUPABASE
  // =========================================================================
  const supabase = await createClient();

  // =========================================================================
  // 2. RÉCUPÉRATION DES CONSOLES UTILISÉES DANS LA TABLE "GAMES"
  // =========================================================================
  const { data: gamesData, error: gamesError } = await supabase
    .from("games")
    .select("console");

  if (gamesError) {
    console.error("Erreur Supabase (games) :", gamesError.message);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des jeux" },
      { status: 500 },
    );
  }

  // Diminutifs uniques réellement attribués à au moins un jeu (ex: ["PS5", "Switch"])
  const consolesInGames = Array.from(
    new Set(gamesData.map((game) => game.console).filter(Boolean)),
  );

  // =========================================================================
  // 3. RÉCUPÉRATION DU DICTIONNAIRE DANS LA TABLE "CONSOLES"
  // =========================================================================
  const { data: consolesInDb, error: consolesError } = await supabase
    .from("consoles")
    .select("*")
    .order("display_order", { ascending: true });

  if (consolesError) {
    console.error("Erreur Supabase (consoles) :", consolesError.message);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des consoles" },
      { status: 500 },
    );
  }

  // =========================================================================
  // 4. COMPARAISON ET DÉTECTION DES DÉCALAGES (AJOUTS / SUPPRESSIONS)
  // =========================================================================
  // À CRÉER : présent dans "games", mais absent de la table "consoles"
  const consolesToAdd = consolesInGames.filter(
    (shortName) => !consolesInDb.some((c) => c.short_name === shortName),
  );

  // À SUPPRIMER : présent dans la table "consoles", mais plus aucun jeu ne l'utilise
  const consolesToDelete = consolesInDb.filter(
    (console) =>
      !consolesInGames.some((shortName) => shortName === console.short_name),
  );

  // =========================================================================
  // 5. SYNCHRONISATION EN BDD (DELETE & INSERT) ET RETOUR JSON
  // =========================================================================

  // A. Suppression des consoles qui n'ont plus aucun jeu
  if (consolesToDelete.length > 0) {
    for (const consoleItem of consolesToDelete) {
      if (consoleItem.logo_url) {
        const fileName = consoleItem.logo_url.split("/").pop();

        if (fileName) {
          // <-- Ici : on cible directement le bucket "consoles"
          await supabase.storage.from("consoles").remove([fileName]);
        }
      }
    }

    const idsToDelete = consolesToDelete.map((c) => c.id);

    const { error: deleteError } = await supabase
      .from("consoles")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      console.error("Erreur Supabase (delete) :", deleteError.message);
    }
  }

  // B. Insertion des consoles manquantes
  if (consolesToAdd.length > 0) {
    const newConsolesToInsert = consolesToAdd.map((shortName, index) => ({
      short_name: shortName,
      full_name: shortName,
      is_bw: false,
      display_order: consolesInDb.length + index + 1,
    }));

    const { error: insertError } = await supabase
      .from("consoles")
      .insert(newConsolesToInsert);

    if (insertError) {
      console.error("Erreur Supabase (insert) :", insertError.message);
    }
  }

  // C. Si une modification a eu lieu, on relit la BDD mise à jour
  if (consolesToDelete.length > 0 || consolesToAdd.length > 0) {
    const { data: updatedConsoles } = await supabase
      .from("consoles")
      .select("*")
      .order("display_order", { ascending: true });

    return NextResponse.json(updatedConsoles);
  }

  // D. Sinon, on renvoie la liste initiale
  return NextResponse.json(consolesInDb);
}

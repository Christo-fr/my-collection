import { Game } from "@/types/game";
import { Console } from "@/types/console";

// =============================================================
// 1. OPTIONS STATIQUES (Listes figées)
// =============================================================

/** Options des tranches d'âge PEGI pour les composants Select */
export const OPTIONS_PEGI = [
  { label: "3", value: "3" },
  { label: "7", value: "7" },
  { label: "12", value: "12" },
  { label: "16", value: "16" },
  { label: "18", value: "18" },
];

/** Options du format de possession (Physique / Dématérialisé) */
export const OPTIONS_SUPPORT = [
  { label: "Physique", value: "Physical" },
  { label: "Digital", value: "Digital" },
];

// =============================================================
// 2. OPTIONS DYNAMIQUES ISSUES DES JEUX
// =============================================================

/**
 * Extrait les valeurs uniques d'un champ texte dans la liste globale des jeux
 * (ex: tous les genres existants) et les formate pour les composants Combobox.
 *
 * @param games La liste globale de tous les jeux
 * @param field Le champ visé ("franchise", "developer", "language" ou "genre")
 */
export function getUniqueGameOptions(
  games: Game[],
  field: "franchise" | "developer" | "language" | "genre",
) {
  const uniqueValues = Array.from(
    new Set(
      games
        // 1. EXTRACTION : Récupération de la valeur brute sur chaque jeu
        .map((game) => game[field])
        // 2. NETTOYAGE : Elimination des valeurs undefined, null ou des chaînes vides ("")
        .filter((val): val is string => Boolean(val && val.trim() !== "")),
    ),
    // 3. TRI : Alignment alphabétique qui prend en compte les accents
  ).sort((a, b) => a.localeCompare(b));

  // 4. FORMATAGE : Conversion au format { label, value } attendu par la Combobox
  return uniqueValues.map((val) => ({ label: val, value: val }));
}

// =============================================================
// 3. OPTIONS DYNAMIQUES ISSUES DES CONSOLES
// =============================================================

/**
 * Formate la liste des consoles dynamiques pour le formulaire de création/édition
 * (contrairement aux filtres de recherche, l'option "Toutes" n'est pas incluse).
 *
 * @param consoles La liste globale des consoles
 */
export function getConsoleFormOptions(consoles: Console[]) {
  return consoles.map((console) => ({
    label: console.short_name,
    value: console.short_name,
  }));
}

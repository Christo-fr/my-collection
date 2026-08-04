/**
 * Options de tri pour la liste des jeux.
 * Utilisées par le composant Select dans l'en-tête de la liste.
 */
export const OPTIONS_SORT = [
  { label: "Alphabétique", value: "alphabetical" },
  { label: "Anti-Alphabétique", value: "anti_alphabetical" },
  { label: "Date de sortie - croissante", value: "releaseDate_ascending" },
  { label: "Date de sortie - décroissante", value: "releaseDate_descending" },
  { label: "Durée de vie - croissant", value: "estimatedPlaytime_ascending" },
  {
    label: "Durée de vie - décroissant",
    value: "estimatedPlaytime_descending",
  },
  { label: "Note - croissante", value: "score_ascending" },
  { label: "Note - décroissante", value: "score_descending" },
];

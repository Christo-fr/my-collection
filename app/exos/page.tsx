"use client";

import LayoutFull from "@/components/layout/LayoutFull";
import Heading from "@/components/ui/Heading";

export default function ExercicePage() {
  // ---------------------------------------------------------------------------
  // 1. DONNÉES DE TEST
  // ---------------------------------------------------------------------------

  // Jeu 1 : Tableau brut avec des doublons, du texte vide et du null
  const rawConsoles = ["PS5", "GBA", "PS5", "N64", "", null, "GBC", "GBA"];

  // Jeu 2 : Tableau d'objets (style catalogue de jeux)
  const mockGames = [
    {
      id: 1,
      title: "Zelda: Ocarina of Time",
      console: "N64",
      price: 60,
      isFavorite: true,
    },
    {
      id: 2,
      title: "Pokémon Émeraude",
      console: "GBA",
      price: 70,
      isFavorite: false,
    },
    {
      id: 3,
      title: "Mario Kart 64",
      console: "N64",
      price: 40,
      isFavorite: true,
    },
    {
      id: 4,
      title: "Super Mario Odyssey",
      console: "Switch",
      price: 50,
      isFavorite: false,
    },
  ];

  // Jeu 3 : Objet simple et tableau de tags
  const baseConsole = { short_name: "PS5", is_bw: false };
  const currentTags = ["retrogaming", "favoris"];

  // ---------------------------------------------------------------------------
  // 2. FORMULES (À compléter ensemble durant le cours !)
  // ---------------------------------------------------------------------------

  // Chapitre 1
  const ch1_cleanConsoles = rawConsoles; // Objectif : Éliminer null et ""
  const ch1_gameTitles = mockGames; // Objectif : Extraire uniquement les titres ["Zelda...", ...]

  // Chapitre 2
  const ch2_uniqueConsoles = rawConsoles; // Objectif : Dédoublonner rawConsoles

  // Chapitre 3
  const ch3_sortedTitles = mockGames; // Objectif : Trier par ordre alphabétique
  const ch3_sortedPrices = mockGames; // Objectif : Trier du moins cher au plus cher

  // Chapitre 4
  const ch4_zeldaGame = null; // Objectif : Trouver le jeu Zelda avec .find()
  const ch4_hasN64 = false; // Objectif : Vérifier s'il y a au moins un jeu N64 avec .some()

  // Chapitre 5
  const ch5_totalPrice = 0; // Objectif : Calculer la somme des prix avec .reduce()
  const ch5_countByConsole = {}; // Objectif : Compter le nombre de jeux par console

  // Chapitre 6
  const ch6_maxPrice = 0; // Objectif : Trouver le prix le plus élevé avec Math.max(...)
  const ch6_extendedConsole = baseConsole; // Objectif : Ajouter full_name avec l'opérateur ...
  const ch6_mergedTags = currentTags; // Objectif : Ajouter "solo" à la liste des tags

  // Chapitre 7
  const ch7_consoleEntries = []; // Objectif : Transformer un objet de comptage en tableau avec Object.entries()

  // ---------------------------------------------------------------------------
  // 3. RENDU DU COMPOSANT
  // ---------------------------------------------------------------------------

  return (
    <LayoutFull title="Atelier Méthodes JS">
      <div className="w-full flex flex-col h-auto lg:h-full min-h-0 overflow-x-hidden p-4 space-y-6">
        <header className="space-y-1 border-b border-main/10 pb-4">
          <Heading as="h1" size="3xl">
            🧪 Atelier Méthodes JS
          </Heading>
          <p className="text-main/60 text-sm">
            Laboratoire d'expérimentation pour manipuler les tableaux et objets
            en JavaScript.
          </p>
        </header>

        {/* CHAPITRE 1 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 1 : Nettoyer & Extraire (.filter & .map)
          </h2>
          <div className="text-sm font-mono space-y-2 bg-black/20 p-3 rounded border border-main/5">
            <div>
              <p className="text-main/40">
                // 1A. Nettoyage (supprimer null et "") :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch1_cleanConsoles)}
              </p>
            </div>
            <div>
              <p className="text-main/40">
                // 1B. Extraction des titres de jeux :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch1_gameTitles)}
              </p>
            </div>
          </div>
        </section>

        {/* CHAPITRE 2 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 2 : Dédoublonner (new Set & Array.from)
          </h2>
          <div className="text-sm font-mono space-y-1 bg-black/20 p-3 rounded border border-main/5">
            <p className="text-main/40">
              // Résultat attendu : ["PS5", "GBA", "N64", "GBC"]
            </p>
            <p className="text-emerald-400">
              {JSON.stringify(ch2_uniqueConsoles)}
            </p>
          </div>
        </section>

        {/* CHAPITRE 3 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 3 : Trier (.sort & localeCompare)
          </h2>
          <div className="text-sm font-mono space-y-2 bg-black/20 p-3 rounded border border-main/5">
            <div>
              <p className="text-main/40">
                // 3A. Tri alphabétique par titre :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch3_sortedTitles)}
              </p>
            </div>
            <div>
              <p className="text-main/40">// 3B. Tri par prix croissant :</p>
              <p className="text-emerald-400">
                {JSON.stringify(ch3_sortedPrices)}
              </p>
            </div>
          </div>
        </section>

        {/* CHAPITRE 4 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 4 : Rechercher & Vérifier (.find & .some)
          </h2>
          <div className="text-sm font-mono space-y-2 bg-black/20 p-3 rounded border border-main/5">
            <div>
              <p className="text-main/40">// 4A. Jeu Zelda trouvé (.find) :</p>
              <p className="text-emerald-400">
                {JSON.stringify(ch4_zeldaGame)}
              </p>
            </div>
            <div>
              <p className="text-main/40">
                // 4B. Presence d'un jeu N64 (.some) :
              </p>
              <p className="text-emerald-400">{JSON.stringify(ch4_hasN64)}</p>
            </div>
          </div>
        </section>

        {/* CHAPITRE 5 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 5 : Accumuler (.reduce)
          </h2>
          <div className="text-sm font-mono space-y-2 bg-black/20 p-3 rounded border border-main/5">
            <div>
              <p className="text-main/40">// 5A. Prix total du catalogue :</p>
              <p className="text-emerald-400">
                {JSON.stringify(ch5_totalPrice)} €
              </p>
            </div>
            <div>
              <p className="text-main/40">
                // 5B. Nombre de jeux par console :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch5_countByConsole)}
              </p>
            </div>
          </div>
        </section>

        {/* CHAPITRE 6 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 6 : Copier, Fusionner & Bornes (Spread ... & Math.max)
          </h2>
          <div className="text-sm font-mono space-y-2 bg-black/20 p-3 rounded border border-main/5">
            <div>
              <p className="text-main/40">
                // 6A. Prix le plus cher (Math.max + ...) :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch6_maxPrice)} €
              </p>
            </div>
            <div>
              <p className="text-main/40">
                // 6B. Objet enrichi ({`...baseConsole`}) :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch6_extendedConsole)}
              </p>
            </div>
            <div>
              <p className="text-main/40">
                // 6C. Tableau augmenté ([`...currentTags`]) :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch6_mergedTags)}
              </p>
            </div>
          </div>
        </section>

        {/* CHAPITRE 7 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 7 : Convertir Objets en Tableaux (Object.entries &
            Object.keys)
          </h2>
          <div className="text-sm font-mono space-y-1 bg-black/20 p-3 rounded border border-main/5">
            <p className="text-main/40">
              // Transformation de {`{ N64: 2, GBA: 1 }`} en clé/valeur :
            </p>
            <p className="text-emerald-400">
              {JSON.stringify(ch7_consoleEntries)}
            </p>
          </div>
        </section>
      </div>
    </LayoutFull>
  );
}

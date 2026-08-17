"use client";

import { ReactNode } from "react";
import LayoutFull from "@/components/layout/LayoutFull";
import Heading from "@/components/ui/Heading";

// Encart pédagogique réutilisable affichant la syntaxe et l'explication de chaque méthode
function TheoryBox({
  title,
  syntax,
  children,
}: {
  title: string;
  syntax?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-main/90">
        📖 {title}
      </p>
      {syntax && (
        <pre className="overflow-x-auto rounded-md bg-black/30 p-2 text-xs text-teal-300">
          <code>{syntax}</code>
        </pre>
      )}
      <div className="space-y-1.5 text-xs leading-relaxed text-main/70">
        {children}
      </div>
    </div>
  );
}

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
  const ch1_cleanConsoles = rawConsoles.filter((item) => Boolean(item)); // Objectif : Éliminer null et ""
  const ch1_gameTitles = mockGames.map((game) => ({
    title: game.title,
    price: game.price,
  })); // Objectif : Extraire uniquement les titres et leurs prix ["Zelda...", ...]

  // Chapitre 2
  const ch2_uniqueConsoles = Array.from(new Set(rawConsoles)).filter((item) =>
    Boolean(item),
  ); // Objectif : Dédoublonner rawConsoles

  // Chapitre 3
  const ch3_sortedTitles = [...mockGames].sort((a, b) =>
    a.title.localeCompare(b.title),
  ); // Objectif : Trier par ordre alphabétique
  const ch3_sortedPrices = [...mockGames].sort((a, b) => a.price - b.price); // Objectif : Trier du moins cher au plus cher

  // Chapitre 4
  const ch4_zeldaGame = mockGames.find((game) => game.title.includes("Zelda")); // Objectif : Trouver le jeu Zelda avec .find()
  const ch4_hasN64 = mockGames.some((game) => game.console === "N64"); // Objectif : Vérifier s'il y a au moins un jeu N64 avec .some()

  // Chapitre 5
  const ch5_totalPrice = mockGames.reduce((compteur, game) => {
    return compteur + game.price;
  }, 0); // Objectif : Calculer la somme des prix avec .reduce()
  const ch5_countByConsole = mockGames.reduce(
    (acc, game) => {
      acc[game.console] = (acc[game.console] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ); // Objectif : Compter le nombre de jeux par console

  // Chapitre 6
  const ch6_maxPrice = Math.max(...mockGames.map((game) => game.price)); // Objectif : Trouver le prix le plus élevé avec Math.max(...)
  const ch6_extendedConsole = { ...baseConsole, full_name: "Nom entier" }; // Objectif : Ajouter full_name avec l'opérateur ...
  const ch6_mergedTags = [...currentTags, "solo"]; // Objectif : Ajouter "solo" à la liste des tags

  // Chapitre 7
  const ch7_consoleEntries = Object.entries(ch5_countByConsole)
    // 1. On filtre les clés vides ou invalides avant de transformer
    .filter(([consoleName, count]) => Boolean(consoleName) && count > 0)
    // 2. On formate proprement en objet
    .map(([consoleName, count]) => ({
      consoleName,
      count,
    })); // Objectif : Transformer un objet de comptage en tableau avec Object.entries()

  // Chapitre 8
  // 8A. Parcourir les VALEURS d'un itérable (Tableau, Set, etc.) avec for...of
  const ch8_forOfValues: string[] = [];
  for (const consoleName of ch2_uniqueConsoles) {
    if (consoleName) {
      ch8_forOfValues.push(`Console: ${consoleName}`);
    }
  }

  // 8B. Parcourir les CLÉS / PROPRIÉTÉS d'un objet avec for...in
  const ch8_forInKeys: string[] = [];
  for (const key in ch5_countByConsole) {
    ch8_forInKeys.push(`${key}: ${ch5_countByConsole[key]} jeu(x)`);
  }

  // ---------------------------------------------------------------------------
  // 3. RENDU DU COMPOSANT
  // ---------------------------------------------------------------------------

  return (
    <LayoutFull title="Atelier Méthodes JS">
      <div className="w-full flex flex-col h-auto lg:h-full min-h-0 overflow-x-hidden p-4 space-y-6">
        <header className="space-y-1 border-b border-main/10 pb-4">
          <Heading as="h1" size="md">
            🧪 Laboratoire
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
            <div className="space-y-2">
              <TheoryBox
                title="Part 1A : La méthode .filter()"
                syntax={`const nouveauTableau = tableauOriginal.filter((element) => condition);`}
              >
                <p>
                  Elle parcourt le tableau élément par élément. Pour chaque
                  élément, elle évalue la condition :
                </p>
                <p>true → l'élément est conservé dans le nouveau tableau.</p>
                <p>false → l'élément est éliminé.</p>
                <p>
                  Le tableau d'arrivée est donc de taille égale ou inférieure à
                  l'original.
                </p>
              </TheoryBox>
              <p className="text-main/40">
                // 1A. Nettoyage (supprimer null et "") :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch1_cleanConsoles)}
              </p>
            </div>
            <div className="space-y-2">
              <TheoryBox
                title="Part 1B : La méthode .map()"
                syntax={`// Version explicite avec bloc :
const nouveauTableau = tableauOriginal.map((element) => {
  return element.unePropriete;
});

// Version courte sur une ligne (retour implicite) :
const nouveauTableau = tableauOriginal.map((element) => element.unePropriete);`}
              >
                <p>
                  Elle prend un tableau et crée un nouveau tableau d'une taille
                  exactement identique.
                </p>
                <p>
                  Elle passe chaque élément un par un dans ta fonction. Ce que
                  renvoie ta fonction devient le nouvel élément à cette
                  position.
                </p>
                <p>Elle sert principalement à :</p>
                <p>
                  Extraire un champ spécifique dans un tableau d'objets (ex :
                  récupérer uniquement les prix ou les noms).
                </p>
                <p>
                  Transformer chaque valeur (ex : convertir des prix en TTC,
                  passer du texte en majuscules).
                </p>
              </TheoryBox>
              <p className="text-main/40">
                // 1B. Extraction des titres de jeux & prix :
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
            <TheoryBox
              title="Chapitre 2 : Dédoublonner (new Set & Array.from)"
              syntax={`// Étape 1 : Créer le Set (élimine les doublons)
const monSet = new Set(tableauAvecDoublons);

// Étape 2 : Reconvertir le Set en vrai Tableau
const tableauPropre = Array.from(monSet);

// --- OU la version combinée très courante ---
const tableauPropre = Array.from(new Set(tableauAvecDoublons));

// --- OU avec le spread operator (...) ---
const tableauPropre = [...new Set(tableauAvecDoublons)];`}
            >
              <p>
                new Set(...) : Un Set est une structure JavaScript spéciale qui
                interdit les doublons par nature. Dès que tu lui injectes un
                tableau, il jette automatiquement toutes les valeurs identiques
                déjà présentes.
              </p>
              <p>
                Array.from(...) : Le problème du Set, c'est que ce n'est pas un
                tableau (tu ne peux pas lui appliquer un .map(), un .filter() ou
                accéder à [0]). Array.from() sert à le reconvertir en vrai
                tableau JavaScript.
              </p>
            </TheoryBox>

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
            <div className="space-y-2">
              <TheoryBox
                title="Chapitre 3 : Trier (.sort & localeCompare)"
                syntax={`// Pour du texte (ordre alphabétique) :
const trieTexte = [...monTableau].sort((a, b) => a.localeCompare(b));

// Pour des nombres, ordre croissant (du + petit au + grand) :
const trieNombreAsc = [...monTableau].sort((a, b) => a - b);

// Ordre décroissant (du + grand au + petit) :
const trieNombreDesc = [...monTableau].sort((a, b) => b - a);`}
              >
                <p>
                  .sort() prend deux éléments du tableau (a et b) et les compare
                  deux à deux.
                </p>
                <p>
                  a.localeCompare(b) est la méthode JS native pour comparer des
                  chaînes de caractères. Elle gère parfaitement l'alphabet, les
                  majuscules/minuscules et les accents.
                </p>
                <p>
                  a - b pour les nombres : si le résultat est négatif, a vient
                  avant b. Si le résultat est positif, b vient avant a.
                </p>
                <p>
                  ⚠️ Attention : .sort() modifie le tableau d'origine ! C'est
                  pour ça qu'on fait souvent une copie avant avec
                  [...monTableau] pour éviter de casser le tableau de départ.
                </p>
              </TheoryBox>
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
            <div className="space-y-2">
              <TheoryBox
                title="Chapitre 4 : Rechercher & Vérifier (.find & .some)"
                syntax={`// .find() renvoie L'ÉLÉMENT entier (ou undefined si non trouvé)
const elementTrouve = tableau.find((item) => condition);

// .some() renvoie un BOOLÉEN (true / false)
const auMoinsUnExiste = tableau.some((item) => condition);`}
              >
                <p>
                  .find() cherche une aiguille dans une botte de foin. Dès qu'il
                  croise le premier élément qui respecte ta condition, il stoppe
                  sa recherche et te renvoie cet objet complet. S'il ne trouve
                  rien, il renvoie undefined.
                </p>
                <p>
                  .some() est un détecteur de présence. Il ne te renvoie pas
                  l'objet, mais juste un booléen (true ou false) pour te
                  confirmer si au moins un élément dans tout le tableau valide
                  la condition.
                </p>
              </TheoryBox>
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
            <div className="space-y-2">
              <TheoryBox
                title="Chapitre 5 : Accumuler (.reduce)"
                syntax={`const resultat = tableau.reduce((accumulateur, elementCourant) => {
  return accumulateur + elementCourant.prix;
}, valeurInitiale);`}
              >
                <p>
                  C'est la méthode la plus puissante de JS. Elle sert à
                  condenser tout un tableau en UNE SEULE valeur (un nombre, une
                  chaîne, ou même un objet de statistiques).
                </p>
                <p>
                  valeurInitiale : la valeur de départ de ta « boule de neige »
                  (ex : 0 pour un total).
                </p>
                <p>
                  accumulateur : l'état actuel de ta boule de neige à chaque
                  étape.
                </p>
                <p>
                  elementCourant : l'élément du tableau en cours de traitement.
                </p>
                <p>
                  Analogie : la caisse enregistreuse. Tu commences avec 0 € dans
                  la caisse (valeurInitiale). Tu prends chaque jeu un par un
                  (elementCourant) et tu ajoutes son prix dans le total de la
                  caisse (accumulateur).
                </p>
              </TheoryBox>
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
            <div className="space-y-2">
              <TheoryBox
                title="Chapitre 6 : Déballer & Comparer (Spread Operator & Math.max)"
                syntax={`// Déballer un tableau de nombres dans Math.max :
const maxNombre = Math.max(...tableauDeNombres);

// Fonctionne aussi pour le minimum :
const minNombre = Math.min(...tableauDeNombres);`}
              >
                <p>
                  ... (Spread Operator) : Il « déballe » les éléments d'un
                  tableau un par un pour les passer séparément.
                </p>
                <p>
                  Math.max(...) : la fonction Math.max() attend des arguments
                  individuels (ex : Math.max(10, 20, 30)). Elle ne sait pas lire
                  un tableau entier. Si tu lui passes un tableau directement
                  (Math.max([10, 20])), elle renvoie NaN. Le spread operator
                  résout ce problème en étalant les valeurs du tableau.
                </p>
              </TheoryBox>
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
            <TheoryBox
              title="Chapitre 7 : Convertir un objet (Object.entries)"
              syntax={`const monObjet = { N64: 2, GBA: 1, Switch: 1 };

// Convertit l'objet en un tableau de paires [clé, valeur]
const tableauDePaires = Object.entries(monObjet);

// Résultat :
// [
//   ["N64", 2],
//   ["GBA", 1],
//   ["Switch", 1]
// ]`}
            >
              <p>
                En JS, tu ne peux pas faire .map() ou .filter() directement sur
                un objet {`{}`}.
              </p>
              <p>
                Object.entries() découpe l'objet pour te donner un tableau de
                paires [clé, valeur]. Une fois sous forme de tableau, tu peux
                lui appliquer n'importe quelle méthode de tableau (.map(),
                .filter(), .sort()).
              </p>
            </TheoryBox>
            <p className="text-main/40">
              // Transformation de {`{ N64: 2, GBA: 1 }`} en clé/valeur :
            </p>
            <p className="text-emerald-400">
              {JSON.stringify(ch7_consoleEntries)}
            </p>
          </div>
        </section>

        {/* CHAPITRE 8 */}
        <section className="space-y-3 bg-background/5 p-4 rounded-xl border border-main/10">
          <h2 className="text-xs font-semibold text-main/50 uppercase tracking-wider">
            Chapitre 8 : Parcourir avec les boucles (for...of & for...in)
          </h2>
          <div className="text-sm font-mono space-y-2 bg-black/20 p-3 rounded border border-main/5">
            <div className="space-y-2">
              <TheoryBox
                title="Chapitre 8 : Parcourir avec for...of & for...in"
                syntax={`// for...of : parcourt les VALEURS d'un itérable (Tableau, Set, Map, String)
for (const item of monTableau) {
  console.log(item);
}

// for...in : parcourt les CLÉS / PROPRIÉTÉS d'un objet
for (const key in monObjet) {
  console.log(key, monObjet[key]);
}`}
              >
                <p>
                  for...of : Parcourt directement les VALEURS d'un itérable
                  (Tableau, Set, Map, etc.).
                </p>
                <p>
                  Avantage majeur sur .forEach() : tu peux utiliser "break" pour
                  interrompre la boucle ou "continue" pour sauter un passage.
                </p>
                <p>
                  for...in : Parcourt les CLÉS (ou noms de propriétés) d'un
                  objet.
                </p>
                <p>
                  💡 Mnémonique : "for...OF" pour les Valeurs | "for...IN" pour
                  les Index/Clés.
                </p>
              </TheoryBox>
              <p className="text-main/40">
                // 8A. Parcourir les valeurs d'un Set / Tableau (for...of) :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch8_forOfValues)}
              </p>
            </div>
            <div>
              <p className="text-main/40">
                // 8B. Parcourir les clés d'un objet (for...in) :
              </p>
              <p className="text-emerald-400">
                {JSON.stringify(ch8_forInKeys)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </LayoutFull>
  );
}

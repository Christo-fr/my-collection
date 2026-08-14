import { createClient } from "@supabase/supabase-js";
import gamesData from "../data/games.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Extraction simple du nom de fichier depuis le chemin local
const getFileName = (path: string) => path.split("/").pop() || "";

async function seedDatabase() {
  console.log("🚀 Transformation des données et import...");

  const formattedGames = gamesData.map((game) => {
    const coverName = getFileName(game.images.cover);
    const logoName = getFileName(game.images.logo);
    const parallaxName = getFileName(game.images.parallax.url);

    return {
      ...game,
      images: {
        cover: `${supabaseUrl}/storage/v1/object/public/covers/${coverName}`,
        logo: `${supabaseUrl}/storage/v1/object/public/logos/${logoName}`,
        parallax: {
          ...game.images.parallax,
          url: `${supabaseUrl}/storage/v1/object/public/parallaxes/${parallaxName}`,
        },
      },
    };
  });

  const { data, error } = await supabase
    .from("games")
    .insert(formattedGames)
    .select();

  if (error) {
    console.error("❌ Erreur lors de l'importation :", error.message);
  } else {
    console.log(`✅ ${data.length} jeux importés avec succès !`);
  }
}

seedDatabase();

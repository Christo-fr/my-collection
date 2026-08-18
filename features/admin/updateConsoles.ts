import { Console } from "@/types/console";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient(); // Client Supabase côté navigateur

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
  const cleanConsolesToUpsert = [];

  for (const consoleItem of consoles) {
    // On permet à TS d'accepter une clé temporaire 'file'
    const item = consoleItem as Console & { file?: File };
    let finalLogoUrl = item.logo_url;

    // 1. On récupère le fichier (qu'il soit dans 'file' ou 'logo_file')
    const fileToUpload = item.file || item.logo_file;

    if (fileToUpload) {
      // A. Nettoyage : si une image existait déjà, on supprime l'ancien fichier
      if (item.logo_url) {
        const oldFileName = item.logo_url.split("/").pop();
        if (oldFileName) {
          await supabase.storage.from("consoles").remove([oldFileName]);
        }
      }

      // B. Upload de la nouvelle image dans le bucket "consoles"
      const fileExt = fileToUpload.name.split(".").pop();
      const filePath = `${item.short_name.toLowerCase()}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("consoles") // <-- Bucket corrigé
        .upload(filePath, fileToUpload, { upsert: true });

      if (uploadError) {
        console.error("Erreur Storage :", uploadError);
        return { success: false, error: uploadError.message };
      }

      // C. Récupération de la nouvelle URL publique
      const { data: urlData } = supabase.storage
        .from("consoles") // <-- Bucket corrigé
        .getPublicUrl(filePath);

      finalLogoUrl = urlData.publicUrl;
    }

    // 2. On retire 'file' et 'logo_file' de l'objet avant d'envoyer en BDD
    const { file, logo_file, ...cleanConsole } = item;

    cleanConsolesToUpsert.push({
      ...cleanConsole,
      logo_url: finalLogoUrl,
    });
  }

  // 3. Enregistrement en base de données
  const { data, error } = await supabase
    .from("consoles")
    .upsert(cleanConsolesToUpsert);

  if (error) {
    console.error("Erreur BDD :", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

"use client";

// 1. React & Hooks
import { useState, useEffect } from "react";

// 2. Icônes & Drag and Drop (DndKit)
import {
  Undo2,
  FilePlus,
  WandSparkles,
  Plus,
  X,
  LoaderCircle,
} from "lucide-react";

// 3. Composants UI & Layout
import LayoutFull from "@/components/layout/LayoutFull";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import FormError from "@/components/ui/FormError";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Combobox from "@/components/ui/Combobox";
import Textarea from "@/components/ui/Textarea";
import { toast } from "sonner";
import Tabs from "@/components/ui/Tabs";

// 4. Types & Utilitaires
import { Console } from "@/types/console";
import { useGamesContext } from "@/components/providers/GamesProvider";

// =========================================================================
// 2. COMPOSANT PRINCIPAL
// =========================================================================
export default function Consoles() {
  // --- A. Données du Context & États locaux ---
  // 1. Le State local pour garder en mémoire la console sélectionnée (initialisé à vide "")

  //Constances Inforations
  const [title, setTitle] = useState<string>("");
  const [selectedFranchise, setSelectedFranchise] = useState<string>("");
  const [selectedConsole, setSelectedConsole] = useState<string>("");
  const [selectedSupport, setSelectedSupport] = useState<string>("");
  const [youtubeId, setYoutubeId] = useState<string>("");

  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedPegi, setSelectedPegi] = useState<number>(3);
  const [estimatedPlaytime, setEstimatedPlaytime] = useState<number>(1);

  const [description, setDescription] = useState<string>("");

  //Constances Avis
  const [completedDate, setCompletedDate] = useState<string>("");
  const [playtime, setPlaytime] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");

  // 2. La constante contenant la liste des options pour le menu déroulant
  const pegiOptions = [
    { label: "3", value: "3" },
    { label: "7", value: "7" },
    { label: "12", value: "12" },
    { label: "16", value: "16" },
    { label: "18", value: "18" },
  ];

  const supportOptions = [
    { label: "Physique", value: "Physical" },
    { label: "Digital", value: "Digital" },
  ];
  // =========================================================================
  // 2. TRAITEMENT
  // =========================================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // --- C. Synchronisation initiale avec la BDD ---

  const sampleTabs = [
    {
      label: "Informations",
      content: (
        <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
          <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
              <Heading
                as="h2"
                size="md"
                className="font-semibold tracking-wide uppercase"
              >
                Contextes
              </Heading>
              <Button href="/administration" variant="secondary" size="xs">
                <WandSparkles className="w-5 h-5" />
              </Button>
            </div>
            <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                <div className="md:col-span-2">
                  <Input
                    label="Titre du jeu*"
                    placeholder="Le nom du jeu"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error=""
                  />
                </div>
                <div>
                  <Combobox
                    label="Franchise*"
                    options={pegiOptions}
                    selectedValue={selectedFranchise}
                    onChange={setSelectedFranchise}
                    error=""
                  />
                </div>
                <div>
                  <Combobox
                    label="Console*"
                    options={pegiOptions}
                    selectedValue={selectedConsole}
                    onChange={setSelectedConsole}
                    error=""
                  />
                </div>
                <div>
                  <Select
                    label="Support*"
                    options={supportOptions}
                    selectedValue={selectedSupport}
                    onChange={(val) => setSelectedSupport(val)}
                    error=""
                  />
                </div>
                <div>
                  <Input
                    label="Vidéo YoutubeID*"
                    placeholder="YoutubeID"
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    error=""
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2  mb-4">
                <div>
                  <Combobox
                    label="Développeur*"
                    options={supportOptions}
                    selectedValue={selectedDeveloper}
                    onChange={setSelectedDeveloper}
                    error=""
                  />
                </div>
                <div>
                  <Combobox
                    label="Langues*"
                    options={pegiOptions}
                    selectedValue={selectedLanguage}
                    onChange={setSelectedLanguage}
                    error=""
                  />
                </div>
                <div>
                  <Input
                    label="Date de sortie*"
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    error=""
                  />
                </div>
                <div>
                  <Combobox
                    label="Genre*"
                    options={pegiOptions}
                    selectedValue={selectedGenre}
                    onChange={setSelectedGenre}
                    error=""
                  />
                </div>
                <div>
                  <Select
                    label="PEGI*"
                    options={pegiOptions}
                    selectedValue={selectedPegi.toString()}
                    onChange={(val) => setSelectedPegi(Number(val))}
                    error=""
                  />
                </div>
                <div>
                  <Input
                    label="Temps de jeu estimé (en heures)*"
                    type="number"
                    min="1"
                    value={estimatedPlaytime}
                    onChange={(e) =>
                      setEstimatedPlaytime(Number(e.target.value))
                    }
                    error=""
                  />
                </div>
              </div>
              <div className="grid">
                <div>
                  <Textarea
                    label="Description*"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error=""
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
              <Heading
                as="h2"
                size="md"
                className="font-semibold tracking-wide uppercase"
              >
                Images
              </Heading>
            </div>
            <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
              <div className="grid gap-2 mb-4">
                <div>
                  <Input
                    label="Logo*"
                    type="file"
                    name="logo"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);

                        // 1. Pour la prévisualisation immédiate
                        //onUpdate(id, "logo_url", previewUrl);
                        // 2. Pour garder le fichier brut à envoyer à Supabase
                        //onUpdate(id, "file", file);
                      }
                    }}
                  />
                  {/*{logo ? (
                    <Image
                      src={logo}
                      alt={`Logo de ${Title}`}
                      width={32}
                      height={32}
                      className={`object-contain max-h-8  ${isBw === true && "dark:invert"}`}
                    />
                  ) : (
                    <span className="text-xs text-main/40 text-center leading-tight">
                      Aucun logo
                    </span>
                  )} */}
                </div>
                <div>
                  <Input
                    label="Cover*"
                    type="file"
                    name="cover"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);

                        // 1. Pour la prévisualisation immédiate
                        //onUpdate(id, "logo_url", previewUrl);
                        // 2. Pour garder le fichier brut à envoyer à Supabase
                        //onUpdate(id, "file", file);
                      }
                    }}
                  />
                  {/*{cover ? (
                    <Image
                      src={cover}
                      alt={`Bannière de ${Title}`}
                      width={32}
                      height={32}
                      className={`object-contain max-h-8  ${isBw === true && "dark:invert"}`}
                    />
                  ) : (
                    <span className="text-xs text-main/40 text-center leading-tight">
                      Aucune Cover
                    </span>
                  )} */}
                </div>
                <div>
                  <Input
                    label="Parallax*"
                    type="file"
                    name="parallax"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);

                        // 1. Pour la prévisualisation immédiate
                        //onUpdate(id, "logo_url", previewUrl);
                        // 2. Pour garder le fichier brut à envoyer à Supabase
                        //onUpdate(id, "file", file);
                      }
                    }}
                  />
                  {/*{parallax ? (
                    <Image
                      src={parallax}
                      alt={`Parallax de ${Title}`}
                      width={32}
                      height={32}
                      className={`object-contain max-h-8  ${isBw === true && "dark:invert"}`}
                    />
                  ) : (
                    <span className="text-xs text-main/40 text-center leading-tight">
                      Aucun parallax
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      label: "Avis",
      content: (
        <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
          <section className="w-full lg:w-1/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
              <Heading
                as="h2"
                size="md"
                className="font-semibold tracking-wide uppercase"
              >
                Contextes
              </Heading>
            </div>
            <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
              <div className="grid gap-2 mb-4">
                <div className="md:col-span-2">
                  <Input
                    label="Date de complétion"
                    type="date"
                    value={completedDate}
                    onChange={(e) => setCompletedDate(e.target.value)}
                    error=""
                  />
                  <div>
                    <Input
                      label="Temps de jeu (en heures)"
                      type="number"
                      min="1"
                      value={playtime?.toString()}
                      onChange={(e) => setPlaytime(Number(e.target.value))}
                      error=""
                    />
                  </div>
                  <div>
                    <Input
                      label="Note /10"
                      type="number"
                      min="0"
                      max="10"
                      value={score?.toString()}
                      onChange={(e) => setScore(Number(e.target.value))}
                      error=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
              <Heading
                as="h2"
                size="md"
                className="font-semibold tracking-wide uppercase"
              >
                Critiques
              </Heading>
            </div>
            <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
              <div className="grid md:grid-cols-2 gap-2 mb-4">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-main/10 ">
                    <div className="text-xs font-medium text-main/80 px-0.5 ">
                      Points forts
                    </div>
                    <Button
                      href="/administration"
                      variant="secondary"
                      size="xs"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <ul>
                    <li className="flex items-center justify-between gap-2 mb-2">
                      <Input
                        placeholder="Force"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error=""
                      />
                      <Button
                        href="/administration"
                        variant="secondary"
                        size="xs"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-main/10 ">
                    <div className="text-xs font-medium text-main/80 px-0.5 ">
                      Points faibles
                    </div>
                    <Button
                      href="/administration"
                      variant="secondary"
                      size="xs"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <ul>
                    <li className="flex items-center justify-between gap-2 mb-2">
                      <Input
                        placeholder="Faiblesse"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error=""
                      />
                      <Button
                        href="/administration"
                        variant="secondary"
                        size="xs"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </li>
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Bilan"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    error=""
                    rows={5}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },
  ];
  // =========================================================================
  // 4. RENDU UI (JSX)
  // =========================================================================
  return (
    <LayoutFull title="Ajout">
      <section className="w-full flex flex-col h-auto lg:h-full min-h-0 overflow-x-hidden">
        {/* En-tête */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 flex flex-col gap-4"
        >
          <Tabs items={sampleTabs} className="p-2" />

          {/* Pied de page (Message d'erreur & Boutons) */}
          <div className="flex flex-col px-2 lg:flex-shrink-0 pb-4">
            <div className="pt-2">
              <FormError message={"test"} />
            </div>

            <div className="w-full flex flex-row flex-wrap items-center justify-between gap-2 pt-4">
              <Button
                href="/administration"
                variant="secondary"
                icon={<Undo2 className="w-5 h-5" />}
              >
                Retour
              </Button>{" "}
              <Button
                type="submit"
                variant="secondary"
                icon={<FilePlus className="w-5 h-5" />}
              >
                Ajouter un jeu
              </Button>
            </div>
          </div>
        </form>
      </section>
    </LayoutFull>
  );
}

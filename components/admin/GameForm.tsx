"use client";

import { Game } from "@/types/game";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import FormError from "@/components/ui/FormError";
import Tabs from "@/components/ui/Tabs";
import { useGameForm } from "@/features/admin/useGameForm";
import { Undo2, FilePlus, WandSparkles, Plus, X, Save } from "lucide-react";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

export default function GameForm({ mode, editGame }: GameFormProps) {
  // =========================================================================
  // 1. HOOKS & OPTIONS LOCALES
  // =========================================================================
  const {
    title,
    selectedFranchise,
    selectedConsole,
    selectedSupport,
    youtubeId,
    selectedDeveloper,
    selectedLanguage,
    releaseDate,
    selectedGenre,
    selectedPegi,
    estimatedPlaytime,
    description,
    completedDate,
    playtime,
    score,
    pros,
    cons,
    summary,
    formError,
    setTitle,
    setSelectedFranchise,
    setSelectedConsole,
    setSelectedSupport,
    setYoutubeId,
    setSelectedDeveloper,
    setSelectedLanguage,
    setReleaseDate,
    setSelectedGenre,
    setSelectedPegi,
    setEstimatedPlaytime,
    setDescription,
    setCompletedDate,
    setPlaytime,
    setScore,
    setPros,
    setCons,
    setSummary,
    handleAddPro,
    handleUpdatePro,
    handleDeletePro,
    handleAddCon,
    handleUpdateCon,
    handleDeleteCon,
    handleSubmit,
  } = useGameForm({ mode, editGame });

  // Options temporaires pour les Select / Combobox
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
  // 3. STRUCTURE DES ONGLETS (TABS)
  // =========================================================================
  const formTabs = [
    {
      label: "Informations",
      content: (
        <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
          {/* Section Métadonnées */}
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
              {/* Ligne 1 : Titre, Franchise, Console, Support, Youtube */}
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

              {/* Ligne 2 : Développeur, Langue, Date, Genre, PEGI, Temps estimé */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
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

              {/* Ligne 3 : Description */}
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

          {/* Section Images */}
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
                        URL.createObjectURL(file);
                      }
                    }}
                  />
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
                        URL.createObjectURL(file);
                      }
                    }}
                  />
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
                        URL.createObjectURL(file);
                      }
                    }}
                  />
                  <div className="mt-2">
                    <Checkbox label="Tronqué ?" onChange={() => {}} />
                  </div>
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
          {/* Section Métriques Avis */}
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

          {/* Section Critique (Pros / Cons / Bilan) */}
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
                {/* Liste des Points Forts */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-main/10">
                    <div className="text-xs font-medium text-main/80 px-0.5">
                      Points forts
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={handleAddPro}
                      disabled={pros.some((pro) => pro.trim() === "")}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <ul>
                    {pros.map((proItem, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-2 mb-2"
                      >
                        <Input
                          placeholder="Force"
                          value={proItem}
                          onChange={(e) =>
                            handleUpdatePro(index, e.target.value)
                          }
                          error=""
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="xs"
                          onClick={() => handleDeletePro(index)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Liste des Points Faibles */}
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-main/10">
                    <div className="text-xs font-medium text-main/80 px-0.5">
                      Points faibles
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={handleAddCon}
                      disabled={cons.some((con) => con.trim() === "")}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <ul>
                    {cons.map((conItem, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-2 mb-2"
                      >
                        <Input
                          placeholder="Faiblesse"
                          value={conItem}
                          onChange={(e) =>
                            handleUpdateCon(index, e.target.value)
                          }
                          error=""
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="xs"
                          onClick={() => handleDeleteCon(index)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bilan Globale */}
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
  // 4. RENDU UI (FORMULAIRE)
  // =========================================================================
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 min-h-0 flex flex-col gap-4"
    >
      {/* 1. Les Onglets */}
      <Tabs items={formTabs} className="p-2" />

      {/* 2. Pied de page (Message d'erreur & Boutons) */}
      <div className="flex flex-col px-2 lg:flex-shrink-0 pb-4">
        {formError && (
          <div className="pt-2">
            <FormError message={formError} />
          </div>
        )}

        <div className="w-full flex flex-row flex-wrap items-center justify-between gap-2 pt-4">
          <Button
            href="/administration"
            variant="secondary"
            icon={<Undo2 className="w-5 h-5" />}
          >
            Retour
          </Button>

          <Button
            type="submit"
            variant="secondary"
            icon={
              mode === "insert" ? (
                <FilePlus className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )
            }
          >
            {mode === "insert"
              ? "Ajouter un jeu"
              : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </form>
  );
}

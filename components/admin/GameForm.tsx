"use client";

// =========================================================================
// 1. IMPORTS & TYPAGE
// =========================================================================
import { Game } from "@/types/game";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import FormError from "@/components/ui/FormError";
import Tabs from "@/components/ui/Tabs";
import ImageInput from "@/components/admin/ImageInput";
import { useGameForm } from "@/features/admin/useGameForm";
import {
  Undo2,
  FilePlus,
  WandSparkles,
  Plus,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";

interface GameFormProps {
  mode: "insert" | "update";
  editGame?: Game;
}

export default function GameForm({ mode, editGame }: GameFormProps) {
  // =========================================================================
  // 2. EXTRACTION DU HOOK (ÉSTATS, HANDLERS & ERREURS)
  // =========================================================================
  const {
    // --- A. Métadonnées ---
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

    // --- B. Images ---
    uploadCover,
    urlCover,
    uploadLogo,
    urlLogo,
    uploadParallax,
    urlParallax,
    parallaxTruncated,
    logoSourceType,
    coverSourceType,
    parallaxSourceType,

    // --- C. Avis & Critiques ---
    completedDate,
    playtime,
    score,
    pros,
    cons,
    summary,

    // --- D. Options dynamiques des listes ---
    OPTIONS_PEGI,
    OPTIONS_SUPPORT,
    franchiseOptions,
    consoleOptions,
    developerOptions,
    languageOptions,
    genreOptions,

    // --- E. Gestion des Erreurs ---
    formError,
    fieldErrors,
    isSaving,

    // --- F. AI ---
    isGeneratingAI,
    fieldAIGenerated,

    // --- G. Setters ---
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
    setUploadCover,
    setUrlCover,
    setUploadLogo,
    setUrlLogo,
    setUploadParallax,
    setUrlParallax,
    setParallaxTruncated,
    setLogoSourceType,
    setCoverSourceType,
    setParallaxSourceType,
    setCompletedDate,
    setPlaytime,
    setScore,
    setPros,
    setCons,
    setIsGeneratingAI,
    setSummary,

    // --- G. Handlers d'actions ---
    clearField,
    handleAddPro,
    handleUpdatePro,
    handleDeletePro,
    handleAddCon,
    handleUpdateCon,
    handleDeleteCon,
    handleGenerateAI,
    handleSubmit,
  } = useGameForm({ mode, editGame });

  // =========================================================================
  // 3. STRUCTURE DES ONGLETS (TABS)
  // =========================================================================
  const formTabs = [
    // -----------------------------------------------------------------------
    // ONGLET 1 : INFORMATIONS (MÉTADONNÉES & IMAGES)
    // -----------------------------------------------------------------------
    {
      label: "Informations",
      content: (
        <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
          {/* Bloc A : Métadonnées du jeu */}
          <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
              <Heading
                as="h2"
                size="md"
                className="font-semibold tracking-wide uppercase"
              >
                Contextes
              </Heading>
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI || !title.trim()}
                title="Remplir automatiquement les champs avec Gemini IA"
              >
                {isGeneratingAI ? (
                  <LoaderCircle className="w-5 h-5 animate-spin text-main" />
                ) : (
                  <WandSparkles className="w-5 h-5" />
                )}
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
                    onChange={(e) => {
                      setTitle(e.target.value);
                      clearField("title");
                    }}
                    error={fieldErrors.title}
                  />
                </div>
                <div>
                  <Combobox
                    label="Franchise*"
                    options={franchiseOptions}
                    selectedValue={selectedFranchise}
                    onChange={(val) => {
                      setSelectedFranchise(val);
                      clearField("selectedFranchise");
                    }}
                    error={fieldErrors.selectedFranchise}
                    isAi={!!fieldAIGenerated.selectedFranchise}
                  />
                </div>
                <div>
                  <Combobox
                    label="Console*"
                    options={consoleOptions}
                    selectedValue={selectedConsole}
                    onChange={(val) => {
                      setSelectedConsole(val);
                      clearField("selectedConsole");
                    }}
                    error={fieldErrors.selectedConsole}
                    isAi={!!fieldAIGenerated.selectedConsole}
                  />
                </div>
                <div>
                  <Select
                    label="Support*"
                    options={OPTIONS_SUPPORT}
                    selectedValue={selectedSupport}
                    onChange={(val) => {
                      setSelectedSupport(val);
                      clearField("selectedSupport");
                    }}
                    error={fieldErrors.selectedSupport}
                    isAi={!!fieldAIGenerated.selectedSupport}
                  />
                </div>
                <div>
                  <Input
                    label="Vidéo YoutubeID*"
                    placeholder="YoutubeID"
                    value={youtubeId}
                    onChange={(e) => {
                      setYoutubeId(e.target.value);
                      clearField("youtubeId");
                    }}
                    error={fieldErrors.youtubeId}
                    isAi={!!fieldAIGenerated.youtubeId}
                  />
                </div>
              </div>

              {/* Ligne 2 : Développeur, Langue, Date, Genre, PEGI, Temps estimé */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                <div>
                  <Combobox
                    label="Développeur*"
                    options={developerOptions}
                    selectedValue={selectedDeveloper}
                    onChange={(val) => {
                      setSelectedDeveloper(val);
                      clearField("selectedDeveloper");
                    }}
                    error={fieldErrors.selectedDeveloper}
                    isAi={!!fieldAIGenerated.selectedDeveloper}
                  />
                </div>
                <div>
                  <Combobox
                    label="Langues*"
                    options={languageOptions}
                    selectedValue={selectedLanguage}
                    onChange={(val) => {
                      setSelectedLanguage(val);
                      clearField("selectedLanguage");
                    }}
                    error={fieldErrors.selectedLanguage}
                    isAi={!!fieldAIGenerated.selectedLanguage}
                  />
                </div>
                <div>
                  <Input
                    label="Date de sortie*"
                    type="month"
                    value={releaseDate}
                    onChange={(e) => {
                      setReleaseDate(e.target.value);
                      clearField("releaseDate");
                    }}
                    error={fieldErrors.releaseDate}
                    isAi={!!fieldAIGenerated.releaseDate}
                  />
                </div>
                <div>
                  <Combobox
                    label="Genre*"
                    options={genreOptions}
                    selectedValue={selectedGenre}
                    onChange={(val) => {
                      setSelectedGenre(val);
                      clearField("selectedGenre");
                    }}
                    error={fieldErrors.selectedGenre}
                    isAi={!!fieldAIGenerated.selectedGenre}
                  />
                </div>
                <div>
                  <Select
                    label="PEGI*"
                    options={OPTIONS_PEGI}
                    selectedValue={selectedPegi.toString()}
                    onChange={(val) => {
                      setSelectedPegi(Number(val));
                      clearField("selectedPegi");
                    }}
                    error={fieldErrors.selectedPegi}
                    isAi={!!fieldAIGenerated.selectedPegi}
                  />
                </div>
                <div>
                  <Input
                    label="Temps de jeu estimé (en heures)*"
                    type="number"
                    min="1"
                    value={estimatedPlaytime}
                    onChange={(e) => {
                      setEstimatedPlaytime(Number(e.target.value));
                      clearField("estimatedPlaytime");
                    }}
                    error={fieldErrors.estimatedPlaytime}
                    isAi={!!fieldAIGenerated.estimatedPlaytime}
                  />
                </div>
              </div>

              {/* Ligne 3 : Description */}
              <div className="grid">
                <div>
                  <Textarea
                    label="Description*"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      clearField("description");
                    }}
                    error={fieldErrors.description}
                    isAi={!!fieldAIGenerated.description}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Bloc B : Gestion des Visuels */}
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
                  <ImageInput
                    label="Logo*"
                    uploadFile={uploadLogo}
                    onUploadChange={(file) => {
                      setUploadLogo(file);
                      clearField("logo");
                    }}
                    urlValue={urlLogo}
                    onUrlChange={(url) => {
                      setUrlLogo(url);
                      clearField("logo");
                    }}
                    sourceType={logoSourceType}
                    onSourceTypeChange={setLogoSourceType}
                    error={fieldErrors.logo}
                  />
                </div>
                <div>
                  <ImageInput
                    label="Cover*"
                    uploadFile={uploadCover}
                    onUploadChange={(file) => {
                      setUploadCover(file);
                      clearField("cover");
                    }}
                    urlValue={urlCover}
                    onUrlChange={(url) => {
                      setUrlCover(url);
                      clearField("cover");
                    }}
                    sourceType={coverSourceType}
                    onSourceTypeChange={setCoverSourceType}
                    error={fieldErrors.cover}
                  />
                </div>
                <div>
                  <ImageInput
                    label="Parallax*"
                    uploadFile={uploadParallax}
                    onUploadChange={(file) => {
                      setUploadParallax(file);
                      clearField("parallax");
                    }}
                    urlValue={urlParallax}
                    onUrlChange={(url) => {
                      setUrlParallax(url);
                      clearField("parallax");
                    }}
                    sourceType={parallaxSourceType}
                    onSourceTypeChange={setParallaxSourceType}
                    showTruncateCheckbox
                    isTruncated={parallaxTruncated}
                    onTruncateChange={setParallaxTruncated}
                    error={fieldErrors.parallax}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      ),
    },

    // -----------------------------------------------------------------------
    // ONGLET 2 : AVIS (MÉTRIQUES, POINTS FORTS/FAIBLES & BILAN)
    // -----------------------------------------------------------------------
    {
      label: "Avis",
      content: (
        <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
          {/* Bloc A : Métriques de complétion */}
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
              <div className="grid gap-4 mb-4">
                <Input
                  label="Date de complétion"
                  type="month"
                  value={completedDate}
                  onChange={(e) => {
                    setCompletedDate(e.target.value);
                    clearField("completedDate");
                  }}
                  error={fieldErrors.completedDate}
                />

                <Input
                  label="Temps de jeu (en heures)"
                  type="number"
                  min="1"
                  value={playtime?.toString() || ""}
                  onChange={(e) => {
                    setPlaytime(
                      e.target.value === "" ? null : Number(e.target.value),
                    );
                    clearField("playtime");
                  }}
                  error={fieldErrors.playtime}
                />

                <Input
                  label="Note /10"
                  type="number"
                  min="0"
                  max="10"
                  value={score?.toString() || ""}
                  onChange={(e) => {
                    setScore(
                      e.target.value === "" ? null : Number(e.target.value),
                    );
                    clearField("score");
                  }}
                  error={fieldErrors.score}
                />
              </div>
            </div>
          </section>

          {/* Bloc B : Critiques rédigées */}
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
                {/* Liste dynamique des Points Forts */}
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

                {/* Liste dynamique des Points Faibles */}
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

                {/* Bilan Global */}
                <div className="md:col-span-2">
                  <Textarea
                    label="Bilan"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    error={fieldErrors.summary}
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
  // 4. RENDU UI (FORMULAIRE & ACTION BAR)
  // =========================================================================
  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 min-h-0 flex flex-col gap-4"
    >
      {/* 1. Onglets principaux */}
      <Tabs items={formTabs} className="p-2" />

      {/* 2. Pied de page (Erreurs globales & Actions) */}
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
            disabled={isGeneratingAI || isSaving}
            icon={
              isSaving ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : mode === "insert" ? (
                <FilePlus className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )
            }
          >
            {isSaving
              ? "Enregistrement..."
              : mode === "insert"
                ? "Ajouter un jeu"
                : "Editer"}
          </Button>
        </div>
      </div>
    </form>
  );
}

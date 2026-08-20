"use client";

import Link from "next/link";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import ImageInput from "@/components/admin/ImageInput";
import { WandSparkles, LoaderCircle } from "lucide-react";

import { useGameInformations } from "@/features/admin/gameForm/useGameInformations";
import { useGameImages } from "@/features/admin/gameForm/useGameImages";
import { useGameAI } from "@/features/admin/gameForm/useGameAI";

interface TabInformationsProps {
  /** Gestion des métadonnées (titre, console, éditeur, etc.) */
  info: ReturnType<typeof useGameInformations>;
  /** Gestion des visuels (cover, logo, parallax) */
  img: ReturnType<typeof useGameImages>;
  /** Gestion de la génération automatique via IA */
  ai: ReturnType<typeof useGameAI>;
  /** Dictionnaire plat contenant les erreurs de validation */
  fieldErrors: Record<string, string>;
  /** Nettoyage d'une erreur lorsqu'un champ est modifié */
  clearField: (fieldKey: string) => void;
  /** Fonction pour l'agent IA */
  handleGenerateAI: () => void;
}

// =========================================================================
//  COMPOSANT VISUEL : ONGLET INFORMATIONS
// =========================================================================
export default function TabInformations({
  info,
  img,
  ai,
  fieldErrors,
  clearField,
  handleGenerateAI,
}: TabInformationsProps) {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
      {/* -----------------------------------------------------------------
          BLOC A : MÉTADONNÉES DU JEU
         ----------------------------------------------------------------- */}
      <section className="w-full lg:w-3/4 flex flex-col h-auto lg:h-full min-h-0 flex-shrink-0">
        {/* En-tête du bloc A avec déclencheur IA */}
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
            disabled={ai.isGeneratingAI || !info.title.trim()}
            title="Remplir automatiquement les champs avec Gemini IA"
          >
            {ai.isGeneratingAI ? (
              <LoaderCircle className="w-5 h-5 animate-spin text-main" />
            ) : (
              <WandSparkles className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Formulaire défilant */}
        <div className="pr-2 pt-4 gap-4 text-main lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
          {/* Ligne 1 : Titre, Franchise, Console, Support, Youtube */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            <div className="md:col-span-2">
              <Input
                label="Titre du jeu*"
                placeholder="Le nom du jeu"
                value={info.title}
                onChange={(e) => {
                  info.setTitle(e.target.value);
                  clearField("title");
                }}
                error={fieldErrors.title}
              />
            </div>
            <div>
              <Combobox
                label="Franchise*"
                options={info.franchiseOptions}
                selectedValue={info.selectedFranchise}
                onChange={(val) => {
                  info.setSelectedFranchise(val);
                  clearField("selectedFranchise");
                }}
                error={fieldErrors.selectedFranchise}
                isAi={!!ai.fieldAIGenerated.selectedFranchise}
              />
            </div>
            <div>
              <Combobox
                label="Console*"
                options={info.consoleOptions}
                selectedValue={info.selectedConsole}
                onChange={(val) => {
                  info.setSelectedConsole(val);
                  clearField("selectedConsole");
                }}
                error={fieldErrors.selectedConsole}
                isAi={!!ai.fieldAIGenerated.selectedConsole}
              />
            </div>
            <div>
              <Select
                label="Support*"
                options={info.OPTIONS_SUPPORT}
                selectedValue={info.selectedSupport}
                onChange={(val) => {
                  info.setSelectedSupport(val);
                  clearField("selectedSupport");
                }}
                error={fieldErrors.selectedSupport}
                isAi={!!ai.fieldAIGenerated.selectedSupport}
              />
            </div>
            <div>
              <Input
                label="Vidéo YoutubeID*"
                placeholder="YoutubeID"
                value={info.youtubeId}
                onChange={(e) => {
                  info.setYoutubeId(e.target.value);
                  clearField("youtubeId");
                }}
                error={fieldErrors.youtubeId}
                isAi={!!ai.fieldAIGenerated.youtubeId}
              />

              {info.youtubeId ? (
                <Link
                  href={`https://www.youtube.com/watch?v=${info.youtubeId}`}
                  className="text-xs text-main/80 hover:underline"
                  target="_blank"
                >
                  (Lien)
                </Link>
              ) : null}
            </div>
          </div>

          {/* Ligne 2 : Développeur, Langue, Date, Genre, PEGI, Temps estimé */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            <div>
              <Combobox
                label="Développeur*"
                options={info.developerOptions}
                selectedValue={info.selectedDeveloper}
                onChange={(val) => {
                  info.setSelectedDeveloper(val);
                  clearField("selectedDeveloper");
                }}
                error={fieldErrors.selectedDeveloper}
                isAi={!!ai.fieldAIGenerated.selectedDeveloper}
              />
            </div>
            <div>
              <Combobox
                label="Langues*"
                options={info.languageOptions}
                selectedValue={info.selectedLanguage}
                onChange={(val) => {
                  info.setSelectedLanguage(val);
                  clearField("selectedLanguage");
                }}
                error={fieldErrors.selectedLanguage}
                isAi={!!ai.fieldAIGenerated.selectedLanguage}
              />
            </div>
            <div>
              <Input
                label="Date de sortie*"
                type="month"
                value={info.releaseDate}
                onChange={(e) => {
                  info.setReleaseDate(e.target.value);
                  clearField("releaseDate");
                }}
                error={fieldErrors.releaseDate}
                isAi={!!ai.fieldAIGenerated.releaseDate}
              />
            </div>
            <div>
              <Combobox
                label="Genre*"
                options={info.genreOptions}
                selectedValue={info.selectedGenre}
                onChange={(val) => {
                  info.setSelectedGenre(val);
                  clearField("selectedGenre");
                }}
                error={fieldErrors.selectedGenre}
                isAi={!!ai.fieldAIGenerated.selectedGenre}
              />
            </div>
            <div>
              <Select
                label="PEGI*"
                options={info.OPTIONS_PEGI}
                selectedValue={info.selectedPegi.toString()}
                onChange={(val) => {
                  info.setSelectedPegi(Number(val));
                  clearField("selectedPegi");
                }}
                error={fieldErrors.selectedPegi}
                isAi={!!ai.fieldAIGenerated.selectedPegi}
              />
            </div>
            <div>
              <Input
                label="Temps de jeu estimé (en heures)*"
                type="number"
                min="1"
                value={info.estimatedPlaytime}
                onChange={(e) => {
                  info.setEstimatedPlaytime(Number(e.target.value));
                  clearField("estimatedPlaytime");
                }}
                error={fieldErrors.estimatedPlaytime}
                isAi={!!ai.fieldAIGenerated.estimatedPlaytime}
              />
            </div>
          </div>

          {/* Ligne 3 : Description */}
          <div className="grid">
            <div>
              <Textarea
                label="Description*"
                value={info.description}
                onChange={(e) => {
                  info.setDescription(e.target.value);
                  clearField("description");
                }}
                error={fieldErrors.description}
                isAi={!!ai.fieldAIGenerated.description}
                rows={6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------
          BLOC B : GESTION DES VISUELS
         ----------------------------------------------------------------- */}
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
                uploadFile={img.uploadLogo}
                onUploadChange={(file) => {
                  img.setUploadLogo(file);
                  clearField("logo");
                }}
                urlValue={img.urlLogo}
                onUrlChange={(url) => {
                  img.setUrlLogo(url);
                  clearField("logo");
                }}
                initialUrl={img.initialImages?.logo}
                sourceType={img.logoSourceType}
                onSourceTypeChange={img.setLogoSourceType}
                error={fieldErrors.logo}
              />
            </div>
            <div>
              <ImageInput
                label="Cover*"
                uploadFile={img.uploadCover}
                onUploadChange={(file) => {
                  img.setUploadCover(file);
                  clearField("cover");
                }}
                urlValue={img.urlCover}
                onUrlChange={(url) => {
                  img.setUrlCover(url);
                  clearField("cover");
                }}
                initialUrl={img.initialImages?.cover}
                sourceType={img.coverSourceType}
                onSourceTypeChange={img.setCoverSourceType}
                error={fieldErrors.cover}
              />
            </div>
            <div>
              <ImageInput
                label="Parallax*"
                uploadFile={img.uploadParallax}
                onUploadChange={(file) => {
                  img.setUploadParallax(file);
                  clearField("parallax");
                }}
                urlValue={img.urlParallax}
                onUrlChange={(url) => {
                  img.setUrlParallax(url);
                  clearField("parallax");
                }}
                initialUrl={img.initialImages?.parallax?.url}
                sourceType={img.parallaxSourceType}
                onSourceTypeChange={img.setParallaxSourceType}
                showTruncateCheckbox
                isTruncated={img.parallaxTruncated}
                onTruncateChange={img.setParallaxTruncated}
                error={fieldErrors.parallax}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

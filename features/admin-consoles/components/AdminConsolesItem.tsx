import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

interface AdminConsolesItemProps {
  id: number;
  shortName: string;
  fullName?: string;
  logoUrl?: string;
  isBw: boolean;
  showErrors?: boolean;
  onUpdate: (id: number, field: string, value: string | boolean | File) => void;
}

export default function AdminConsolesItem({
  id,
  shortName,
  fullName,
  logoUrl,
  isBw,
  onUpdate,
  showErrors,
}: AdminConsolesItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-3 ${isDragging ? "rounded-xl opacity-50 z-50 shadow-[0_0_15px_2px_var(--color-secondary)]" : ""}`}
    >
      <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-main/10 bg-background/20 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_15px_2px_var(--color-secondary)]">
        {/* 1. POIGNÉE DE GLISSEMENT (GRIP) */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Déplacer la console"
          className="cursor-grab active:cursor-grabbing p-1 text-main/40 hover:text-main focus:outline-none touch-none shrink-0"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* 2. GRILLE DE FORMULAIRE RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-start flex-1">
          {/* Diminutif (ex: PS5) */}
          <div className="lg:col-span-2">
            <Input
              label="Diminutif*"
              placeholder="ex: PS5"
              value={shortName}
              onChange={(e) => onUpdate(id, "short_name", e.target.value)}
              error={showErrors && !shortName.trim() ? "Requis" : false}
            />
          </div>

          {/* Nom complet */}
          <div className="lg:col-span-3">
            <Input
              label="Nom complet"
              placeholder="ex: PlayStation 5"
              value={fullName ?? ""}
              onChange={(e) => onUpdate(id, "full_name", e.target.value)}
            />
          </div>

          {/* Upload Fichier */}
          <div className="lg:col-span-4">
            <Input
              label="Logo de la console"
              type="file"
              name="logo"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);

                  // 1. Pour la prévisualisation immédiate
                  onUpdate(id, "logo_url", previewUrl);
                  // 2. Pour garder le fichier brut à envoyer à Supabase
                  onUpdate(id, "file", file);
                }
              }}
            />
          </div>

          {/* Checkbox N/B */}
          <div className="lg:col-span-2 pt-2 sm:pt-0">
            <Checkbox
              label="N/B ?"
              checked={isBw}
              onChange={(checked) => onUpdate(id, "is_bw", checked)}
            />
          </div>

          {/* Prévisualisation Logo */}
          <div className="lg:col-span-1 flex self-center justify-center sm:pt-0">
            <div className="w-12 h-12 relative flex items-center justify-center p-1">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={shortName}
                  width={48}
                  height={48}
                  sizes="64px"
                  // logoUrl est une blob: URL tant que le nouveau fichier n'a pas été uploadé sur Supabase
                  className={`object-contain max-h-8 ${logoUrl.startsWith("blob:") ? "border-2 border-emerald-500 rounded" : ""} ${isBw === true && "dark:invert"}`}
                />
              ) : (
                <span className="text-xs text-main/40 text-center leading-tight">
                  Aucun logo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

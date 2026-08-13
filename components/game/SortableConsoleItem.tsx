import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

interface SortableConsoleItemProps {
  id: number;
  name: string;
}

export default function SortableConsoleItem({
  id,
  name,
}: SortableConsoleItemProps) {
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
      className={`mb-3  ${isDragging ? " rounded-xl opacity-50 z-50 shadow-[0_0_15px_2px_var(--color-secondary)]" : ""}`}
    >
      <div className="flex items-center gap-3 p-3 sm:p-4  rounded-xl border border-main/10 bg-background/20 backdrop-blur-sm transition-all duration-300  hover:shadow-[0_0_15px_2px_var(--color-secondary)]">
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
              defaultValue="PS5"
            />
          </div>

          {/* Nom complet */}
          <div className="lg:col-span-4">
            <Input
              label="Nom complet*"
              placeholder="ex: PlayStation 5"
              defaultValue={name}
            />
          </div>

          {/* Upload Fichier */}
          <div className="lg:col-span-3">
            <Input
              label="Logo de la console*"
              type="file"
              id={`logo-${id}`}
              name="logo"
              accept="image/png, image/jpeg, image/webp"
            />
          </div>

          {/* Prévisualisation Logo */}
          <div className="lg:col-span-1 flex self-start justify-center sm:pt-0">
            <div className="w-10 h-10 relative flex items-center justify-center p-1">
              <Image
                src="/icons/console/ps5.webp"
                alt={name}
                width={32}
                height={32}
                className="object-contain max-h-8"
              />
            </div>
          </div>

          {/* Checkbox N/B */}
          <div className="lg:col-span-2 pt-2 sm:pt-0">
            <Checkbox label="N/B ?" />
          </div>
        </div>
      </div>
    </div>
  );
}

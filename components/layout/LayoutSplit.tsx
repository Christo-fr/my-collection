import ParallaxCharacter from "@/components/layout/ParallaxCharacter";
import { ParallaxImage } from "@/types/game";

export interface SplitLayoutProps {
  children: React.ReactNode;
  image: ParallaxImage;
  className?: string;
}

export default function LayoutSplit({
  children,
  image,
  className = "",
}: SplitLayoutProps) {
  return (
    <div className="relative w-full h-full flex justify-between px-12 py-8 gap-8">
      {/* ========================================================================
        ZONE GAUCHE (50%) : Catalogue de nos composants UI
        ========================================================================
      */}
      {/* ZONE GAUCHE (50% desktop, 100% mobile avec scroll natif) */}
      <div
        className={`w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)] pr-4 space-y-8 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent] ${className}`}
      >
        {children}
      </div>

      {/* ========================================================================
        ZONE DROITE (50%) : Personnage d'ambiance avec effet Parallaxe
        ========================================================================
      */}
      <div className="hidden lg:block w-1/2 h-full relative">
        <ParallaxCharacter image={image} />
      </div>
    </div>
  );
}

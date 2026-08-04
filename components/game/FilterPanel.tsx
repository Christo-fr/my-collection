import { ReactNode } from "react";

interface FilterPanelProps {
  title?: string;
  children: ReactNode;
}

export default function FilterPanel({
  title = "Filtres",
  children,
}: FilterPanelProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
        <h2 className="text-lg font-semibold tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="space-y-4 px-2 py-4 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(255,255,255,0.3)_transparent]">
        {children}
      </div>
    </>
  );
}

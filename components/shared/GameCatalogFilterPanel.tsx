import Heading from "@/components/ui/Heading";
interface GameCatalogFilterPanelProps {
  title?: string;
  children: React.ReactNode;
}

export default function GameCatalogFilterPanel({
  title = "Filtres",
  children,
}: GameCatalogFilterPanelProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-main/10 px-2 lg:h-12 flex-shrink-0">
        <Heading
          as="h2"
          size="md"
          className="font-semibold tracking-wide uppercase"
        >
          {title}
        </Heading>
      </div>
      <div className="space-y-4 px-2 py-4 lg:flex-1 lg:overflow-y-auto [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:hover:[scrollbar-color:var(--color-scrollbar)_transparent]">
        {children}
      </div>
    </>
  );
}

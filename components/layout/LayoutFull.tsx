import Heading from "@/components/ui/Heading";

export interface SplitLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export default function LayoutFull({
  children,
  title,
  className = "",
}: SplitLayoutProps) {
  return (
    <div
      className={`relative w-full h-full flex flex-col px-6 md:px-12 pt-4 pb-18 gap-4  ${className}`}
    >
      {/* Titre principal */}
      <Heading as="h1" size="xl">
        {title}
      </Heading>

      {/* Conteneur principal flex */}
      <div className="w-full flex flex-col lg:flex-row gap-4 flex-1 min-h-0 p-2 rounded-xl border border-main/10  bg-gradient-to-br from-[var(--color-secondary)]/40 via-background/30 to-background/70">
        {children}
      </div>
    </div>
  );
}

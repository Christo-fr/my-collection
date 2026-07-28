import { Description as HeadlessDescription } from "@headlessui/react";

export interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Description({
  description,
  children,
  className = "",
  ...props
}: DescriptionProps) {
  return (
    <HeadlessDescription className={`text-xs ${className}`} {...props}>
      {/* 
        Valeur de secours (Fallback) : 
        Affiche 'children' en priorité s'il est fourni (enfants JSX), 
        sinon retombe sur la prop 'description' (chaîne de caractères).
      */}
      {children || description}
    </HeadlessDescription>
  );
}

import { Label as HeadlessLabel } from "@headlessui/react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Label({
  label,
  children,
  className = "",
  ...props
}: LabelProps) {
  return (
    <HeadlessLabel
      className={`text-xs font-medium text-main/80 px-0.5 ${className}`}
      {...props}
    >
      {/* 
        Valeur de secours (Fallback) : 
        Affiche 'children' en priorité s'il est fourni (enfants JSX), 
        sinon retombe sur la prop 'label' (chaîne de caractères).
      */}
      {children || label}
    </HeadlessLabel>
  );
}

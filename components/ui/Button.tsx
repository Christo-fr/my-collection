import Link from "next/link";
import { Button as HeadlessButton } from "@headlessui/react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  icon,
  className = "",
}: ButtonProps) {
  // 1. Styles de base
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 select-none cursor-pointer";

  // 2. Variantes de couleurs
  const variantStyles = {
    primary: "bg-primary text-background hover:opacity-90 shadow-md",
    secondary:
      "border border-primary/30 text-main hover:bg-primary/10 backdrop-blur-md",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  // 3. Si c'est un lien de navigation Next.js
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {icon && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  // 4. Si c'est un bouton d'action Headless UI
  return (
    <HeadlessButton onClick={onClick} className={combinedClasses}>
      {icon && <span>{icon}</span>}
      {children}
    </HeadlessButton>
  );
}

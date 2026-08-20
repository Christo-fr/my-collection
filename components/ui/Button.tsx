import { forwardRef } from "react";
import Link from "next/link";
import { Button as HeadlessButton } from "@headlessui/react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "xs";
  title?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      href,
      onClick,
      icon,
      size = "md",
      className = "",
      title,
      type = "button",
      disabled = false,
    },
    ref,
  ) => {
    // 1. Styles de base
    // Tailwind ne détecte que des classes littérales : on ne peut pas construire le préfixe hover dynamiquement,
    // donc on écrit les deux variantes (lien / bouton) en toutes lettres.
    // `:enabled` ne matche pas les <a> (Link), d'où la distinction.
    const baseStyles = href
      ? "uppercase inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 select-none cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
      : "uppercase inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 select-none cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none";

    // 2. Variantes de couleurs
    const variantStyles = {
      primary: href
        ? "bg-primary text-background shadow-md hover:bg-primary/85"
        : "bg-primary text-background shadow-md enabled:hover:bg-primary/85",
      secondary: href
        ? "border border-primary/30 text-main backdrop-blur-md hover:bg-primary hover:text-background hover:border-primary"
        : "border border-primary/30 text-main backdrop-blur-md enabled:hover:bg-primary enabled:hover:text-background enabled:hover:border-primary",
    };

    const sizeStyles = {
      xs: "text-sm px-1.25 py-1.25 rounded-sm",
      sm: "text-sm px-2.5 py-1.5 rounded-md",
      md: "font-medium px-5 py-2.5 rounded-xl",
    };

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    // 3. Si c'est un lien de navigation Next.js
    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={combinedClasses}
          title={title}
        >
          {icon && <span>{icon}</span>}
          {children}
        </Link>
      );
    }

    // 4. Si c'est un bouton d'action Headless UI
    return (
      <HeadlessButton
        type={type}
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        className={combinedClasses}
        title={title}
        disabled={disabled}
      >
        {icon && <span>{icon}</span>}
        {children}
      </HeadlessButton>
    );
  },
);

Button.displayName = "Button";

export default Button;

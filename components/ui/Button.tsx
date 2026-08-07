import { forwardRef } from "react";
import Link from "next/link";
import { Button as HeadlessButton } from "@headlessui/react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
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
    },
    ref,
  ) => {
    // 1. Styles de base
    const baseStyles =
      "uppercase inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 select-none cursor-pointer";

    // 2. Variantes de couleurs
    const variantStyles = {
      primary: "bg-primary text-background hover:opacity-90 shadow-md",
      secondary:
        "border border-primary/30 text-main hover:bg-primary/10 backdrop-blur-md",
    };

    const sizeStyles = {
      sm: "text-sm px-2.5 py-1.5",
      md: "font-medium px-5 py-2.5",
    };

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    // 3. Si c'est un lien de navigation Next.js
    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={combinedClasses}
        >
          {icon && <span>{icon}</span>}
          {children}
        </Link>
      );
    }

    // 4. Si c'est un bouton d'action Headless UI
    return (
      <HeadlessButton
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        className={combinedClasses}
      >
        {icon && <span>{icon}</span>}
        {children}
      </HeadlessButton>
    );
  },
);

Button.displayName = "Button";

export default Button;

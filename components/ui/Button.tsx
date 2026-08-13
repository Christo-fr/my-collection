import { forwardRef } from "react";
import Link from "next/link";
import { Button as HeadlessButton } from "@headlessui/react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "xs";
  title?: string;
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
      title,
    },
    ref,
  ) => {
    // 1. Styles de base
    const baseStyles =
      "uppercase inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-300 select-none cursor-pointer hover:bg-gradient-to-br hover:from-[var(--color-grad-gacha-end)] hover:to-transparent hover:to-[40%] ";
    // 2. Variantes de couleurs
    const variantStyles = {
      primary: "bg-primary text-background hover:opacity-90 shadow-md",
      secondary:
        "border border-primary/30 text-main hover:bg-primary/10 backdrop-blur-md",
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
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        className={combinedClasses}
        title={title}
      >
        {icon && <span>{icon}</span>}
        {children}
      </HeadlessButton>
    );
  },
);

Button.displayName = "Button";

export default Button;

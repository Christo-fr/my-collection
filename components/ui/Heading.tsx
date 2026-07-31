export interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children?: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  "3xl": "text-4xl md:text-5xl font-extrabold tracking-tight",
  "2xl": "text-3xl md:text-4xl font-bold",
  xl: "text-2xl md:text-3xl font-bold",
  lg: "text-xl md:text-2xl font-semibold",
  md: "text-lg font-semibold",
  sm: "text-base font-medium",
};

// On extrait la prop 'as' (ou 'balise') et on la renomme en 'Tag' (avec une majuscule)
export default function Heading({
  as: Tag = "h2",
  children,
  size = "xl",
  className = "",
}: HeadingProps) {
  return (
    <Tag className={`font-jewels text-main ${sizeStyles[size]} ${className}`}>
      {children}
    </Tag>
  );
}

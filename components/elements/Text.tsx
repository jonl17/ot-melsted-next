import { ReactNode } from "react";

type TextVariant = "huge" | "large" | "large-mobile" | "medium" | "small";
type TextColor = "gray" | "lightgray" | "darkgray" | "white" | "black";
type TextFont = "untitled" | "untitled-medium";
type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  font?: TextFont;
  as?: TextElement;
  className?: string;
}

export default function Text({
  children,
  variant = "medium",
  color = "white",
  font = "untitled",
  as = "p",
  className = "",
}: TextProps) {
  const Component = as;

  const variantClasses: Record<TextVariant, string> = {
    huge: "text-huge",
    large: "text-large",
    "large-mobile": "text-large-mobile",
    medium: "text-medium",
    small: "text-small",
  };

  const colorClasses: Record<TextColor, string> = {
    gray: "text-gray",
    lightgray: "text-lightgray",
    darkgray: "text-darkgray",
    white: "text-white",
    black: "text-black",
  };

  const fontClasses: Record<TextFont, string> = {
    untitled: "font-family-untitled",
    "untitled-medium": "font-family-untitled-medium",
  };

  const classes = [
    variantClasses[variant],
    colorClasses[color],
    fontClasses[font],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes}>{children}</Component>;
}

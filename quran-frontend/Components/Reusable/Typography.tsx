import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "small";
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-bold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight text-text-color",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  span: "text-sm font-medium leading-none",
  small: "text-sm font-medium leading-none text-muted-foreground",
};

export default function Typography({
  variant = "p",
  children,
  className,
}: TypographyProps) {
  // Determine which HTML tag to render
  const Component = variant.startsWith("h") ? variant : variant === "small" ? "small" : variant === "span" ? "span" : "p";

  return (
    <Component className={cn(variantConfig[variant], className)}>
      {children}
    </Component>
  );
}
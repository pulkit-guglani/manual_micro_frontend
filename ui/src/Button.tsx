import * as React from "react";
import type { ReactElement } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";
import "./globals.css";

// Button design tokens – classes ported from the reference component supplied by the user.
// The component keeps the same Radix Slot / cva based API but the underlying classes,
// colours, paddings and margins were aligned to the new redrob-ai design system.

const buttonVariants = cva(
  // Root (common) classes
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg select-none transition-all duration-200 ease-in-out disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      // Sizing variants (height, font-size, gap etc.)
      size: {
        xsmall: "!text-caption-semibold font-semibold gap-x-1",
        small:
          "h-[34px] !text-caption-semibold font-semibold  gap-x-1 px-4 pr-4", // adornment paddings will be overridden at call-site
        medium: "h-[40px] !text-label-semibold font-semibold gap-x-2 px-4 pl-4",
        large: "h-[44px] !text-base-semibold font-semibold gap-x-2 px-4 ",
      },

      // Visual variants coming from the spec supplied by the user
      variant: {
        // FILLS
        "primary-fill":
          "bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600 disabled:bg-grayscale-200 disabled:text-grayscale-400",
        "destructive-fill":
          "bg-semantic-error text-white hover:bg-semantic-error/90 active:bg-semantic-error/80 disabled:bg-grayscale-200 disabled:text-grayscale-400",

        // OUTLINES
        "primary-outline":
          "border border-primary-300 text-primary-400 bg-transparent hover:bg-[#303A4B]/8 active:bg-[#303A4B]/16 disabled:border-grayscale-300 disabled:text-grayscale-400",
        "white-outline":
          "border border-white text-white bg-transparent hover:bg-[#303A4B]/8 active:bg-[#303A4B]/16 disabled:border-grayscale-300 disabled:text-grayscale-400",

        // TEXTS (no padding – spacing handled in size + gap utilities)
        "primary-text":
          "bg-transparent text-primary-400 px-0 hover:text-[color-mix(in_oklab,_theme(colors.primary.400)_100%,_theme(colors.grayscale.800)_24%)] active:text-[#265f8b] disabled:text-grayscale-400",
        "grayscale-text":
          "bg-transparent text-grayscale-600 px-0 hover:text-[#5e6e84] active:text-[#505e71] disabled:text-grayscale-400",
        // SPECIAL
        "ai-gradient":
          "bg-transparent px-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:bg-[#303A4B]/8 active:bg-[#303A4B]/16 disabled:text-grayscale-400",
        "ai-gradient-background":
          "text-white px-4 bg-gradient-to-r from-primary to-secondary disabled:text-grayscale-400",
      },
    },

    defaultVariants: {
      variant: "primary-fill",
      size: "medium",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  label,
  adornment,
  adornmentPosition = "none",
  ...rest
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    label?: string;
    adornment?: ReactElement;
    adornmentPosition?: "start" | "end" | "none";
  }) {
  const Comp = asChild ? Slot : "button";

  // Only allow xsmall size for text variants
  let computedSize = size;
  const textVariants = ["primary-text", "grayscale-text", "ai-gradient"];
  if (
    size === "xsmall" &&
    !(textVariants as readonly string[]).includes(variant as string)
  ) {
    computedSize = "small";
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size: computedSize, className }))}
      {...rest}
    >
      {adornment && adornmentPosition === "start" && (
        <span className="pointer-events-none flex-shrink-0">{adornment}</span>
      )}
      {label}
      {adornment && adornmentPosition === "end" && (
        <span className="pointer-events-none flex-shrink-0">{adornment}</span>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };

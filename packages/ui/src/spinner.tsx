import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
    variant: {
      primary: "text-primary",
      secondary: "text-secondary",
      white: "text-white",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    { size, variant, label = "Loading...", className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        role="status"
        aria-label={label}
        {...props}
      >
        <svg
          className={cn(spinnerVariants({ size, variant }))}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

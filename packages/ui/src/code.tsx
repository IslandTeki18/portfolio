import { HTMLAttributes, forwardRef } from "react";
import { cn } from "./lib/utils";

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          "font-mono text-sm px-1.5 py-0.5 rounded bg-muted text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);

Code.displayName = "Code";

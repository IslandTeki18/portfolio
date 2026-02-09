import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes.
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution.
 *
 * @example
 * cn("bg-blue-500", "text-white", { "font-bold": isActive })
 * cn("bg-blue-500", "bg-red-500") // => "bg-red-500" (later class wins)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

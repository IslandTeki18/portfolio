import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  dot?: boolean;
}

export default function Chip({ children, dot = false }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full border border-line-2 px-[11px] py-[5px] font-mono text-xs text-fg-muted">
      {dot && <span className="h-[5px] w-[5px] rounded-full bg-accent" />}
      {children}
    </span>
  );
}

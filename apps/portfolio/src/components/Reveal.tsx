import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@repo/ui/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Fades content in when it scrolls into view. Elements already on screen render immediately. */
export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || el.getBoundingClientRect().top <= window.innerHeight * 0.85) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-soft",
        shown ? "translate-y-0 opacity-100" : "translate-y-[22px] opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

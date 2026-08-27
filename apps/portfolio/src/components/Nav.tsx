import { Link } from "react-router-dom";
import { SITE } from "../content";

const NAV_LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#ventures", label: "Ventures" },
  { href: "/#background", label: "Background" },
] as const;

export default function Nav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-ink/80 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link to="/" className="flex items-baseline gap-2 text-fg">
          <span className="font-mono text-[15px] text-accent">&gt;</span>
          <span className="text-base font-semibold tracking-[-0.01em]">{SITE.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-full px-3.5 py-2 text-sm text-fg-muted transition-colors hover:bg-ink-hover hover:text-fg md:inline-block"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="ml-2 rounded-full bg-accent px-[18px] py-[9px] text-sm font-medium text-ink transition-[transform,filter] duration-200 ease-soft hover:-translate-y-px hover:brightness-[1.08]"
          >
            Start a project
          </a>
        </div>
      </div>
    </nav>
  );
}

import { SITE } from "../content";

const LINK = "text-fg-footer transition-colors hover:text-fg";

export default function Footer() {
  return (
    <footer className="mt-[72px] flex flex-col gap-4 border-t border-line pt-7 font-mono text-xs text-fg-footer sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span>
        © {new Date().getFullYear()} {SITE.name}
      </span>
      <div className="flex gap-5">
        <a href={SITE.links.github} target="_blank" rel="noreferrer" className={LINK}>
          GitHub
        </a>
        <a href={SITE.links.linkedin} target="_blank" rel="noreferrer" className={LINK}>
          LinkedIn
        </a>
        <a href="#top" className={LINK}>
          Back to top
        </a>
      </div>
    </footer>
  );
}

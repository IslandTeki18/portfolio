import { EYEBROW } from "./styles";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  aside?: string;
}

export default function SectionHeader({ eyebrow, title, aside }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
      <div>
        <p className={EYEBROW}>{eyebrow}</p>
        <h2 className="mt-2.5 text-2xl font-semibold tracking-[-0.02em] md:text-[30px]">{title}</h2>
      </div>
      {aside && (
        <span className="whitespace-nowrap font-mono text-[13px] text-fg-faint">{aside}</span>
      )}
    </div>
  );
}

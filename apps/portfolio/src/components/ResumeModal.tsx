import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { cn } from "@repo/ui/lib/utils";
import type { Resume } from "../types/convex";
import { SITE } from "../content";
import Chip from "./Chip";
import { BTN_PILL, EYEBROW, LABEL } from "./styles";

interface ResumeModalProps {
  resume: Resume;
  isOpen: boolean;
  onClose: () => void;
}

const Divider = () => <div className="h-px bg-line" />;

export default function ResumeModal({ resume, isOpen, onClose }: ResumeModalProps) {
  const pdfUrl = useStorageUrl(api.storage.getFileUrl, resume.pdfStorageId);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-[rgba(14,13,12,0.72)] p-4 backdrop-blur-[6px] sm:p-6 md:p-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[780px] animate-sheet-in rounded-[20px] border border-line bg-ink-sheet shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
        <div className="sticky top-0 z-[2] flex items-center justify-between gap-6 rounded-t-[20px] border-b border-line bg-ink-sheet/95 px-5 py-5 backdrop-blur-[10px] md:px-8 md:py-6">
          <div>
            <p className={EYEBROW}>Resume</p>
            <h2 id="resume-title" className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">
              {SITE.name}
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noreferrer" className={cn(BTN_PILL, "hidden sm:inline-flex")}>
                Download PDF
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume"
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-line-2 text-[17px] text-fg-muted transition-colors hover:bg-ink-hover hover:text-fg"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-9 p-5 md:p-8">
          <div>
            {resume.headline && (
              <p className="text-[21px] font-medium leading-[1.45] tracking-[-0.01em] text-pretty">{resume.headline}</p>
            )}
            {resume.summary && (
              <p className="mt-3.5 text-[15px] leading-[1.7] text-fg-muted text-pretty">{resume.summary}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-6 font-mono text-xs text-fg-faint">
              <span>{SITE.contact.email}</span>
              <span>{SITE.contact.location}</span>
              <span>{SITE.links.github.replace(/^https?:\/\//, "")}</span>
            </div>
          </div>

          {resume.experience && resume.experience.length > 0 && (
            <>
              <Divider />
              <div>
                <p className={cn(LABEL, "mb-5")}>Experience</p>
                <div className="flex flex-col gap-7">
                  {resume.experience.map((exp, i) => (
                    <div key={i} className={cn("border-l-2 pl-5", i === 0 ? "border-accent" : "border-line-2")}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{exp.role}</h3>
                        {(exp.start || exp.end) && (
                          <span className="whitespace-nowrap font-mono text-xs text-fg-faint">
                            {exp.start} — {exp.end || "present"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[15px] text-fg-muted">{exp.company}</p>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <div className="mt-3.5 flex flex-col gap-[9px]">
                          {exp.bullets.map((b, j) => (
                            <p key={j} className="text-[15px] leading-relaxed text-fg-body">
                              {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {resume.skills && resume.skills.length > 0 && (
            <>
              <Divider />
              <div>
                <p className={cn(LABEL, "mb-3.5")}>Skills</p>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            </>
          )}

          {resume.education && resume.education.length > 0 && (
            <>
              <Divider />
              <div>
                <p className={cn(LABEL, "mb-3.5")}>Education</p>
                <div className="flex flex-col gap-4">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold">{edu.school}</h3>
                        {edu.degree && <p className="mt-1 text-[15px] text-fg-muted">{edu.degree}</p>}
                      </div>
                      {edu.year && <span className="whitespace-nowrap font-mono text-xs text-fg-faint">{edu.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

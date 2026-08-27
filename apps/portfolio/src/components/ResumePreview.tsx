import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { cn } from "@repo/ui/lib/utils";
import type { Resume } from "../types/convex";
import Chip from "./Chip";
import { BTN_PRIMARY, BTN_SECONDARY, CARD, LABEL } from "./styles";

interface ResumePreviewProps {
  resume: Resume;
  onViewFull: () => void;
}

export default function ResumePreview({ resume, onViewFull }: ResumePreviewProps) {
  const pdfUrl = useStorageUrl(api.storage.getFileUrl, resume.pdfStorageId);
  const experience = resume.experience?.slice(0, 3) ?? [];

  return (
    <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
      <div className={cn(CARD, "p-6 md:p-8")}>
        {resume.headline && (
          <p className="text-lg font-medium leading-normal tracking-[-0.01em] text-pretty md:text-xl">
            {resume.headline}
          </p>
        )}
        {resume.summary && (
          <p className="mt-[18px] text-[15px] leading-[1.7] text-fg-muted text-pretty">{resume.summary}</p>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={onViewFull} className={cn(BTN_PRIMARY, "px-[22px] py-3")}>
            Read full resume
          </button>
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer" className={cn(BTN_SECONDARY, "px-[22px] py-3")}>
              Download PDF
            </a>
          )}
        </div>
      </div>

      <div className={cn(CARD, "flex flex-col gap-[22px] p-6 md:p-8")}>
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <p className={cn(LABEL, "mb-3")}>Stack</p>
            <div className="flex flex-wrap gap-2">
              {resume.skills.slice(0, 8).map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </div>
        )}
        {experience.length > 0 && (
          <>
            <div className="h-px bg-line" />
            <div className="flex flex-col gap-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <p className="text-[15px] font-medium">
                    {exp.role}, {exp.company}
                  </p>
                  {(exp.start || exp.end) && (
                    <p className="mt-1 font-mono text-xs text-fg-faint">
                      {exp.start} — {exp.end || "present"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

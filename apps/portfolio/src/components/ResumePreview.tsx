import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import type { Resume } from "../types/convex";

interface ResumePreviewProps {
  resume: Resume;
  onViewFull: () => void;
}

export default function ResumePreview({ resume, onViewFull }: ResumePreviewProps) {
  const pdfUrl = useStorageUrl(api.storage.getFileUrl, resume.pdfStorageId);

  return (
    <div className="space-y-3">
      {resume.headline && (
        <div className="space-y-1">
          <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ headline:</p>
          <p className="font-mono text-xs md:text-[13px] leading-relaxed text-[#E5E5E5]">
            {resume.headline}
          </p>
        </div>
      )}

      {resume.summary && (
        <div className="space-y-1">
          <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ summary:</p>
          <p className="font-mono text-[11px] md:text-xs leading-relaxed text-[#A3A3A3]">
            {resume.summary}
          </p>
        </div>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <div className="space-y-1">
          <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ skills:</p>
          <p className="font-mono text-[11px] md:text-xs text-[#22C55E] break-words">
            {resume.skills.slice(0, 10).join(" · ")}
            {resume.skills.length > 10 && ` · +${resume.skills.length - 10} more`}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <button
          onClick={onViewFull}
          className="bg-[#F59E0B] px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#0C0C0C] hover:bg-[#D97706] text-center"
        >
          [view_full_resume]
        </button>
        {resume.pdfStorageId && pdfUrl && (
          <button
            onClick={() => window.open(pdfUrl, "_blank")}
            className="border border-[#737373] px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#737373] hover:border-[#A3A3A3] hover:text-[#A3A3A3] text-center"
          >
            [download_pdf]
          </button>
        )}
      </div>
    </div>
  );
}

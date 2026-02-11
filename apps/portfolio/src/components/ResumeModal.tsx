import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Modal, ModalBody, ModalFooter } from "@repo/ui/modal";
import type { Resume } from "../types/convex";

interface ResumeModalProps {
  resume: Resume;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ resume, isOpen, onClose }: ResumeModalProps) {
  const pdfUrl = useStorageUrl(api.storage.getFileUrl, resume.pdfStorageId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="~ resume.txt">
      <ModalBody>
        <div className="space-y-4 md:space-y-6 -my-4 md:-my-6 py-4 md:py-6">
          {resume.headline && (
            <div className="space-y-1">
              <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ headline:</p>
              <h3 className="font-mono text-sm md:text-base font-semibold text-[#E5E5E5]">
                {resume.headline}
              </h3>
            </div>
          )}

          {resume.summary && (
            <div className="space-y-1">
              <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ summary:</p>
              <p className="font-mono text-[11px] md:text-xs leading-relaxed text-[#A3A3A3]">{resume.summary}</p>
            </div>
          )}

          {resume.experience && resume.experience.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ experience:</p>
              <div className="space-y-3 md:space-y-4">
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-[#F59E0B] pl-3 md:pl-4">
                    <h5 className="font-mono text-xs md:text-sm font-semibold text-[#E5E5E5]">{exp.role}</h5>
                    <p className="font-mono text-[11px] md:text-xs text-[#A3A3A3]">{exp.company}</p>
                    {(exp.start || exp.end) && (
                      <p className="mt-1 font-mono text-[10px] md:text-xs text-[#737373]">
                        {exp.start} - {exp.end || "present"}
                      </p>
                    )}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="font-mono text-[11px] md:text-xs text-[#A3A3A3]">
                            <span className="text-[#22C55E]">&gt;</span> {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.skills && resume.skills.length > 0 && (
            <div className="space-y-1">
              <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ skills:</p>
              <p className="font-mono text-[11px] md:text-xs text-[#22C55E] break-words">
                {resume.skills.join(" · ")}
              </p>
            </div>
          )}

          {resume.education && resume.education.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] md:text-xs text-[#737373]">$ education:</p>
              <div className="space-y-3">
                {resume.education.map((edu, idx) => (
                  <div key={idx}>
                    <h5 className="font-mono text-xs md:text-sm font-semibold text-[#E5E5E5]">{edu.school}</h5>
                    {edu.degree && (
                      <p className="font-mono text-[11px] md:text-xs text-[#A3A3A3]">{edu.degree}</p>
                    )}
                    {edu.year && (
                      <p className="font-mono text-[10px] md:text-xs text-[#737373]">{edu.year}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-2 -my-4 md:-my-6 py-4 md:py-6">
          {resume.pdfStorageId && pdfUrl && (
            <button
              onClick={() => window.open(pdfUrl, "_blank")}
              className="border border-[#737373] px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#737373] hover:border-[#A3A3A3] hover:text-[#A3A3A3] text-center"
            >
              [download_pdf]
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-[#F59E0B] px-3 md:px-4 py-1.5 md:py-2 font-mono text-[10px] md:text-xs font-medium text-[#0C0C0C] hover:bg-[#D97706] text-center"
          >
            [close]
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

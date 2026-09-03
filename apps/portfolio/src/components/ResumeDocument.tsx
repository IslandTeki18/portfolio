// ponytail: print-only duplicate of ResumeModal's content. The browser's print
// dialog replaces PDF generation and storage entirely; screen and paper have
// opposite styling needs, so the markup is duplicated rather than unified.
import { createPortal } from "react-dom";
import type { Resume } from "../types/convex";
import { SITE } from "../content";

interface ResumeDocumentProps {
  resume: Resume;
}

/**
 * Opens the browser print dialog. `document.title` is swapped first because
 * browsers use it as the default filename in the Save as PDF dialog.
 */
export function printResume() {
  const previous = document.title;
  document.title = `${SITE.name} — Resume`;
  const restore = () => {
    document.title = previous;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
}

/**
 * Paper rendering of the Resume. Hidden on screen, revealed only inside
 * `@media print` (see apps/portfolio/src/index.css). Explicit black-on-white
 * values throughout — the portfolio's semantic tokens are dark and would print
 * dark.
 */
export default function ResumeDocument({ resume }: ResumeDocumentProps) {
  const github = SITE.links.github.replace(/^https?:\/\//, "");

  return createPortal(
    <div id="resume-print" className="bg-white text-[11pt] leading-normal text-black">
      <header>
        <h1 className="text-[20pt] font-bold tracking-tight">{SITE.name}</h1>
        {resume.headline && <p className="mt-1 text-[12pt] font-medium">{resume.headline}</p>}
        <p className="mt-2 text-[9.5pt]">
          {SITE.contact.email} · {SITE.contact.location} · {github}
        </p>
      </header>

      {resume.summary && <p className="mt-4 border-t border-black/25 pt-4">{resume.summary}</p>}

      {resume.experience && resume.experience.length > 0 && (
        <section className="mt-5 border-t border-black/25 pt-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em]">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mt-3 break-inside-avoid">
              <p className="font-bold">
                {exp.role}
                {exp.company ? `, ${exp.company}` : ""}
              </p>
              {(exp.start || exp.end) && (
                <p className="text-[9.5pt]">
                  {exp.start} — {exp.end || "present"}
                </p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1.5 list-disc pl-5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="mt-1">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <section className="mt-5 break-inside-avoid border-t border-black/25 pt-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em]">Skills</h2>
          <p className="mt-2">{resume.skills.join(", ")}</p>
        </section>
      )}

      {resume.education && resume.education.length > 0 && (
        <section className="mt-5 border-t border-black/25 pt-4">
          <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em]">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="mt-2.5 break-inside-avoid">
              <p className="font-bold">{edu.school}</p>
              {edu.degree && <p>{edu.degree}</p>}
              {edu.year && <p className="text-[9.5pt]">{edu.year}</p>}
            </div>
          ))}
        </section>
      )}
    </div>,
    document.body,
  );
}

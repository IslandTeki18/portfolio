import { Modal, ModalBody, ModalFooter } from "@repo/ui/modal";
import { Button } from "@repo/ui/button";
import type { Resume } from "../types/convex";

interface ResumeModalProps {
  resume: Resume;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ resume, isOpen, onClose }: ResumeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Resume">
      <ModalBody>
        <div className="space-y-6">
          {resume.headline && (
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {resume.headline}
              </h3>
            </div>
          )}

          {resume.summary && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Summary</h4>
              <p className="text-muted-foreground">{resume.summary}</p>
            </div>
          )}

          {resume.experience && resume.experience.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">Experience</h4>
              <div className="space-y-4">
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-border pl-4">
                    <h5 className="font-semibold text-foreground">{exp.role}</h5>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    {(exp.start || exp.end) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.start} - {exp.end || "Present"}
                      </p>
                    )}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {exp.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="list-disc ml-4">
                            {bullet}
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
            <div>
              <h4 className="font-semibold text-foreground mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.education && resume.education.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">Education</h4>
              <div className="space-y-3">
                {resume.education.map((edu, idx) => (
                  <div key={idx}>
                    <h5 className="font-semibold text-foreground">{edu.school}</h5>
                    {edu.degree && (
                      <p className="text-sm text-muted-foreground">{edu.degree}</p>
                    )}
                    {edu.year && (
                      <p className="text-xs text-muted-foreground">{edu.year}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        {resume.pdfStorageId && (
          <Button variant="outline">Download PDF</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

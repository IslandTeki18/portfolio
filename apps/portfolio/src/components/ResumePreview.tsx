import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import type { Resume } from "../types/convex";

interface ResumePreviewProps {
  resume: Resume;
  onViewFull: () => void;
}

export default function ResumePreview({ resume, onViewFull }: ResumePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.headline && (
          <p className="text-lg font-semibold text-foreground">
            {resume.headline}
          </p>
        )}

        {resume.summary && (
          <p className="text-label-secondary">{resume.summary}</p>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {resume.skills.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {resume.skills.length > 10 && (
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  +{resume.skills.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={onViewFull}>View Full Resume</Button>
          {resume.pdfStorageId && (
            <Button variant="outline">Download PDF</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

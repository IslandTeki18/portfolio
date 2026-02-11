import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Card, CardHeader, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

interface ResumeFormData {
  headline?: string;
  summary?: string;
  skills?: string;
  experience?: Array<{
    company: string;
    role: string;
    start?: string;
    end?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    school: string;
    degree?: string;
    year?: string;
  }>;
}

interface EducationEntryProps {
  index: number;
  register: UseFormRegister<ResumeFormData>;
  errors: FieldErrors<ResumeFormData>;
  onRemove: () => void;
}

export function EducationEntry({
  index,
  register,
  errors,
  onRemove,
}: EducationEntryProps) {
  const educationErrors = errors.education?.[index];

  return (
    <Card variant="outline" padding="md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Education #{index + 1}
          </h3>
          <Button variant="ghost" size="sm" type="button" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            {...register(`education.${index}.school`, {
              required: "School is required",
            })}
            label="School"
            placeholder="University of Example"
            fullWidth
            required
            error={educationErrors?.school?.message}
          />
          <Input
            {...register(`education.${index}.degree`)}
            label="Degree"
            placeholder="BS Computer Science"
            fullWidth
          />
          <Input
            {...register(`education.${index}.year`)}
            label="Year"
            placeholder="2020"
            fullWidth
          />
        </div>
      </CardContent>
    </Card>
  );
}

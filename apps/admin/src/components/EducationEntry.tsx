import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@repo/ui/input";
import { RemoveButton } from "./AdminLayout";

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
    <div className="flex flex-col gap-3.5 border-l-2 border-input pl-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-label-secondary">
          School {index + 1}
        </span>
        <RemoveButton onClick={onRemove} />
      </div>

      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)] gap-3.5">
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
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

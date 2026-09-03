import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";
import { Input } from "@repo/ui/input";
import { AddButton, RemoveButton } from "./AdminLayout";

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

interface ExperienceEntryProps {
  index: number;
  register: UseFormRegister<ResumeFormData>;
  control: Control<ResumeFormData>;
  errors: FieldErrors<ResumeFormData>;
  onRemove: () => void;
}

export function ExperienceEntry({
  index,
  register,
  control,
  errors,
  onRemove,
}: ExperienceEntryProps) {
  const {
    fields: bulletFields,
    append: appendBullet,
    remove: removeBullet,
  } = useFieldArray({
    control,
    // @ts-expect-error - Dynamic field path not supported by react-hook-form types
    name: `experience.${index}.bullets`,
  });

  const experienceErrors = errors.experience?.[index];

  return (
    <div className="flex flex-col gap-3.5 border-l-2 border-primary pl-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-label-secondary">
          Role {index + 1}
        </span>
        <RemoveButton onClick={onRemove} />
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <Input
          {...register(`experience.${index}.company`, {
            required: "Company is required",
          })}
          label="Company"
          placeholder="Acme Corp"
          fullWidth
          required
          error={experienceErrors?.company?.message}
        />
        <Input
          {...register(`experience.${index}.role`, {
            required: "Role is required",
          })}
          label="Role"
          placeholder="Senior Software Engineer"
          fullWidth
          required
          error={experienceErrors?.role?.message}
        />
        <Input
          {...register(`experience.${index}.start`)}
          label="Start"
          placeholder="Jan 2020"
          fullWidth
          className="font-mono text-sm"
        />
        <Input
          {...register(`experience.${index}.end`)}
          label="End"
          placeholder="Present"
          fullWidth
          className="font-mono text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-muted-foreground">
          Highlights
        </span>
        {bulletFields.map((field, bulletIndex) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`experience.${index}.bullets.${bulletIndex}` as const)}
              placeholder="Led development of new feature..."
              fullWidth
            />
            <RemoveButton onClick={() => removeBullet(bulletIndex)}>
              &times;
            </RemoveButton>
          </div>
        ))}
        <AddButton onClick={() => appendBullet("" as never)}>
          + Add highlight
        </AddButton>
      </div>
    </div>
  );
}

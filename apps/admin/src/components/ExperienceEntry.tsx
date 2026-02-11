import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";
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
    <Card variant="outline" padding="md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Experience #{index + 1}
          </h3>
          <Button variant="ghost" size="sm" type="button" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register(`experience.${index}.start`)}
              label="Start Date"
              placeholder="Jan 2020"
              fullWidth
            />
            <Input
              {...register(`experience.${index}.end`)}
              label="End Date"
              placeholder="Present"
              fullWidth
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Responsibilities & Achievements
            </label>
            {bulletFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bullet points added yet
              </p>
            ) : (
              <div className="space-y-2">
                {bulletFields.map((field, bulletIndex) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      {...register(
                        `experience.${index}.bullets.${bulletIndex}` as const,
                      )}
                      placeholder="Led development of new feature..."
                      fullWidth
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => removeBullet(bulletIndex)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => appendBullet("" as never)}
            >
              + Add Bullet Point
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

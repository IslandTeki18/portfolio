import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { ExperienceEntry } from "../components/ExperienceEntry";
import { EducationEntry } from "../components/EducationEntry";
import { AddButton, PageHeader, Section } from "../components/AdminLayout";

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

export default function Resume() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const resume = useQuery(api.resume.getResume);
  const updateResume = useMutation(api.resume.updateResume);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ResumeFormData>();

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    if (resume) {
      reset({
        headline: resume.headline || "",
        summary: resume.summary || "",
        skills: resume.skills?.join(", ") || "",
        experience: resume.experience || [],
        education: resume.education || [],
      });
    }
  }, [resume, reset]);


  const onSubmit = async (data: ResumeFormData) => {
    try {
      await updateResume({
        headline: data.headline || undefined,
        summary: data.summary || undefined,
        skills: data.skills
          ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        experience:
          data.experience && data.experience.length > 0
            ? data.experience.map((exp) => ({
                company: exp.company,
                role: exp.role,
                start: exp.start || undefined,
                end: exp.end || undefined,
                bullets: exp.bullets?.filter(Boolean) || undefined,
              }))
            : undefined,
        education:
          data.education && data.education.length > 0
            ? data.education.map((edu) => ({
                school: edu.school,
                degree: edu.degree || undefined,
                year: edu.year || undefined,
              }))
            : undefined,
      });
      addToast({
        type: "success",
        message: "Resume updated successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to update resume:", error);
      addToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to update resume",
      });
    }
  };

  if (resume === undefined) {
    return <Spinner variant="primary" size="lg" className="py-24" />;
  }

  return (
    <>
      <PageHeader
        title="Resume"
        action={
          resume && (
            <span className="font-mono text-xs text-label-secondary">
              updated {new Date(resume.updatedAt).toLocaleDateString()}
            </span>
          )
        }
      />

      <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <Section label="Profile">
          <Input
            {...register("headline")}
            label="Headline"
            placeholder="Software Engineer | Full-Stack Developer"
            fullWidth
          />
          <Textarea
            {...register("summary")}
            label="Summary"
            placeholder="Write your professional summary..."
            rows={5}
            fullWidth
          />
          <Input
            {...register("skills")}
            label="Skills"
            placeholder="React, TypeScript, Node.js"
            fullWidth
            helperText="Comma-separated"
          />
        </Section>

        <Section
          label="Experience"
          aside={
            <AddButton
              onClick={() =>
                appendExperience({
                  company: "",
                  role: "",
                  start: "",
                  end: "",
                  bullets: [],
                })
              }
            >
              + Add role
            </AddButton>
          }
        >
          {experienceFields.length === 0 ? (
            <p className="m-0 text-sm text-muted-foreground">
              No roles yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {experienceFields.map((field, index) => (
                <ExperienceEntry
                  key={field.id}
                  index={index}
                  register={register}
                  control={control}
                  errors={errors}
                  onRemove={() => removeExperience(index)}
                />
              ))}
            </div>
          )}
        </Section>

        <Section
          label="Education"
          aside={
            <AddButton
              onClick={() => appendEducation({ school: "", degree: "", year: "" })}
            >
              + Add school
            </AddButton>
          }
        >
          {educationFields.length === 0 ? (
            <p className="m-0 text-sm text-muted-foreground">
              No schools yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {educationFields.map((field, index) => (
                <EducationEntry
                  key={field.id}
                  index={index}
                  register={register}
                  errors={errors}
                  onRemove={() => removeEducation(index)}
                />
              ))}
            </div>
          )}
        </Section>


        <div className="flex gap-2.5 border-t border-border pt-6">
          <Button type="submit" size="sm" disabled={isSubmitting} className="rounded-md">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Link to="/">
            <Button variant="outline" size="sm" type="button" className="rounded-md border">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </>
  );
}

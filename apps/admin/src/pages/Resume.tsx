import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { useUpload } from "@repo/lib/use-upload";
import { useStorageUrl } from "@repo/lib/use-storage-url";
import { api } from "@backend/_generated/api";
import { Id } from "@backend/_generated/dataModel";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { FileUpload, FileIndicator } from "@repo/ui/file-upload";
import { ExperienceEntry } from "../components/ExperienceEntry";
import { EducationEntry } from "../components/EducationEntry";

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
  const removeResumePdf = useMutation(api.storage.removeResumePdf);
  const { upload, isUploading, error: uploadError } = useUpload(
    api.storage.generateUploadUrl,
  );

  const pdfUrl = useStorageUrl(api.storage.getFileUrl, resume?.pdfStorageId);

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

  const handlePdfUpload = async (file: File) => {
    try {
      const storageId = await upload(file);
      await updateResume({
        pdfStorageId: storageId as Id<"_storage">,
      });
      addToast({ type: "success", message: "PDF uploaded" });
    } catch {
      addToast({ type: "error", message: "Failed to upload PDF" });
    }
  };

  const handleRemovePdf = async () => {
    try {
      await removeResumePdf();
      addToast({ type: "success", message: "PDF removed" });
    } catch {
      addToast({ type: "error", message: "Failed to remove PDF" });
    }
  };

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/">
          <Button variant="ghost">&larr; Dashboard</Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register("headline")}
                label="Headline"
                placeholder="Software Engineer | Full-Stack Developer"
                fullWidth
                helperText="Your professional title or tagline"
              />
              <Textarea
                {...register("summary")}
                label="Summary"
                placeholder="Write your professional summary..."
                rows={6}
                fullWidth
                helperText="A brief overview of your background and expertise"
              />
              <Input
                {...register("skills")}
                label="Skills"
                placeholder="React, TypeScript, Node.js (comma-separated)"
                fullWidth
                helperText="List your key technical skills"
              />

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Experience
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
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
                    + Add Experience
                  </Button>
                </div>
                {experienceFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No experience entries yet. Click &quot;Add Experience&quot; to get
                    started.
                  </p>
                ) : (
                  <div className="space-y-4">
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
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Education
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() =>
                      appendEducation({ school: "", degree: "", year: "" })
                    }
                  >
                    + Add Education
                  </Button>
                </div>
                {educationFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No education entries yet. Click &quot;Add Education&quot; to get
                    started.
                  </p>
                ) : (
                  <div className="space-y-4">
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
              </div>

              <div>
                {resume?.pdfStorageId && pdfUrl ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Resume PDF
                    </label>
                    <FileIndicator
                      fileName="Resume.pdf"
                      url={pdfUrl}
                      onRemove={handleRemovePdf}
                    />
                  </div>
                ) : (
                  <FileUpload
                    label="Resume PDF"
                    accept=".pdf,application/pdf"
                    isUploading={isUploading}
                    error={uploadError ?? undefined}
                    onFileSelect={handlePdfUpload}
                    helperText="Upload your resume as a PDF file"
                    fullWidth
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Link to="/">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

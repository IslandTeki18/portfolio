import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Spinner } from "@repo/ui/spinner";
import { useEffect } from "react";

interface ResumeFormData {
  headline?: string;
  summary?: string;
  skills?: string;
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
    formState: { isSubmitting },
  } = useForm<ResumeFormData>();

  // Pre-populate form when resume data loads
  useEffect(() => {
    if (resume) {
      reset({
        headline: resume.headline || "",
        summary: resume.summary || "",
        skills: resume.skills?.join(", ") || "",
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
        message: error instanceof Error ? error.message : "Failed to update resume",
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

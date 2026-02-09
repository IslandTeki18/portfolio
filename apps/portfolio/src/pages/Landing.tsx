import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useAction } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Button } from "@repo/ui/button";
import { Spinner } from "@repo/ui/spinner";
import { EmptyState, EmptyStateIcon } from "@repo/ui/empty-state";
import ProjectCard from "../components/ProjectCard";
import BusinessCard from "../components/BusinessCard";
import ResumePreview from "../components/ResumePreview";
import ResumeModal from "../components/ResumeModal";

interface ContactFormData {
  name?: string;
  email: string;
  message: string;
}

export default function Landing() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { addToast } = useToast();

  const projects = useQuery(api.projects.listPublishedProjects);
  const businesses = useQuery(api.businesses.listPublishedBusinesses);
  const resume = useQuery(api.resume.getPublicResume);

  const sendContactEmail = useAction(api.contact.sendContactEmail);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmitContact = async (data: ContactFormData) => {
    try {
      await sendContactEmail({
        name: data.name || undefined,
        email: data.email,
        message: data.message,
      });

      addToast({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
        duration: 5000,
      });

      // Clear form on success
      reset();
    } catch (error) {
      console.error("Failed to send contact email:", error);
      addToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-label-primary">Landon McKell</h1>
          <p className="text-label-secondary">
            Full Stack Web Developer & Mobile Developer
          </p>
        </header>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects === undefined ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : projects === null || projects.length === 0 ? (
              <EmptyState
                icon={<EmptyStateIcon.Folder />}
                title="No projects yet"
                description="Check back soon for updates."
              />
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resume Section */}
        {resume !== undefined && resume !== null && (
          <>
            <ResumePreview
              resume={resume}
              onViewFull={() => setIsResumeModalOpen(true)}
            />
            <ResumeModal
              resume={resume}
              isOpen={isResumeModalOpen}
              onClose={() => setIsResumeModalOpen(false)}
            />
          </>
        )}

        {/* Businesses Section */}
        <Card>
          <CardHeader>
            <CardTitle>Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            {businesses === undefined ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : businesses === null || businesses.length === 0 ? (
              <EmptyState
                icon={<EmptyStateIcon.Inbox />}
                title="No businesses listed"
                description="Check back later for business ventures."
              />
            ) : (
              <div className="grid gap-4">
                {businesses.map((business) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmitContact)}>
              <Input
                {...register("name")}
                label="Name"
                placeholder="Your name (optional)"
                fullWidth
              />
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
                fullWidth
                error={errors.email?.message}
              />
              <Textarea
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
                label="Message"
                placeholder="Your message..."
                rows={4}
                required
                fullWidth
                error={errors.message?.message}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

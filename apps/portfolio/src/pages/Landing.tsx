import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useAction } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Spinner } from "@repo/ui/spinner";
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
    <div className="min-h-screen bg-[#0C0C0C] p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
        <header className="space-y-2 border-b-2 border-[#22C55E] pb-4 md:pb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="font-mono text-[24px] md:text-[32px] font-semibold text-[#22C55E]">&gt;</span>
            <h1 className="font-mono text-[24px] md:text-[32px] font-semibold text-[#E5E5E5] break-all">landon_mckell</h1>
          </div>
          <p className="font-mono text-xs md:text-sm text-[#737373]">
            {"// full stack web developer & mobile developer"}
          </p>
        </header>

        {/* Projects Section */}
        <div className="border-2 border-[#22C55E] bg-[#171717] p-4 md:p-5">
          <div className="flex items-center justify-between border-b border-[#252525] pb-3">
            <h2 className="font-mono text-sm md:text-base font-medium text-[#22C55E]">~ projects</h2>
            <span className="font-mono text-[10px] md:text-xs text-[#737373]">
              {projects ? `// ${projects.length} items` : "// loading..."}
            </span>
          </div>
          <div className="mt-4">
            {projects === undefined ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : projects === null || projects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-mono text-sm text-[#737373]">{"// no projects found"}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resume Section */}
        {resume !== undefined && resume !== null && (
          <>
            <div className="border-2 border-[#F59E0B] bg-[#171717] p-4 md:p-5">
              <div className="flex items-center justify-between border-b border-[#252525] pb-3">
                <h2 className="font-mono text-sm md:text-base font-medium text-[#F59E0B]">~ resume.txt</h2>
                <span className="font-mono text-[10px] md:text-xs text-[#737373]">{"// ready"}</span>
              </div>
              <div className="mt-4">
                <ResumePreview
                  resume={resume}
                  onViewFull={() => setIsResumeModalOpen(true)}
                />
              </div>
            </div>
            <ResumeModal
              resume={resume}
              isOpen={isResumeModalOpen}
              onClose={() => setIsResumeModalOpen(false)}
            />
          </>
        )}

        {/* Businesses Section */}
        <div className="border-2 border-[#3B82F6] bg-[#171717] p-4 md:p-5">
          <div className="flex items-center justify-between border-b border-[#252525] pb-3">
            <h2 className="font-mono text-sm md:text-base font-medium text-[#3B82F6]">~ businesses</h2>
            <span className="font-mono text-[10px] md:text-xs text-[#737373]">
              {businesses ? `// ${businesses.length} active ventures` : "// loading..."}
            </span>
          </div>
          <div className="mt-4">
            {businesses === undefined ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : businesses === null || businesses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-mono text-sm text-[#737373]">{"// no businesses listed"}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {businesses.map((business) => (
                  <BusinessCard key={business._id} business={business} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="border-2 border-[#EF4444] bg-[#171717] p-4 md:p-5">
          <div className="flex items-center justify-between border-b border-[#252525] pb-3">
            <h2 className="font-mono text-sm md:text-base font-medium text-[#EF4444]">~ let&apos;s_connect</h2>
            <span className="font-mono text-[10px] md:text-xs text-[#737373]">{"// send a message"}</span>
          </div>
          <div className="mt-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmitContact)}>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#737373]">$ name</label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="your_name (optional)"
                  className="w-full border border-[#1F1F1F] bg-[#1A1A1A] px-3 py-2.5 font-mono text-xs text-[#E5E5E5] placeholder-[#525252] focus:border-[#22C55E] focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 font-mono text-xs text-[#737373]">
                  <span>$ email</span>
                  <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-[#22C55E] bg-[#1A1A1A] px-3 py-2.5 font-mono text-xs text-[#E5E5E5] placeholder-[#525252] focus:border-[#22C55E] focus:outline-none"
                />
                {errors.email && (
                  <p className="font-mono text-xs text-[#EF4444]">{`// ${errors.email.message}`}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 font-mono text-xs text-[#737373]">
                  <span>$ message</span>
                  <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  rows={5}
                  placeholder="your_message..."
                  className="w-full border border-[#22C55E] bg-[#1A1A1A] px-3 py-2.5 font-mono text-xs text-[#E5E5E5] placeholder-[#525252] focus:border-[#22C55E] focus:outline-none"
                />
                {errors.message && (
                  <p className="font-mono text-xs text-[#EF4444]">{`// ${errors.message.message}`}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#EF4444] px-5 py-2.5 font-mono text-xs md:text-[13px] font-semibold text-[#0C0C0C] hover:bg-[#DC2626] disabled:opacity-50"
                >
                  {isSubmitting ? "[sending...]" : "[send_message]"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

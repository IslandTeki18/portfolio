import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useAction } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";
import { useToast } from "@repo/ui/toast";
import { Spinner } from "@repo/ui/spinner";
import { cn } from "@repo/ui/lib/utils";
import { SITE } from "../content";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import ProjectCard from "../components/ProjectCard";
import BusinessCard from "../components/BusinessCard";
import ResumePreview from "../components/ResumePreview";
import ResumeModal from "../components/ResumeModal";
import ResumeDocument from "../components/ResumeDocument";
import HeroCube from "../components/HeroCube";
import { BTN_PRIMARY, BTN_SECONDARY, CARD, EYEBROW } from "../components/styles";

interface ContactFormData {
  name?: string;
  email: string;
  message: string;
}

const FIELD =
  "w-full rounded-xl border border-line-2 bg-ink-field px-[15px] py-[13px] font-mono text-sm text-fg outline-none transition-colors duration-200 placeholder:text-fg-ghost focus:border-accent focus:bg-ink-hover";
const FIELD_LABEL = "font-mono text-xs text-fg-muted";
const FIELD_ERROR = "font-mono text-xs text-accent";

function Loading() {
  return (
    <div className="flex justify-center py-12">
      <Spinner size="md" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-12 text-center font-mono text-sm text-fg-faint">{text}</p>;
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
        message: "Message sent. I'll get back to you soon.",
        duration: 5000,
      });
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

  const activeCount = businesses?.filter((b) => b.active).length ?? 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-1/4 -left-[15%] h-[75vw] w-[75vw] animate-drift-1 rounded-full bg-[radial-gradient(circle,rgba(201,138,106,0.10)_0%,rgba(201,138,106,0)_65%)]" />
        <div className="absolute -right-[20%] -bottom-[30%] h-[80vw] w-[80vw] animate-drift-2 rounded-full bg-[radial-gradient(circle,rgba(140,158,170,0.07)_0%,rgba(140,158,170,0)_65%)]" />
      </div>

      <div className="relative z-[1]">
        <Nav />

        <div id="top" className="mx-auto max-w-[1120px] px-5 pb-24 md:px-8">
          {/* Hero */}
          <header className="grid items-center gap-12 py-16 md:grid-cols-[minmax(0,1fr)_340px] md:pt-[104px] md:pb-[88px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-ink-pill py-1.5 pr-3.5 pl-3">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                <span className="font-mono text-xs text-fg-muted">{SITE.availability}</span>
              </div>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-pretty sm:text-5xl md:text-[58px]">
                {SITE.hero.title}
              </h1>
              <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-fg-muted text-pretty md:text-[19px]">
                {SITE.hero.lede}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#work" className={BTN_PRIMARY}>
                  See recent work
                </a>
                <a href="#background" className={BTN_SECONDARY}>
                  Read my background
                </a>
              </div>
              <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[13px] text-fg-faint">
                {SITE.hero.stats.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <HeroCube />
            </div>
          </header>

          {/* Work */}
          <section id="work" className="scroll-mt-24 pt-6">
            <Reveal>
              <SectionHeader
                eyebrow="Selected work"
                title="Recent projects, and what they changed"
                aside={projects ? `${String(projects.length).padStart(2, "0")} / case studies` : undefined}
              />
            </Reveal>
            {projects === undefined ? (
              <Loading />
            ) : !projects || projects.length === 0 ? (
              <Empty text="No projects published yet." />
            ) : (
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {projects.map((project, i) => (
                  <Reveal key={project._id} className={cn("flex", i === 0 && "md:col-span-2")}>
                    <ProjectCard project={project} index={i} featured={i === 0} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>

          {/* Ventures */}
          <section id="ventures" className="scroll-mt-24 pt-24">
            <Reveal>
              <SectionHeader
                eyebrow="Ventures"
                title="Businesses I run"
                aside={businesses ? `${String(activeCount).padStart(2, "0")} active` : undefined}
              />
            </Reveal>
            {businesses === undefined ? (
              <Loading />
            ) : !businesses || businesses.length === 0 ? (
              <Empty text="No businesses listed yet." />
            ) : (
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {businesses.map((business) => (
                  <Reveal key={business._id} className="flex [&>a]:flex-1">
                    <BusinessCard business={business} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>

          {/* Background */}
          {resume && (
            <section id="background" className="scroll-mt-24 pt-24">
              <Reveal>
                <SectionHeader eyebrow="Background" title="How I work" aside="resume" />
              </Reveal>
              <Reveal className="mt-7">
                <ResumePreview resume={resume} onViewFull={() => setIsResumeModalOpen(true)} />
              </Reveal>
              <ResumeModal resume={resume} isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
              <ResumeDocument resume={resume} />
            </section>
          )}

          {/* Contact */}
          <section id="contact" className="scroll-mt-24 pt-24">
            <Reveal>
              <div className={cn(CARD, "grid overflow-hidden rounded-[20px] md:grid-cols-[1fr_1.15fr]")}>
                <div className="flex flex-col justify-between gap-8 border-b border-line p-7 md:border-r md:border-b-0 md:p-11">
                  <div>
                    <p className={EYEBROW}>Contact</p>
                    <h2 className="mt-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-pretty md:text-[32px]">
                      {SITE.contact.title}
                    </h2>
                    <p className="mt-4 text-base leading-[1.65] text-fg-muted text-pretty">{SITE.contact.lede}</p>
                  </div>
                  <div className="flex flex-col gap-2.5 font-mono text-[13px] text-fg-faint">
                    <a href={`mailto:${SITE.contact.email}`} className="text-fg-faint hover:text-fg">
                      {SITE.contact.email}
                    </a>
                    <span>{SITE.contact.location}</span>
                  </div>
                </div>

                <form
                  className="flex flex-col gap-[18px] p-7 md:p-11"
                  onSubmit={handleSubmit(onSubmitContact)}
                  noValidate
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className={FIELD_LABEL}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      {...register("name")}
                      type="text"
                      placeholder="Optional"
                      className={FIELD}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className={FIELD_LABEL}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      type="email"
                      placeholder="you@company.com"
                      aria-invalid={errors.email ? true : undefined}
                      className={FIELD}
                    />
                    {errors.email && <p className={FIELD_ERROR}>{errors.email.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className={FIELD_LABEL}>
                      What are you trying to fix?
                    </label>
                    <textarea
                      id="contact-message"
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "Message must be at least 10 characters" },
                      })}
                      rows={5}
                      placeholder="We schedule 20 techs a day out of a shared spreadsheet and it breaks every time someone calls in sick."
                      aria-invalid={errors.message ? true : undefined}
                      className={cn(FIELD, "resize-y leading-[1.55]")}
                    />
                    {errors.message && <p className={FIELD_ERROR}>{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className={cn(BTN_PRIMARY, "mt-1 py-3.5")}>
                    {isSubmitting ? "Sending…" : "Send message"}
                  </button>
                </form>
              </div>
            </Reveal>
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}

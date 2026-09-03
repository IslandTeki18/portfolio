import { Link } from "react-router-dom";
import { useQuery } from "@repo/lib/convex";
import { api } from "@backend/_generated/api";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  return "Good evening.";
}

function DashRow({
  to,
  label,
  meta,
}: {
  to: string;
  label: string;
  meta: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-baseline justify-between gap-4 border-b border-border px-1 py-[22px] transition-[padding-left] duration-200 ease-out hover:pl-3"
    >
      <span className="text-xl font-semibold tracking-[-0.015em]">{label}</span>
      <span className="font-mono text-xs text-label-secondary">{meta} &rarr;</span>
    </Link>
  );
}

export default function Dashboard() {
  const projects = useQuery(api.projects.listAllProjects);
  const businesses = useQuery(api.businesses.listAllBusinesses);
  const resume = useQuery(api.resume.getResume);

  const projectMeta =
    projects === undefined
      ? "—"
      : `${projects.length} · ${projects.filter((p) => p.status !== "published").length} draft`;

  const businessMeta =
    businesses === undefined
      ? "—"
      : `${businesses.length} · ${businesses.filter((b) => !b.active).length} inactive`;

  const resumeMeta =
    resume === undefined
      ? "—"
      : resume?.updatedAt
        ? `Updated ${new Date(resume.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}`
        : "Not set up";

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-3xl font-semibold tracking-[-0.02em] text-pretty">
          {greeting(new Date().getHours())}
        </h1>
        <p className="m-0 text-base leading-relaxed text-muted-foreground">
          What are you updating today?
        </p>
      </div>

      <div className="flex flex-col border-t border-border">
        <DashRow to="/projects" label="Projects" meta={projectMeta} />
        <DashRow to="/businesses" label="Businesses" meta={businessMeta} />
        <DashRow to="/resume" label="Resume" meta={resumeMeta} />
      </div>
    </>
  );
}

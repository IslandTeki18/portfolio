import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { cn } from "@repo/ui/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/projects", label: "Projects", end: false },
  { to: "/businesses", label: "Businesses", end: false },
  { to: "/resume", label: "Resume", end: false },
];

const siteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[220px_minmax(0,1fr)] bg-background-primary text-label-primary">
      <aside className="sticky top-0 flex h-screen flex-col gap-7 border-r border-border px-4 py-7">
        <Link to="/" className="flex flex-col gap-1 px-3">
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            Landon
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-label-secondary">
            Admin
          </span>
        </Link>

        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-accent" : "hover:bg-accent",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      isActive ? "bg-primary" : "bg-transparent",
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-start gap-2.5 px-3">
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground transition-colors hover:text-label-primary"
            >
              View site &#8599;
            </a>
          )}
          <SignOutButton>
            <button
              type="button"
              className="text-[13px] text-muted-foreground transition-colors hover:text-label-primary"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="min-w-0 px-12 pt-14 pb-24">
        <div className="view-in mx-auto flex max-w-[720px] flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
}

/** Page-level h1. */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="m-0 text-3xl font-semibold tracking-[-0.02em] text-pretty">
      {children}
    </h1>
  );
}

/** Title row with an optional right-hand action or status. */
export function PageHeader({
  title,
  action,
}: {
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <PageTitle>{title}</PageTitle>
      {action}
    </div>
  );
}

/** "← Projects" style back link. */
export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="text-sm text-muted-foreground transition-colors hover:text-label-primary"
    >
      &larr; {children}
    </Link>
  );
}

/** Form section: mono uppercase label in the left column, fields on the right. */
export function Section({
  label,
  aside,
  children,
}: {
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="grid grid-cols-[160px_minmax(0,1fr)] gap-6 border-t border-border pt-7">
      <div className="flex flex-col items-start gap-2.5">
        <span className="pt-3 font-mono text-xs uppercase tracking-[0.06em] text-label-secondary">
          {label}
        </span>
        {aside}
      </div>
      <div className="flex flex-col gap-[18px]">{children}</div>
    </section>
  );
}

/** Dotted status pill: published/draft, active/inactive. */
export function StatusPill({
  children,
  on = true,
}: {
  children: ReactNode;
  on?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-input px-2.5 py-0.5 font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
      <span
        className={cn(
          "size-[5px] rounded-full",
          on ? "bg-primary" : "bg-label-disabled",
        )}
      />
      {children}
    </span>
  );
}

export function FeaturedTag() {
  return (
    <span className="font-mono text-[11px] tracking-[0.04em] text-primary">
      featured
    </span>
  );
}

/** Mono metadata strip at the bottom of a detail view. */
export function MetaBar({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-8 border-t border-border pt-5 font-mono text-xs text-label-secondary">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

/** Label + value block in a detail view's right rail. */
export function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-[0.06em] text-label-secondary">
        {label}
      </span>
      {children}
    </div>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-input px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * Checkbox styled as a bordered pill, matching the form controls.
 * forwardRef so react-hook-form's `register()` ref lands on the input.
 */
export const CheckboxField = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, ...props }, ref) => (
  <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-input px-3 py-2.5 text-sm">
    <input
      ref={ref}
      type="checkbox"
      className="m-0 size-[15px] accent-primary"
      {...props}
    />
    {label}
  </label>
));

CheckboxField.displayName = "CheckboxField";

/** Accent text button: "+ Add role". */
export function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer self-start p-0 text-[13px] font-medium text-primary"
    >
      {children}
    </button>
  );
}

/** Quiet text button used to remove a repeated entry. */
export function RemoveButton({
  children = "Remove",
  onClick,
}: {
  children?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer p-0 text-[13px] text-label-secondary transition-colors hover:text-label-primary"
    >
      {children}
    </button>
  );
}

/** Quiet text button used for destructive actions. */
export function DangerLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer px-1 py-2.5 text-sm text-label-secondary transition-colors hover:text-label-primary"
    >
      {children}
    </button>
  );
}

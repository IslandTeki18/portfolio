import {
  forwardRef,
  useEffect,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever the route changes (mobile nav tap).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-background-primary text-label-primary md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background-primary/95 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            Landon
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-label-secondary">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          className="-mr-2 flex size-10 cursor-pointer items-center justify-center rounded-full text-label-primary transition-colors hover:bg-accent"
        >
          <MenuIcon open={open} />
        </button>
      </header>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] max-w-[85vw] flex-col gap-7 border-r border-border bg-background-primary px-4 py-7 transition-transform duration-200 ease-out",
          "md:sticky md:top-0 md:h-screen md:w-auto md:max-w-none md:translate-x-0 md:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
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
              className="cursor-pointer text-[13px] text-muted-foreground transition-colors hover:text-label-primary"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="min-w-0 px-5 pt-8 pb-16 sm:px-8 sm:pt-10 md:px-12 md:pt-14 md:pb-24">
        <div className="view-in mx-auto flex max-w-[720px] flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M4 4l12 12" />
          <path d="M16 4L4 16" />
        </>
      ) : (
        <>
          <path d="M3 6h14" />
          <path d="M3 10h14" />
          <path d="M3 14h14" />
        </>
      )}
    </svg>
  );
}

/** Page-level h1. */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="m-0 text-2xl font-semibold tracking-[-0.02em] text-pretty sm:text-3xl">
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
    <div className="flex flex-wrap items-end justify-between gap-4">
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
    <section className="grid grid-cols-1 gap-4 border-t border-border pt-6 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6 md:pt-7">
      <div className="flex flex-col items-start gap-2.5">
        <span className="font-mono text-xs uppercase tracking-[0.06em] text-label-secondary md:pt-3">
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
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-t md:gap-x-8 border-border pt-5 font-mono text-xs text-label-secondary">
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

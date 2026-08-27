import { Link } from "react-router-dom";
import { cn } from "@repo/ui/lib/utils";
import { BTN_PRIMARY, CARD, EYEBROW } from "../components/styles";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-10">
      <div className={cn(CARD, "w-full max-w-md p-8 text-center md:p-10")}>
        <p className={EYEBROW}>404</p>
        <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.02em]">That page doesn&apos;t exist.</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
          The link may be old, or the project may have been unpublished.
        </p>
        <Link to="/" className={cn(BTN_PRIMARY, "mt-7")}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

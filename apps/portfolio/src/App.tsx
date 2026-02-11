import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spinner } from "@repo/ui/spinner";

const Landing = lazy(() => import("./pages/Landing"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BusinessDetail = lazy(() => import("./pages/BusinessDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/businesses/:slug" element={<BusinessDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

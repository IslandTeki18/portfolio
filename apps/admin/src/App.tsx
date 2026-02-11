import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spinner } from "@repo/ui/spinner";
import AuthGate from "./components/AuthGate";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectCreate = lazy(() => import("./pages/ProjectCreate"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ProjectEdit = lazy(() => import("./pages/ProjectEdit"));
const Resume = lazy(() => import("./pages/Resume"));
const Businesses = lazy(() => import("./pages/Businesses"));
const BusinessCreate = lazy(() => import("./pages/BusinessCreate"));
const BusinessDetail = lazy(() => import("./pages/BusinessDetail"));
const BusinessEdit = lazy(() => import("./pages/BusinessEdit"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <AuthGate>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background-primary">
            <Spinner size="lg" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/edit" element={<ProjectEdit />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/new" element={<BusinessCreate />} />
          <Route path="/businesses/:id" element={<BusinessDetail />} />
          <Route path="/businesses/:id/edit" element={<BusinessEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthGate>
  );
}

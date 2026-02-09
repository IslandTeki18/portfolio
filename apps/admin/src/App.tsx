import { Routes, Route } from "react-router-dom";
import AuthGate from "./components/AuthGate";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectEdit from "./pages/ProjectEdit";
import Resume from "./pages/Resume";
import Businesses from "./pages/Businesses";
import BusinessCreate from "./pages/BusinessCreate";
import BusinessDetail from "./pages/BusinessDetail";
import BusinessEdit from "./pages/BusinessEdit";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthGate>
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
    </AuthGate>
  );
}

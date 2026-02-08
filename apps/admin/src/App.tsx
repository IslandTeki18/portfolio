import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectEdit from "./pages/ProjectEdit";
import Resume from "./pages/Resume";
import Businesses from "./pages/Businesses";
import BusinessCreate from "./pages/BusinessCreate";
import BusinessEdit from "./pages/BusinessEdit";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/new" element={<ProjectCreate />} />
      <Route path="/projects/:id" element={<ProjectEdit />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/businesses" element={<Businesses />} />
      <Route path="/businesses/new" element={<BusinessCreate />} />
      <Route path="/businesses/:id" element={<BusinessEdit />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Businesses from "./pages/Businesses";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/businesses" element={<Businesses />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

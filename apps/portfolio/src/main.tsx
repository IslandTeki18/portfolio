import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexClientProvider } from "@repo/lib/convex";
import { convex } from "./lib/convex";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexClientProvider client={convex}>
        <App />
      </ConvexClientProvider>
    </BrowserRouter>
  </StrictMode>,
);

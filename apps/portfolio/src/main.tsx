import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexClientProvider } from "@repo/lib/convex";
import { ToastProvider } from "@repo/ui/toast";
import { convex } from "./lib/convex";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexClientProvider client={convex}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ConvexClientProvider>
    </BrowserRouter>
  </StrictMode>,
);

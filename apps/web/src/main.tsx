import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

import App from "./App";
import "./index.css";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
if (!CONVEX_URL) throw new Error("Missing VITE_CONVEX_URL environment variable");

const convex = new ConvexReactClient(CONVEX_URL);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </StrictMode>,
);

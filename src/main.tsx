import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { PhrasesProvider } from "./context/PhrasesContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PhrasesProvider>
      <App />
    </PhrasesProvider>
  </StrictMode>
);

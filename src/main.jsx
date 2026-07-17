import { StrictMode } from "react";

import { createRoot }
from "react-dom/client";

import App from "./App";

import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

     <ThemeProvider>
      <App />
    </ThemeProvider>

  </StrictMode>

);
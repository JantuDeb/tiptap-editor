import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="">
      <SimpleEditor />
    </div>
  </StrictMode>
);

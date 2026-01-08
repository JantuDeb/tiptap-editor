import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
import content from "./components/tiptap-templates/simple/data/content.md?raw";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="">
      <SimpleEditor initialValue={content} contentType="markdown" />
    </div>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import { Editor } from "./components/tiptap-templates/simple/simple-editor";
import content from "./components/tiptap-templates/simple/data/content.md?raw";

const mockImageUpload = (file: File) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }, 500);
  });
};

const mockVideoUpload = (file: File) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }, 500);
  });
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      <Editor
        initialValue={content}
        contentType="markdown"
        onImageUpload={mockImageUpload}
        onVideoUpload={mockVideoUpload}
      />
    </div>
  </StrictMode>
);

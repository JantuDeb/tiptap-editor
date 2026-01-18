import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import "./index.css";
import { Editor } from "./components/editor";
import content from "./data/content.md?raw";

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
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Editor
        initialValue={content}
        contentType="markdown"
        onImageUpload={mockImageUpload}
        onVideoUpload={mockVideoUpload}
      />
    </div>
  </StrictMode>,
);

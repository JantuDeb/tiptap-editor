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
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        margin: "0 auto",
        flexWrap: "wrap",
        overflow: "hidden",
      }}
    >
      <div style={{ flexShrink: 0, flex: 1, overflowY: "auto", height: "100%", }}>
        <Editor
          initialValue={content}
          contentType="markdown"
          onImageUpload={mockImageUpload}
          onVideoUpload={mockVideoUpload}
        />
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto",
          flex: 1,
        }}
      >
        <Editor
          initialValue={content}
          contentType="markdown"
          onImageUpload={mockImageUpload}
          onVideoUpload={mockVideoUpload}
          variant="input"
          maxHeight={400}
          minHeight={200}
        />

        <Editor
          initialValue={content}
          contentType="markdown"
          onImageUpload={mockImageUpload}
          onVideoUpload={mockVideoUpload}
          variant="input"
          maxHeight={600}
        />
      </div>
    </div>
  </StrictMode>
);

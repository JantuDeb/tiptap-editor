import { useMemo } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import katexLib from "katex";
import { toJSON } from "@/lib/tiptap-utils";

export function KatexNodeView({ node }: any) {
  const { text, macros } = node.attrs;
  console.log("text", text);

  const isBlock = node.type.name === "katexBlock";

  const formatText = useMemo(() => {
    try {
      return katexLib.renderToString(decodeURIComponent(text || ""), {
        macros: toJSON(decodeURIComponent(macros || "")),
        displayMode: isBlock, // IMPORTANT for KaTeX
      });
    } catch {
      return text;
    }
  }, [text, macros, isBlock]);

  const content = useMemo(
    () =>
      text?.trim() ? (
        <span
          contentEditable={false}
          dangerouslySetInnerHTML={{ __html: formatText }}
        />
      ) : (
        <span contentEditable={false} style={{ opacity: 0.6 }}>
          Enter a formula
        </span>
      ),
    [text, formatText]
  );

  return (
    <NodeViewWrapper
      as={isBlock ? "div" : "span"}
      style={{
        display: isBlock ? "block" : "inline-block",
        textAlign: isBlock ? "center" : undefined,
        margin: isBlock ? "0.75em 0" : undefined,
      }}
    >
      {content}
    </NodeViewWrapper>
  );
}

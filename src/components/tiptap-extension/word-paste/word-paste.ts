/**
 * Word Paste Plugin for Tiptap
 *
 * Handles pasting content from Microsoft Word documents:
 * - Converts OMML math equations to KaTeX block/inline math nodes
 * - Handles embedded base64 images from Word
 * - Preserves formatting (tables, headings, lists, etc. are handled by Tiptap's built-in parsing)
 */
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  ommlToLatex,
  findOmmlElements,
  findOmmlParaElements,
} from "./omml-to-latex";

export interface WordPasteOptions {
  /**
   * Callback to upload images. Receives a base64 data URL and returns a promise
   * that resolves to the final image URL.
   * If not provided, base64 images are inserted directly.
   */
  onImageUpload?: (dataUrl: string) => Promise<string>;
}

const wordPastePluginKey = new PluginKey("wordPaste");

/**
 * Detect if HTML content is from Microsoft Word
 */
function isWordContent(html: string): boolean {
  return (
    html.includes("xmlns:w=") ||
    html.includes("xmlns:m=") ||
    html.includes("urn:schemas-microsoft-com:office") ||
    html.includes("mso-") ||
    html.includes("MsoNormal") ||
    html.includes("<o:p>")
  );
}

/**
 * Parse the clipboard HTML into a DOM document.
 * Word wraps math in XML namespaces, so we parse as XML where possible,
 * falling back to HTML parsing.
 */
function parseWordHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

/**
 * Extract all base64 images from Word HTML.
 * Word embeds images as data URIs in <img> or <v:imagedata> tags.
 */
function extractImages(doc: Document): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];

  // Standard img tags with data URIs
  const imgElements = doc.querySelectorAll("img");
  imgElements.forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      images.push({ src, alt: img.getAttribute("alt") || "" });
    }
  });

  // VML imagedata (older Word formats)
  const vmlImages = doc.querySelectorAll("v\\:imagedata, imagedata");
  vmlImages.forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      images.push({ src, alt: "" });
    }
  });

  return images;
}

/**
 * Check if an oMath element is inside an oMathPara (display/block math)
 */
function isDisplayMath(oMathEl: Element): boolean {
  const parent = oMathEl.parentElement;
  if (!parent) return false;
  const parentTag =
    parent.localName || parent.nodeName.replace(/^[^:]+:/, "");
  return parentTag === "oMathPara";
}

/**
 * Replace OMML math elements in the HTML with LaTeX placeholders.
 * Returns the modified HTML and a map of placeholder -> latex data.
 */
function replaceMathInHtml(html: string): {
  html: string;
  mathBlocks: Map<string, { latex: string; isBlock: boolean }>;
} {
  const doc = parseWordHtml(html);
  const mathBlocks = new Map<string, { latex: string; isBlock: boolean }>();

  // Process oMathPara (block math) first
  const mathParas = findOmmlParaElements(doc);
  mathParas.forEach((para, index) => {
    const oMathElements = findOmmlElements(
      para as unknown as Document
    ).length
      ? findOmmlElements(para as unknown as Document)
      : Array.from(para.children).filter((child) => {
          const tag =
            child.localName || child.nodeName.replace(/^[^:]+:/, "");
          return tag === "oMath";
        });

    const latexParts: string[] = [];
    oMathElements.forEach((oMath) => {
      const latex = ommlToLatex(oMath);
      if (latex) latexParts.push(latex);
    });

    if (latexParts.length > 0) {
      const latex = latexParts.join(" ");
      const placeholder = `__MATH_BLOCK_${index}__`;
      mathBlocks.set(placeholder, { latex, isBlock: true });

      const placeholderEl = doc.createElement("div");
      placeholderEl.setAttribute("data-math-placeholder", placeholder);
      placeholderEl.textContent = placeholder;
      para.replaceWith(placeholderEl);
    }
  });

  // Process standalone oMath (inline math)
  const inlineMaths = findOmmlElements(doc);
  inlineMaths.forEach((oMath, index) => {
    // Skip if already processed as part of oMathPara
    if (isDisplayMath(oMath)) return;

    const latex = ommlToLatex(oMath);
    if (latex) {
      const placeholder = `__MATH_INLINE_${index}__`;
      mathBlocks.set(placeholder, { latex, isBlock: false });

      const placeholderEl = doc.createElement("span");
      placeholderEl.setAttribute("data-math-placeholder", placeholder);
      placeholderEl.textContent = placeholder;
      oMath.replaceWith(placeholderEl);
    }
  });

  // Serialize back to HTML
  const body = doc.body || doc.documentElement;
  const resultHtml = body.innerHTML;

  return { html: resultHtml, mathBlocks };
}

/**
 * Clean up Word-specific CSS and elements from HTML
 */
function cleanWordHtml(html: string): string {
  // Remove Word-specific XML processing instructions
  html = html.replace(/<\?xml[^>]*>/gi, "");

  // Remove Word-specific conditional comments
  html = html.replace(/<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi, "");

  // Remove <o:p> tags but keep content
  html = html.replace(/<\/?o:p[^>]*>/gi, "");

  // Remove empty spans with only mso styles
  html = html.replace(
    /<span[^>]*style="[^"]*mso-[^"]*"[^>]*>\s*<\/span>/gi,
    ""
  );

  // Clean up mso-* styles but keep other styles
  html = html.replace(/mso-[^;"]*;?/gi, "");

  return html;
}

export const WordPaste = Extension.create<WordPasteOptions>({
  name: "wordPaste",

  addOptions() {
    return {
      onImageUpload: undefined,
    };
  },

  addProseMirrorPlugins() {
    const extensionOptions = this.options;

    return [
      new Plugin({
        key: wordPastePluginKey,

        props: {
          transformPastedHTML(html) {
            if (!isWordContent(html)) return html;

            // Replace math elements with placeholders
            const { html: processedHtml, mathBlocks } =
              replaceMathInHtml(html);

            // Clean up Word-specific markup
            let cleaned = cleanWordHtml(processedHtml);

            // Replace math placeholders with proper HTML nodes that Tiptap can parse
            mathBlocks.forEach(({ latex, isBlock }, placeholder) => {
              if (isBlock) {
                cleaned = cleaned.replace(
                  new RegExp(
                    `<div[^>]*data-math-placeholder="${placeholder}"[^>]*>[^<]*</div>`,
                    "g"
                  ),
                  `<div data-type="block-math" data-latex="${escapeHtmlAttr(latex)}"></div>`
                );
                // Also replace plain text placeholders
                cleaned = cleaned.replace(
                  placeholder,
                  `<div data-type="block-math" data-latex="${escapeHtmlAttr(latex)}"></div>`
                );
              } else {
                cleaned = cleaned.replace(
                  new RegExp(
                    `<span[^>]*data-math-placeholder="${placeholder}"[^>]*>[^<]*</span>`,
                    "g"
                  ),
                  `<span data-type="inline-math" data-latex="${escapeHtmlAttr(latex)}"></span>`
                );
                cleaned = cleaned.replace(
                  placeholder,
                  `<span data-type="inline-math" data-latex="${escapeHtmlAttr(latex)}"></span>`
                );
              }
            });

            return cleaned;
          },

          handlePaste(view, event) {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const html = clipboardData.getData("text/html");
            if (!html || !isWordContent(html)) return false;

            // Handle base64 images from Word asynchronously
            const doc = parseWordHtml(html);
            const images = extractImages(doc);

            if (images.length > 0 && extensionOptions.onImageUpload) {
              // Process images asynchronously after paste
              const uploadFn = extensionOptions.onImageUpload;
              setTimeout(async () => {
                for (const { src } of images) {
                  try {
                    const url = await uploadFn(src);
                    if (url && url !== src) {
                      // Find and replace the base64 image in the document
                      const { state } = view;
                      const { tr } = state;
                      let replaced = false;

                      state.doc.descendants((node, pos) => {
                        if (
                          replaced ||
                          node.type.name !== "image" ||
                          node.attrs.src !== src
                        )
                          return;

                        tr.setNodeMarkup(pos, undefined, {
                          ...node.attrs,
                          src: url,
                        });
                        replaced = true;
                      });

                      if (replaced) {
                        view.dispatch(tr);
                      }
                    }
                  } catch (err) {
                    console.error("Failed to upload Word image:", err);
                  }
                }
              }, 100);
            }

            // Let the default paste handling continue with the transformed HTML
            return false;
          },
        },
      }),
    ];
  },
});

/**
 * Escape a string for use in an HTML attribute value
 */
function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

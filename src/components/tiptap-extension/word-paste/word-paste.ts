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
import { DOMParser as PMDOMParser } from "@tiptap/pm/model";
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
 * Word wraps math in two conditional comment blocks:
 *   <!--[if gte msEquation 12]><m:oMathPara>...</m:oMathPara><![endif]-->  (OMML - what we want)
 *   <![if !msEquation]><v:shape>...</v:shape><![endif]>                     (image fallback - strip this)
 * DOMParser (text/html) treats <!--[if...]>...</[endif]--> as comments and discards OMML content.
 * We must unwrap the msEquation block and remove the !msEquation fallback block.
 */
function parseWordHtml(html: string): Document {
  // Remove the non-OMML image fallback blocks entirely
  let processed = html.replace(
    /<!\[if !msEquation\]>[\s\S]*?<!\[endif\]>/gi,
    "",
  );
  // Unwrap the OMML conditional comment wrappers so the content is visible to the parser
  processed = processed
    .replace(/<!--\[if gte msEquation[^\]]*\]>/gi, "")
    .replace(/<!\[endif\]-->/gi, "");
  const parser = new DOMParser();
  return parser.parseFromString(processed, "text/html");
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
  const name = parent.localName || parent.nodeName;
  const colonIndex = name.indexOf(":");
  const parentTag = colonIndex >= 0 ? name.slice(colonIndex + 1) : name;
  return parentTag.toLowerCase() === "omathpara";
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
    const oMathElements = findOmmlElements(para as unknown as Document).length
      ? findOmmlElements(para as unknown as Document)
      : Array.from(para.children).filter((child) => {
          const name = child.localName || child.nodeName;
          const colonIdx = name.indexOf(":");
          const tag = colonIdx >= 0 ? name.slice(colonIdx + 1) : name;
          return tag.toLowerCase() === "omath";
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

  // Merge consecutive math block placeholders into a single block.
  // Word often splits multi-line equations into separate oMathPara elements,
  // each in its own <p>. We combine them with \\ line breaks.
  const body = doc.body || doc.documentElement;
  mergeMathBlocks(body, mathBlocks);

  const resultHtml = body.innerHTML;

  return { html: resultHtml, mathBlocks };
}

/**
 * Check if a node is a math block placeholder (or a <p> containing only a math block placeholder).
 * Returns the placeholder key if found, null otherwise.
 */
function getMathPlaceholder(node: Node): string | null {
  if (!(node instanceof Element)) return null;

  // Direct div placeholder
  if (node.getAttribute("data-math-placeholder")) {
    return node.getAttribute("data-math-placeholder");
  }

  // <p> containing only a math block div (possibly with empty spans)
  if (node.tagName === "P") {
    let placeholderDiv: Element | null = null;
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        return null; // has meaningful text
      }
      if (child instanceof Element) {
        if (child.getAttribute("data-math-placeholder")) {
          placeholderDiv = child;
        } else if (child.textContent?.trim()) {
          return null; // has other meaningful content
        }
      }
    }
    return placeholderDiv?.getAttribute("data-math-placeholder") || null;
  }

  return null;
}

/**
 * Check if a node is "empty" — whitespace-only text, empty <span>, empty <p>,
 * or a <p>/<span> containing only whitespace/empty children.
 */
function isEmptyNode(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return !node.textContent?.trim();
  }
  if (node instanceof Element) {
    const tag = node.tagName;
    if (tag === "P" || tag === "SPAN" || tag === "BR") {
      return !node.textContent?.trim();
    }
  }
  return false;
}

/**
 * Merge consecutive math block placeholders into a single block with \\\\ line separators.
 * Skips empty/whitespace-only nodes between math blocks (Word often inserts empty <p>/<span> elements).
 */
function mergeMathBlocks(
  container: Element,
  mathBlocks: Map<string, { latex: string; isBlock: boolean }>,
): void {
  const children = Array.from(container.childNodes);
  let i = 0;

  while (i < children.length) {
    const node = children[i];
    const placeholder = getMathPlaceholder(node as Node);

    if (!placeholder || !mathBlocks.has(placeholder)) {
      i++;
      continue;
    }

    // Found a math block — collect consecutive math blocks, skipping empty nodes
    const group: { placeholder: string; nodeIndex: number }[] = [
      { placeholder, nodeIndex: i },
    ];
    const emptyBetween: number[] = [];
    let j = i + 1;
    while (j < children.length) {
      const next = children[j];
      const nextPlaceholder = getMathPlaceholder(next as Node);
      if (nextPlaceholder && mathBlocks.has(nextPlaceholder)) {
        const nextData = mathBlocks.get(nextPlaceholder)!;
        if (!nextData.isBlock) break;
        group.push({ placeholder: nextPlaceholder, nodeIndex: j });
        j++;
      } else if (isEmptyNode(next)) {
        emptyBetween.push(j);
        j++;
      } else {
        break;
      }
    }

    if (group.length > 1) {
      // Merge: combine latex with \\ line separators
      const lines = group.map((g) => mathBlocks.get(g.placeholder)!.latex);
      const mergedLatex = lines.join(" \\\\ ");

      // Update the first placeholder's latex
      mathBlocks.set(group[0].placeholder, {
        latex: mergedLatex,
        isBlock: true,
      });

      // Remove the merged placeholders (except first) and empty nodes between them from DOM
      const toRemove = [
        ...group.slice(1).map((g) => g.nodeIndex),
        ...emptyBetween,
      ];
      // Remove in reverse order to preserve indices
      toRemove
        .sort((a, b) => b - a)
        .forEach((idx) => {
          const nodeToRemove = children[idx];
          nodeToRemove.parentNode?.removeChild(nodeToRemove);
        });

      // Remove merged entries from mathBlocks map
      for (let k = 1; k < group.length; k++) {
        mathBlocks.delete(group[k].placeholder);
      }
    }

    i = j;
  }
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
    "",
  );

  // Clean up mso-* styles but keep other styles
  html = html.replace(/mso-[^;"]*;?/gi, "");

  // Remove empty paragraphs (with only &nbsp; or whitespace)
  html = html.replace(/<p[^>]*>\s*(&nbsp;|\s)*\s*<\/p>/gi, "");

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
          handlePaste(this, view, event) {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const html = clipboardData.getData("text/html");
            if (!html || !isWordContent(html)) return false;

            // Process the raw Word HTML (with OMML) before the browser sanitizes it
            const { html: processedHtml, mathBlocks } = replaceMathInHtml(html);
            let cleaned = cleanWordHtml(processedHtml);

            // Replace math placeholders with proper HTML nodes that Tiptap can parse
            mathBlocks.forEach(({ latex, isBlock }, placeholder) => {
              if (isBlock) {
                const blockHtml = `<div data-type="block-math" data-latex="${escapeHtmlAttr(latex)}"></div>`;
                cleaned = cleaned.replace(
                  new RegExp(
                    `<div[^>]*data-math-placeholder="${placeholder}"[^>]*>[^<]*</div>`,
                    "g",
                  ),
                  blockHtml,
                );
                cleaned = cleaned.replace(placeholder, blockHtml);
              } else {
                const inlineHtml = `<span data-type="inline-math" data-latex="${escapeHtmlAttr(latex)}"></span>`;
                cleaned = cleaned.replace(
                  new RegExp(
                    `<span[^>]*data-math-placeholder="${placeholder}"[^>]*>[^<]*</span>`,
                    "g",
                  ),
                  inlineHtml,
                );
                cleaned = cleaned.replace(placeholder, inlineHtml);
              }
            });

            // Unwrap block-math divs from surrounding <p> tags.
            // <div> inside <p> is invalid HTML and causes browsers to auto-close
            // the <p>, creating extra empty paragraphs.
            cleaned = cleaned.replace(
              /<p[^>]*>\s*(<div data-type="block-math"[^>]*><\/div>)\s*<\/p>/gi,
              "$1",
            );

            // Parse the processed HTML into ProseMirror nodes and insert
            const { state, dispatch } = view;
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = cleaned;

            const pmSlice = PMDOMParser.fromSchema(state.schema).parseSlice(
              tempDiv,
              {
                preserveWhitespace: false,
                context: state.selection.$from,
              },
            );
            const tr = state.tr.replaceSelection(pmSlice);
            dispatch(tr.scrollIntoView());

            // Handle base64 image upload asynchronously after paste
            if (extensionOptions.onImageUpload) {
              const images = extractImages(parseWordHtml(html));
              if (images.length > 0) {
                const uploadFn = extensionOptions.onImageUpload;
                setTimeout(async () => {
                  for (const { src } of images) {
                    try {
                      const url = await uploadFn(src);
                      if (url && url !== src) {
                        const { state: currentState } = view;
                        const { tr } = currentState;
                        let replaced = false;
                        currentState.doc.descendants((node, pos) => {
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
                        if (replaced) view.dispatch(tr);
                      }
                    } catch (err) {
                      console.error("Failed to upload Word image:", err);
                    }
                  }
                }, 100);
              }
            }

            return true;
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

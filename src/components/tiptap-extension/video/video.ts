import { Node, nodeInputRule } from "@tiptap/core";

import { VIDEO_SIZE } from "@/constants";
import type { GeneralOptions, VideoAlignment } from "@/types";
import { getCssUnitWithDefault } from "@/lib/tiptap-utils";
import { Plugin } from "@tiptap/pm/state";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface VideoOptions extends GeneralOptions {
  allowFullscreen: boolean;
  frameborder: boolean;
  width: number | string;
  HTMLAttributes: Record<string, any>;
  upload?: (file: File) => Promise<string>;
  resourceVideo: "upload" | "link" | "both";
}

interface SetVideoOptions {
  src: string;
  width: number | string;
  align: VideoAlignment;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: Partial<SetVideoOptions>) => ReturnType;
      updateVideo: (options: Partial<SetVideoOptions>) => ReturnType;
    };
  }
}

/* -------------------------------------------------------------------------- */
/* URL Detection                                                              */
/* -------------------------------------------------------------------------- */

const VIDEO_URL_REGEX =
  /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|vimeo\.com\/\d+|.*\.(?:mp4|webm|ogg))(?:\S*)?)$/i;

function isYouTube(src: string) {
  return /youtube\.com|youtu\.be/.test(src);
}

function isVimeo(src: string) {
  return /vimeo\.com/.test(src);
}

function getRenderType(src: string): "iframe" | "video" {
  return isYouTube(src) || isVimeo(src) ? "iframe" : "video";
}

/* -------------------------------------------------------------------------- */
/* Embed Conversion (YouTube & Vimeo only)                                     */
/* -------------------------------------------------------------------------- */

function convertEmbedUrl(src: string) {
  // youtu.be → embed
  src = src
    .replace("https://youtu.be/", "https://www.youtube.com/watch?v=")
    .replace("watch?v=", "embed/");

  // YouTube Shorts
  const shortsMatch = src.match(
    /^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
  );
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = src.match(
    /^https:\/\/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/
  );
  if (vimeoMatch) {
    const [, id, hash] = vimeoMatch;
    return hash
      ? `https://player.vimeo.com/video/${id}?h=${hash}`
      : `https://player.vimeo.com/video/${id}`;
  }

  return src;
}

/* -------------------------------------------------------------------------- */
/* Extension                                                                  */
/* -------------------------------------------------------------------------- */

export const Video = Node.create<VideoOptions>({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  /* -------------------------------- Options ------------------------------- */

  addOptions() {
    return {
      divider: false,
      spacer: false,
      allowFullscreen: true,
      frameborder: false,
      upload: undefined,
      resourceVideo: "both",
      width: VIDEO_SIZE["size-medium"],
      HTMLAttributes: {
        class: "iframe-wrapper",
      },
    };
  },

  /* ------------------------------ Attributes ------------------------------ */

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: this.options.width,
      },
      align: {
        default: "center",
      },
    };
  },

  /* ------------------------------- Parsing -------------------------------- */

  parseHTML() {
    return [
      { tag: "div[data-video] iframe" },
      { tag: "div[data-video] video" },
    ];
  },

  /* ------------------------------- Rendering ------------------------------ */

  renderHTML({ HTMLAttributes }) {
    const { src, width, align } = HTMLAttributes;

    if (!src) return ["div"];

    const type = getRenderType(src);

    const positionStyle = `
      display: flex;
      justify-content: ${align};
    `;

    const containerStyle = `
      position: relative;
      overflow: hidden;
      display: flex;
      flex: 1;
      max-width: ${getCssUnitWithDefault(width)};
    `;

    const ratioStyle = `
      flex: 1;
      padding-bottom: ${(9 / 16) * 100}%;
    `;

    const mediaStyle = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    `;

    const mediaNode =
      type === "iframe"
        ? [
            "iframe",
            {
              src: convertEmbedUrl(src),
              allowfullscreen: this.options.allowFullscreen,
              frameborder: this.options.frameborder ? 1 : 0,
              style: mediaStyle,
            },
          ]
        : [
            "video",
            {
              src,
              controls: true,
              style: mediaStyle,
            },
          ];

    return [
      "div",
      { ...this.options.HTMLAttributes, "data-video": "" },
      [
        "div",
        { style: positionStyle },
        [
          "div",
          { style: containerStyle },
          ["div", { style: ratioStyle }],
          mediaNode,
        ],
      ],
    ];
  },

  /* --------------------------- Auto Conversion ---------------------------- */

  addInputRules() {
    return [
      nodeInputRule({
        find: VIDEO_URL_REGEX,
        type: this.type,
        getAttributes: (match) => {
          console.log("match", match);
          const src = match[1].trim();
          return { src };
        },
      }),
    ];
  },

  /* ------------------------------- Commands ------------------------------- */

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),

      updateVideo:
        (options) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, options),
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view, _event, slice) {
            const { state } = view;
            console.log("state", state);
            const { schema } = state;

            // Never interfere inside code blocks
            if (state.selection.$from.parent.type.name === "codeBlock") {
              return false;
            }

            // Only handle: single text node, single paragraph
            if (
              slice.content.childCount !== 1 ||
              slice.content.firstChild?.type.name !== "paragraph"
            ) {
              return false;
            }

            const paragraph = slice.content.firstChild;
            if (!paragraph || paragraph.childCount !== 1) {
              return false;
            }

            const textNode = paragraph.firstChild;
            if (!textNode || !textNode.isText) {
              return false;
            }

            const text = textNode.text?.trim();
            if (!text || !VIDEO_URL_REGEX.test(text)) {
              return false;
            }

            // ✅ EXACT match: replace with video node
            const tr = state.tr.replaceSelectionWith(
              schema.nodes.video.create({ src: text })
            );

            view.dispatch(tr);
            return true; // stop other handlers
          },
        },
      }),
    ];
  },
});

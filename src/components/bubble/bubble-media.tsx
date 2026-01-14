import { Fragment, useMemo } from "react";

import { BubbleMenu } from "@tiptap/react/menus";

import { Separator } from "../tiptap-ui-primitive/separator";
import {
  getBubbleImage,
  getBubbleVideo,
  type BubbleMenuItem,
} from "./format-bubble";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import type { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import { Video } from "../tiptap-extension/video/video";
import { Image } from "../tiptap-extension/image";

function ItemA({
  item,
  disabled,
  editor,
}: {
  item: BubbleMenuItem;
  disabled?: boolean;
  editor: Editor;
}) {
  const Comp = item.component as any;

  if (!Comp) {
    return <></>;
  }

  return (
    <Fragment>
      {item.type === "divider" ? (
        <Separator
          className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
          orientation="vertical"
        />
      ) : (
        <Comp {...item.componentProps} disabled={disabled} editor={editor} />
      )}
    </Fragment>
  );
}

function isImageNode(node: Node) {
  return node.type.name === Image.name;
}

function isVideoNode(node: Node) {
  return node.type.name === Video.name;
}

function RichTextBubbleImage() {
  // const { lang, t } = useLocale();
  const { editor } = useTiptapEditor();
  const editable = editor?.isEditable;

  const shouldShow = ({ editor }: { editor: Editor }) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isImage = false;

    editor.view.state.doc.nodesBetween($from.pos, to, (node) => {
      if (isImageNode(node)) {
        isImage = true;
        return false; // Stop iteration if an image is found
      }
    });

    return isImage;
  };

  const items = useMemo(() => {
    if (editor) return getBubbleImage(editor);
  }, [editor]);

  console.log("items", items);
  console.log("editable", editable);
  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "bottom", offset: 8, flip: true }}
      pluginKey={"RichTextBubbleImage"}
      shouldShow={shouldShow}
    >
      {items?.length ? (
        <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
          {items?.map((item, i) => {
            return (
              <ItemA
                editor={editor}
                item={item}
                key={`bubbleMenu-image-${i}`}
              />
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </BubbleMenu>
  );
}

// function RichTextBubbleImageGif() {
//   const editable = useEditableEditor();
//   const editor = useEditorInstance();

//   const shouldShow = ({ editor }: any) => {
//     const { selection } = editor.view.state;
//     const { $from, to } = selection;
//     let isImage = false;

//     editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
//       if (isImageGifNode(node)) {
//         isImage = true;
//         return false; // Stop iteration if an image is found
//       }
//     });

//     return isImage;
//   };

//   const items = useMemo(() => {
//     return getBubbleImageGif(editor);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [editor]);

//   if (!editable) {
//     return <></>;
//   }

//   return (
//     <BubbleMenu
//       editor={editor}
//       options={{ placement: 'bottom', offset: 8, flip: true }}
//       pluginKey={'RichTextBubbleImageGif'}
//       shouldShow={shouldShow}
//     >
//       {items?.length
//         ? (

//             <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
//               {items?.map((item: any, key: any) => {
//                 return (
//                   <ItemA
//                     editor={editor}
//                     item={item}
//                     key={`bubbleMenu-image-gif-${key}`}
//                   />
//                 );
//               })}

//             </div>
//         )
//         : (
//           <></>
//         )}
//     </BubbleMenu>
//   );
// }

function RichTextBubbleVideo() {
  const { editor } = useTiptapEditor();

  const editable = editor?.isEditable;

  const shouldShow = ({ editor }: { editor: Editor }) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isVideo = false;

    editor.view.state.doc.nodesBetween($from.pos, to, (node: Node) => {
      if (isVideoNode(node)) {
        isVideo = true;
        return false;
      }
    });

    return isVideo;
  };

  const items = useMemo(() => {
    if (editor) return getBubbleVideo(editor);
  }, [editor]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "bottom", offset: 8, flip: true }}
      pluginKey={"RichTextBubbleVideo"}
      shouldShow={shouldShow}
    >
      {items?.length ? (
        <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
          {items?.map((item, i) => {
            return (
              <ItemA
                editor={editor}
                item={item}
                key={`bubbleMenu-video-${i}`}
              />
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </BubbleMenu>
  );
}

export {
  RichTextBubbleImage,
  RichTextBubbleVideo /* RichTextBubbleImageGif */,
};

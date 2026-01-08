import type { ButtonViewReturn, ExtensionNameKeys, VideoAlignment } from "@/types";
import type { Editor } from "@tiptap/core";
import { ActionButton } from "../tiptap-ui/buttons/action-button";
import { IMAGE_SIZE } from "@/constants";
import { deleteSelection } from '@tiptap/pm/commands';

/** Represents the size types for bubble images or videos */
type BubbleImageOrVideoSizeType = 'size-small' | 'size-medium' | 'size-large';
type ImageAlignments = 'left' | 'center' | 'right';

/** Represents the various types for bubble images */
type BubbleImageType =
  | `image-${BubbleImageOrVideoSizeType}`
  | `video-${BubbleImageOrVideoSizeType}`
  | 'image'
  | 'image-aspect-ratio'
  | 'remove';

/** Represents the types for bubble videos */
type BubbleVideoType = 'video' | 'remove';

/** Represents the overall types for bubbles */
type BubbleAllType =
  | BubbleImageType
  | BubbleVideoType
  | ExtensionNameKeys
  | 'divider'
  | (string & {});

/** Represents the key types for node types */
export type NodeTypeKey = 'image' | 'text' | 'video';

/** Represents the menu of bubble types for each node type */
export type BubbleTypeMenu = Partial<Record<NodeTypeKey, BubbleMenuItem[]>>;

/** Represents the menu of overall bubble types for each node type */
export type NodeTypeMenu = Partial<Record<NodeTypeKey, BubbleAllType[]>>;

/**
 * Represents the structure of a bubble menu item.
 */
export interface BubbleMenuItem extends ButtonViewReturn {
  /** The type of the bubble item */
  type: BubbleAllType
}


function imageSizeMenus(editor: Editor): BubbleMenuItem[] {
  const types: BubbleImageOrVideoSizeType[] = ['size-small', 'size-medium', 'size-large'];
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = [
    'SizeS',
    'SizeM',
    'SizeL',
  ];

  return types.map((size, i) => ({
    type: `image-${size}`,
    component: ActionButton,
    componentProps: {
      tooltip: types[i].replace('size-', '').toUpperCase(),
      icon: icons[i],
      action: () => editor.commands.updateImage({ width: IMAGE_SIZE[size] }),
      isActive: () => editor.isActive('image', { width: IMAGE_SIZE[size] }),
    },
  }));
}

function imageAlignMenus(editor: Editor ): BubbleMenuItem[] {
  const types: ImageAlignments[] = ['left', 'center', 'right'];
  const iconMap: any = {
    left: 'AlignLeft',
    center: 'AlignCenter',
    right: 'AlignRight',
  };
  return types.map(k => ({
    type: `image-${k}`,
    component: ActionButton,
    componentProps: {
      tooltip: `Align ${k}`,
      icon: iconMap[k],
      action: () => editor.commands?.setAlignImage?.(k),
      isActive: () => editor.isActive({ align: k }) || false,
      disabled: false,
    },
  }));
}

export function getBubbleImage(editor: Editor): BubbleMenuItem[] {
  return [
    {
      type: 'flipX',
      component: ActionButton,
      componentProps: {
        editor,
        tooltip: 'Flip X',
        icon: 'FlipX',
        action: () => {
          const image = editor.getAttributes('image');
          const { flipX } = image as any;
          editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .updateImage({
              flipX: !flipX,
            })
            .run();
        },
      },
    },
    {
      type: 'flipY',
      component: ActionButton,
      componentProps: {
        editor,
        tooltip: 'Flip Y',
        icon: 'FlipY',
        action: () => {
          const image = editor.getAttributes('image');
          const { flipY } = image as any;
          editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .updateImage({
              flipY: !flipY,
            })
            .run();
        },
      },
    },
    ...imageSizeMenus(editor),
    ...imageAlignMenus(editor),
    {
      type: 'remove',
      component: ActionButton,
      componentProps: {
        editor,
        tooltip: "Remove",
        icon: 'Trash2',
        action: () => {
          const { state, dispatch } = editor.view;
          deleteSelection(state, dispatch);
        },
      },
    },
  ];
}

function videoAlignMenus(editor: Editor): BubbleMenuItem[] {
  const alignments: {
    type: VideoAlignment;
    icon: string;
    tooltip: string;
  }[] = [
    { type: 'flex-start', icon: 'AlignLeft', tooltip: 'Align left' },
    { type: 'center', icon: 'AlignCenter', tooltip: 'Align center' },
    { type: 'flex-end', icon: 'AlignRight', tooltip: 'Align right' },
  ];

  return alignments.map((align) => ({
    type: `video-align-${align.type}`,
    component: ActionButton,
    componentProps: {
      tooltip: align.tooltip,
      icon: align.icon,
      action: () => editor.commands.updateVideo({ align: align.type }),
      isActive: () => editor.getAttributes('video').align === align.type,
    },
  }));
}

function videoSizeMenus(editor: Editor, t: any): BubbleMenuItem[] {
  const types: BubbleImageOrVideoSizeType[] = ['size-small', 'size-medium', 'size-large'];
  const icons: NonNullable<ButtonViewReturn['componentProps']['icon']>[] = [
    'SizeS',
    'SizeM',
    'SizeL',
  ];

  return types.map((size, i) => ({
    type: `video-${size}`,
    component: ActionButton,
    componentProps: {
      tooltip: t(`editor.${size.replace('-', '.')}.tooltip` as any),
      icon: icons[i],
      action: () => editor.commands.updateVideo({ width: VIDEO_SIZE[size] }),
      isActive: () => editor.isActive('video', { width: VIDEO_SIZE[size] }),
    },
  }));
}


export function getBubbleVideo(editor: Editor, t: any): BubbleMenuItem[] {
  return [
    ...videoSizeMenus(editor, t),
    ...videoAlignMenus(editor),
    {
      type: 'remove',
      component: ActionButton,
      componentProps: {
        editor,
        tooltip: t('editor.remove'),
        icon: 'Trash2',
        action: () => {
          const { state, dispatch } = editor.view;
          deleteSelection(state, dispatch);
        },
      },
    },
  ];
}
import { ButtonViewReturn, ExtensionNameKeys } from '../../types';
import { Editor } from '@tiptap/core';
/** Represents the size types for bubble images or videos */
type BubbleImageOrVideoSizeType = "size-small" | "size-medium" | "size-large";
/** Represents the various types for bubble images */
type BubbleImageType = `image-${BubbleImageOrVideoSizeType}` | `video-${BubbleImageOrVideoSizeType}` | "image" | "image-aspect-ratio" | "remove";
/** Represents the types for bubble videos */
type BubbleVideoType = "video" | "remove";
/** Represents the overall types for bubbles */
type BubbleAllType = BubbleImageType | BubbleVideoType | ExtensionNameKeys | "divider" | (string & {});
/** Represents the key types for node types */
export type NodeTypeKey = "image" | "text" | "video";
/** Represents the menu of bubble types for each node type */
export type BubbleTypeMenu = Partial<Record<NodeTypeKey, BubbleMenuItem[]>>;
/** Represents the menu of overall bubble types for each node type */
export type NodeTypeMenu = Partial<Record<NodeTypeKey, BubbleAllType[]>>;
/**
 * Represents the structure of a bubble menu item.
 */
export interface BubbleMenuItem extends ButtonViewReturn {
    /** The type of the bubble item */
    type: BubbleAllType;
}
export declare function getBubbleImage(editor: Editor): BubbleMenuItem[];
export declare function getBubbleVideo(editor: Editor): BubbleMenuItem[];
export {};

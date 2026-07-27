import { Editor } from '@tiptap/react';
export interface CursorVisibilityOptions {
    /**
     * The Tiptap editor instance
     */
    editor?: Editor | null;
    /**
     * Reference to the toolbar element that may obscure the cursor
     */
    toolbarRef?: React.RefObject<HTMLDivElement | null>;
}
/**
 * Custom hook that ensures the cursor remains visible when typing in a Tiptap editor.
 * Automatically scrolls the window when the cursor would be hidden by the toolbar.
 *
 * @param options.editor The Tiptap editor instance
 * @param options.overlayHeight Toolbar height to account for
 * @returns The bounding rect of the body
 */
export declare function useCursorVisibility({ editor, toolbarRef }: CursorVisibilityOptions): import('./use-element-rect').RectState;

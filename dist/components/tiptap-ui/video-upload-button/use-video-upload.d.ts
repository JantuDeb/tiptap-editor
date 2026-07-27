import { Editor } from '@tiptap/react';
export declare const VIDEO_UPLOAD_SHORTCUT_KEY = "mod+shift+v";
/**
 * Configuration for the video upload functionality
 */
export interface UseVideoUploadConfig {
    /**
     * The Tiptap editor instance.
     */
    editor?: Editor | null;
    /**
     * Whether the button should hide when insertion is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean;
    /**
     * Callback function called after a successful video insertion.
     */
    onInserted?: () => void;
}
/**
 * Checks if video can be inserted in the current editor state
 */
export declare function canInsertVideo(editor: Editor | null): boolean;
/**
 * Checks if video is currently active
 */
export declare function isVideoActive(editor: Editor | null): boolean;
/**
 * Inserts a video in the editor
 */
export declare function insertVideo(editor: Editor | null): boolean;
/**
 * Determines if the video button should be shown
 */
export declare function shouldShowButton(props: {
    editor: Editor | null;
    hideWhenUnavailable: boolean;
}): boolean;
/**
 * Custom hook that provides video functionality for Tiptap editor
 */
export declare function useVideoUpload(config?: UseVideoUploadConfig): {
    isVisible: boolean;
    isActive: boolean;
    handleVideo: () => boolean;
    canInsert: boolean;
    label: string;
    shortcutKeys: string;
    Icon: ({ className, ...props }: import('react').SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
};

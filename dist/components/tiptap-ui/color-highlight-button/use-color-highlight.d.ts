import { Editor } from '@tiptap/react';
export declare const COLOR_HIGHLIGHT_SHORTCUT_KEY = "mod+shift+h";
export declare const HIGHLIGHT_COLORS: {
    label: string;
    value: string;
    border: string;
}[];
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];
export type HighlightMode = "mark" | "node";
/**
 * Configuration for the color highlight functionality
 */
export interface UseColorHighlightConfig {
    /**
     * The Tiptap editor instance.
     */
    editor?: Editor | null;
    /**
     * The color to apply when toggling the highlight.
     */
    highlightColor?: string;
    /**
     * Optional label to display alongside the icon.
     */
    label?: string;
    /**
     * Whether the button should hide when the mark is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean;
    /**
     * The highlighting mode to use.
     * - "mark": Uses the highlight mark extension (default)
     * - "node": Uses the node background extension
     * @default "mark"
     */
    mode?: HighlightMode;
    /**
     * Called when the highlight is applied.
     */
    onApplied?: ({ color, label, mode, }: {
        color: string;
        label: string;
        mode: HighlightMode;
    }) => void;
}
export declare function pickHighlightColorsByValue(values: string[]): {
    label: string;
    value: string;
    border: string;
}[];
/**
 * Checks if highlight can be applied based on the mode and current editor state
 */
export declare function canColorHighlight(editor: Editor | null, mode?: HighlightMode): boolean;
/**
 * Checks if highlight is currently active
 */
export declare function isColorHighlightActive(editor: Editor | null, highlightColor?: string, mode?: HighlightMode): boolean;
/**
 * Removes highlight based on the mode
 */
export declare function removeHighlight(editor: Editor | null, mode?: HighlightMode): boolean;
/**
 * Determines if the highlight button should be shown
 */
export declare function shouldShowButton(props: {
    editor: Editor | null;
    hideWhenUnavailable: boolean;
    mode: HighlightMode;
}): boolean;
export declare function useColorHighlight(config: UseColorHighlightConfig): {
    isVisible: boolean;
    isActive: boolean;
    handleColorHighlight: () => boolean;
    handleRemoveHighlight: () => boolean;
    canColorHighlight: boolean;
    label: string;
    shortcutKeys: string;
    Icon: import('react').MemoExoticComponent<({ className, ...props }: Omit<import('react').SVGProps<SVGSVGElement>, "ref">) => import("react/jsx-runtime").JSX.Element>;
    mode: HighlightMode;
};

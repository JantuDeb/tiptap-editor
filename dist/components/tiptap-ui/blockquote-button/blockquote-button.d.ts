import { UseBlockquoteConfig } from '.';
import { ButtonProps } from '../../tiptap-ui-primitive/button';
export interface BlockquoteButtonProps extends Omit<ButtonProps, "type">, UseBlockquoteConfig {
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Optional show shortcut keys in the button.
     * @default false
     */
    showShortcut?: boolean;
}
export declare function BlockquoteShortcutBadge({ shortcutKeys, }: {
    shortcutKeys?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Button component for toggling blockquote in a Tiptap editor.
 *
 * For custom button implementations, use the `useBlockquote` hook instead.
 */
export declare const BlockquoteButton: import('react').ForwardRefExoticComponent<BlockquoteButtonProps & import('react').RefAttributes<HTMLButtonElement>>;

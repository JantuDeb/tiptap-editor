import { UseCodeBlockConfig } from '.';
import { ButtonProps } from '../../tiptap-ui-primitive/button';
export interface CodeBlockButtonProps extends Omit<ButtonProps, "type">, UseCodeBlockConfig {
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
export declare function CodeBlockShortcutBadge({ shortcutKeys, }: {
    shortcutKeys?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Button component for toggling code block in a Tiptap editor.
 *
 * For custom button implementations, use the `useCodeBlock` hook instead.
 */
export declare const CodeBlockButton: import('react').ForwardRefExoticComponent<CodeBlockButtonProps & import('react').RefAttributes<HTMLButtonElement>>;

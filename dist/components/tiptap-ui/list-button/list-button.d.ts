import { ButtonProps } from '../../tiptap-ui-primitive/button';
import { ListType, UseListConfig } from '.';
export interface ListButtonProps extends Omit<ButtonProps, "type">, UseListConfig {
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
export declare function ListShortcutBadge({ type, shortcutKeys, }: {
    type: ListType;
    shortcutKeys?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Button component for toggling lists in a Tiptap editor.
 *
 * For custom button implementations, use the `useList` hook instead.
 */
export declare const ListButton: import('react').ForwardRefExoticComponent<ListButtonProps & import('react').RefAttributes<HTMLButtonElement>>;

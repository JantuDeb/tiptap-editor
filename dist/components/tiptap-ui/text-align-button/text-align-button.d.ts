import { TextAlign, UseTextAlignConfig } from '.';
import { ButtonProps } from '../../tiptap-ui-primitive/button';
type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;
export interface TextAlignButtonProps extends Omit<ButtonProps, "type">, UseTextAlignConfig {
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Optional show shortcut keys in the button.
     * @default false
     */
    showShortcut?: boolean;
    /**
     * Optional custom icon component to render instead of the default.
     */
    icon?: React.MemoExoticComponent<IconComponent> | React.FC<IconProps>;
}
export declare function TextAlignShortcutBadge({ align, shortcutKeys, }: {
    align: TextAlign;
    shortcutKeys?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Button component for setting text alignment in a Tiptap editor.
 *
 * For custom button implementations, use the `useTextAlign` hook instead.
 */
export declare const TextAlignButton: import('react').ForwardRefExoticComponent<TextAlignButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export {};

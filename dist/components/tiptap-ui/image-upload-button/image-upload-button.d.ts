import { UseImageUploadConfig } from '.';
import { ButtonProps } from '../../tiptap-ui-primitive/button';
type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;
export interface ImageUploadButtonProps extends Omit<ButtonProps, "type">, UseImageUploadConfig {
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
export declare function ImageShortcutBadge({ shortcutKeys, }: {
    shortcutKeys?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Button component for uploading/inserting images in a Tiptap editor.
 *
 * For custom button implementations, use the `useImage` hook instead.
 */
export declare const ImageUploadButton: import('react').ForwardRefExoticComponent<ImageUploadButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export {};

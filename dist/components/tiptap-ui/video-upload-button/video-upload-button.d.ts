import { UseVideoUploadConfig } from '.';
import { ButtonProps } from '../../tiptap-ui-primitive/button';
type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;
export interface VideoUploadButtonProps extends Omit<ButtonProps, "type">, UseVideoUploadConfig {
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
export declare function VideoShortcutBadge({ shortcutKeys, }: {
    shortcutKeys?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Button component for uploading/inserting videos in a Tiptap editor.
 */
export declare const VideoUploadButton: import('react').ForwardRefExoticComponent<VideoUploadButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export {};

import { UseHeadingDropdownMenuConfig } from '.';
import { ButtonProps } from '../../tiptap-ui-primitive/button';
export interface HeadingDropdownMenuProps extends Omit<ButtonProps, "type">, UseHeadingDropdownMenuConfig {
    /**
     * Whether to render the dropdown menu in a portal
     * @default false
     */
    portal?: boolean;
    /**
     * Callback for when the dropdown opens or closes
     */
    onOpenChange?: (isOpen: boolean) => void;
}
/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export declare const HeadingDropdownMenu: import('react').ForwardRefExoticComponent<HeadingDropdownMenuProps & import('react').RefAttributes<HTMLButtonElement>>;
export default HeadingDropdownMenu;

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
declare function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare const DropdownMenuTrigger: import('react').ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuTriggerProps & import('react').RefAttributes<HTMLButtonElement>, "ref"> & import('react').RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: import('react').ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & import('react').RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSub: import('react').FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
declare const DropdownMenuRadioGroup: import('react').ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & import('react').RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: import('react').ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuItemProps & import('react').RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: import('react').ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & import('react').RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: import('react').ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & import('react').RefAttributes<HTMLDivElement>, "ref"> & {
    portal?: boolean | React.ComponentProps<typeof DropdownMenuPortal>;
} & import('react').RefAttributes<HTMLDivElement>>;
declare const DropdownMenuContent: import('react').ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & import('react').RefAttributes<HTMLDivElement>, "ref"> & {
    portal?: boolean;
} & import('react').RefAttributes<HTMLDivElement>>;
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSub, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup, };

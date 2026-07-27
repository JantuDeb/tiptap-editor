import { FloatingPortal, Placement } from '@floating-ui/react';
interface TooltipProviderProps {
    children: React.ReactNode;
    initialOpen?: boolean;
    placement?: Placement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    delay?: number;
    closeDelay?: number;
    timeout?: number;
    useDelayGroup?: boolean;
}
interface TooltipTriggerProps extends Omit<React.HTMLProps<HTMLElement>, "ref"> {
    asChild?: boolean;
    children: React.ReactNode;
}
interface TooltipContentProps extends Omit<React.HTMLProps<HTMLDivElement>, "ref"> {
    children?: React.ReactNode;
    portal?: boolean;
    portalProps?: Omit<React.ComponentProps<typeof FloatingPortal>, "children">;
}
export declare function Tooltip({ children, ...props }: TooltipProviderProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Tooltip {
    var displayName: string;
}
export declare const TooltipTrigger: import('react').ForwardRefExoticComponent<TooltipTriggerProps & import('react').RefAttributes<HTMLElement>>;
export declare const TooltipContent: import('react').ForwardRefExoticComponent<TooltipContentProps & import('react').RefAttributes<HTMLDivElement>>;
export {};

type BaseProps = React.HTMLAttributes<HTMLDivElement>;
interface ToolbarProps extends BaseProps {
    variant?: "floating" | "fixed";
}
export declare const Toolbar: import('react').ForwardRefExoticComponent<ToolbarProps & import('react').RefAttributes<HTMLDivElement>>;
export declare const ToolbarGroup: import('react').ForwardRefExoticComponent<BaseProps & import('react').RefAttributes<HTMLDivElement>>;
export declare const ToolbarSeparator: import('react').ForwardRefExoticComponent<BaseProps & import('react').RefAttributes<HTMLDivElement>>;
export {};

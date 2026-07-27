export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    showTooltip?: boolean;
    tooltip?: React.ReactNode;
    shortcutKeys?: string;
}
export declare const ShortcutDisplay: React.FC<{
    shortcuts: string[];
}>;
export declare const Button: import('react').ForwardRefExoticComponent<ButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export declare const ButtonGroup: import('react').ForwardRefExoticComponent<Omit<import('react').ClassAttributes<HTMLDivElement> & import('react').HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
}, "ref"> & import('react').RefAttributes<HTMLDivElement>>;
export default Button;

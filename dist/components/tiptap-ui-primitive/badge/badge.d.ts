export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "ghost" | "white" | "gray" | "green" | "default";
    size?: "default" | "small";
    appearance?: "default" | "subdued" | "emphasized";
    trimText?: boolean;
}
export declare const Badge: import('react').ForwardRefExoticComponent<BadgeProps & import('react').RefAttributes<HTMLDivElement>>;
export default Badge;

export type Orientation = "horizontal" | "vertical";
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: Orientation;
    decorative?: boolean;
}
export declare const Separator: import('react').ForwardRefExoticComponent<SeparatorProps & import('react').RefAttributes<HTMLDivElement>>;

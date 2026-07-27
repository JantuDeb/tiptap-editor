export type SpacerOrientation = "horizontal" | "vertical";
export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: SpacerOrientation;
    size?: string | number;
}
export declare function Spacer({ orientation, size, style, ...props }: SpacerProps): import("react/jsx-runtime").JSX.Element;

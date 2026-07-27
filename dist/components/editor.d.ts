export type EditorContentType = "html" | "json" | "markdown";
export interface OnChangeParams {
    html: string;
    markdown: string;
    json: Record<string, any>;
}
export interface EditorProps {
    initialValue?: string | Record<string, any>;
    contentType?: EditorContentType;
    className?: string;
    onImageUpload?: (file: File) => Promise<string>;
    onVideoUpload?: (file: File) => Promise<string>;
    onChange?: (content: OnChangeParams) => void;
    variant?: "fullpage" | "input";
    minHeight?: number;
    maxHeight?: number;
    placeholder?: string;
    resize?: "none" | "vertical" | "horizontal" | "both";
    showToolbarOnFocus?: boolean;
}
export declare function Editor({ initialValue, contentType, className, onImageUpload, onVideoUpload, onChange, variant, minHeight, maxHeight, placeholder, resize, }: EditorProps): import("react/jsx-runtime").JSX.Element;

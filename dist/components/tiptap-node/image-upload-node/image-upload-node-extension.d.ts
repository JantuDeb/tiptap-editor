import { Node } from '@tiptap/react';
import { NodeType } from '@tiptap/pm/model';
export type UploadFunction = (file: File, onProgress?: (event: {
    progress: number;
}) => void, abortSignal?: AbortSignal) => Promise<string>;
export interface ImageUploadNodeOptions {
    /**
     * The type of the node.
     * @default 'image'
     */
    type?: string | NodeType | undefined;
    /**
     * Acceptable file types for upload.
     * @default 'image/*'
     */
    accept?: string;
    /**
     * Maximum number of files that can be uploaded.
     * @default 1
     */
    limit?: number;
    /**
     * Maximum file size in bytes (0 for unlimited).
     * @default 0
     */
    maxSize?: number;
    /**
     * Function to handle the upload process.
     */
    upload?: UploadFunction;
    /**
     * Callback for upload errors.
     */
    onError?: (error: Error) => void;
    /**
     * Callback for successful uploads.
     */
    onSuccess?: (url: string) => void;
    /**
     * HTML attributes to add to the image element.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>;
}
declare module "@tiptap/react" {
    interface Commands<ReturnType> {
        imageUpload: {
            setImageUploadNode: (options?: ImageUploadNodeOptions) => ReturnType;
        };
    }
}
/**
 * A Tiptap node extension that creates an image upload component.
 * @see registry/tiptap-node/image-upload-node/image-upload-node
 */
export declare const ImageUploadNode: Node<ImageUploadNodeOptions, any>;
export default ImageUploadNode;

import { Node } from '@tiptap/react';
import { NodeType } from '@tiptap/pm/model';
export type UploadFunction = (file: File, onProgress?: (event: {
    progress: number;
}) => void, abortSignal?: AbortSignal) => Promise<string>;
export interface VideoUploadNodeOptions {
    /**
     * The type of the node.
     * @default 'video'
     */
    type?: string | NodeType | undefined;
    /**
     * Acceptable file types for upload.
     * @default 'video/*'
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
     * HTML attributes to add to the video element.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>;
}
declare module "@tiptap/react" {
    interface Commands<ReturnType> {
        videoUpload: {
            setVideoUploadNode: (options?: VideoUploadNodeOptions) => ReturnType;
        };
    }
}
/**
 * A Tiptap node extension that creates a video upload component.
 * @see registry/tiptap-node/video-upload-node/video-upload-node
 */
export declare const VideoUploadNode: Node<VideoUploadNodeOptions, any>;
export default VideoUploadNode;

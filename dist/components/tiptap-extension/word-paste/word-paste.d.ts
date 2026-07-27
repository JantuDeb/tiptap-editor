import { Extension } from '@tiptap/core';
export interface WordPasteOptions {
    /**
     * Callback to upload images. Receives a base64 data URL and returns a promise
     * that resolves to the final image URL.
     * If not provided, base64 images are inserted directly.
     */
    onImageUpload?: (dataUrl: string) => Promise<string>;
}
export declare const WordPaste: Extension<WordPasteOptions, any>;

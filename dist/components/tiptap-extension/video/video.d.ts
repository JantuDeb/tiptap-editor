import { Node } from '@tiptap/core';
import { GeneralOptions, VideoAlignment } from '../../../types';
export interface VideoOptions extends GeneralOptions {
    allowFullscreen: boolean;
    frameborder: boolean;
    width: number | string;
    HTMLAttributes: Record<string, any>;
    upload?: (file: File) => Promise<string>;
    resourceVideo: "upload" | "link" | "both";
}
interface SetVideoOptions {
    src: string;
    width: number | string;
    align: VideoAlignment;
}
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        video: {
            setVideo: (options: Partial<SetVideoOptions>) => ReturnType;
            updateVideo: (options: Partial<SetVideoOptions>) => ReturnType;
        };
    }
}
export declare const Video: Node<VideoOptions, any>;
export {};

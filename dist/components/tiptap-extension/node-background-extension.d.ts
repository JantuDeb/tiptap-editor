import { Extension } from '@tiptap/core';
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        nodeBackground: {
            setNodeBackgroundColor: (backgroundColor: string) => ReturnType;
            unsetNodeBackgroundColor: () => ReturnType;
            toggleNodeBackgroundColor: (backgroundColor: string) => ReturnType;
        };
    }
}
export interface NodeBackgroundOptions {
    /**
     * Node types that should support background colors
     * @default ["paragraph", "heading", "blockquote", "taskList", "bulletList", "orderedList", "tableCell", "tableHeader"]
     */
    types: string[];
    /**
     * Use inline style instead of data attribute
     * @default true
     */
    useStyle?: boolean;
}
export declare const NodeBackground: Extension<NodeBackgroundOptions, any>;

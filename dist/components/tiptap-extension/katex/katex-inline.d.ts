import { Node } from '@tiptap/core';
import { Node as PMNode } from '@tiptap/pm/model';
import { KatexOptions } from 'katex';
/**
 * Configuration options for the InlineMath extension.
 */
export type InlineMathOptions = {
    /**
     * KaTeX specific options
     * @see https://katex.org/docs/options.html
     * @example
     * ```ts
     * katexOptions: {
     *   displayMode: false,
     *   throwOnError: false,
     *   macros: {
     *     '\\RR': '\\mathbb{R}',
     *     '\\ZZ': '\\mathbb{Z}'
     *   }
     * }
     * ```
     */
    katexOptions?: KatexOptions;
    /**
     * Optional click handler for inline math nodes.
     * Called when a user clicks on an inline math expression in the editor.
     *
     * @param node - The ProseMirror node representing the inline math element
     * @param pos - The position of the node within the document
     * @example
     * ```ts
     * onClick: (node, pos) => {
     *   console.log('Inline math clicked:', node.attrs.latex, 'at position:', pos)
     * }
     * ```
     */
    onClick?: (node: PMNode, pos: number) => void;
};
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        inlineMath: {
            /**
             * Insert a inline math node with LaTeX string.
             * @param options - Options for inserting inline math.
             * @returns ReturnType
             */
            insertInlineMath: (options: {
                latex: string;
                pos?: number;
            }) => ReturnType;
            /**
             * Delete an inline math node.
             * @returns ReturnType
             */
            deleteInlineMath: (options?: {
                pos?: number;
            }) => ReturnType;
            /**
             * Update inline math node with optional LaTeX string.
             * @param options - Options for updating inline math.
             * @returns ReturnType
             */
            updateInlineMath: (options?: {
                latex?: string;
                pos?: number;
            }) => ReturnType;
        };
    }
}
/**
 * InlineMath is a Tiptap extension for rendering inline mathematical expressions using KaTeX.
 * It allows users to insert LaTeX formatted math expressions inline within text.
 * It supports rendering, input rules for LaTeX syntax, and click handling for interaction.
 *
 * @example
 * ```javascript
 * import { InlineMath } from '@tiptap/extension-mathematics'
 * import { Editor } from '@tiptap/core'
 *
 * const editor = new Editor({
 *   extensions: [
 *     InlineMath.configure({
 *       onClick: (node, pos) => {
 *         console.log('Inline math clicked:', node.attrs.latex, 'at position:', pos)
 *       },
 *     }),
 *   ],
 * })
 */
export declare const InlineMath: Node<InlineMathOptions, any>;

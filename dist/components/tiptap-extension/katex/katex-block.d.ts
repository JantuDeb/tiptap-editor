import { Node } from '@tiptap/core';
import { Node as PMNode } from '@tiptap/pm/model';
import { KatexOptions } from 'katex';
import { MathfieldElement } from 'mathlive';
declare global {
    interface HTMLElementTagNameMap {
        "math-field": MathfieldElement;
    }
}
/**
 * Configuration options for the BlockMath extension.
 */
export type BlockMathOptions = {
    /**
     * KaTeX specific options
     * @see https://katex.org/docs/options.html
     * @example
     * ```ts
     * katexOptions: {
     *   displayMode: true,
     *   throwOnError: false,
     * },
     */
    katexOptions?: KatexOptions;
    /**
     * Optional click handler for block math nodes.
     * Called when a user clicks on a block math expression in the editor.
     *
     * @param node - The ProseMirror node representing the block math element
     * @param pos - The position of the node within the document
     * @example
     * ```ts
     * onClick: (node, pos) => {
     *   console.log('Block math clicked:', node.attrs.latex, 'at position:', pos)
     * },
     * ```
     */
    onClick?: (node: PMNode, pos: number) => void;
};
declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        insertBlockMath: {
            /**
             * Inserts a math block node with LaTeX string.
             * @param options - Options for inserting block math.
             * @returns ReturnType
             */
            insertBlockMath: (options: {
                latex: string;
                pos?: number;
            }) => ReturnType;
            /**
             * Deletes a block math node.
             * @returns ReturnType
             */
            deleteBlockMath: (options?: {
                pos?: number;
            }) => ReturnType;
            /**
             * Update block math node with optional LaTeX string.
             * @param options - Options for updating block math.
             * @returns ReturnType
             */
            updateBlockMath: (options?: {
                latex: string;
                pos?: number;
            }) => ReturnType;
        };
    }
}
/**
 * BlockMath is a Tiptap extension for rendering block mathematical expressions using KaTeX.
 * It allows users to insert LaTeX formatted math expressions block within text.
 * It supports rendering, input rules for LaTeX syntax, and click handling for interaction.
 *
 * @example
 * ```javascript
 * import { BlockMath } from '@tiptap/extension-mathematics'
 * import { Editor } from '@tiptap/core'
 *
 * const editor = new Editor({
 *   extensions: [
 *     BlockMath.configure({
 *       onClick: (node, pos) => {
 *         console.log('Block math clicked:', node.attrs.latex, 'at position:', pos)
 *       },
 *     }),
 *   ],
 * })
 */
export declare const BlockMath: Node<BlockMathOptions, any>;

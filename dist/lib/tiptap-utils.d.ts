import { Node as PMNode } from '@tiptap/pm/model';
import { Transaction, Selection } from '@tiptap/pm/state';
import { Editor, NodeWithPos } from '@tiptap/react';
export declare const MAX_FILE_SIZE: number;
export declare const MAC_SYMBOLS: Record<string, string>;
export declare const SR_ONLY: {
    readonly position: "absolute";
    readonly width: "1px";
    readonly height: "1px";
    readonly padding: 0;
    readonly margin: "-1px";
    readonly overflow: "hidden";
    readonly clip: "rect(0, 0, 0, 0)";
    readonly whiteSpace: "nowrap";
    readonly borderWidth: 0;
};
export declare function cn(...classes: (string | boolean | undefined | null)[]): string;
/**
 * Determines if the current platform is macOS
 * @returns boolean indicating if the current platform is Mac
 */
export declare function isMac(): boolean;
/**
 * Formats a shortcut key based on the platform (Mac or non-Mac)
 * @param key - The key to format (e.g., "ctrl", "alt", "shift")
 * @param isMac - Boolean indicating if the platform is Mac
 * @param capitalize - Whether to capitalize the key (default: true)
 * @returns Formatted shortcut key symbol
 */
export declare const formatShortcutKey: (key: string, isMac: boolean, capitalize?: boolean) => string;
/**
 * Parses a shortcut key string into an array of formatted key symbols
 * @param shortcutKeys - The string of shortcut keys (e.g., "ctrl-alt-shift")
 * @param delimiter - The delimiter used to split the keys (default: "-")
 * @param capitalize - Whether to capitalize the keys (default: true)
 * @returns Array of formatted shortcut key symbols
 */
export declare const parseShortcutKeys: (props: {
    shortcutKeys: string | undefined;
    delimiter?: string;
    capitalize?: boolean;
}) => string[];
/**
 * Checks if a mark exists in the editor schema
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 * @returns boolean indicating if the mark exists in the schema
 */
export declare const isMarkInSchema: (markName: string, editor: Editor | null) => boolean;
/**
 * Checks if a node exists in the editor schema
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 * @returns boolean indicating if the node exists in the schema
 */
export declare const isNodeInSchema: (nodeName: string, editor: Editor | null) => boolean;
/**
 * Moves the focus to the next node in the editor
 * @param editor - The editor instance
 * @returns boolean indicating if the focus was moved
 */
export declare function focusNextNode(editor: Editor): boolean;
/**
 * Checks if a value is a valid number (not null, undefined, or NaN)
 * @param value - The value to check
 * @returns boolean indicating if the value is a valid number
 */
export declare function isValidPosition(pos: number | null | undefined): pos is number;
/**
 * Checks if one or more extensions are registered in the Tiptap editor.
 * @param editor - The Tiptap editor instance
 * @param extensionNames - A single extension name or an array of names to check
 * @returns True if at least one of the extensions is available, false otherwise
 */
export declare function isExtensionAvailable(editor: Editor | null, extensionNames: string | string[]): boolean;
/**
 * Finds a node at the specified position with error handling
 * @param editor The Tiptap editor instance
 * @param position The position in the document to find the node
 * @returns The node at the specified position, or null if not found
 */
export declare function findNodeAtPosition(editor: Editor, position: number): PMNode | null;
/**
 * Finds the position and instance of a node in the document
 * @param props Object containing editor, node (optional), and nodePos (optional)
 * @param props.editor The Tiptap editor instance
 * @param props.node The node to find (optional if nodePos is provided)
 * @param props.nodePos The position of the node to find (optional if node is provided)
 * @returns An object with the position and node, or null if not found
 */
export declare function findNodePosition(props: {
    editor: Editor | null;
    node?: PMNode | null;
    nodePos?: number | null;
}): {
    pos: number;
    node: PMNode;
} | null;
/**
 * Determines whether the current selection contains a node whose type matches
 * any of the provided node type names.
 * @param editor Tiptap editor instance
 * @param nodeTypeNames List of node type names to match against
 * @param checkAncestorNodes Whether to check ancestor node types up the depth chain
 */
export declare function isNodeTypeSelected(editor: Editor | null, nodeTypeNames?: string[], checkAncestorNodes?: boolean): boolean;
/**
 * Check whether the current selection is fully within nodes
 * whose type names are in the provided `types` list.
 *
 * - NodeSelection → checks the selected node.
 * - Text/AllSelection → ensures all textblocks within [from, to) are allowed.
 */
export declare function selectionWithinConvertibleTypes(editor: Editor, types?: string[]): boolean;
type ProtocolOptions = {
    /**
     * The protocol scheme to be registered.
     * @default '''
     * @example 'ftp'
     * @example 'git'
     */
    scheme: string;
    /**
     * If enabled, it allows optional slashes after the protocol.
     * @default false
     * @example true
     */
    optionalSlashes?: boolean;
};
type ProtocolConfig = Array<ProtocolOptions | string>;
export declare function isAllowedUri(uri: string | undefined, protocols?: ProtocolConfig): true | RegExpMatchArray | null;
export declare function sanitizeUrl(inputUrl: string, baseUrl: string, protocols?: ProtocolConfig): string;
/**
 * Update a single attribute on multiple nodes.
 *
 * @param tr - The transaction to mutate
 * @param targets - Array of { node, pos }
 * @param attrName - Attribute key to update
 * @param next - New value OR updater function receiving previous value
 *               Pass `undefined` to remove the attribute.
 * @returns true if at least one node was updated, false otherwise
 */
export declare function updateNodesAttr<A extends string = string, V = unknown>(tr: Transaction, targets: readonly NodeWithPos[], attrName: A, next: V | ((prev: V | undefined) => V | undefined)): boolean;
/**
 * Selects the entire content of the current block node if the selection is empty.
 * If the selection is not empty, it does nothing.
 * @param editor The Tiptap editor instance
 */
export declare function selectCurrentBlockContent(editor: Editor): void;
/**
 * Retrieves all nodes of specified types from the current selection.
 * @param selection The current editor selection
 * @param allowedNodeTypes An array of node type names to look for (e.g., ["image", "table"])
 * @returns An array of objects containing the node and its position
 */
export declare function getSelectedNodesOfType(selection: Selection, allowedNodeTypes: string[]): NodeWithPos[];
export declare function getShortcutKey(key: string): string;
export declare function getShortcutKeys(keys: string[]): string;
export declare const isNumber: (value: unknown) => value is number;
export declare const isString: (value: unknown) => value is string;
export declare const isBoolean: (value: unknown) => value is boolean;
export declare const isFunction: (value: unknown) => boolean;
export declare function getCssUnitWithDefault(value?: string | number, defaultUnit?: string): string | number | undefined;
export declare function toJSON(str: string): any;
export {};

import { Editor } from '@tiptap/core';
import { Transaction } from '@tiptap/pm/state';
/**
 * Regular expression to match LaTeX math strings wrapped in single dollar signs.
 * This should not catch dollar signs which are not part of a math expression,
 * like those used for currency or other purposes.
 * It ensures that the dollar signs are not preceded or followed by digits,
 * allowing for proper identification of inline math expressions.
 *
 * - `$x^2 + y^2 = z^2$` will match
 * - `This is $inline math$ in text.` will match
 * - `This is $100$ dollars.` will not match (as it is not a math expression)
 * - `This is $x^2 + y^2 = z^2$ and $100$ dollars.` will match both math expressions
 */
export declare const mathMigrationRegex: RegExp;
/**
 * Creates a transaction that migrates existing math strings in the document to new math nodes.
 * This function traverses the document and replaces LaTeX math syntax (wrapped in single dollar signs)
 * with proper inline math nodes, preserving the mathematical content.
 *
 * @param editor - The editor instance containing the schema and configuration
 * @param tr - The transaction to modify with the migration operations
 * @returns The modified transaction with math string replacements
 *
 * @example
 * ```typescript
 * const editor = new Editor({ ... })
 * const tr = editor.state.tr
 * const updatedTr = createMathMigrateTransaction(editor, tr)
 * editor.view.dispatch(updatedTr)
 * ```
 */
export declare function createMathMigrateTransaction(editor: Editor, tr: Transaction, regex?: RegExp): Transaction;
/**
 * Migrates existing math strings in the editor document to math nodes.
 * This function creates and dispatches a transaction that converts LaTeX math syntax
 * (text wrapped in single dollar signs) into proper inline math nodes. The migration
 * happens immediately and is not added to the editor's history.
 *
 * @param editor - The editor instance to perform the migration on
 *
 * @example
 * ```typescript
 * const editor = new Editor({
 *   extensions: [Mathematics],
 *   content: 'This is inline math: $x^2 + y^2 = z^2$ in text.'
 * })
 *
 * // Math strings will be automatically migrated to math nodes
 * migrateMathStrings(editor)
 * ```
 */
export declare function migrateMathStrings(editor: Editor, regex?: RegExp): void;

import { TableCellOptions, TableRowOptions, TableHeaderOptions } from '@tiptap/extension-table';
import { GeneralOptions } from '../../../types';
import { TableCellBackgroundOptions } from './table-cell-selection-background';
export interface TableOptions extends GeneralOptions {
    HTMLAttributes: Record<string, any>;
    resizable: boolean;
    handleWidth: number;
    cellMinWidth: number;
    lastColumnResizable: boolean;
    allowTableNodeSelection: boolean;
    /** options for table rows */
    tableRow: Partial<TableRowOptions>;
    /** options for table headers */
    tableHeader: Partial<TableHeaderOptions>;
    /** options for table cells */
    tableCell: Partial<TableCellOptions>;
    /** options for table cell background */
    tableCellBackground: Partial<TableCellBackgroundOptions>;
}
export declare const Table: import('@tiptap/core').Node<TableOptions, any>;

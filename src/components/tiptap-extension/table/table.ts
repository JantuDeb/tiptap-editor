import {
  Table as TiptapTable,
  TableRow,
  TableCell,
  TableHeader,
  type TableCellOptions,
  type TableRowOptions,
  type TableHeaderOptions,
} from "@tiptap/extension-table";

import type { GeneralOptions } from "@/types";
import {
  TableCellBackground,
  type TableCellBackgroundOptions,
} from "./table-cell-selection-background";

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

export const Table = TiptapTable.extend<TableOptions>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        style: `
          border: 1px solid #bb2929ff;
          border-collapse: collapse;
          width: 100%;
        `,
      },
      resizable: true,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
  },

  addExtensions() {
    return [
      TableRow.configure(this.options.tableRow),
      TableHeader.configure(this.options.tableHeader),
      TableCell.configure(this.options.tableCell),
      TableCellBackground.configure(this.options.tableCellBackground),
    ];
  },
});

"use client";

import { Button } from "@/components/tiptap-ui-primitive/button";
import { TableIcon } from "@/components/tiptap-icons/table-icon";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

export const InsertTable = () => {
  const { editor } = useTiptapEditor();

  if (!editor) {
    return null;
  }

  return (
    <Button
      data-style="ghost"
      onClick={() =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()
      }
    >
      <TableIcon className="tiptap-button-icon" />
    </Button>
  );
};

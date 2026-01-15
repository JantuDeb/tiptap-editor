import type { Editor } from "@tiptap/core";
import { isActive } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Table } from "../tiptap-extension/table/table";
import { ActionButton } from "../tiptap-ui/buttons/action-button";
import { Separator } from "../tiptap-ui-primitive/separator";
import "./bubble-menu.css";

interface RichTextBubbleTableProps {
  hiddenActions?: string[];
}

function RichTextBubbleTable({ hiddenActions = [] }: RichTextBubbleTableProps) {
  const { editor } = useTiptapEditor();
  const editable = editor?.isEditable;

  const shouldShow = ({ editor }: { editor: Editor }) => {
    return isActive(editor.view.state, Table.name);
  };

  const isHidden = (key: string) => hiddenActions.includes(key);

  function onAddColumnBefore() {
    editor?.chain().focus().addColumnBefore().run();
  }

  function onAddColumnAfter() {
    editor?.chain().focus().addColumnAfter().run();
  }

  function onDeleteColumn() {
    editor?.chain().focus().deleteColumn().run();
  }
  function onAddRowAbove() {
    editor?.chain().focus().addRowBefore().run();
  }

  function onAddRowBelow() {
    editor?.chain().focus().addRowAfter().run();
  }

  function onDeleteRow() {
    editor?.chain().focus().deleteRow().run();
  }

  function onMergeCell() {
    editor?.chain().focus().mergeCells().run();
  }
  function onSplitCell() {
    editor?.chain().focus().splitCell().run();
  }
  function onDeleteTable() {
    editor?.chain().focus().deleteTable().run();
  }

  // function onSetCellBackground(color: string) {
  //   editor.chain().focus().setTableCellBackground(color).run();
  // }

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "bottom", offset: 8, flip: true }}
      pluginKey={"RichTextBubbleTable"}
      shouldShow={shouldShow}
    >
      <div className="bubble-menu">
        {!isHidden("addColumnBefore") && (
          <ActionButton
            action={onAddColumnBefore}
            disabled={!editor?.can()?.addColumnBefore?.()}
            icon="BetweenHorizonalEnd"
            tooltip={"Insert Column Before"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden("addColumnAfter") && (
          <ActionButton
            action={onAddColumnAfter}
            disabled={!editor?.can()?.addColumnAfter?.()}
            icon="BetweenHorizonalStart"
            tooltip={"Insert Column After"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden("deleteColumn") && (
          <ActionButton
            action={onDeleteColumn}
            disabled={!editor?.can().deleteColumn?.()}
            icon="DeleteColumn"
            tooltip={"Delete Column"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        <Separator className="bubble-menu-divider" orientation="vertical" />

        {!isHidden("addRowAbove") && (
          <ActionButton
            action={onAddRowAbove}
            disabled={!editor?.can().addRowBefore?.()}
            icon="BetweenVerticalEnd"
            tooltip={"Insert Row Above"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden("addRowBelow") && (
          <ActionButton
            action={onAddRowBelow}
            disabled={!editor?.can()?.addRowAfter?.()}
            icon="BetweenVerticalStart"
            tooltip={"Insert Row Below"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden("deleteRow") && (
          <ActionButton
            action={onDeleteRow}
            disabled={!editor?.can()?.deleteRow?.()}
            icon="DeleteRow"
            tooltip={"Delete Row"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        <Separator className="bubble-menu-divider" orientation="vertical" />

        {!isHidden("mergeCells") && (
          <ActionButton
            action={onMergeCell}
            disabled={!editor?.can()?.mergeCells?.()}
            icon="TableCellsMerge"
            tooltip={"Merge Cells"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        {!isHidden("splitCells") && (
          <ActionButton
            action={onSplitCell}
            disabled={!editor?.can()?.splitCell?.()}
            icon="TableCellsSplit"
            tooltip={"Split Cells"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}

        <Separator className="bubble-menu-divider" orientation="vertical" />

        {/* {!isHidden('setCellBackground') && (
        <HighlightActionButton
        action={onSetCellBackground}
        editor={editor}
        tooltip={t('editor.table.menu.setCellsBgColor')}
        tooltipOptions={{ sideOffset: 15 }}
        />
      )}  */}

        {!isHidden("deleteTable") && (
          <ActionButton
            action={onDeleteTable}
            disabled={!editor?.can()?.deleteTable?.()}
            icon="Trash2"
            tooltip={"Delete Table"}
            tooltipOptions={{ sideOffset: 15 }}
          />
        )}
      </div>
    </BubbleMenu>
  );
}

export { RichTextBubbleTable };

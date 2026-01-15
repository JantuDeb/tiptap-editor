"use client";

import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

// --- Lib ---
import { isExtensionAvailable } from "@/lib/tiptap-utils";

// --- Icons ---
import { VideoIcon } from "@/components/tiptap-icons/video-icon";

export const VIDEO_UPLOAD_SHORTCUT_KEY = "mod+shift+v";

/**
 * Configuration for the video upload functionality
 */
export interface UseVideoUploadConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Whether the button should hide when insertion is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback function called after a successful video insertion.
   */
  onInserted?: () => void;
}

/**
 * Checks if video can be inserted in the current editor state
 */
export function canInsertVideo(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "videoUpload")) return false;

  return editor.can().insertContent({ type: "videoUpload" });
}

/**
 * Checks if video is currently active
 */
export function isVideoActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("videoUpload");
}

/**
 * Inserts a video in the editor
 */
export function insertVideo(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  if (!canInsertVideo(editor)) return false;

  try {
    return editor
      .chain()
      .focus()
      .insertContent({
        type: "videoUpload",
      })
      .run();
  } catch {
    return false;
  }
}

/**
 * Determines if the video button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (!editor || !editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "videoUpload")) return false;

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canInsertVideo(editor);
  }

  return true;
}

/**
 * Custom hook that provides video functionality for Tiptap editor
 */
export function useVideoUpload(config?: UseVideoUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {};

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const canInsert = canInsertVideo(editor);
  const isActive = isVideoActive(editor);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleVideo = useCallback(() => {
    if (!editor) return false;

    const success = insertVideo(editor);
    if (success) {
      onInserted?.();
    }
    return success;
  }, [editor, onInserted]);

  useHotkeys(
    VIDEO_UPLOAD_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleVideo();
    },
    {
      enabled: isVisible && canInsert,
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  );

  return {
    isVisible,
    isActive,
    handleVideo,
    canInsert,
    label: "Add video",
    shortcutKeys: VIDEO_UPLOAD_SHORTCUT_KEY,
    Icon: VideoIcon,
  };
}

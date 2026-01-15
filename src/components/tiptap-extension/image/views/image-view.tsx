/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import  { useCallback, useEffect, useMemo, useState } from "react";

import { NodeViewWrapper } from "@tiptap/react";
import { clamp, isNumber, throttle } from "lodash-es";
import {
  IMAGE_MAX_SIZE,
  IMAGE_THROTTLE_WAIT_TIME,
  IMAGE_MIN_SIZE,
} from "@/constants";
import "./image-view.scss";
interface Size {
  width: number;
  height: number;
}

const ResizeDirection = {
  TOP_LEFT: "tl",
  TOP_RIGHT: "tr",
  BOTTOM_LEFT: "bl",
  BOTTOM_RIGHT: "br",
};

function ImageView(props: any) {
  const [maxSize, setMaxSize] = useState<Size>({
    width: IMAGE_MAX_SIZE,
    height: IMAGE_MAX_SIZE,
  });

  const [originalSize, setOriginalSize] = useState({
    width: 0,
    height: 0,
  });

  const [resizeDirections] = useState<string[]>([
    ResizeDirection.TOP_LEFT,
    ResizeDirection.TOP_RIGHT,
    ResizeDirection.BOTTOM_LEFT,
    ResizeDirection.BOTTOM_RIGHT,
  ]);

  const [resizing, setResizing] = useState<boolean>(false);

  const [resizerState, setResizerState] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dir: "",
  });

  const { align, inline } = props?.node?.attrs;
  const inlineFloat = inline && (align === "left" || align === "right");
  const editor = props?.editor;

  const imgAttrs = useMemo(() => {
    const { src, alt, width: w, height: h, flipX, flipY } = props?.node?.attrs;

    const width = isNumber(w) ? `${w}px` : w;
    const height = isNumber(h) ? `${h}px` : h;
    const transformStyles: string[] = [];

    if (flipX) transformStyles.push("rotateX(180deg)");
    if (flipY) transformStyles.push("rotateY(180deg)");
    const transform = transformStyles.join(" ");

    const floatStyle = inlineFloat ? { float: align } : {};

    return {
      src: src || undefined,
      alt: alt || undefined,
      style: {
        width: width || undefined,
        height: height || undefined,
        transform: transform || "none",
        ...floatStyle,
      },
    };
  }, [props?.node?.attrs, inlineFloat, align]);

  const imageMaxStyle = useMemo(() => {
    const {
      style: { width },
    } = imgAttrs;

    return { width: width === "100%" ? width : undefined };
  }, [imgAttrs]);

  function onImageLoad(e: Record<string, any>) {
    setOriginalSize({
      width: e.target.width,
      height: e.target.height,
    });
  }

  // https://github.com/scrumpy/tiptap/issues/361#issuecomment-540299541
  const selectImage = useCallback(() => {
    {
      const { editor, getPos } = props;
      editor.commands.setNodeSelection(getPos());
    }
  }, [props]);

  const getMaxSize = useCallback(() => {
    const throttledFn = throttle(() => {
      const { width } = getComputedStyle(editor.view.dom);
      setMaxSize((prev) => ({
        ...prev,
        width: Number.parseInt(width, 10),
      }));
    }, IMAGE_THROTTLE_WAIT_TIME);

    throttledFn();
  }, [editor]);

  function onMouseDown(e: MouseEvent, dir: string) {
    e.preventDefault();
    e.stopPropagation();

    const originalWidth = originalSize.width;
    const originalHeight = originalSize.height;
    const aspectRatio = originalWidth / originalHeight;

    let width = Number(props.node.attrs.width);
    let height = Number(props.node.attrs.height);
    const maxWidth = maxSize.width;

    if (width && !height) {
      width = width > maxWidth ? maxWidth : width;
      height = Math.round(width / aspectRatio);
    } else if (height && !width) {
      width = Math.round(height * aspectRatio);
      width = width > maxWidth ? maxWidth : width;
    } else if (!width && !height) {
      width = originalWidth > maxWidth ? maxWidth : originalWidth;
      height = Math.round(width / aspectRatio);
    } else {
      width = width > maxWidth ? maxWidth : width;
    }

    setResizing(true);

    setResizerState({
      x: e.clientX,
      y: e.clientY,
      w: width,
      h: height,
      dir,
    });
  }

  const updateAttributes = props.updateAttributes;

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!resizing) {
        return;
      }

      const { x, w, dir } = resizerState;

      const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1);
      // const dy = (e.clientY - y) * (/t/.test(dir) ? -1 : 1)

      const width = clamp(w + dx, IMAGE_MIN_SIZE, maxSize.width);
      const height = null;

      updateAttributes({
        width,
        height,
      });
    },
    [resizing, resizerState, maxSize, updateAttributes]
  );

  const throttledOnMouseMove = useMemo(
    () => throttle(onMouseMove, IMAGE_THROTTLE_WAIT_TIME),
    [onMouseMove]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!resizing) {
        return;
      }

      setResizerState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        dir: "",
      });
      setResizing(false);

      selectImage();
    },
    [resizing, selectImage]
  );

  const onEvents = useCallback(() => {
    document?.addEventListener("mousemove", throttledOnMouseMove, true);
    document?.addEventListener("mouseup", onMouseUp, true);
  }, [throttledOnMouseMove, onMouseUp]);

  const offEvents = useCallback(() => {
    document?.removeEventListener("mousemove", throttledOnMouseMove, true);
    document?.removeEventListener("mouseup", onMouseUp, true);
  }, [throttledOnMouseMove, onMouseUp]);

  useEffect(() => {
    if (resizing) {
      onEvents();
    } else {
      offEvents();
    }

    return () => {
      offEvents();
    };
  }, [resizing, onEvents, offEvents]);

  const resizeOb: ResizeObserver = useMemo(() => {
    return new ResizeObserver(() => getMaxSize());
  }, [getMaxSize]);

  useEffect(() => {
    resizeOb.observe(props.editor.view.dom);

    return () => {
      resizeOb.disconnect();
    };
  }, [props.editor.view.dom, resizeOb]);

  return (
    <NodeViewWrapper
      as={inline ? "span" : "div"}
      className="image-view"
      style={{
        float: inlineFloat ? align : undefined,
        margin: inlineFloat
          ? align === "left"
            ? "1em 1em 1em 0"
            : "1em 0 1em 1em"
          : undefined,
        display: inline ? "inline" : "block",
        textAlign: inlineFloat ? undefined : align,
        width: imgAttrs.style?.width ?? "auto",
        ...(inlineFloat ? {} : imageMaxStyle),
      }}
    >
      <div
        data-drag-handle
        draggable="true"
        style={imageMaxStyle}
        className={`image-view__body ${
          props?.selected ? "image-view__body--focused" : ""
        } ${resizing ? "image-view__body--resizing" : ""}`}
      >
        <img
          alt={imgAttrs.alt}
          className="image-view__body__image block"
          height="auto"
          onClick={selectImage}
          onLoad={onImageLoad}
          src={imgAttrs.src}
          style={imgAttrs.style}
        />

        {props?.editor.view.editable && (props?.selected || resizing) && (
          <div className="image-resizer">
            {resizeDirections?.map((direction) => {
              return (
                <span
                  className={`image-resizer__handler image-resizer__handler--${direction}`}
                  key={`image-dir-${direction}`}
                  onMouseDown={(e: any) => onMouseDown(e, direction)}
                ></span>
              );
            })}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

export default ImageView;

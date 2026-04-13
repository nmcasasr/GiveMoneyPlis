"use client";

import { useRef, useState, useCallback } from "react";
import { CanvasElement } from "@/types/editor";
import { useEditorStore } from "@/lib/store/editor-store";

interface DraggableElementProps {
  element: CanvasElement;
  scale: number;
  isSelected: boolean;
}

export default function DraggableElement({
  element,
  scale,
  isSelected,
}: DraggableElementProps) {
  const { selectElement, moveElement, resizeElement } = useEditorStore();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectElement(element.id);
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        elX: element.position.x,
        elY: element.position.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const dx = (e.clientX - dragStart.current.x) / scale;
        const dy = (e.clientY - dragStart.current.y) / scale;
        moveElement(element.id, {
          x: dragStart.current.elX + dx,
          y: dragStart.current.elY + dy,
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [element.id, element.position, scale, selectElement, moveElement]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        w: element.size.width,
        h: element.size.height,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const dx = (e.clientX - resizeStart.current.x) / scale;
        const dy = (e.clientY - resizeStart.current.y) / scale;
        resizeElement(element.id, {
          width: Math.max(20, resizeStart.current.w + dx),
          height: Math.max(20, resizeStart.current.h + dy),
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [element.id, element.size, scale, resizeElement]
  );

  const renderContent = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              fontSize: element.fontSize,
              fontWeight: element.fontWeight,
              fontFamily: element.fontFamily,
              color: element.color,
              textAlign: element.textAlign,
              lineHeight: element.lineHeight,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              wordWrap: "break-word",
            }}
          >
            {element.content}
          </div>
        );
      case "shape":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
              borderRadius:
                element.shape === "circle" ? "50%" : element.borderRadius,
            }}
          />
        );
      case "image":
        return element.src ? (
          <img
            src={element.src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: element.objectFit,
              borderRadius: element.borderRadius,
            }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "2px dashed rgba(255,255,255,0.3)",
              borderRadius: element.borderRadius,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
            }}
          >
            Drop image
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        opacity: element.opacity,
        zIndex: element.zIndex,
        cursor: isDragging ? "grabbing" : "grab",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: 2,
        userSelect: "none",
      }}
    >
      {renderContent()}
      {isSelected && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            right: -5,
            bottom: -5,
            width: 10,
            height: 10,
            backgroundColor: "#3b82f6",
            borderRadius: 2,
            cursor: "se-resize",
          }}
        />
      )}
    </div>
  );
}

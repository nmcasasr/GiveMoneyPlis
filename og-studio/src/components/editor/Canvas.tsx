"use client";

import { useRef, useCallback } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import { OG_WIDTH, OG_HEIGHT } from "@/types/editor";
import DraggableElement from "./DraggableElement";

function getBackgroundStyle(bg: ReturnType<typeof useEditorStore.getState>["background"]) {
  if (bg.type === "solid") {
    return { backgroundColor: bg.color || "#1a1a2e" };
  }
  if (bg.type === "gradient") {
    return {
      background: `linear-gradient(${bg.gradientDirection || "to right"}, ${bg.gradientFrom || "#667eea"}, ${bg.gradientTo || "#764ba2"})`,
    };
  }
  if (bg.type === "image" && bg.imageUrl) {
    return {
      backgroundImage: `url(${bg.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "#1a1a2e" };
}

export default function Canvas() {
  const { elements, selectedElementId, background, canvasScale, selectElement } =
    useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        selectElement(null);
      }
    },
    [selectElement]
  );

  return (
    <div className="flex-1 flex items-center justify-center bg-neutral-900 overflow-auto p-8">
      <div
        style={{
          transform: `scale(${canvasScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            position: "relative",
            overflow: "hidden",
            borderRadius: 8,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            ...getBackgroundStyle(background),
          }}
        >
          {[...elements]
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                scale={canvasScale}
                isSelected={element.id === selectedElementId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEditorStore, createDefaultText, createDefaultShape, createDefaultImage } from "@/lib/store/editor-store";

export default function Toolbar() {
  const { addElement, canvasScale, setCanvasScale, clearCanvas } = useEditorStore();

  return (
    <div className="h-14 bg-neutral-800 border-b border-neutral-700 flex items-center px-4 gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => addElement(createDefaultText())}
          className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors flex items-center gap-1.5"
          title="Add Text"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
          </svg>
          Text
        </button>
        <button
          onClick={() => addElement(createDefaultShape())}
          className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors flex items-center gap-1.5"
          title="Add Shape"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          Shape
        </button>
        <button
          onClick={() => addElement(createDefaultImage())}
          className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-md transition-colors flex items-center gap-1.5"
          title="Add Image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          Image
        </button>
      </div>

      <div className="h-6 w-px bg-neutral-600 mx-2" />

      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400">Zoom</span>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          value={canvasScale}
          onChange={(e) => setCanvasScale(parseFloat(e.target.value))}
          className="w-24 accent-blue-500"
        />
        <span className="text-xs text-neutral-400 w-10">
          {Math.round(canvasScale * 100)}%
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={clearCanvas}
          className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800/50 text-red-300 text-sm rounded-md transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

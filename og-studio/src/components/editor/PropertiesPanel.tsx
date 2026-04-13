"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { CanvasElement, TextElement, ShapeElement, ImageElement } from "@/types/editor";

function TextProperties({ element }: { element: TextElement }) {
  const { updateElement } = useEditorStore();
  const update = (changes: Partial<TextElement>) =>
    updateElement(element.id, changes);

  return (
    <>
      <div>
        <label className="text-xs text-neutral-400 block mb-1">Content</label>
        <textarea
          value={element.content}
          onChange={(e) => update({ content: e.target.value })}
          className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600 resize-none"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Font Size</label>
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => update({ fontSize: parseInt(e.target.value) || 16 })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Weight</label>
          <select
            value={element.fontWeight}
            onChange={(e) => update({ fontWeight: e.target.value as TextElement["fontWeight"] })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="extrabold">Extra Bold</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Color</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={element.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={element.color}
              onChange={(e) => update({ color: e.target.value })}
              className="flex-1 bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Align</label>
          <select
            value={element.textAlign}
            onChange={(e) => update({ textAlign: e.target.value as TextElement["textAlign"] })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-neutral-400 block mb-1">Line Height</label>
        <input
          type="number"
          step="0.1"
          min="0.8"
          max="3"
          value={element.lineHeight}
          onChange={(e) => update({ lineHeight: parseFloat(e.target.value) || 1.2 })}
          className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
        />
      </div>
    </>
  );
}

function ShapeProperties({ element }: { element: ShapeElement }) {
  const { updateElement } = useEditorStore();
  const update = (changes: Partial<ShapeElement>) =>
    updateElement(element.id, changes);

  return (
    <>
      <div>
        <label className="text-xs text-neutral-400 block mb-1">Shape</label>
        <select
          value={element.shape}
          onChange={(e) => update({ shape: e.target.value as ShapeElement["shape"] })}
          className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
        >
          <option value="rectangle">Rectangle</option>
          <option value="rounded-rect">Rounded Rect</option>
          <option value="circle">Circle</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-neutral-400 block mb-1">Background</label>
        <div className="flex gap-1">
          <input
            type="color"
            value={element.backgroundColor.startsWith("rgba") ? "#ffffff" : element.backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
          <input
            type="text"
            value={element.backgroundColor}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            className="flex-1 bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Border Width</label>
          <input
            type="number"
            min="0"
            value={element.borderWidth}
            onChange={(e) => update({ borderWidth: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Border Radius</label>
          <input
            type="number"
            min="0"
            value={element.borderRadius}
            onChange={(e) => update({ borderRadius: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-neutral-400 block mb-1">Border Color</label>
        <input
          type="text"
          value={element.borderColor}
          onChange={(e) => update({ borderColor: e.target.value })}
          className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
        />
      </div>
    </>
  );
}

function ImageProperties({ element }: { element: ImageElement }) {
  const { updateElement } = useEditorStore();
  const update = (changes: Partial<ImageElement>) =>
    updateElement(element.id, changes);

  return (
    <>
      <div>
        <label className="text-xs text-neutral-400 block mb-1">Image URL</label>
        <input
          type="text"
          value={element.src}
          onChange={(e) => update({ src: e.target.value })}
          placeholder="https://..."
          className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Fit</label>
          <select
            value={element.objectFit}
            onChange={(e) => update({ objectFit: e.target.value as ImageElement["objectFit"] })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Border Radius</label>
          <input
            type="number"
            min="0"
            value={element.borderRadius}
            onChange={(e) => update({ borderRadius: parseInt(e.target.value) || 0 })}
            className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
          />
        </div>
      </div>
    </>
  );
}

export default function PropertiesPanel() {
  const { elements, selectedElementId, background, setBackground, removeElement, duplicateElement, bringForward, sendBackward, updateElement } =
    useEditorStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <div className="w-72 bg-neutral-800 border-l border-neutral-700 overflow-y-auto">
      {selectedElement ? (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white capitalize">
              {selectedElement.type}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => duplicateElement(selectedElement.id)}
                className="p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-300"
                title="Duplicate"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
              <button
                onClick={() => bringForward(selectedElement.id)}
                className="p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-300"
                title="Bring Forward"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => sendBackward(selectedElement.id)}
                className="p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-300"
                title="Send Backward"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => removeElement(selectedElement.id)}
                className="p-1.5 bg-red-900/50 hover:bg-red-800/50 rounded text-red-300"
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">X</label>
              <input
                type="number"
                value={Math.round(selectedElement.position.x)}
                onChange={(e) => updateElement(selectedElement.id, { position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 } })}
                className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Y</label>
              <input
                type="number"
                value={Math.round(selectedElement.position.y)}
                onChange={(e) => updateElement(selectedElement.id, { position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 } })}
                className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Width</label>
              <input
                type="number"
                value={Math.round(selectedElement.size.width)}
                onChange={(e) => updateElement(selectedElement.id, { size: { ...selectedElement.size, width: parseInt(e.target.value) || 20 } })}
                className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Height</label>
              <input
                type="number"
                value={Math.round(selectedElement.size.height)}
                onChange={(e) => updateElement(selectedElement.id, { size: { ...selectedElement.size, height: parseInt(e.target.value) || 20 } })}
                className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedElement.opacity}
              onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="h-px bg-neutral-700" />

          {selectedElement.type === "text" && <TextProperties element={selectedElement} />}
          {selectedElement.type === "shape" && <ShapeProperties element={selectedElement} />}
          {selectedElement.type === "image" && <ImageProperties element={selectedElement} />}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-semibold text-white">Background</h3>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Type</label>
            <select
              value={background.type}
              onChange={(e) => setBackground({ type: e.target.value as "solid" | "gradient" | "image" })}
              className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
            >
              <option value="solid">Solid Color</option>
              <option value="gradient">Gradient</option>
              <option value="image">Image</option>
            </select>
          </div>

          {background.type === "solid" && (
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Color</label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={background.color || "#1a1a2e"}
                  onChange={(e) => setBackground({ color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={background.color || "#1a1a2e"}
                  onChange={(e) => setBackground({ color: e.target.value })}
                  className="flex-1 bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
                />
              </div>
            </div>
          )}

          {background.type === "gradient" && (
            <>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">From</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={background.gradientFrom || "#667eea"}
                    onChange={(e) => setBackground({ gradientFrom: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={background.gradientFrom || "#667eea"}
                    onChange={(e) => setBackground({ gradientFrom: e.target.value })}
                    className="flex-1 bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">To</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={background.gradientTo || "#764ba2"}
                    onChange={(e) => setBackground({ gradientTo: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={background.gradientTo || "#764ba2"}
                    onChange={(e) => setBackground({ gradientTo: e.target.value })}
                    className="flex-1 bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Direction</label>
                <select
                  value={background.gradientDirection || "to bottom right"}
                  onChange={(e) => setBackground({ gradientDirection: e.target.value as "to right" | "to bottom" | "to bottom right" })}
                  className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
                >
                  <option value="to right">Horizontal</option>
                  <option value="to bottom">Vertical</option>
                  <option value="to bottom right">Diagonal</option>
                </select>
              </div>
            </>
          )}

          {background.type === "image" && (
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Image URL</label>
              <input
                type="text"
                value={background.imageUrl || ""}
                onChange={(e) => setBackground({ imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-neutral-700 text-white text-sm rounded px-2 py-1.5 border border-neutral-600"
              />
            </div>
          )}

          <div className="h-px bg-neutral-700" />
          <p className="text-xs text-neutral-500 text-center">
            Click an element to edit its properties
          </p>
        </div>
      )}
    </div>
  );
}

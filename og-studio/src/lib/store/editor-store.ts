import { create } from "zustand";
import { v4 as uuid } from "uuid";
import {
  CanvasElement,
  CanvasBackground,
  TextElement,
  ShapeElement,
  ImageElement,
  OG_WIDTH,
  OG_HEIGHT,
} from "@/types/editor";

interface EditorState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  background: CanvasBackground;
  canvasScale: number;

  // Actions
  addElement: (element: Omit<CanvasElement, "id" | "zIndex">) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (id: string, position: { x: number; y: number }) => void;
  resizeElement: (id: string, size: { width: number; height: number }) => void;
  setBackground: (bg: Partial<CanvasBackground>) => void;
  setCanvasScale: (scale: number) => void;
  duplicateElement: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  loadTemplate: (elements: CanvasElement[], bg: CanvasBackground) => void;
  clearCanvas: () => void;
}

const defaultBackground: CanvasBackground = {
  type: "gradient",
  gradientFrom: "#667eea",
  gradientTo: "#764ba2",
  gradientDirection: "to bottom right",
};

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  background: defaultBackground,
  canvasScale: 0.5,

  addElement: (element) => {
    const maxZ = get().elements.reduce(
      (max, el) => Math.max(max, el.zIndex),
      0
    );
    const newElement = {
      ...element,
      id: uuid(),
      zIndex: maxZ + 1,
    } as CanvasElement;
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id,
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? ({ ...el, ...updates } as CanvasElement) : el
      ),
    }));
  },

  removeElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId:
        state.selectedElementId === id ? null : state.selectedElementId,
    }));
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  moveElement: (id, position) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, position } : el
      ) as CanvasElement[],
    }));
  },

  resizeElement: (id, size) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, size } : el
      ) as CanvasElement[],
    }));
  },

  setBackground: (bg) => {
    set((state) => ({
      background: { ...state.background, ...bg },
    }));
  },

  setCanvasScale: (scale) => {
    set({ canvasScale: scale });
  },

  duplicateElement: (id) => {
    const el = get().elements.find((e) => e.id === id);
    if (!el) return;
    const maxZ = get().elements.reduce(
      (max, e) => Math.max(max, e.zIndex),
      0
    );
    const copy = {
      ...el,
      id: uuid(),
      zIndex: maxZ + 1,
      position: { x: el.position.x + 20, y: el.position.y + 20 },
    } as CanvasElement;
    set((state) => ({
      elements: [...state.elements, copy],
      selectedElementId: copy.id,
    }));
  },

  bringForward: (id) => {
    set((state) => {
      const el = state.elements.find((e) => e.id === id);
      if (!el) return state;
      const maxZ = state.elements.reduce(
        (max, e) => Math.max(max, e.zIndex),
        0
      );
      return {
        elements: state.elements.map((e) =>
          e.id === id ? { ...e, zIndex: maxZ + 1 } : e
        ) as CanvasElement[],
      };
    });
  },

  sendBackward: (id) => {
    set((state) => {
      const el = state.elements.find((e) => e.id === id);
      if (!el) return state;
      const minZ = state.elements.reduce(
        (min, e) => Math.min(min, e.zIndex),
        Infinity
      );
      return {
        elements: state.elements.map((e) =>
          e.id === id ? { ...e, zIndex: minZ - 1 } : e
        ) as CanvasElement[],
      };
    });
  },

  loadTemplate: (elements, bg) => {
    set({ elements, background: bg, selectedElementId: null });
  },

  clearCanvas: () => {
    set({ elements: [], selectedElementId: null, background: defaultBackground });
  },
}));

// Helper to create default elements
export function createDefaultText(): Omit<TextElement, "id" | "zIndex"> {
  return {
    type: "text",
    position: { x: OG_WIDTH / 2 - 200, y: OG_HEIGHT / 2 - 30 },
    size: { width: 400, height: 60 },
    rotation: 0,
    opacity: 1,
    content: "Your Title Here",
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: "Inter",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 1.2,
  };
}

export function createDefaultShape(): Omit<ShapeElement, "id" | "zIndex"> {
  return {
    type: "shape",
    position: { x: OG_WIDTH / 2 - 100, y: OG_HEIGHT / 2 - 50 },
    size: { width: 200, height: 100 },
    rotation: 0,
    opacity: 1,
    shape: "rounded-rect",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    borderRadius: 12,
  };
}

export function createDefaultImage(): Omit<ImageElement, "id" | "zIndex"> {
  return {
    type: "image",
    position: { x: OG_WIDTH / 2 - 60, y: OG_HEIGHT / 2 - 60 },
    size: { width: 120, height: 120 },
    rotation: 0,
    opacity: 1,
    src: "",
    objectFit: "cover",
    borderRadius: 60,
  };
}

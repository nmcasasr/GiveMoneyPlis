export type ElementType = "text" | "image" | "shape" | "icon";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  zIndex: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontWeight: "normal" | "bold" | "extrabold";
  fontFamily: string;
  color: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  objectFit: "cover" | "contain" | "fill";
  borderRadius: number;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: "rectangle" | "circle" | "rounded-rect";
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface IconElement extends BaseElement {
  type: "icon";
  icon: string;
  color: string;
  size: Size;
}

export type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | IconElement;

export interface CanvasBackground {
  type: "solid" | "gradient" | "image";
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to right" | "to bottom" | "to bottom right";
  imageUrl?: string;
}

export interface OGTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  background: CanvasBackground;
  elements: CanvasElement[];
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

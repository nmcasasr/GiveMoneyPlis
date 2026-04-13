import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { CanvasElement, CanvasBackground, OG_WIDTH, OG_HEIGHT } from "@/types/editor";

export const runtime = "edge";

function getBackgroundStyle(bg: CanvasBackground): React.CSSProperties {
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
      backgroundColor: "#1a1a2e",
    };
  }
  return { backgroundColor: "#1a1a2e" };
}

function renderElement(el: CanvasElement) {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: el.position.x,
    top: el.position.y,
    width: el.size.width,
    height: el.size.height,
    opacity: el.opacity,
  };

  switch (el.type) {
    case "text":
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight === "extrabold" ? 800 : el.fontWeight === "bold" ? 700 : 400,
            color: el.color,
            textAlign: el.textAlign,
            lineHeight: el.lineHeight,
            display: "flex",
            alignItems: "flex-start",
            wordWrap: "break-word",
            overflow: "hidden",
          }}
        >
          {el.content}
        </div>
      );
    case "shape":
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            backgroundColor: el.backgroundColor,
            border: el.borderWidth > 0 ? `${el.borderWidth}px solid ${el.borderColor}` : undefined,
            borderRadius: el.shape === "circle" ? "50%" : el.borderRadius,
          }}
        />
      );
    case "image":
      return el.src ? (
        <img
          key={el.id}
          src={el.src}
          style={{
            ...baseStyle,
            objectFit: el.objectFit,
            borderRadius: el.borderRadius,
          }}
        />
      ) : null;
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { elements, background } = (await req.json()) as {
      elements: CanvasElement[];
      background: CanvasBackground;
    };

    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    return new ImageResponse(
      (
        <div
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            display: "flex",
            position: "relative",
            overflow: "hidden",
            ...getBackgroundStyle(background),
          }}
        >
          {background.type === "image" && background.imageUrl && (
            <img
              src={background.imageUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          {sortedElements.map(renderElement)}
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }
    );
  } catch (error) {
    console.error("OG generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

// GET endpoint for simple URL-based generation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Hello World";
  const subtitle = searchParams.get("subtitle") || "";
  const theme = searchParams.get("theme") || "gradient";

  const backgrounds: Record<string, CanvasBackground> = {
    gradient: {
      type: "gradient",
      gradientFrom: searchParams.get("from") || "#667eea",
      gradientTo: searchParams.get("to") || "#764ba2",
      gradientDirection: "to bottom right",
    },
    dark: { type: "solid", color: "#0a0a0a" },
    light: { type: "solid", color: "#ffffff" },
  };

  const bg = backgrounds[theme] || backgrounds.gradient;
  const textColor = theme === "light" ? "#000000" : "#ffffff";

  return new ImageResponse(
    (
      <div
        style={{
          width: OG_WIDTH,
          height: OG_HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          ...getBackgroundStyle(bg),
        }}
      >
        <div
          style={{
            fontSize: title.length > 30 ? 48 : 64,
            fontWeight: 700,
            color: textColor,
            textAlign: "center",
            maxWidth: 1000,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 28,
              color: textColor,
              opacity: 0.7,
              marginTop: 20,
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}

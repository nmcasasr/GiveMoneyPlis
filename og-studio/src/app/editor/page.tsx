"use client";

import Canvas from "@/components/editor/Canvas";
import Toolbar from "@/components/editor/Toolbar";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import TemplatesPanel from "@/components/editor/TemplatesPanel";
import ExportButton from "@/components/editor/ExportButton";
import Link from "next/link";

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-900 text-white">
      {/* Header */}
      <div className="h-12 bg-neutral-950 border-b border-neutral-800 flex items-center px-4 justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded" />
          <span className="font-semibold text-sm">OG Studio</span>
        </Link>
        <ExportButton />
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        <TemplatesPanel />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}

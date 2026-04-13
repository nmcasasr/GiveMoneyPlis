"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/editor-store";

export default function ExportButton() {
  const { elements, background } = useEditorStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportUrl(null);
    try {
      const res = await fetch("/api/og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements, background }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setExportUrl(url);

      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = "og-image.png";
      a.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-wait text-white text-sm font-medium rounded-md transition-colors"
      >
        {isExporting ? "Exporting..." : "Export PNG"}
      </button>
      {exportUrl && (
        <a
          href={exportUrl}
          download="og-image.png"
          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-md transition-colors"
        >
          Download
        </a>
      )}
    </div>
  );
}

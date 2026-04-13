"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { templatePresets } from "@/lib/templates/presets";

export default function TemplatesPanel() {
  const { loadTemplate } = useEditorStore();

  return (
    <div className="w-56 bg-neutral-800 border-r border-neutral-700 overflow-y-auto">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Templates
        </h3>
        <div className="space-y-2">
          {templatePresets.map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.elements, template.background)}
              className="w-full text-left group"
            >
              <div className="rounded-lg overflow-hidden border border-neutral-700 group-hover:border-blue-500 transition-colors">
                <div
                  className="w-full aspect-[1200/630] relative"
                  style={{
                    background:
                      template.background.type === "gradient"
                        ? `linear-gradient(${template.background.gradientDirection}, ${template.background.gradientFrom}, ${template.background.gradientTo})`
                        : template.background.color || "#1a1a2e",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] text-white/60 font-medium">
                      {template.name}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-neutral-400 mt-1 block group-hover:text-white transition-colors">
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { Check, Palette } from "lucide-react";

export function TemplateSelector() {
  const { templateId, setProfileField } = useProfileStore();

  const templates = [
    {
      id: "gradient-indigo",
      name: "Terminal Flux (Indigo Teal)",
      description: "Default Stitch IDE theme. Obsidian dark background with vibrant Indigo and Teal accents.",
      gradient: "from-indigo-600 via-indigo-500 to-teal-400",
    },
    {
      id: "cyberpunk-amber",
      name: "Amber Edition (Cyberpunk)",
      description: "Warm amber & neon orange glow designed for high energy developer profiles.",
      gradient: "from-amber-500 via-orange-500 to-rose-500",
    },
    {
      id: "emerald-glow",
      name: "Emerald Matrix (Green Systems)",
      description: "Sleek dark green matrix aesthetic tailored for backend & security engineers.",
      gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    },
    {
      id: "midnight-obsidian",
      name: "Midnight Obsidian (Minimalist)",
      description: "Deep violet & slate minimalist layout prioritizing maximum clarity and focus.",
      gradient: "from-purple-900 via-indigo-900 to-slate-800",
    },
    {
      id: "dracula-purple",
      name: "Dracula Neon (Vibrant Pink)",
      description: "Rich magenta, neon purple & pink gradient for creative full-stack developers.",
      gradient: "from-purple-600 via-fuchsia-500 to-pink-500",
    },
    {
      id: "nordic-frost",
      name: "Nordic Frost (Cyan Blue)",
      description: "Crisp arctic ice blue and cyan aesthetic tailored for modern UI engineers.",
      gradient: "from-sky-500 via-cyan-400 to-indigo-500",
    },
    {
      id: "sunset-crimson",
      name: "Sunset Crimson (Rose Fire)",
      description: "Dramatic crimson, rose & gold sunset gradient for bold developer personas.",
      gradient: "from-rose-600 via-red-500 to-amber-500",
    },
    {
      id: "tokyo-night",
      name: "Tokyo Night (Sapphire)",
      description: "Futuristic Tokyo neon sapphire and deep indigo theme.",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <header className="border-b border-outline-variant pb-4">
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
          <Palette className="text-primary shrink-0" /> Template & Theme Selector
        </h2>
        <p className="text-on-surface-variant font-sans text-xs mt-1">
          Choose a high-fidelity visual theme template for your GitHub profile card and README pipeline.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((tpl) => {
          const isSelected = templateId === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setProfileField("templateId", tpl.id)}
              className={`p-4 sm:p-5 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-surface-container-high border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/10"
                  : "bg-surface-container-low border-outline-variant hover:border-outline hover:bg-surface-container"
              }`}
            >
              <div>
                <div
                  className={`h-16 rounded-md bg-gradient-to-r ${tpl.gradient} mb-3 relative overflow-hidden flex items-end p-2 shadow-md`}
                >
                  <div className="text-[10px] font-mono bg-black/50 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {tpl.id}
                  </div>
                </div>
                <h3 className="font-sans font-bold text-sm text-on-surface mb-1 flex items-center justify-between">
                  <span>{tpl.name}</span>
                  {isSelected && <Check size={18} className="text-primary shrink-0" />}
                </h3>
                <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
                  {tpl.description}
                </p>
              </div>
              <button
                type="button"
                className={`mt-4 w-full py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-colors ${
                  isSelected
                    ? "bg-primary text-white font-semibold"
                    : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {isSelected ? "Active Template" : "Select Template"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

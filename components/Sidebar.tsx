"use client";

import React from "react";
import { useProfileStore } from "@/store/useProfileStore";
import {
  User,
  Briefcase,
  Code2,
  Zap,
  Share2,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export function Sidebar() {
  const { activeNavSection, setProfileField, activeTab } = useProfileStore();

  const navItems = [
    { id: "identity" as const, label: "Identity", icon: User },
    { id: "experience" as const, label: "Experience", icon: Briefcase },
    { id: "projects" as const, label: "Projects", icon: Code2 },
    { id: "skills" as const, label: "Skills", icon: Zap },
    { id: "socials" as const, label: "Socials", icon: Share2 },
  ];

  return (
    <nav className="bg-surface-container-low border-r border-outline-variant fixed left-0 top-0 h-screen w-64 flex flex-col py-6 hidden md:flex z-40 select-none">
      {/* Brand Header */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-primary/20">
            P
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-on-surface leading-tight tracking-tight">
              Profile Architect
            </h1>
            <p className="font-mono text-[11px] text-on-surface-variant tracking-wider uppercase">
              v2.4.0 • Stitch IDE
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-grow flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavSection === item.id && activeTab === "editor";
          return (
            <button
              key={item.id}
              onClick={() => {
                setProfileField("activeNavSection", item.id);
                setProfileField("activeTab", "editor");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
                isActive
                  ? "text-primary border-l-2 border-primary bg-surface-container-high translate-x-1 font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
              }`}
            >
              <Icon size={18} className={isActive ? "text-primary" : "text-on-surface-variant"} />
              <span className="uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Callout CTA */}
      <div className="px-6 mb-6">
        <button
          onClick={() => {
            setProfileField("activeTab", "editor");
            const element = document.getElementById("ai-assistant-box");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
              element.classList.add("ring-2", "ring-primary");
              setTimeout(() => element.classList.remove("ring-2", "ring-primary"), 2000);
            }
          }}
          className="w-full bg-primary text-white font-mono text-xs uppercase tracking-wider py-2.5 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg shadow-primary/25 group"
        >
          <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          <span>Build with AI</span>
        </button>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col gap-1 px-3 border-t border-outline-variant pt-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest transition-all rounded text-xs font-mono tracking-wider"
        >
          <HelpCircle size={16} />
          <span className="uppercase">Support</span>
        </a>
      </div>
    </nav>
  );
}

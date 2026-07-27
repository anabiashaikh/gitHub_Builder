"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { GithubIcon } from "./GithubIcon";
import { PublishToGithubButton } from "./PublishToGithubButton";
import {
  Eye,
  Smartphone,
  Monitor,
  Link2,
  MapPin,
  Terminal,
  Copy,
  Check,
  Download,
  User,
} from "lucide-react";

export function LivePreview() {
  const state = useProfileStore();
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewTab, setPreviewTab] = useState<"card" | "markdown">("card");
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-surface-container-lowest flex items-center justify-center p-8 text-on-surface-variant font-mono text-xs">
        <span>Initializing Live Preview...</span>
      </div>
    );
  }

  const hasData = Boolean(
    state.name.trim() ||
    state.title.trim() ||
    state.bio.trim() ||
    state.githubUsername.trim() ||
    state.techStack.length > 0 ||
    state.avatarUrl.trim()
  );

  const name = state.name || "Your Name";
  const title = state.title || "Your Title";
  const bio = state.bio || "Your developer biography will appear here as you type or generate with AI...";
  const expertise = state.expertise || [];
  const location = state.location;
  const portfolioUrl = state.portfolioUrl;
  const githubUsername = state.githubUsername;
  const techStack = state.techStack;
  const avatarUrl = state.avatarUrl;
  const templateId = state.templateId || "gradient-indigo";

  // Dynamic template styling mapping for all 8 themes
  const templateStyles: Record<string, { banner: string; badge: string; dot: string }> = {
    "gradient-indigo": {
      banner: "from-indigo-600 via-indigo-500 to-teal-400",
      badge: "bg-indigo-500/10 border-indigo-500/40 text-indigo-400",
      dot: "bg-teal-400",
    },
    "cyberpunk-amber": {
      banner: "from-amber-500 via-orange-500 to-rose-500",
      badge: "bg-amber-500/10 border-amber-500/40 text-amber-400",
      dot: "bg-amber-400",
    },
    "emerald-glow": {
      banner: "from-emerald-600 via-teal-500 to-cyan-500",
      badge: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
      dot: "bg-emerald-400",
    },
    "midnight-obsidian": {
      banner: "from-purple-900 via-indigo-900 to-slate-800",
      badge: "bg-purple-500/10 border-purple-500/40 text-purple-300",
      dot: "bg-purple-400",
    },
    "dracula-purple": {
      banner: "from-purple-600 via-fuchsia-500 to-pink-500",
      badge: "bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-400",
      dot: "bg-fuchsia-400",
    },
    "nordic-frost": {
      banner: "from-sky-500 via-cyan-400 to-indigo-500",
      badge: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400",
      dot: "bg-cyan-400",
    },
    "sunset-crimson": {
      banner: "from-rose-600 via-red-500 to-amber-500",
      badge: "bg-rose-500/10 border-rose-500/40 text-rose-400",
      dot: "bg-rose-400",
    },
    "tokyo-night": {
      banner: "from-blue-600 via-indigo-600 to-purple-600",
      badge: "bg-blue-500/10 border-blue-500/40 text-blue-400",
      dot: "bg-blue-400",
    },
  };

  const activeTheme = templateStyles[templateId] || templateStyles["gradient-indigo"];

  // Generate GitHub Markdown README string based on store state following the exact user layout format
  const markdownReadme = `# Hi there, I'm ${name} 👋
## ${title}

<p align="center">
  <code>${title}</code>
</p>

---

### 🙋‍♀️ About Me

${bio}

---

### 🚀 Expertise

${
  expertise.length > 0
    ? expertise
        .map((e) => {
          const parts = e.split("—");
          if (parts.length > 1) {
            return `**${parts[0].trim()}** — ${parts.slice(1).join("—").trim()}`;
          }
          return `**${e}** — Specialized domain methodology and engineering practices.`;
        })
        .join("\n\n")
    : "- **Full-Stack Architecture** — Architecting modern web applications.\n- **Data & AI Systems** — Integrating LLMs and data pipelines."
}

---

### ⚡ Top Tech Stack

${techStack.length > 0 ? techStack.map((tech) => `\`${tech}\``).join(" • ") : "`Developer`"}

---

### 🌐 Connect & Details
${location ? `- 📍 **Location:** ${location}\n` : ""}${portfolioUrl ? `- 🔗 **Portfolio:** [${portfolioUrl}](${portfolioUrl})\n` : ""}${githubUsername ? `- 🐙 **GitHub:** [@${githubUsername}](https://github.com/${githubUsername})\n` : ""}

---
*Generated with DevProfile Architect* 🚀
`;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownReadme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full bg-surface-container-lowest overflow-y-auto relative flex flex-col">
      {/* Preview Sticky Header Controls */}
      <div className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant px-3 sm:px-6 py-2.5 flex flex-wrap justify-between items-center z-20 shrink-0 select-none gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Eye size={16} className="text-primary shrink-0" />
          <h2 className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-on-surface font-semibold whitespace-nowrap">
            Live Sync Preview
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/30 hidden sm:inline-block">
            Theme: {templateId}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Preview Format Switcher */}
          <div className="flex items-center bg-surface-container-high rounded-md p-0.5 border border-outline-variant text-xs font-mono">
            <button
              onClick={() => {
                if (previewTab === "card") {
                  downloadMarkdown();
                } else {
                  setPreviewTab("card");
                }
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                previewTab === "card"
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="Click to view README or download .md file"
            >
              <span>README.md</span>
              <Download size={13} className="shrink-0" />
            </button>
            <button
              onClick={() => {
                if (previewTab === "markdown") {
                  copyMarkdown();
                } else {
                  setPreviewTab("markdown");
                }
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                previewTab === "markdown"
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="Click to view Code or copy Markdown"
            >
              <span>Code</span>
              <Copy size={13} className="shrink-0" />
            </button>
          </div>

          {/* Viewport Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "mobile"
                  ? "bg-surface-container-highest text-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "desktop"
                  ? "bg-surface-container-highest text-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Canvas Content */}
      <div className="p-4 md:p-8 flex justify-center flex-grow items-start">
        {!hasData ? (
          <div className="w-full max-w-md bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-8 text-center flex flex-col items-center justify-center my-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4">
              <Eye size={28} />
            </div>
            <h3 className="font-sans font-bold text-base text-on-surface mb-2">
              Live Preview Window
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-xs mb-4">
              Start typing in the Editor or click <strong className="text-primary font-mono">Build with AI</strong> to watch your profile render here in real-time.
            </p>
            <span className="font-mono text-[11px] px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant">
              Waiting for user input...
            </span>
          </div>
        ) : previewTab === "card" ? (
          <div
            className={`w-full transition-all duration-300 ${
              viewMode === "mobile" ? "max-w-md" : "max-w-5xl"
            } bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl p-4 sm:p-6 md:p-8 text-[#c9d1d9] font-sans flex flex-col md:flex-row gap-6 md:gap-8`}
          >
            {/* Left Sidebar Column (~25%-30% width) - Exact GitHub Profile Sidebar */}
            <div className="w-full md:w-[30%] shrink-0 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-[#21262d] pb-6 md:pb-0 md:pr-6">
              
              {/* Mobile Only Template Banner behind Avatar (< md screens) */}
              <div className="md:hidden w-full h-32 sm:h-40 rounded-xl bg-[#161b22] border border-[#30363d] relative overflow-hidden flex items-end justify-center mb-10">
                <div className={`absolute inset-0 opacity-90 bg-gradient-to-r ${activeTheme.banner}`}></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-black/40"></div>
                <div className="relative z-10 translate-y-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#0d1117] bg-[#161b22] overflow-hidden shadow-2xl flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} className="text-[#8b949e]" />
                  )}
                </div>
              </div>

              {/* Tablet & Desktop Avatar Frame (>= md screens - Exact 2-Column Desktop Layout) */}
              <div className="hidden md:flex w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full border-4 border-[#30363d] bg-[#161b22] overflow-hidden mb-4 shadow-xl items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-[#8b949e]" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {name}
              </h1>
              <p className="text-sm text-[#8b949e] font-mono mb-1">
                {githubUsername || "username"}
              </p>

              <p className="text-xs text-[#c9d1d9] font-sans mb-1 font-semibold">
                {title}
              </p>

              {/* Tagline / Motto under Name - Clean White Text Without Box */}
              <p className="text-xs text-white font-sans mb-4 leading-relaxed max-w-xs">
                {state.tagline || "Turning data into decisions."}
              </p>

              <button className="w-full max-w-xs py-1.5 px-3 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-mono text-xs rounded-md transition-colors mb-4 text-center font-semibold">
                Edit profile
              </button>

              <div className="text-xs font-mono text-[#8b949e] mb-4 flex items-center gap-1.5">
                <span>👥 0 followers</span> · <span>0 following</span>
              </div>

              <div className="w-full space-y-2.5 text-xs font-mono text-[#8b949e] border-t border-[#21262d] pt-4">
                {location && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span>📍</span> <span>{location}</span>
                  </div>
                )}
                {portfolioUrl && (
                  <div className="flex items-center justify-center md:justify-start gap-2 truncate">
                    <span>🔗</span>
                    <a href={portfolioUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                      {portfolioUrl}
                    </a>
                  </div>
                )}
                {githubUsername && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span>🐙</span> <span>@{githubUsername}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Main Content Column (~70% width) */}
            <div className="w-full md:w-[70%] flex-grow space-y-6">
              {/* Tablet & Desktop Sleek Header Banner Graphic (>= md screens) */}
              <div className="hidden md:flex h-36 sm:h-44 w-full bg-[#161b22] border border-[#30363d] rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
                <div className={`absolute inset-0 opacity-90 bg-gradient-to-r ${activeTheme.banner}`}></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-black/40"></div>
                <div className="relative z-10 w-16 h-16 rounded-full border-4 border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-2xl">
                  <GithubIcon size={32} className="text-white" />
                </div>
              </div>

              {/* Tagline Sub-header - Tablet & Desktop (>= md) */}
              <div className="hidden md:block text-center">
                <h3 className="font-mono text-xs sm:text-sm text-white inline-block">
                  {state.tagline || "Turning data into decisions."}
                </h3>
              </div>

              <hr className="border-[#21262d]" />

              {/* 🙋‍♀️ About Me Section */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span>🙋‍♀️</span> <span>About Me</span>
                </h3>
                <div className="text-xs sm:text-sm text-[#8b949e] leading-relaxed space-y-4 whitespace-pre-line">
                  <p>{bio}</p>
                </div>
              </div>

              <hr className="border-[#21262d]" />

              {/* 🚀 Expertise Section */}
              {expertise && expertise.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>🚀</span> <span>Expertise</span>
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm">
                    {expertise.map((exp, idx) => {
                      const parts = exp.split("—");
                      return (
                        <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5">
                          <strong className="text-white font-semibold block mb-1">
                            {parts[0].trim()}
                          </strong>
                          {parts.length > 1 && (
                            <span className="text-[#8b949e] text-xs leading-relaxed block whitespace-pre-line">
                              — {parts.slice(1).join("—").trim()}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <hr className="border-[#21262d]" />

              {/* ⚡ Top Tech Stack Section */}
              {techStack && techStack.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>⚡</span> <span>Top Tech Stack</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-primary/10 border border-primary/30 text-primary font-mono text-xs px-3 py-1 rounded-md"
                      >
                        `{tech}`
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Markdown Raw README Code View */
          <div className="w-full max-w-3xl bg-[#0d1117] border border-[#30363d] rounded-lg p-6 font-mono text-xs text-[#c9d1d9] shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-[#30363d] pb-3">
              <span className="text-xs font-mono text-primary font-bold">
                README.md Source Code
              </span>
              <div className="flex items-center gap-2">
                <PublishToGithubButton />
              </div>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-on-surface-variant overflow-x-auto p-4 bg-[#161b22] rounded border border-[#30363d]">
              {markdownReadme}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

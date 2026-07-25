"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { GithubIcon } from "./GithubIcon";
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

  // Safe fallback values if state fields are empty
  const name = state.name || "Alex Chen";
  const title = state.title || "Senior Full Stack Engineer";
  const bio = state.bio || "Building scalable web applications and intuitive user interfaces.";
  const location = state.location || "San Francisco, CA";
  const portfolioUrl = state.portfolioUrl || "https://myportfolio.dev";
  const githubUsername = state.githubUsername || "alexchen-dev";
  const techStack = state.techStack && state.techStack.length > 0
    ? state.techStack
    : ["TypeScript", "React", "Node.js", "TailwindCSS"];
  const avatarUrl = state.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
  const templateId = state.templateId || "gradient-indigo";

  // Dynamic template styling mapping
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
  };

  const activeTheme = templateStyles[templateId] || templateStyles["gradient-indigo"];

  // Generate GitHub Markdown README string based on store state
  const markdownReadme = `# Hi there, I'm ${name} 👋
## ${title}

${bio}

---

### 🌐 Connect & Details
- 📍 **Location:** ${location}
- 🔗 **Portfolio:** [${portfolioUrl}](${portfolioUrl})
- 🐙 **GitHub:** [@${githubUsername}](https://github.com/${githubUsername})

---

### ⚡ Top Tech Stack
${techStack.map((tech) => `\`${tech}\``).join(" • ")}

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
              onClick={() => setPreviewTab("card")}
              className={`px-3 py-1 rounded transition-colors ${
                previewTab === "card"
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              GitHub Card
            </button>
            <button
              onClick={() => setPreviewTab("markdown")}
              className={`px-3 py-1 rounded transition-colors ${
                previewTab === "markdown"
                  ? "bg-primary text-white font-semibold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Markdown
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
      <div className="p-6 md:p-10 flex justify-center flex-grow items-start">
        {previewTab === "card" ? (
          <div
            className={`w-full transition-all duration-300 ${
              viewMode === "mobile" ? "max-w-md" : "max-w-3xl"
            } bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl`}
          >
            {/* Header Banner & Avatar Frame (Dynamic Template Color) */}
            <div className="h-36 bg-[#161b22] border-b border-[#30363d] relative overflow-hidden flex items-end px-6 pb-4">
              <div className={`absolute inset-0 opacity-80 bg-gradient-to-r ${activeTheme.banner} transition-all duration-300`}></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>

              <div className="flex items-end gap-4 relative z-10 translate-y-10">
                <div className="w-24 h-24 rounded-full border-4 border-[#0d1117] bg-[#161b22] overflow-hidden shrink-0 shadow-lg">
                  <img
                    alt="Preview Avatar"
                    className="w-full h-full object-cover"
                    src={avatarUrl}
                  />
                </div>
              </div>
            </div>

            {/* Profile Body Content */}
            <div className="pt-14 px-6 pb-8">
              <div className="mb-6 border-b border-[#21262d] pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-[#c9d1d9] leading-tight">
                    {name}
                  </h1>
                  <div
                    className={`w-3 h-3 ${activeTheme.dot} rounded-full pulse-status`}
                    title="Available for work"
                  ></div>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${activeTheme.badge}`}>
                    Active
                  </span>
                </div>
                <h2 className="text-sm text-[#8b949e] font-mono">
                  {title}
                </h2>
              </div>

              {/* Bio Paragraphs */}
              <div className="mb-6 text-[#8b949e] font-sans text-sm leading-relaxed space-y-2 whitespace-pre-line">
                <p>{bio}</p>

                <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-mono">
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Link2 size={14} /> {portfolioUrl}
                    </a>
                  )}
                  {location && (
                    <span className="flex items-center gap-1 text-[#8b949e]">
                      <MapPin size={14} /> {location}
                    </span>
                  )}
                  {githubUsername && (
                    <span className="flex items-center gap-1 text-[#8b949e]">
                      <GithubIcon size={14} /> @{githubUsername}
                    </span>
                  )}
                </div>
              </div>

              {/* Tech Stack Badges */}
              <div>
                <h3 className="text-sm font-semibold text-[#c9d1d9] mb-3 flex items-center gap-1.5 font-mono">
                  <Terminal size={16} className="text-primary" /> Core Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 border rounded-full text-xs font-mono flex items-center gap-1.5 transition-all ${activeTheme.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.dot}`}></span>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
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
                <button
                  onClick={copyMarkdown}
                  className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded text-xs font-mono transition-colors text-on-surface"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-secondary" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:bg-primary-container text-white rounded text-xs font-mono transition-colors"
                >
                  <Download size={14} />
                  <span>Download .md</span>
                </button>
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

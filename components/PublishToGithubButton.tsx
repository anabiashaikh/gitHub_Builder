"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useProfileStore } from "@/store/useProfileStore";
import { GithubIcon } from "./GithubIcon";
import { Loader2, Check, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface PublishToGithubButtonProps {
  customClass?: string;
  variant?: "primary" | "secondary" | "header";
}

export function PublishToGithubButton({
  customClass = "",
  variant = "primary",
}: PublishToGithubButtonProps) {
  const { data: session, status } = useSession();
  const state = useProfileStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success?: boolean;
    url?: string;
    error?: string;
  } | null>(null);

  // Generate GitHub Markdown README string based on store state
  const generateMarkdown = () => {
    const name = state.name || "Developer";
    const title = state.title || "Software Engineer";
    const bio = state.bio || "";
    const location = state.location;
    const portfolioUrl = state.portfolioUrl;
    const githubUsername = state.githubUsername || (session?.user as any)?.username;
    const techStack = state.techStack || [];

    return `# Hi there, I'm ${name} 👋
## ${title}

${bio}

---

### 🌐 Connect & Details
${location ? `- 📍 **Location:** ${location}\n` : ""}${portfolioUrl ? `- 🔗 **Portfolio:** [${portfolioUrl}](${portfolioUrl})\n` : ""}${githubUsername ? `- 🐙 **GitHub:** [@${githubUsername}](https://github.com/${githubUsername})\n` : ""}
---

### ⚡ Top Tech Stack
${techStack.length > 0 ? techStack.map((tech) => `\`${tech}\``).join(" • ") : "`Developer`"}

---
*Generated with DevProfile Architect* 🚀
`;
  };

  const handlePublish = async () => {
    if (status !== "authenticated" || !session) {
      signIn("github");
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const markdownContent = generateMarkdown();

      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdownContent }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPublishResult({ success: true, url: data.url });
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.2, x: 0.8 },
        });
      } else {
        setPublishResult({
          error: data.error || "Failed to publish README to GitHub.",
        });
      }
    } catch (err: any) {
      console.error("Publish error:", err);
      setPublishResult({
        error: "Network error occurred while publishing to GitHub.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative inline-block">
      {status !== "authenticated" ? (
        <button
          onClick={() => signIn("github")}
          className={`bg-[#24292e] text-white font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-md hover:bg-[#2f363d] transition-all flex items-center gap-2 border border-[#444d56] shadow-md ${customClass}`}
        >
          <GithubIcon size={16} />
          <span>Sign In to Sync</span>
        </button>
      ) : (
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className={`bg-accent text-white font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-md hover:bg-accent/90 transition-all flex items-center gap-2 shadow-md shadow-accent/20 disabled:opacity-50 ${customClass}`}
        >
          {isPublishing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Syncing README...</span>
            </>
          ) : (
            <>
              <GithubIcon size={16} />
              <span>Direct GitHub Sync</span>
            </>
          )}
        </button>
      )}

      {/* Success / Error Notification Modal / Banner */}
      {publishResult && (
        <div className="absolute top-full right-0 mt-2 z-50 w-80 sm:w-96 bg-[#0d1117] border border-[#30363d] rounded-lg p-3.5 shadow-2xl animate-fade-in text-xs font-mono">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1.5 font-bold">
              {publishResult.success ? (
                <div className="flex items-center gap-2 text-secondary">
                  <Check size={16} />
                  <span>Published to GitHub!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-accent">
                  <AlertCircle size={16} />
                  <span>Sync Failed</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setPublishResult(null)}
              className="text-[#8b949e] hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {publishResult.success ? (
            <div className="space-y-2 pt-1">
              <p className="text-[#8b949e] text-[11px] leading-tight">
                Your profile README.md is now live on your special GitHub repository!
              </p>
              <a
                href={publishResult.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline font-bold text-xs pt-1"
              >
                <span>View Live GitHub Profile</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <p className="text-[#8b949e] text-[11px] leading-relaxed whitespace-pre-line">
                {publishResult.error}
              </p>
              <button
                onClick={() => signIn("github")}
                className="text-xs text-primary hover:underline font-bold block pt-1"
              >
                Re-authenticate with GitHub ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

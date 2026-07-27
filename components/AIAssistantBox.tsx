"use client";

import React, { useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { Sparkles, Bot, Zap, Loader2 } from "lucide-react";

export function AIAssistantBox() {
  const { setAIProfile, setProfileField, isGeneratingAI } = useProfileStore();
  const [promptInput, setPromptInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerateProfile = async () => {
    if (!promptInput.trim()) {
      setErrorMsg("Please enter a description for your profile.");
      return;
    }

    setErrorMsg("");
    setProfileField("isGeneratingAI", true);

    try {
      const res = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const rawText = await res.text();
      let data: any = {};
      
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseErr) {
        console.error("Failed to parse JSON response:", parseErr);
        data = {};
      }

      if (res.ok && (data.title || data.bio)) {
        setAIProfile({
          name: data.name,
          title: data.title,
          bio: data.bio,
          expertise: data.expertise,
          techStack: data.techStack,
        });
      } else {
        setErrorMsg(data.error || "Failed to generate profile. Try again.");
      }
    } catch (err: any) {
      console.error("AI Generation fetch error:", err);
      setErrorMsg("Network error connecting to AI service.");
    } finally {
      setProfileField("isGeneratingAI", false);
    }
  };

  return (
    <div
      id="ai-assistant-box"
      className="border border-primary/40 bg-surface-container-low/90 rounded-lg p-3.5 sm:p-5 relative overflow-hidden transition-all duration-300 shadow-xl shadow-primary/5 group"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 p-4 text-primary opacity-10 pointer-events-none">
        <Sparkles size={64} />
      </div>

      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="font-mono text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-2">
          <Bot size={16} className="text-primary" />
          <span>Build with AI</span>
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          Fast Structured Sync
        </span>
      </div>

      <p className="text-xs font-sans text-on-surface-variant mb-3 relative z-10">
        Describe your ideal developer role or tech focus. Gemini 2.5 Flash will scaffold your profile title, bio, and tech stack in real-time.
      </p>

      <textarea
        value={promptInput}
        onChange={(e) => {
          setPromptInput(e.target.value);
          if (errorMsg) setErrorMsg("");
        }}
        disabled={isGeneratingAI}
        className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y min-h-[90px] mb-3 relative z-10 placeholder-outline text-sm"
        placeholder="e.g., 'I am Alex, a senior frontend engineer focused on performance, WebGL, and Rust. I need a dark-themed profile with React, Three.js, and TypeScript...'"
      />

      {errorMsg && (
        <p className="text-xs font-mono text-accent mb-2">{errorMsg}</p>
      )}

      <div className="flex justify-end relative z-10">
        <button
          type="button"
          onClick={handleGenerateProfile}
          disabled={isGeneratingAI}
          className="bg-accent text-white font-mono text-[10px] sm:text-xs uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-md flex items-center gap-2 hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:opacity-50"
        >
          {isGeneratingAI ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Zap size={15} />
              <span>Generate Profile</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

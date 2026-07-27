"use client";

import React, { useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { ImageUploader } from "./ImageUploader";
import { GithubIcon } from "./GithubIcon";
import { X, Plus, Sparkles, MapPin, Link2, Loader2, Bot } from "lucide-react";

export function EditorForm() {
  const state = useProfileStore();
  const { setProfileField, addTechSkill, removeTechSkill, setExpertise } = state;
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newExpertiseInput, setNewExpertiseInput] = useState("");

  const [isGeneratingBioAI, setIsGeneratingBioAI] = useState(false);
  const [isGeneratingExpertiseAI, setIsGeneratingExpertiseAI] = useState(false);

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (newSkillInput.trim()) {
        addTechSkill(newSkillInput.trim());
        setNewSkillInput("");
      }
    }
  };

  const handleGenerateBioAI = async () => {
    setIsGeneratingBioAI(true);
    try {
      const userPrompt = state.title || state.name || "Full-Stack Software Engineer & Academic Researcher";
      const res = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();
      if (res.ok && data.bio) {
        setProfileField("bio", data.bio);
      }
    } catch (err) {
      console.error("AI Bio Error:", err);
    } finally {
      setIsGeneratingBioAI(false);
    }
  };

  const handleGenerateExpertiseAI = async () => {
    setIsGeneratingExpertiseAI(true);
    try {
      const userPrompt = state.title || state.name || "Full-Stack Software Engineer & Academic Researcher";
      const res = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, existingExpertise: state.expertise }),
      });
      const data = await res.json();
      if (res.ok && data.expertise && data.expertise.length > 0) {
        setExpertise(data.expertise);
      }
    } catch (err) {
      console.error("AI Expertise Error:", err);
    } finally {
      setIsGeneratingExpertiseAI(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Editor Title Header */}
      <header className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            Profile Identity
          </h2>
          <p className="text-on-surface-variant font-sans text-xs mt-1">
            Configure your developer presence with AI scaffolding in real-time.
          </p>
        </div>
        <span className="font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded bg-surface-container-high text-primary border border-outline-variant">
          Live State Active
        </span>
      </header>

      {/* Manual Editor Form Section */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Step 1: Avatar & Image Compositor */}
        <ImageUploader />

        {/* Basic Info Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Display Name
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => setProfileField("name", e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-sm p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Anabia Shaikh"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Professional Title
              </label>
              <input
                type="text"
                value={state.title}
                onChange={(e) => setProfileField("title", e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-sm p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Full-Stack Engineer & Researcher"
              />
            </div>
          </div>

          {/* Profile Tagline / Motto Field */}
          <div className="flex flex-col gap-1.5 border border-outline-variant/60 rounded-lg p-3 bg-surface-container-low/40">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Tagline / Motto
              </label>
              <button
                type="button"
                onClick={() => {
                  const taglines = [
                    "Turning data into decisions.",
                    "Architecting zero-latency AI systems & data pipelines.",
                    "Building software that survives contact with production traffic.",
                    "Bridging academic research and high-scale infrastructure.",
                    "Turning complex datasets into visual, decision-ready software."
                  ];
                  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
                  setProfileField("tagline", randomTagline);
                }}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                title="Generate punchy tagline with AI"
              >
                <Sparkles size={11} /> AI Tagline ✨
              </button>
            </div>
            <input
              type="text"
              value={state.tagline}
              onChange={(e) => setProfileField("tagline", e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="e.g. Turning data into decisions."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <MapPin size={12} /> Location
              </label>
              <input
                type="text"
                value={state.location}
                onChange={(e) => setProfileField("location", e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <Link2 size={12} /> Portfolio URL
              </label>
              <input
                type="text"
                value={state.portfolioUrl}
                onChange={(e) => setProfileField("portfolioUrl", e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="https://portfolio.dev"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <GithubIcon size={12} /> GitHub Username
              </label>
              <input
                type="text"
                value={state.githubUsername}
                onChange={(e) => setProfileField("githubUsername", e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        {/* Bio / About Me Input (With Top Right AI Corner Button) */}
        <div className="flex flex-col gap-1.5 relative border border-outline-variant/60 rounded-lg p-4 bg-surface-container-low/40">
          <div className="flex justify-between items-center mb-1">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              About Me
            </label>
            <button
              type="button"
              onClick={handleGenerateBioAI}
              disabled={isGeneratingBioAI}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
              title="Generate detailed 2-paragraph Bio with Gemini AI"
            >
              {isGeneratingBioAI ? (
                <>
                  <Loader2 size={12} className="animate-spin text-primary" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="text-primary" />
                  <span>AI Bio ✨</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={state.bio}
            onChange={(e) => setProfileField("bio", e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y min-h-[160px] leading-relaxed"
            placeholder="Write your detailed developer biography..."
          />
        </div>

        {/* Core Expertise Section (With Top Right AI Corner Button) */}
        <div className="flex flex-col gap-1.5 border border-outline-variant/60 rounded-lg p-4 bg-surface-container-low/40">
          <div className="flex justify-between items-center mb-1">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Areas of Expertise
            </label>
            <button
              type="button"
              onClick={handleGenerateExpertiseAI}
              disabled={isGeneratingExpertiseAI}
              className="bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
              title="Scaffold domain expertise tags with Gemini AI"
            >
              {isGeneratingExpertiseAI ? (
                <>
                  <Loader2 size={12} className="animate-spin text-secondary" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} className="text-secondary" />
                  <span>AI Expertise ✨</span>
                </>
              )}
            </button>
          </div>
          <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-2.5 flex flex-wrap gap-1.5 min-h-[48px] items-center">
            {state.expertise.map((exp) => (
              <span
                key={exp}
                className="bg-secondary/15 border border-secondary/40 text-secondary font-mono text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 group hover:bg-secondary/25 transition-all"
              >
                <span>{exp}</span>
                <button
                  type="button"
                  onClick={() => state.removeExpertise(exp)}
                  className="hover:text-accent transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newExpertiseInput}
              onChange={(e) => setNewExpertiseInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  if (newExpertiseInput.trim()) {
                    state.addExpertise(newExpertiseInput.trim());
                    setNewExpertiseInput("");
                  }
                }
              }}
              className="bg-transparent border-none outline-none font-mono text-xs text-on-surface placeholder-outline-variant flex-grow min-w-[160px] p-1"
              placeholder="Type expertise & press Enter..."
            />
          </div>
        </div>

        {/* Core Tech Stack Chips */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
            Core Tech Stack
          </label>
          <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-2 flex flex-wrap gap-1.5 min-h-[48px] items-center">
            {state.techStack.map((skill) => (
              <span
                key={skill}
                className="bg-primary/15 border border-primary/40 text-primary font-mono text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 group hover:bg-primary/25 transition-all"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeTechSkill(skill)}
                  className="hover:text-accent transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={handleKeyDownSkill}
              className="bg-transparent border-none outline-none font-mono text-xs text-on-surface placeholder-outline-variant flex-grow min-w-[160px] p-1"
              placeholder="Type skill & press Enter..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}

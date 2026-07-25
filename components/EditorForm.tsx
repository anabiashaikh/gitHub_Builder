"use client";

import React, { useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { AIAssistantBox } from "./AIAssistantBox";
import { ImageUploader } from "./ImageUploader";
import { GithubIcon } from "./GithubIcon";
import { X, Plus, Sparkles, MapPin, Link2 } from "lucide-react";

export function EditorForm() {
  const state = useProfileStore();
  const { setProfileField, addTechSkill, removeTechSkill } = state;
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (newSkillInput.trim()) {
        addTechSkill(newSkillInput.trim());
        setNewSkillInput("");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Editor Title Header */}
      <header className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-on-surface tracking-tight">
            Profile Identity
          </h2>
          <p className="text-on-surface-variant font-sans text-xs mt-1">
            Configure your primary developer presence in real-time.
          </p>
        </div>
        <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-surface-container-high text-primary border border-outline-variant">
          Live State Active
        </span>
      </header>

      {/* Step 3: AI Assistant Box */}
      <AIAssistantBox />

      {/* Manual Editor Form Section */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Step 4: Avatar & Image Compositor */}
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
                placeholder="Alex Chen"
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
                placeholder="Senior Full Stack Engineer"
              />
            </div>
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
                placeholder="https://myportfolio.dev"
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
                placeholder="alexchen-dev"
              />
            </div>
          </div>
        </div>

        {/* Bio Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
              Bio (Markdown Supported)
            </label>
            <button
              type="button"
              onClick={() => {
                const aiBox = document.getElementById("ai-assistant-box");
                aiBox?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles size={12} /> Refine with AI
            </button>
          </div>
          <textarea
            value={state.bio}
            onChange={(e) => setProfileField("bio", e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-md text-on-surface font-mono text-xs p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y min-h-[120px]"
            placeholder="Write your developer story..."
          />
        </div>

        {/* Core Tech Stack Chips */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
            Core Tech Stack (Array State)
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
                  className="text-primary/70 hover:text-accent transition-colors"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1 flex-grow min-w-[140px]">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                placeholder="Add tech & hit Enter..."
                className="bg-transparent border-none outline-none text-on-surface font-mono text-xs flex-grow px-2 py-1 placeholder-outline"
              />
              {newSkillInput.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    addTechSkill(newSkillInput.trim());
                    setNewSkillInput("");
                  }}
                  className="p-1 bg-primary text-white rounded hover:bg-primary-container transition-colors"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

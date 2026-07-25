"use client";

import React from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { FolderHeart, Calendar, MapPin, ArrowRight, Trash2 } from "lucide-react";

export function SavedProfilesView() {
  const { savedProfilesSession, setProfileField, clearSessionProfiles } = useProfileStore();

  const loadProfileIntoEditor = (p: any) => {
    setProfileField("name", p.name);
    setProfileField("title", p.title);
    setProfileField("bio", p.bio);
    setProfileField("location", p.location || "");
    setProfileField("portfolioUrl", p.portfolioUrl || "");
    setProfileField("githubUsername", p.githubUsername || "");
    setProfileField("techStack", Array.isArray(p.techStack) ? p.techStack : []);
    if (p.avatarUrl) {
      setProfileField("avatarUrl", p.avatarUrl);
    }
    setProfileField("activeTab", "editor");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <header className="border-b border-outline-variant pb-4 flex justify-between items-center">
        <div>
          <h2 className="font-sans text-2xl font-bold text-on-surface tracking-tight flex items-center gap-2">
            <FolderHeart className="text-secondary" /> Temporary Session Memory
          </h2>
          <p className="text-on-surface-variant font-sans text-xs mt-1">
            Data is stored client-side in browser session memory (No database needed).
          </p>
        </div>
        {savedProfilesSession.length > 0 && (
          <button
            onClick={clearSessionProfiles}
            className="text-xs font-mono px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded transition-colors flex items-center gap-1"
          >
            <Trash2 size={13} />
            <span>Clear Session</span>
          </button>
        )}
      </header>

      {savedProfilesSession.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-outline-variant rounded-lg p-8">
          <FolderHeart size={40} className="mx-auto text-outline mb-3" />
          <p className="font-mono text-sm text-on-surface mb-1">
            No session snapshots saved yet.
          </p>
          <p className="text-xs font-sans text-on-surface-variant mb-4">
            Click "Save Session" in the top header to save temporary profile snapshots in your browser session.
          </p>
          <button
            onClick={() => setProfileField("activeTab", "editor")}
            className="px-4 py-2 bg-primary text-white rounded font-mono text-xs uppercase tracking-wider hover:bg-primary-container transition-colors"
          >
            Create Profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedProfilesSession.map((p) => (
            <div
              key={p.id}
              className="p-5 bg-surface-container-low border border-outline-variant rounded-lg hover:border-outline transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-sans font-bold text-base text-on-surface">
                    {p.name}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                    {p.title}
                  </span>
                </div>
                <p className="text-xs font-sans text-on-surface-variant line-clamp-2">
                  {p.bio}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-on-surface-variant/80 pt-1">
                  {p.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {p.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {p.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={() => loadProfileIntoEditor(p)}
                className="px-4 py-2 bg-surface-container-high hover:bg-primary hover:text-white rounded border border-outline-variant text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Load in Editor</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

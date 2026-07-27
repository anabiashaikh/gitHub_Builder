"use client";

import React, { useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { Bell, Settings, Check, Sparkles, User } from "lucide-react";
import confetti from "canvas-confetti";

import { PublishToGithubButton } from "./PublishToGithubButton";

export function Header() {
  const state = useProfileStore();
  const { activeTab, setProfileField, saveProfileToSession } = state;
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  const handleSaveProfile = () => {
    saveProfileToSession();
    setNotificationMsg("Profile saved to temporary session memory!");
    setShowNotification(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.1, x: 0.8 },
    });
    setTimeout(() => setShowNotification(false), 4000);
  };

  return (
    <header className="bg-surface font-sans text-sm border-b border-outline-variant flex justify-between items-center w-full px-2.5 sm:px-6 h-14 sm:h-16 sticky top-0 z-50 shrink-0 select-none gap-1 sm:gap-4">
      {/* Left Title & Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-6 h-full min-w-0">
        <span className="font-sans font-bold text-xs sm:text-lg text-primary md:hidden block shrink-0">
          DevProfile
        </span>

        <nav className="flex h-full items-end gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setProfileField("activeTab", "editor")}
            className={`px-2 sm:px-4 h-full flex items-center font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === "editor"
                ? "text-primary border-primary font-semibold bg-surface-container-low/50"
                : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setProfileField("activeTab", "preview")}
            className={`px-2 sm:px-4 h-full flex items-center font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === "preview"
                ? "text-primary border-primary font-semibold bg-surface-container-low/50"
                : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setProfileField("activeTab", "templates")}
            className={`px-2 sm:px-4 h-full flex items-center font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === "templates"
                ? "text-primary border-primary font-semibold bg-surface-container-low/50"
                : "text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Templates
          </button>
        </nav>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {showNotification && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-secondary/15 border border-secondary text-secondary rounded text-xs font-mono animate-fade-in">
            <Check size={14} />
            <span>{notificationMsg}</span>
          </div>
        )}

        <div className="hidden md:flex items-center text-on-surface-variant gap-1">
          <button
            aria-label="notifications"
            onClick={() => {
              setNotificationMsg("DevProfile Builder System Active");
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 3000);
            }}
            className="p-2 hover:bg-surface-container-high rounded-md transition-colors hover:text-on-surface"
          >
            <Bell size={18} />
          </button>
          <button
            aria-label="settings"
            className="p-2 hover:bg-surface-container-high rounded-md transition-colors hover:text-on-surface"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Publish to GitHub Direct Sync Button */}
        <PublishToGithubButton />

        {/* User Avatar */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high cursor-pointer shrink-0 flex items-center justify-center">
          {state.avatarUrl ? (
            <img
              alt="User avatar"
              className="w-full h-full object-cover"
              src={state.avatarUrl}
            />
          ) : (
            <User size={15} className="text-on-surface-variant" />
          )}
        </div>
      </div>
    </header>
  );
}

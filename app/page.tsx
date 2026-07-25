"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { EditorForm } from "@/components/EditorForm";
import { LivePreview } from "@/components/LivePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useProfileStore } from "@/store/useProfileStore";

import { Eye, Edit3 } from "lucide-react";

export default function Home() {
  const { activeTab, setProfileField } = useProfileStore();

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background text-on-surface relative">
      {/* Stitch Sidebar Navigation (Fixed left w-64 on desktop) */}
      <Sidebar />

      {/* Main App Container (Shifted right by w-64 on desktop) */}
      <div className="flex-grow flex flex-col md:ml-64 h-screen w-full relative overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Workspace Area: Responsive Layout */}
        <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
          {/* Mobile View Handling (< md screens) */}
          <div className="md:hidden w-full h-full overflow-hidden flex flex-col">
            {activeTab === "editor" && (
              <div className="w-full h-full overflow-y-auto p-4 sm:p-6 pb-24 bg-surface">
                <EditorForm />
              </div>
            )}
            {activeTab === "templates" && (
              <div className="w-full h-full overflow-y-auto p-4 sm:p-6 pb-24 bg-surface">
                <TemplateSelector />
              </div>
            )}
            {activeTab === "preview" && (
              <div className="w-full h-full overflow-y-auto pb-24 bg-surface-container-lowest">
                <LivePreview />
              </div>
            )}
          </div>

          {/* Desktop Split Screen View (>= md screens) */}
          <section className="hidden md:block w-1/2 h-full border-r border-outline-variant bg-surface overflow-y-auto p-6 md:p-8">
            {activeTab === "editor" && <EditorForm />}
            {activeTab === "templates" && <TemplateSelector />}
            {activeTab === "preview" && <EditorForm />}
          </section>

          <section className="hidden md:block w-1/2 h-full bg-surface-container-lowest overflow-hidden relative">
            <LivePreview />
          </section>

          {/* Mobile Floating Preview Toggle Button */}
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            {activeTab === "preview" ? (
              <button
                onClick={() => setProfileField("activeTab", "editor")}
                className="bg-primary text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-2 border border-white/20 active:scale-95 transition-all"
              >
                <Edit3 size={16} />
                <span>Edit Form</span>
              </button>
            ) : (
              <button
                onClick={() => setProfileField("activeTab", "preview")}
                className="bg-accent text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-2xl shadow-accent/40 flex items-center gap-2 border border-white/20 active:scale-95 transition-all animate-bounce"
              >
                <Eye size={16} />
                <span>Show Preview</span>
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

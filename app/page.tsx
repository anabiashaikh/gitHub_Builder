"use client";

import React from "react";
import { Header } from "@/components/Header";
import { EditorForm } from "@/components/EditorForm";
import { LivePreview } from "@/components/LivePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useProfileStore } from "@/store/useProfileStore";
import { Eye, Edit3 } from "lucide-react";

export default function Home() {
  const { activeTab, setProfileField } = useProfileStore();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-background text-on-surface relative">
      {/* Main App Container (Full Width 100%) */}
      <div className="flex-grow flex flex-col h-screen w-full relative overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Workspace Area: Responsive Breakpoint (Stacked on Mobile/Tablet < 1024px, 40%-60% Split on Desktop >= 1024px) */}
        <main className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">
          {/* Mobile & Tablet View Handling (< 1024px lg breakpoint) */}
          <div className="lg:hidden w-full h-full overflow-hidden flex flex-col">
            {activeTab === "editor" && (
              <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-28 bg-surface">
                <EditorForm />
              </div>
            )}
            {activeTab === "templates" && (
              <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-28 bg-surface">
                <TemplateSelector />
              </div>
            )}
            {activeTab === "preview" && (
              <div className="w-full h-full overflow-y-auto pb-28 bg-surface-container-lowest">
                <LivePreview />
              </div>
            )}
          </div>

          {/* Desktop Split View (>= 1024px lg breakpoint: 40% Editor / 60% Preview) */}
          {activeTab === "preview" ? (
            <section className="hidden lg:block w-full h-full bg-surface-container-lowest overflow-hidden relative">
              <LivePreview />
            </section>
          ) : (
            <>
              <section className="hidden lg:block w-full lg:w-[40%] xl:w-[38%] h-full border-r border-outline-variant bg-surface overflow-y-auto p-6 xl:p-8 shrink-0">
                {activeTab === "editor" && <EditorForm />}
                {activeTab === "templates" && <TemplateSelector />}
              </section>

              <section className="hidden lg:block w-full lg:w-[60%] xl:w-[62%] h-full bg-surface-container-lowest overflow-hidden relative flex-grow">
                <LivePreview />
              </section>
            </>
          )}

          {/* Mobile & Tablet Floating Toggle Button (< 1024px) */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
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

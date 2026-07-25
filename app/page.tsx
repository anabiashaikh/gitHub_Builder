"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { EditorForm } from "@/components/EditorForm";
import { LivePreview } from "@/components/LivePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useProfileStore } from "@/store/useProfileStore";

export default function Home() {
  const { activeTab } = useProfileStore();

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background text-on-surface">
      {/* Stitch Sidebar Navigation (Fixed left w-64 on desktop) */}
      <Sidebar />

      {/* Main App Container (Shifted right by w-64 on desktop) */}
      <div className="flex-grow flex flex-col md:ml-64 h-screen w-full relative overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Workspace Area: Split Screen Layout */}
        <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left Editor / Controls Pane */}
          <section className="w-full md:w-1/2 h-full border-r border-outline-variant bg-surface overflow-y-auto p-6 md:p-8">
            {activeTab === "editor" && <EditorForm />}
            {activeTab === "templates" && <TemplateSelector />}
            {activeTab === "preview" && (
              <div className="md:hidden">
                <LivePreview />
              </div>
            )}
          </section>

          {/* Right Live Preview Pane (Virtualization / Real-time Sync) */}
          <section className="w-full md:w-1/2 h-full bg-surface-container-lowest overflow-hidden relative hidden md:block">
            <LivePreview />
          </section>
        </main>
      </div>
    </div>
  );
}

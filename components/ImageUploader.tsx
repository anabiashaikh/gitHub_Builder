"use client";

import React, { useRef, useState } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { Upload, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";

export function ImageUploader() {
  const { avatarUrl, setProfileField, isProcessingImage } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileField("isProcessingImage", true);
    setUploadStatus("Processing image...");

    // Immediate instant client-side preview via FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileField("avatarUrl", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.avatarUrl) {
        setProfileField("avatarUrl", data.avatarUrl);
        setUploadStatus("Avatar updated with Sharp!");
        setTimeout(() => setUploadStatus(""), 3000);
      }
    } catch (err: any) {
      console.error("Image processing error:", err);
    } finally {
      setProfileField("isProcessingImage", false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
        Profile Avatar Upload
      </label>
      <div className="flex items-center gap-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant bg-surface-container flex items-center justify-center text-outline cursor-pointer hover:border-primary hover:text-primary transition-colors overflow-hidden group relative shrink-0"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            />
          ) : (
            <ImageIcon size={24} />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload size={18} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            className="border border-outline-variant bg-surface-container-high text-on-surface font-mono text-xs uppercase px-3 py-1.5 rounded hover:bg-surface-container-highest transition-colors flex items-center gap-2 w-fit disabled:opacity-50"
          >
            {isProcessingImage ? (
              <>
                <Loader2 size={14} className="animate-spin text-primary" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={14} className="text-primary" />
                <span>Upload Image</span>
              </>
            )}
          </button>
          <p className="text-[11px] font-sans text-on-surface-variant">
            {uploadStatus ? (
              <span className="text-secondary font-mono flex items-center gap-1">
                <Sparkles size={12} /> {uploadStatus}
              </span>
            ) : (
              "Recommended: 400x400px, PNG or JPG."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

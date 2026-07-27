# 🚀 Profile Architect - AI GitHub README & Profile Builder

> **Transform your GitHub presence with AI-driven scaffolding, real-time live previews, responsive 2-column layouts, and instant 1-click GitHub direct repository synchronization.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://git-hub-builder-gamma.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8e44ad?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

---

## 🌟 Live Production Deployment

🌐 **Live Application URL:** [https://git-hub-builder-gamma.vercel.app](https://git-hub-builder-gamma.vercel.app)

---

## ✨ Features & Capabilities

- 🤖 **Gemini 2.5 Flash AI Engine:** Instantly generates detailed 2-paragraph biographies, tailored domain expertise descriptions, and dynamic tech stacks based on simple user prompts or custom tags.
- 🎨 **8 High-Fidelity Design Themes:** Switch between premium color gradients including *Terminal Flux (Indigo Teal)*, *Amber Edition (Cyberpunk)*, *Emerald Matrix*, *Midnight Obsidian*, *Dracula Neon*, *Nordic Frost*, *Sunset Crimson*, and *Tokyo Night*.
- 📐 **Exact 2-Column GitHub Profile Architecture:** Authentic GitHub desktop interface layout with a 30% profile sidebar (avatar, name, tagline, followers, contact info) and a 70% right content area (header graphic banner, About Me, Expertise, Tech Stack).
- 📱 **Flawless Mobile & Tablet Responsiveness:** Custom breakpoints for mobile phones, iPads, and tablets. Single-screen tabbed navigation with floating action triggers and full 2-column desktop rendering on preview.
- 🐙 **1-Click GitHub Repository Direct Sync:** Direct OAuth login (`read:user repo` scope) and serverless automated API route that creates or updates `README.md` directly inside your special `username/username` profile repository.
- ⚡ **Real-Time Synchronized Live Preview:** Watch every keystroke and AI generation render instantly in both visual card mode and raw Markdown code view.
- 📥 **Export & Download Options:** Download your generated `README.md` file with one click or copy formatted Markdown code to your clipboard.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router & Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Vanilla CSS Design Tokens
- **AI Integration:** `@google/genai` (Google Gemini 2.5 Flash API)
- **Authentication:** NextAuth.js (GitHub OAuth Provider)
- **Database & ORM:** Prisma ORM 5.22.0 (SQLite / PostgreSQL)
- **Icons & Visuals:** Lucide React & Custom SVG Compositor
- **Deployment:** Vercel Serverless Platform

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **GitHub OAuth App:** Created on [GitHub Developer Settings](https://github.com/settings/developers)
- **Google Gemini API Key:** Obtained from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anabiashaikh/gitHub_Builder.git
   cd gitHub_Builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```
gitHub_Builder/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # GitHub OAuth Handler
│   │   ├── generate-profile/    # Gemini 2.5 Flash AI Engine Route
│   │   ├── process-image/       # Image Compositor API
│   │   ├── profiles/            # Session Profile Storage API
│   │   └── publish/             # 1-Click GitHub Repository Direct Sync
│   ├── layout.tsx
│   └── page.tsx                 # Main Workspace Split Layout
├── components/
│   ├── Header.tsx               # Top Application Navigation
│   ├── EditorForm.tsx           # Profile Identity & AI Prompt Inputs
│   ├── LivePreview.tsx          # Real-time GitHub Profile & Markdown Canvas
│   ├── TemplateSelector.tsx     # Theme Picker (8 Premium Themes)
│   ├── ImageUploader.tsx        # Avatar & Image Compositor
│   └── PublishToGithubButton.tsx# GitHub Direct Sync Action Button
├── store/
│   └── useProfileStore.ts       # Zustand Store & Persistence State
├── prisma/
│   └── schema.prisma            # Database Schema (User, Session, Profile)
└── public/
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [Issues page](https://github.com/anabiashaikh/gitHub_Builder/issues).

---

## 📜 License

Created and maintained by [@anabiashaikh](https://github.com/anabiashaikh). Distributed under the MIT License.

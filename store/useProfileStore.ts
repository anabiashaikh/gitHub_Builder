import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProfileState {
  // Identity Fields
  name: string;
  title: string;
  tagline: string;
  bio: string;
  expertise: string[];
  location: string;
  portfolioUrl: string;
  githubUsername: string;
  techStack: string[];
  avatarUrl: string;
  templateId: string;
  
  // App UI State
  activeTab: "editor" | "preview" | "templates";
  activeNavSection: "identity" | "experience" | "projects" | "skills" | "socials";
  isGeneratingAI: boolean;
  isProcessingImage: boolean;
  savedProfilesSession: Array<{
    id: string;
    timestamp: string;
    name: string;
    title: string;
    tagline?: string;
    bio: string;
    expertise?: string[];
    location: string;
    portfolioUrl: string;
    githubUsername: string;
    techStack: string[];
    avatarUrl: string;
    templateId: string;
  }>;

  // Actions
  setProfileField: <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => void;
  addTechSkill: (skill: string) => void;
  removeTechSkill: (skill: string) => void;
  setTechStack: (skills: string[]) => void;
  addExpertise: (item: string) => void;
  removeExpertise: (item: string) => void;
  setExpertise: (items: string[]) => void;
  setAIProfile: (data: { name?: string; title?: string; tagline?: string; bio?: string; expertise?: string[]; techStack?: string[] }) => void;
  saveProfileToSession: () => void;
  clearSessionProfiles: () => void;
  resetProfile: () => void;
}

const defaultState = {
  name: "",
  title: "",
  tagline: "Turning data into decisions.",
  bio: "",
  expertise: [],
  location: "",
  portfolioUrl: "",
  githubUsername: "",
  techStack: [],
  avatarUrl: "",
  templateId: "gradient-indigo",
  activeTab: "editor" as const,
  activeNavSection: "identity" as const,
  isGeneratingAI: false,
  isProcessingImage: false,
  savedProfilesSession: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setProfileField: (key, value) =>
        set((state) => ({ ...state, [key]: value })),

      addTechSkill: (skill) =>
        set((state) => {
          const trimmed = skill.trim();
          if (!trimmed || state.techStack.includes(trimmed)) return state;
          return { ...state, techStack: [...state.techStack, trimmed] };
        }),

      removeTechSkill: (skill) =>
        set((state) => ({
          ...state,
          techStack: state.techStack.filter((s) => s !== skill),
        })),

      setTechStack: (skills) => set({ techStack: skills }),

      addExpertise: (item) =>
        set((state) => {
          const trimmed = item.trim();
          if (!trimmed || state.expertise.includes(trimmed)) return state;
          return { ...state, expertise: [...state.expertise, trimmed] };
        }),

      removeExpertise: (item) =>
        set((state) => ({
          ...state,
          expertise: state.expertise.filter((e) => e !== item),
        })),

      setExpertise: (items) => set({ expertise: items }),

      setAIProfile: (data) =>
        set((state) => ({
          ...state,
          name: data.name || state.name,
          title: data.title || state.title,
          tagline: data.tagline || state.tagline,
          bio: data.bio || state.bio,
          expertise: data.expertise && data.expertise.length > 0 ? data.expertise : state.expertise,
          techStack: data.techStack && data.techStack.length > 0 ? data.techStack : state.techStack,
        })),

      saveProfileToSession: () => {
        const state = get();
        const newSnapshot = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: state.name,
          title: state.title,
          bio: state.bio,
          expertise: [...state.expertise],
          location: state.location,
          portfolioUrl: state.portfolioUrl,
          githubUsername: state.githubUsername,
          techStack: [...state.techStack],
          avatarUrl: state.avatarUrl,
          templateId: state.templateId,
        };

        set((s) => ({
          savedProfilesSession: [newSnapshot, ...s.savedProfilesSession],
        }));
      },

      clearSessionProfiles: () => set({ savedProfilesSession: [] }),

      resetProfile: () => set(defaultState),
    }),
    {
      name: "dev-profile-architect-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

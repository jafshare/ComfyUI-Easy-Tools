import { create } from "zustand";

export const usePresetStore = create<{
  open: boolean;
  tags: string[];
  updateTags: (tags: string[]) => void;
  openPreset: () => void;
  closePreset: () => void;
}>((set) => ({
  open: false,
  tags: [],
  updateTags: (tags: string[]) => set({ tags }),
  openPreset: () => set({ open: true }),
  closePreset: () => set({ open: false }),
}));

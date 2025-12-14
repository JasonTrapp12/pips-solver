import { create } from "zustand";

type IModalStore = {
  aboutModalOpen: boolean;
  setAboutModalOpen: (open: boolean) => void;
};

export const useModalStore = create<IModalStore>((set) => ({
  aboutModalOpen: false,
  setAboutModalOpen: (open) => {
    set({ aboutModalOpen: open });
  },
}));

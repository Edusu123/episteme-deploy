import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  setModal: (open: boolean) => void;
};

export const useProfileModal = create<ModalStore>((set) => ({
  isOpen: false,
  setModal: (open: boolean) => set(() => ({ isOpen: open }))
}));

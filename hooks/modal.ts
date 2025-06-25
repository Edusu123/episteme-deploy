import { create } from 'zustand';

type ModalStore = {
  isOpen: boolean;
  setModal: (open: boolean) => void;
};

type ProfileModalStore = {
  isOpen: boolean;
  imageURL: string;
  setModal: (open: boolean, imageURL: string) => void;
};

export const useProfileModal = create<ProfileModalStore>((set) => ({
  isOpen: false,
  imageURL: '',
  setModal: (open: boolean, imageURL: string) =>
    set(() => ({ isOpen: open, imageURL: imageURL }))
}));

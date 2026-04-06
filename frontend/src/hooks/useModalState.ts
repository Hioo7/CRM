import { useState } from 'react';

export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useModalState(): ModalState {
  const [isOpen, setIsOpen] = useState(false);
  const open = (): void => setIsOpen(true);
  const close = (): void => setIsOpen(false);
  return { isOpen, open, close };
}

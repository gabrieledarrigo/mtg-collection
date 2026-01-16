"use client";

import { Dialog } from "@base-ui/react/dialog";
import styles from "./Modal.module.css";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          {title && (
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          )}
          <Dialog.Description className={styles.content}>
            {children}
          </Dialog.Description>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

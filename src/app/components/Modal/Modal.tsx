"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon, IconName } from "../Icon/Icon";
import styles from "./Modal.module.css";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.modal__backdrop} />
        <Dialog.Popup className={styles.modal__popup}>
          <div className={styles.modal__header}>
            {title && (
              <Dialog.Title className={styles.modal__title}>
                {title}
              </Dialog.Title>
            )}
            <Dialog.Close className={styles.modal__close}>
              <Icon name={IconName.CLOSE} size={24} />
            </Dialog.Close>
          </div>
          <div className={styles.modal__content}>{children}</div>
          {footer && <div className={styles.modal__footer}>{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

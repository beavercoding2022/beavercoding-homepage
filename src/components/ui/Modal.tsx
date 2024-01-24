'use client';

import React from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = {
  isOpen: boolean;
  onClickOutside?: () => void;
  onClose?: () => void;
};

const ModalBody = (props: React.PropsWithChildren<ModalProps>) => {
  return (
    <div
      className="absolute w-screen h-screen top-0 left-0 dark:bg-white/30 bg-white/70 flex flex-col justify-center items-center transition-all duration-150"
      onClick={(event) => {
        event.stopPropagation();
        props?.onClickOutside?.();
      }}
    >
      <div className="dark:bg-background bg-background p-4 rounded-xl animate-in">
        {props.children}
      </div>
    </div>
  );
};

export default function Modal(props: React.PropsWithChildren<ModalProps>) {
  const [modalRoot, setModalRoot] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setModalRoot(document.getElementById('modal-root') as HTMLDivElement);
  }, []);

  if (!props.isOpen || !modalRoot) {
    return null;
  }

  return createPortal(
    <ModalBody {...props}>{props.children}</ModalBody>,
    modalRoot!,
  );
}

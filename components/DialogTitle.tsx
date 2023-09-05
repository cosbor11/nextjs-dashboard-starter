import { Dialog } from '@headlessui/react';
import React from 'react';

interface DialogTitleProps {
  className?: string;
  children?: any
}

const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = "" }) => {
  return (
    <Dialog.Title as="h3" className={`text-base text-center font-semibold leading-6 text-gray-500 ${className}`}>
      {children}
    </Dialog.Title>
  );
};

export default DialogTitle;
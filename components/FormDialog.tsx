import { Dialog, Transition } from '@headlessui/react';
import React, { FormEvent, Fragment, ReactNode, useState } from 'react';
import BackgroundOverlayTransition from './BackgroundOverlayTransition';
import DialogPanelTransition from './DialogPanelTransition';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import DialogTitle from './DialogTitle';

interface FormDialogProps {
  setShow?(open: boolean): void;
  onCancel(): void;
  buttonLabel?: string;
  title: string;
  show: boolean;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const FormDialog: React.FC<FormDialogProps> = ({ show = true, buttonLabel = 'Submit', title, children, onSubmit, onCancel }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
        <BackgroundOverlayTransition />
        <form onSubmit={onSubmit} className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanelTransition>
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="my-3 text-center sm:mt-5 w-full">
                  <DialogTitle>{title}</DialogTitle>
                  <div className="my-8">
                    {children}
                  </div>
                </div>
                <div className='flex w-full space-x-2'>
                  <PrimaryButton type="submit" className='w-3/4'>{buttonLabel}</PrimaryButton>
                  <SecondaryButton onClick={onCancel} className='w-1/4 secondary-btn-dialog'>Cancel</SecondaryButton>
                </div>
              </Dialog.Panel>
            </DialogPanelTransition>
          </div>
        </form>
      </Dialog>
    </Transition.Root>
  );
};

export default FormDialog;

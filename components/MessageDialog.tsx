import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import BackgroundOverlayTransition from './BackgroundOverlayTransition';
import DialogPanelTransition from './DialogPanelTransition';
import PrimaryButton from './PrimaryButton';
import DialogTitle from './DialogTitle';

interface MessageDialogProps {
  onClose(value: boolean): void;
  setShow(open: boolean): void;
  buttonLabel?: string;
  title: string;
  description?: string;
  show: boolean;
  icon: ReactNode;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ show = true, setShow, onClose, buttonLabel = 'Done', title, description, icon }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <BackgroundOverlayTransition />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanelTransition>
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    {icon}
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle>{title}</DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-5">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <PrimaryButton className='w-full' onClick={() => {setShow(false)}}>{buttonLabel}</PrimaryButton>
              </Dialog.Panel>
            </DialogPanelTransition>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MessageDialog;

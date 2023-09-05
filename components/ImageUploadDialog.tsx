import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import DialogTitle from './DialogTitle';
import BackgroundOverlayTransition from './BackgroundOverlayTransition';
import DialogPanelTransition from './DialogPanelTransition';
import ImageUploader from './ImageUploader';

interface ImageUploadDialogProps {
  title?: string;
  show: boolean;
  onClose(value: boolean): void | null;
  onUploadSuccess?: (imageName: string) => void | null;
  signedURLEndpoint?: string;
  namespace: string; //the s3 subfolder in web-assets
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  title = "Title",
  show = false,  
  onClose = () => {},
  onUploadSuccess = () => { },
  namespace
}) => {
  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => onClose(false)}>
          <BackgroundOverlayTransition />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanelTransition>
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-slate-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <DialogTitle>{title}</DialogTitle>
                    <div>
                      <ImageUploader
                        namespace={namespace}
                        onUploadSuccess={onUploadSuccess}
                        cancelButtonVisible={true}
                        cancelButtonCss='secondary-btn-dialog'
                        onCancel={() => onClose(false)} // This line ensures the dialog is hidden on cancel
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </DialogPanelTransition>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ImageUploadDialog;

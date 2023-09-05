import { StepForm } from '@/components/WizardSteps';
import { PencilIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import React, { useState, useRef, useEffect } from 'react';
import ImageUploadDialog from '@/components/ImageUploadDialog';
import RandomLlamaImage from '@/components/RandomLlamaImage';
import { toast } from 'react-toastify';
import ProgressBar from '@/components/ProgressBar';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import SecondaryButton from '@/components/SecondaryButton';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const clearCustomValidity = (input: HTMLInputElement) => {
  input.setCustomValidity('');
};

const DetailsForm: React.FC<StepForm> = ({ onNext, values, onChange }) => {
  const [isAvatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [imageUrl, setImageUrl] = useState(values.profileImageUrl);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const reportEmailExistAlreadyError = (e: React.FormEvent<Element>) => {
    const emailInput = emailInputRef.current;

    if (emailInput) {
      emailInput.setCustomValidity('A user with that email already exists');
      emailInput.reportValidity();

      emailInput.addEventListener('input', () => clearCustomValidity(emailInput));
    }

  }

  const handleNext = async (e: React.FormEvent<Element>) => {
    if (values.email) {
      setIsValidating(true);
      try {
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          body: `{"email": "${values.email}"}`
        });
        const data = await response.json();
        if (data.error && data.error.message) {
          toast.error(`${data.error.message}`);
          setIsValidating(false);
          return
        }
        if (data.exists) {
          reportEmailExistAlreadyError(e)
        }
      } catch (error) {
        setIsValidating(false);
        console.error(`failed to verify email. error=${error}`)
        toast.error("an unexpected error occurred, please try again later");
        return
      }
    }

    setIsValidating(false);
    onNext && onNext(e)

  };

  const handleImageChange = (url: string) => {
    setImageUrl(url);
    values.profileImageUrl = url;
  };

  const handleUploadSuccess = (filename: string) => {
    handleImageChange(`/api/web-assets/${filename}`)
    setAvatarDialogOpen(false)
  };

  const AvatarSelector: React.FC<{ className: string }> = ({ className }) => {
    return (
      <div className={`flex items-center space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 mx-10 my-3 ${className}`}>

        <RandomLlamaImage src={imageUrl} className="rounded-full bg-panel-theme-color h-32 w-32" onImageChange={handleImageChange} />
        <input type="hidden" name="profileImageUrl" onChange={onChange} value={values.profileImageUrl || imageUrl} />

        <div className="flex flex-col items-center bg-transparent h-32 w-32">
          <SecondaryButton type="button" onClick={() => setAvatarDialogOpen(true)} className="p-2 border rounded btn">
            <PencilIcon className="text-theme-color w-7" />
          </SecondaryButton>
        </div>

      </div>
    );
  };

  return (
    <div className="mb-5 md:w-96 lg:w-96">

      {/* Google Register Button */}
      <GoogleSignInButton autoFocus />

      {/* ------- "Or" -------- */}
      <div className="relative m-5 ">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-2 border-theme-color " />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6 ">
          <span className="font-semibold px-6 bg-theme-color">Or</span>
        </div>
      </div>

      <h1 className="section-header" >
        Enter your details
      </h1>

      {/* email field */}
      <div className="relative mt-2 rounded-md shadow-sm mb-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          ref={emailInputRef}
          value={values.email || ''}
          onChange={onChange}
          className="block border rounded w-full pl-10"
          required
          placeholder="Email" />
      </div>

      <div className="flex flex-col w-full">

        {/* first name field */}
        <div className="flex flex-row mb-1">
          <input type="text"
            id="firstName"
            name="givenName"
            autoComplete="given-name"
            placeholder="First Name"
            value={values.givenName || ''}
            onChange={onChange}
            className="border rounded w-full" required />
        </div>

        {/* last name field */}
        <div className="flex flex-row mb-5">
          <input type="text"
            id="lastName"
            autoComplete="family-name"
            name="familyName"
            placeholder="Last Name"
            onChange={onChange}
            value={values.familyName || ''} className="border rounded w-full" required />
        </div>

        {/* profile picture field */}
        <h1 className="text-lg text-center w-full mb-5" >
          Choose a profile picture
        </h1>
        <AvatarSelector className="text-center w-full" />
      </div>

      {/* profile pic dialog */}
      <ImageUploadDialog
        namespace="profile-pics"
        title="Upload a profile picture"
        show={isAvatarDialogOpen}
        onUploadSuccess={handleUploadSuccess} 
        onClose={(val:boolean) => {
          setAvatarDialogOpen(val)
        }}      
        />

      <SecondaryButton
        type="button"
        onClick={handleNext}
        className="btn flex w-full justify-center ">
        {isValidating ? "Looking up email..." : "Continue"}
      </SecondaryButton>

      {isValidating && <ProgressBar />}

    </div>
  );
};

export default DetailsForm;

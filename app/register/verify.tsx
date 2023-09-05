import MessageDialog from '@/components/MessageDialog';
import PrimaryButton from '@/components/PrimaryButton';
import ProgressBar from '@/components/ProgressBar';
import SecondaryButton from '@/components/SecondaryButton';
import { StepForm } from '@/components/WizardSteps';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/20/solid';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

const VerifyEmailForm: React.FC<StepForm> = ({ onNext, onChange, values }) => {
  const [registrationCodeSent, setRegistrationCodeSent] = useState(values.registrationCodeSent);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const inputRef = useRef(null);

  if ((values.email && values.verifiedEmail) && (values.email != values.verifiedEmail)) {
    values.registrationCode = ""
    values.verifiedEmail = ""
    setRegistrationCodeSent(values.registrationCode)
  }

  const sendCode = async () => {
    setIsSendingCode(true)
    try {
      const response = await fetch('/api/send-registration-code', {
        method: 'POST',
        body: `{"email": "${values.email}"}`
      })
      const data = await response.json();
      if (data.error && data.error.message) {
        toast.error(`${data.error.message}`);
        return false;
      }
      if (data.message = "success") {
        values.registrationCodeSent = true;
        setRegistrationCodeSent(values.registrationCodeSent);
      }

    } catch (error) {
      console.error(`failed to send registration. error=${error}`)
      toast.error("an unexpected error occurred, please try again later");
    }

    setIsSendingCode(false)

  };

  const verify = async () => {
    try {
      const response = await fetch('/api/verify-registration-code', {
        method: 'POST',
        body: `{"email": "${values.email}", "code": "${values.registrationCode}"}`
      });
      const data = await response.json();
      if (data.error && data.error.message) {
        toast.error(`${data.error.message}`);
        return false;
      }
      if (data.message === "success") {
        values.verifiedEmail = values.email;

        return true;
      }
    } catch (error) {
      console.error(`failed to send registration. error=${error}`);
      toast.error("an unexpected error occurred, please try again later");
      return false;
    }
  };

  const handleNext = async (e: React.FormEvent<Element>) => {
    if (values.verifiedEmail !== values.email) {
      setIsVerifying(true);
      const success = await verify();
      setIsVerifying(false);
      if (!success) return;
    }

    if (values.verifiedEmail === values.email) {
      onNext && onNext(e);
    }
  };

  return (

    <div className="mb-5 md:w-96 lg:w-96">
      <h1 className="text-lg text-center w-full mb-5" >
        Verify email
      </h1>

      <p className="m-5 text-theme-color opacity-80 w-4/5 relative">
        <span className="font-bold">Send Code</span> will send a registration code to your email.
        Open the email in your inbox, and copy/pase the code below. <span className="text-2xl font-extrabold absolute bottom-0 right-0">↴</span>
      </p>

      <div className="flex flex-col w-full">
        <div className="flex flex-row mb-3">
          <input
            type="text"
            value={values.registrationCode || ''}
            onChange={onChange}
            disabled={!registrationCodeSent || values.verifiedEmail == values.email}
            placeholder="registration code"
            name="registrationCode"
            ref={inputRef}
            required
            className="border uppercase rounded w-3/4 mr-2 disabled:cursor-not-allowed disabled:bg-gray-200" />

          <SecondaryButton
            type="button"
            onClick={sendCode}
            disabled={values.verifiedEmail == values.email}
            className="btn w-1/4 disabled:cursor-not-allowed">
            {!registrationCodeSent ? "Send Code" : (values.verifiedEmail == values.email) ? "Verfied" : "Resend Code"}
          </SecondaryButton>
        </div>
      </div>

    {registrationCodeSent && 
      <div className="text-green-500 flex flex-row font-semibold p-3">
          <CheckCircleIcon height={30} width={30} />
          <h1 className='mt-1'>{values.verifiedEmail != values.email ? "Code was sent! Check your email": "Verified!"}</h1>
        </div>
    }

      {(values.verifiedEmail != values.email) ?
        <PrimaryButton
          type="button"
          onClick={handleNext}
          disabled={!values.registrationCode || values.registrationCode == ""}
          className="w-full">
          {isVerifying ? (
            <>
              <span className="spinner"></span> Verifying...
            </>
          ) : (
            "Verify"
          )}
        </PrimaryButton>
        :
        <PrimaryButton
          type="button"
          onClick={handleNext}
          disabled={values.verifiedEmail != values.email}
          className="w-full">
          Next
        </PrimaryButton>
      }

      {(isVerifying || isSendingCode) && <ProgressBar />}

    </div>
  );
};

export default VerifyEmailForm;

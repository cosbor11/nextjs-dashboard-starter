import PrimaryButton from '@/components/PrimaryButton';
import { StepForm } from '@/components/WizardSteps';
import React, { FormEvent, useState } from 'react';
import { getPasswordStrength } from './validations';
import { PasswordNotVisibleIcon, PasswordVisibleIcon } from '@/components/PasswordFieldIcons';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import StatesMatchIndicator from '@/components/StatesMatchIndicator';

const PasswordForm: React.FC<StepForm> = ({ onChange, values, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevPasswordState) => !prevPasswordState);
  }

  function toggleConfirmPasswordVisibility() {
    setIsConfirmPasswordVisible((prevConfirmPasswordState) => !prevConfirmPasswordState);
  }

  const handlePasswordChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setPassword(value);
    setStrength(getPasswordStrength(value));
  };

  const handleConfirmPasswordChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    setConfirmPassword(value);
    onChange(e)
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form reload
    setIsSubmitting(true);

    let isFormValid = true;

    const passwordInput = passwordRef.current;
    const confirmedPasswordInput = confirmPasswordRef.current;

    if (!passwordInput || !confirmedPasswordInput) {
      return;
    }

    const clearCustomValidity = (input: HTMLInputElement) => {
      input.setCustomValidity('');
    };

    passwordInput.addEventListener('input', () => clearCustomValidity(passwordInput));
    confirmedPasswordInput.addEventListener('input', () => clearCustomValidity(confirmedPasswordInput));

    passwordInput.addEventListener('input', () => clearCustomValidity(passwordInput));
    confirmedPasswordInput.addEventListener('input', () => clearCustomValidity(confirmedPasswordInput));

    const pwStrength = getPasswordStrength(passwordInput.value);
    if (pwStrength < 4) {
      passwordInput.setCustomValidity('must have at least 9 characters, contain one numeric, one alphabetic, and one special character.');
      passwordInput.reportValidity();
      isFormValid = false;
    }

    if (passwordInput.value != confirmedPasswordInput.value) {
      confirmedPasswordInput.setCustomValidity('must match password');
      confirmedPasswordInput.reportValidity();
      isFormValid = false;
    }

    if (isFormValid && onSubmit) {
      let success = await onSubmit(e);
      if(!success){
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
    
  }

  return (
    <div className="mb-5 md:w-96 lg:w-96">

      <h1 className="text-lg text-center w-full mb-5">
        Choose a password
      </h1>

      <div className="flex flex-col w-full">
        <div className="flex flex-row">
          <div className="relative w-full container mx-auto">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              ref={passwordRef}
              autoComplete="new-password"
              name="password"
              className="w-full
                        px-4
                        py-2
                        border
                        rounded
                        outline-none"
              onKeyUp={handlePasswordChange}
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <PasswordVisibleIcon />
              ) : (
                <PasswordNotVisibleIcon />
              )}
            </button>
          </div>
        </div>

        <PasswordStrengthMeter strength={strength} />

      </div>

      <div className="flex flex-col w-full">
        <div className="relative w-full container mx-auto">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmedPassword"
            ref={confirmPasswordRef}
            onKeyUp={handleConfirmPasswordChange}
            className="w-full
            px-4
            py-2
            border
            rounded
            outline-none
            focus:ring-blue-500 focus:border-blue-500 focus:ring-1"
            required
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            onClick={toggleConfirmPasswordVisibility}
          >
            {isConfirmPasswordVisible ? (
              <PasswordVisibleIcon />
            ) : (
              <PasswordNotVisibleIcon />
            )}
          </button>
        </div>
      </div>

      {/* password match meter */}
      <StatesMatchIndicator state1={password} state2={confirmPassword} />

      <div className="px-8 pb-5 text-sm">
        <p>
          Must have at least 9 characters
          and the following:
        </p>

        <ul className='list-disc pl-5'>
          <li>1 uppercase letter</li>
          <li>1 number</li>
          <li>1 special character (i.e. ! @ # $ % ^ & *)</li>
        </ul>
      </div>


      <PrimaryButton
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full">
        {isSubmitting ? 'Submitting...' : 'Finish'}
      </PrimaryButton>

    </div>
  );
};

export default PasswordForm;

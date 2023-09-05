import React, { FormEvent, useState } from 'react';
import { Step } from './WizardSteps';
import SecondaryButton from './SecondaryButton';

type FormWizardsProps = {
  formId: string,
  steps: Step[];
  onNext(): void;
  onBack(): void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<boolean>;
  className?: string
  values: Record<string, any>;
  onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
}

const FormWizard: React.FC<FormWizardsProps> = ({ className, formId, steps, onNext, onBack, onSubmit, values, onChange }) => {
  const [stepIndex, setStep] = useState(0);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault(); 
    const form = document.getElementById(formId) as HTMLFormElement;
    if (form.checkValidity() === false) {
      form.reportValidity();
    } else {
      onNext()
      setStep(stepIndex + 1)
    }
  };

  const handlePrevious = () => {
    onBack()
    setStep(stepIndex - 1)
  }

  const StepComponent = steps[stepIndex].component;

  return (
    <div className={className}>
     <form id={formId} onSubmit={onSubmit} className="panel">
        <div>
          <StepComponent 
            values={values} 
            onChange={onChange} 
            onNext={handleNext}
            onSubmit={onSubmit}
          />
        </div>
      </form>

      {stepIndex > 0 && (
          <SecondaryButton type="button" 
                        className="btn" 
                        onClick={handlePrevious}>
          ← Back
          </SecondaryButton>
      )}

    </div>
  );
};

export default FormWizard;

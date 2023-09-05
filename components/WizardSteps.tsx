import { CheckIcon } from '@heroicons/react/20/solid';
import { FormEvent } from 'react';

export interface StepForm {
    values: Record<string, any>;
    onNext?(e: React.FormEvent): void;
    onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<boolean>;
  }

export type Step = {
    name: string;
    description?: string;
    href?: string;
    status: 'complete' | 'current' | 'upcoming';
    component: React.FC<StepForm>;
}

type WizardStepsProps = {
    steps: Step[];
    headerElement: React.ReactElement;
    className: string;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function CompleteStep({ step, stepIdx, steps }: { step: Step; stepIdx: number; steps:Step[] }) {
    let isLast = (stepIdx !== steps.length - 1);
    return (
        <>
            {isLast ? (
                // connecting line
                <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-panel-text-color" aria-hidden="true" />
            ) : null}
            <a href={step.href} className="group relative flex items-start">
                <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-panel-text-color">
                        <CheckIcon className="h-5 w-5 stroke-current" style={{ strokeWidth: '1.5', color: 'var(--panel-background-color)' }} aria-hidden="true" />
                    </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-bold font-large text-panel-theme-color">{step.name}</span>
                    <span className="text-sm text-panel-theme-color font-small">{step.description}</span>
                </span>
            </a>
        </>
    );
}

function CurrentStep({ step, stepIdx, steps }: { step: Step; stepIdx: number; steps: Step[] }) {
    return (
        <>
            {stepIdx !== steps.length - 1 ? (
                // connecting line
                <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5" aria-hidden="true" /> 
            ) : null}
            <a href={step.href} className="group relative flex items-start" aria-current="step">
                <span className="flex h-9 items-center" aria-hidden="true">
                    {/* big circle */}
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-theme-color bg-panel-text-color">
                        {/* small inner circle */}
                        <span className="h-2.5 w-2.5 rounded-full bg-panel-theme-color" />
                    </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-bold font-large text-panel-theme-color">{step.name}</span>
                    <span className="text-sm text-panel-theme-color font-small">{step.description}</span>
                </span>
            </a>
        </>
    );
}

function UpcomingStep({ step}: { step: Step;}) {
    return (
        <>
            <a href={step.href} className="group relative flex items-start">

                <span className="flex h-9 items-center" aria-hidden="true">
                    {/* big circle */}
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-panel-theme-color border-panel-theme-color">
                        {/* small inner circle */}
                        <span className="h-2.5 w-2.5 rounded-full bg-panel-text-color" />
                    </span>
                </span>
                {/* name and description */}
                <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-bold font-large text-panel-theme-color">{step.name}</span>
                    <span className="text-sm text-panel-theme-color font-small">{step.description}</span>
                </span>
            </a>
        </>);
}

const WizardSteps: React.FC<WizardStepsProps> = ({ steps, headerElement, className }) => {
    return (
        <nav aria-label="Registration Progress" className={`h-screen first-letter:hidden sm:block ${className}`}>
            <div className='m-7 mr-14 mt-7 flex flex-col'>
                {headerElement}
                <ol role="list" className="">
                    {steps.map((step, stepIdx) => (
                        <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
                            {step.status === 'complete' ? (
                                <CompleteStep step={step} stepIdx={stepIdx} steps={steps} />
                            ) : step.status === 'current' ? (
                                <CurrentStep step={step} steps={steps} stepIdx={stepIdx}/>
                            ) : (
                                <UpcomingStep step={step} />
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    )
}

export default WizardSteps;


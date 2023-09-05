'use client'

import Logo from '@/components/Logo'
import WizardSteps, { Step } from '@/components/WizardSteps'
import Branding from '@/components/branding/Branding'

const Header = (
    <div className='flex'>
        <Logo className="panel-logo-theme-color mb-10" width={34} height={34} />
        <span className='text-panel-theme-color text-md font-semibold text-justify mt-1 ml-2'>{Branding.name} Registration</span>
    </div>
)

type RegistrationStepsProps = {
    steps: Step[];
    className?: string
}

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({ steps, className="" }) => {
    return (
        <WizardSteps className={`h-screen sticky top-0 bg-panel-theme-color hidden sm:block ${className}`} headerElement={Header} steps={steps} />
    )
}

export default RegistrationSteps;



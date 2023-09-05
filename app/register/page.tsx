'use client'
import Title from "@/components/branding/BrandingTitle"
import Footer from "@/components/Footer"
import Logo from "@/components/Logo"
import DetailsForm from "./details"
import RegistrationSteps from "./steps"
import { Step } from "@/components/WizardSteps"
import { FormEvent, useState } from "react"
import FormWizard from "@/components/FormWizard"
import VerifyEmailForm from "./verify"
import PasswordForm from "./password"
import { toast } from 'react-toastify';
import { useAuth } from "@/contexts/AuthContext"

const Register: React.FC = () => {
    const [values, setValues] = useState({});
    const { loginWithCustomToken } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = JSON.stringify(values);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            });
            const data = await response.json();
            if (data.error && data.error.message) {
                toast.error(`${data.error.message}`);
                return false;
            }
            await loginWithCustomToken(data.token);
            return true
        } catch (error) {
            toast.error(`failed to submit form. error=${error}`);
        }
        return false
    };

    const [steps, setSteps] = useState<Step[]>([
        { name: 'Details', description: 'enter name and email.', status: 'current', component: DetailsForm },
        { name: 'Verify', description: 'verify your email.', status: 'upcoming', component: VerifyEmailForm },
        { name: 'Password', description: 'Choose a password.', status: 'upcoming', component: PasswordForm }
    ]);

    const getCurrentStepIndex = (): number => {
        return steps.findIndex(step => step.status === 'current');
    };

    const nextStep = () => {
        const currentIndex = getCurrentStepIndex()
        const newSteps = [...steps];  //avoid mutating the state directly
        if (currentIndex !== -1 && currentIndex < newSteps.length - 1) {
            newSteps[currentIndex].status = 'complete';
            newSteps[currentIndex + 1].status = 'current';
        }
        setSteps(newSteps);
    };

    const previousStep = () => {
        const currentIndex = getCurrentStepIndex()
        const newSteps = [...steps];  //avoid mutating the state directly
        if (currentIndex !== -1 && currentIndex > 0) {
            newSteps[currentIndex].status = 'upcoming';
            newSteps[currentIndex - 1].status = 'current';
        }
        setSteps(newSteps);
    }

    return (
        <main className="flex h-scren w-full">

            <RegistrationSteps className={"w-1/4"} steps={steps} />

            <div className="flex-col m-auto w-fill">

                <div className="flex items-center px-5 pt-5" >
                    <Logo className="logo-theme-color sm:hidden" width={64} height={64} />
                    <Title textClassName="text-4xl p-3" />
                </div>

                <FormWizard className="mx-4"
                    formId="userRegistrationForm"
                    steps={steps}
                    onNext={nextStep}
                    onBack={previousStep}
                    values={values}
                    onChange={handleChange}
                    onSubmit={onSubmit} />

                {/* Sign in Link */}
                <p className="mt-8 text-center text-sm text-theme-color mb-14">
                    Already a member?{' '}
                    <a href="signin" className="font-semibold leading-6 link-theme-color">
                        Sign in
                    </a>
                </p>

                <Footer />

            </div>

        </main>
    )
}

export default Register

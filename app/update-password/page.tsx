'use client'

import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import { getPasswordStrength } from "../register/validations";
import { PasswordNotVisibleIcon, PasswordVisibleIcon } from "@/components/PasswordFieldIcons";
import StatesMatchIndicator from "@/components/StatesMatchIndicator";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/contexts/AuthContext";
import ProgressBar from "@/components/ProgressBar";
import SecondaryButton from "@/components/SecondaryButton";

interface Headers {
    [key: string]: string;
}

export default function UpdatePassword() {
    const { user, logout, authCheckCompleted } = useAuth();
    const [resetCode, setResetCode] = useState<string | null>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [strength, setStrength] = useState(0);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    useEffect(() => {
        if (authCheckCompleted) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('code')) {
                setResetCode(urlParams.get('code'))
            } else if (window && !user) {
                window.location.href = "/signin"
            }
        }
    }, [authCheckCompleted, user]);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevPasswordState) => !prevPasswordState);
    }

    const toggleConfirmPasswordVisibility = () => {
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
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const passwordInput = document.getElementsByName("password")[0] as HTMLInputElement;
        const confirmPasswordInput = document.getElementsByName("confirmedPassword")[0] as HTMLInputElement;

        // Clear previous custom validation messages
        passwordInput.setCustomValidity("");
        confirmPasswordInput.setCustomValidity("");

        const clearCustomValidity = (input: HTMLInputElement) => {
            input.setCustomValidity('');
        };

        passwordInput.addEventListener('input', () => clearCustomValidity(passwordInput));
        confirmPasswordInput.addEventListener('input', () => clearCustomValidity(confirmPasswordInput));

        if (strength < 4) {
            passwordInput.setCustomValidity("Password is not strong enough");
        }

        if (password != confirmPassword) {
            confirmPasswordInput.setCustomValidity("Passwords do not match");
        }

        if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity();
            return;
        }

        setIsPending(true)
        try {

            const headers: Headers = {
                'Content-Type': 'application/json',
            };


            if (user && !resetCode) {
                const token = await user.getIdToken(true)
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    password: password,
                    resetCode: resetCode
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.log(data.error)
                toast.error(data.error.message)
            } else if (data.message == "success") {
                window.location.href = '/signin?pwUpdate=true'
            }
        } catch (error) {
            console.log(error)
            toast.error("Unexpected error occurred. Try again later")
        }
        setIsPending(false)
    };

    return (
        <>
            <main className="flex min-h-screen flex-col items-center">

                <Title className="p-5" textClassName="text-4xl" />

                <div className="bg-panel-theme-color shadow-2xl w-screen sm:w-3/4 md:w-2/5 lg:1/4 sm:rounded-xl">
                    <div className="px-4 py-5">

                        <div className="flex justify-center items-center">
                            <Logo className="panel-logo-theme-color" height={164} width={164} />
                        </div>

                        <h3 className="px-20 text-center text-2xl font-semibold leading-9 tracking-tight text-inverse">
                            Set your Password
                        </h3>

                        <form className="space-y-6 bg-panel-theme-color mt-4" onSubmit={onSubmit}>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row">
                                    <div className="relative w-full container mx-auto">
                                        <input
                                            title="Password"
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="Password"
                                            autoComplete="new-password"
                                            name="password"
                                            autoFocus
                                            className="w-full
                                                        px-4
                                                        py-2
                                                        border
                                                        rounded
                                                        outline-none
                                                        focus:ring-blue-500 
                                                        focus:border-blue-500 
                                                        focus:ring-1"
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

                                {/* password strength meter: weak, fair, good, excellent */}
                                <PasswordStrengthMeter strength={strength} />

                                <div className="relative w-full container mx-auto">
                                    <input
                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        name="confirmedPassword"
                                        onKeyUp={handleConfirmPasswordChange}
                                        className="w-full
                                                    px-4
                                                    py-2
                                                    border
                                                    rounded
                                                    outline-none
                                                  focus:ring-blue-500 
                                                  focus:border-blue-500 
                                                    focus:ring-1"
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
                                    disabled={isPending}
                                    type="submit"
                                    className="w-full border-theme-inverse">
                                    {isPending ? "Updating..." : "Update"}
                                </PrimaryButton>

                            </div>
                        </form>
                        {isPending && <ProgressBar />}
                    </div>



                </div>


                <div className="py-5 w-screen sm:w-3/4 md:w-2/5 lg:1/3 pl-2 sm:pl-0">
                    <SecondaryButton
                        onClick={function (): void {
                            window.location.href = "/"
                        }}>← Back
                    </SecondaryButton>
                </div>


            </main>

            <Footer />
        </>
    );
}

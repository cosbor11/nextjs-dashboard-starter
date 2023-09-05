'use client'
import Footer from "@/components/Footer"
import Logo from "@/components/Logo"
import { PasswordNotVisibleIcon, PasswordVisibleIcon } from "@/components/PasswordFieldIcons";
import ProgressBar from "@/components/ProgressBar";
import Title from "@/components/branding/BrandingTitle"
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "@/contexts/AuthContext";
import SecondaryButton from "@/components/SecondaryButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const SignIn: React.FC = () => {
    const { signInWithEmail, logout, loginWithNewPassword, authCheckCompleted } = useAuth();
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevPasswordState) => !prevPasswordState);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('logout')) {
            logout()
        }
        if(urlParams.has('pwUpdate')){
            loginWithNewPassword()
        }

        if (urlParams.has('new')) {
            toast.success(`Welcome! Your account was created! You may now sign in`);
            const newUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, newUrl);
        }

    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        signInWithEmail(email, password);
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center">
                <Title className="p-5" textClassName="text-4xl" />
                <div className="bg-panel-theme-color shadow-2xl lg:rounded-lg md:rounded-lg">
                    <div className="px-4 py-5">

                        <div className="flex justify-center items-center">
                            <Logo className="panel-logo-theme-color" height={164} width={164} />
                        </div>

                        <h3 className="px-20 text-center text-2xl font-semibold 
                        leading-9 tracking-tight text-theme-panel-color">Sign in to your account</h3>

                        <div className="mt-10 mb-4">

                            <form className="space-y-6 bg-panel-theme-color" onSubmit={onSubmit} method="POST">

                                {/* Google Sign In Button */}
                                <GoogleSignInButton />

                                {/* ------- "Or" -------- */}
                                <div className="relative m-5 ">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t bg-panel-theme-color" />
                                    </div>
                                    <div className="relative flex justify-center text-sm font-medium leading-6">
                                        <span className="bg-theme-panel-color text-theme-panel-color px-6 bg-panel-theme-color">Or</span>
                                    </div>
                                </div>

                                {/* email */}

                                <div className="relative mt-2 rounded-md shadow-sm mb-2">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <label htmlFor="email" className="sr-only block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="Email"
                                            className="block w-full pl-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                {/* password */}
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>

                                <div className="relative w-full container mx-auto">
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        name="password"
                                        id="password"
                                        autoComplete="current-password"
                                        className="relative 
                                        block w-full 
                                        rounded-b-md border-0 py-1.5 
                                        text-gray-900 ring-1 ring-inset 
                                        ring-gray-100 placeholder:text-gray-400 
                                        focus:ring-2 focus:ring-inset 
                                        focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

                                {/*Forgot Password link */}
                                <div className="flex justify-end w-full text-sm">
                                    <a href="reset-password" className="panel-link-theme-color">
                                        Forgot password?
                                    </a>
                                </div>

                                <div>
                                    {/* Sign In button */}
                                    <SecondaryButton
                                        type="submit"
                                        disabled={isPending}
                                        className="flex w-full secondary-btn-panel">
                                        {isPending ? "Signing in..." : "Sign In"}
                                    </SecondaryButton>
                                </div>

                            </form>

                            {isPending && <ProgressBar />}
                        </div>
                    </div>

                </div>

                {/* Register Link */}
                <p className="mt-8 text-center text-sm text-theme-color">
                    Not a member?{' '}
                    <a href="register" className="font-semibold leading-6 link-theme-color">
                        Register
                    </a>
                </p>


            </main>
            <Footer />
        </>


    )
}

export default SignIn




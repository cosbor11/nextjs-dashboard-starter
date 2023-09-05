'use client'
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import Logo from "@/components/Logo";
import Title from "@/components/branding/BrandingTitle";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import PrimaryButton from "@/components/PrimaryButton";

export default function ResetPassword() {
    const [email, setEmail] = useState<string>("");
    const [isPending, setIsPending] = useState<boolean>(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsPending(true)
        e.preventDefault();
        try {
            const response = await fetch('/api/send-password-reset-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.log(data.error)
                toast.error(data.error.message)
            } else if (data.message == "success") {
                toast.success("Email sent successfully.", {
                    onClose: () => {
                        window.location.href = '/signin'
                    }
                });
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
                <div className="bg-panel-theme-color shadow-2xl lg:rounded-lg md:rounded-lg">
                    <div className="px-4 py-5">
                        <div className="flex justify-center items-center">
                            <Logo className="logo-inverse" height={164} width={164} />
                        </div>
                        <h3 className="px-20 text-center text-2xl font-semibold leading-9 tracking-tight text-color-inverse">
                            Reset Your Password
                        </h3>
                        <form className="space-y-6 bg-panel-theme-color" onSubmit={onSubmit}>
                            <div>
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <PrimaryButton
                                    disabled={isPending}
                                    type="submit"
                                    className="w-full"
                                >
                                    {isPending ? "Sending..." : "Send Reset Email"}
                                </PrimaryButton>
                            </div>
                        </form>

                        {isPending && <ProgressBar />}

                    </div>
                </div>

                {/* Register Link */}
                <p className="mt-8 text-center text-sm text-color">
                    Change your mind?{' '}
                    <a href="signin" className="font-semibold leading-6 link-theme-color">
                        Sign in
                    </a>
                </p>

            </main>

            <Footer />
        </>
    );
}

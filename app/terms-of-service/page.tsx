'use client'

import Footer from "@/components/Footer";
import SecondaryButton from "@/components/SecondaryButton";
import { NextPage } from "next";

const TermsOfService: NextPage = () => {
    return (
        <main className="flex flex-col justify-center items-center">

            <div className="panel p-4 w-screen sm:w-3/4 lg:w-2/3">
                <h1 className="text-2xl font-semibold py-3">Terms of Service</h1>

                <div className="space-y-6">

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Booking Terms</h2>
                        <ul>
                            <li>When you book a listing, you agree to cover all associated costs. This includes the room rate, our service fee, and any applicable taxes and extra charges.</li>
                            <li>You&apos;re also giving us permission to charge your chosen payment method for any damage claims.</li>
                            <li>Once the booking is confirmed, your reservation agreement is directly with the host.</li>
                            <li>Please note, you&apos;ll need to adhere to the host&apos;s rules, including their cancellation policy and any additional requirements.</li>
                            <li>We recommend reviewing these terms carefully before finalizing your booking.</li>
                        </ul>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Acceptance of Terms</h2>
                        <p>By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Modifications</h2>
                        <p>We may change or modify these Terms at any time. Your continued use signifies your acceptance of the updated Terms.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Account Responsibilities</h2>
                        <p>You are responsible for maintaining the confidentiality of your account and are liable for all activities that occur under it.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Content</h2>
                        <p>You agree not to post content that is illegal, offensive, or harmful when using our services.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Termination</h2>
                        <p>We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for behavior that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Limitation of Liability</h2>
                        <p>To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Governing Law</h2>
                        <p>These Terms are governed by and construed in accordance with the laws of the state in which we operate, without regard to its conflict of law principles.</p>
                    </section>

                    <section className="text-base">
                        <h2 className="text-lg font-semibold">Contact Information</h2>
                        <p>If you have any questions about these Terms, please contact us at 1-800-694-5487 or via email at [email address].</p>
                    </section>

                </div>
            </div>


            <SecondaryButton
                onClick={function (): void {
                    window.location.href = "/"
                }}>← Back
            </SecondaryButton>

            <Footer />

        </main>
    );
};

export default TermsOfService;

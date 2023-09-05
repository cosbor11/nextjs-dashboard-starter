"use client"

import Footer from "@/components/Footer";
import SecondaryButton from "@/components/SecondaryButton";
import { NextPage } from "next";

const PrivacyPolicy: NextPage = () => {
  return (
    <main className="flex flex-col justify-center items-center p-4 ">
      <div className="panel p-4 w-screen sm:w-3/4 lg:w-2/3">
        <h1 className="text-2xl font-semibold py-3">Privacy Policy</h1>

        <div className="space-y-6">
          <section className="text-base">
            <h2 className="text-lg font-semibold">Introduction</h2>
            <p>This Privacy Policy (&quot;Policy&quot;) governs your interaction with our website and services. It describes how we collect, use, process, and manage your personal information.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">Information Collected</h2>
            <p>We collect various types of information including your email, chosen display name from Google, payment information, phone number (optional for certain phone opt-in features)</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">How Information is Collected</h2>
            <p>Information is collected through forms during the sign up process and booking process, as well as via secure payment gateways such as Stripe for phone prepayments.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">Why Information is Collected</h2>
            <p>The information is collected for various purposes including facilitating guest prepayments, allowing innkeepers to communicate with guests, and for internal record-keeping.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">How Information is Used</h2>
            <p>We use your information solely for the purposes outlined in this Policy, and we do not sell your information to third parties.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">Information Sharing and Disclosure</h2>
            <p>Your data will only be shared with third parties if it&apos;s necessary for the fulfillment of our services or if required by law.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">Data Storage and Security</h2>
            <p>All sensitive information such as payment details is securely stored using trusted third-party services like Stripe. We employ various security measures to protect your data.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">User Rights</h2>
            <p>You have the right to request a copy, amendment, or deletion of your personal data. You also have the right to opt-out of marketing communications.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">Cookies and Local Storage</h2>
            <p>We utilize local storage for storing authentication details and application state. We do not use cookies for tracking purposes.</p>
          </section>

          <section className="text-base">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <p>If you have any questions or concerns, please contact us at 1-800-694-5487 or via email at [email address].</p>
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

export default PrivacyPolicy;

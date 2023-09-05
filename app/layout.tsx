

import { UXSettingsProvider } from '@/contexts/UXSettingsContext';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import Branding from '@/components/branding/Branding';
import CopyableToastContainer from '@/components/CopyableToastContainer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${Branding.name} ${Branding.appName}`,
  description: `${Branding.description}`,
}

type RootLayoutProps = {
  children: React.ReactNode;
};

const toastClassName = (): string => {
  setTimeout(() => {
    const toasts: NodeListOf<HTMLElement> = document.querySelectorAll('.selectable-toast');
    toasts.forEach((toast: HTMLElement) => {
      if (!toast.querySelector('.copy-button')) {
        const btn: HTMLButtonElement = document.createElement('button');
        btn.innerHTML = 'Copy';
        btn.classList.add('copy-button');
        btn.onclick = function (): void {
          navigator.clipboard.writeText(toast.textContent || '');
        };
        toast.appendChild(btn);
      }
    });
  }, 0);
  return 'selectable-toast';
};


export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <UXSettingsProvider>
      <html lang="en" className={`h-full`}>
        <body className={inter.className}>
          <CopyableToastContainer />
          {children}
        </body>
      </html>
    </UXSettingsProvider>
  );
}





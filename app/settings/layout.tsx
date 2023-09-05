'use client'

import React from 'react';
import Admin from "../admin";
import { UXSettingsProvider } from '@/contexts/UXSettingsContext';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <Admin>{children}</Admin>
  );
}

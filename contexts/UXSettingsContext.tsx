'use client'

import { deepMerge } from '@/src/form-helpers';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CustomTheme {
  appBarBackgroundColor:string;
  appBarTextColor:string;
  appBarLogoColor:string;

  backgroundColor: string;
  textColor: string;
  logoColor:string;
  linkColor: string;
  
  panelBackgroundColor:string;
  panelTextColor:string;
  panelLinkColor: string;

  buttonColor: string;

  sidebarBackgroundColor:string;
  sidebarTextColor:string;
  sidebarLinkBackgroundColor:string;
  sidebarLinkTextColor:string;
  sidebarActiveLinkBackgroundColor:string;
  sidebarActiveLinkTextColor:string;

  linkColorHover?: string; //derived from linkColor (brighter)
  linkColorFocus?: string; //derived from linkColor (darker)

  sidebarLinkTextColorHover?:string; //derived from sidebarTextColor (brighter)

  panelLinkColorHover?: string; //derived from panelLinkColor (darker)
  panelLinkColorFocus?: string; //derived from panelLinkColor (brighter)

  buttonColorHover?: string; //derived from buttonColor (brigher)
  buttonColorHoverFocus?: string; //derived from buttonColor (brigher)
}

const adjustBrightness = (hex: string, factor: number): string => {
  if (hex === undefined) return '';
  let red = parseInt(hex.slice(1, 3), 16);
  let green = parseInt(hex.slice(3, 5), 16);
  let blue = parseInt(hex.slice(5, 7), 16);

  red = Math.min(255, Math.max(0, red + Math.round(255 * factor)));
  green = Math.min(255, Math.max(0, green + Math.round(255 * factor)));
  blue = Math.min(255, Math.max(0, blue + Math.round(255 * factor)));

  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

export interface UXSettings {
  theme: string;
  customThemes: Record<string, CustomTheme>;
}

export const defaultSettings: UXSettings = {
  theme: 'light',
  customThemes: {
    new: {
      appBarBackgroundColor: '#436666',
      appBarTextColor: '#f8e9dc',

      logoColor: '#436666',
      appBarLogoColor: '#f8e9dc',

      backgroundColor: '#f8e9dc',
      textColor: '#436666',

      panelBackgroundColor: '#436666',
      panelTextColor: '#f8e9dc',

      linkColor: '#2499ba',
      panelLinkColor: '#23D3ED',
      buttonColor: '#FB923C',

      sidebarBackgroundColor: "#436666",
      sidebarTextColor: "#9BA3AF",
      sidebarLinkBackgroundColor: "#436666",
      sidebarLinkTextColor: "#9BA3AF",
      sidebarActiveLinkBackgroundColor: "#1F2937",
      sidebarActiveLinkTextColor: "#FFFFFF",
    }
  }
};


const deriveColors = (theme: CustomTheme): CustomTheme => {
  const linkColorHover = adjustBrightness(theme.linkColor, 0.1);
  const linkColorFocus = adjustBrightness(theme.linkColor, -0.1);

  const panelLinkColorHover = adjustBrightness(theme.panelLinkColor, -0.1);
  const panelLinkColorFocus = adjustBrightness(theme.panelLinkColor, 0.1);

  const buttonColorHover = adjustBrightness(theme.buttonColor, 0.1);
  const buttonColorHoverFocus = adjustBrightness(theme.buttonColor, 0.1);

  const sidebarLinkTextColorHover = adjustBrightness(theme.sidebarLinkTextColor, 0.1);

  return {
    ...theme,
    linkColorHover,
    linkColorFocus,
    panelLinkColorHover,
    panelLinkColorFocus,
    buttonColorHover,
    buttonColorHoverFocus,
    sidebarLinkTextColorHover
  };
};

const updateCssVariables = (theme: CustomTheme) => {
  if (theme && theme.backgroundColor) {
    const root = document.documentElement;

    root?.style?.setProperty('--background-color', theme.backgroundColor);
    root?.style?.setProperty('--text-color', theme.textColor);

    root?.style?.setProperty('--logo-color', theme.logoColor);
    root?.style?.setProperty('--app-panel-logo-color', theme.appBarLogoColor);

    root?.style?.setProperty('--panel-background-color', theme.panelBackgroundColor);
    root?.style?.setProperty('--panel-text-color', theme.panelTextColor);

    root?.style?.setProperty('--app-bar-background-color', theme.appBarBackgroundColor);
    root?.style?.setProperty('--app-bar-text-color', theme.appBarTextColor);

    root?.style?.setProperty('--link-color', theme.linkColor);
    root?.style?.setProperty('--panel-link-color', theme.panelLinkColor);
    root?.style?.setProperty('--button-color', theme.buttonColor);

    root?.style?.setProperty('--sidebar-background-color', theme.sidebarBackgroundColor);
    root?.style?.setProperty('--sidebar-text-color', theme.sidebarTextColor);
    root?.style?.setProperty('--sidebar-link-background-color', theme.sidebarLinkBackgroundColor);
    root?.style?.setProperty('--sidebar-link-text-color', theme.sidebarLinkTextColor);
    root?.style?.setProperty('--sidebar-active-link-background-color', theme.sidebarActiveLinkBackgroundColor);
    root?.style?.setProperty('--sidebar-active-link-text-color', theme.sidebarActiveLinkTextColor);

    // Derived colors
    root?.style?.setProperty('--link-color-hover', theme.linkColorHover!);
    root?.style?.setProperty('--link-color-focus', theme.linkColorFocus!);
    root?.style?.setProperty('--panel-link-color-hover', theme.panelLinkColorHover!);
    root?.style?.setProperty('--panel-link-color-focus', theme.panelLinkColorFocus!);
    root?.style?.setProperty('--button-color-hover', theme.buttonColorHover!);
    root?.style?.setProperty('--button-color-hover-focus', theme.buttonColorHoverFocus!);
    root?.style?.setProperty('--sidebar-link-text-color-hover', theme.sidebarLinkTextColorHover!);
    
    document.body.style.backgroundColor = theme.backgroundColor;
  }
};

const resetCssVariables = () => {
  const root = document.documentElement;

  root?.style?.removeProperty('--background-color');
  root?.style?.removeProperty('--text-color');

  root?.style?.removeProperty('--app-bar-background-color');
  root?.style?.removeProperty('--app-bar-text-color');

  root?.style?.removeProperty('--logo-color');
  root?.style?.removeProperty('--app-panel-logo-color');

  root?.style?.removeProperty('--panel-background-color');
  root?.style?.removeProperty('--panel-text-color');

  root?.style?.removeProperty('--link-color');
  root?.style?.removeProperty('--panel-link-color');
  root?.style?.removeProperty('--button-color');

  root?.style?.removeProperty('--sidebar-background-color');
  root?.style?.removeProperty('--sidebar-text-color');
  root?.style?.removeProperty('--sidebar-link-background-color');
  root?.style?.removeProperty('--sidebar-link-text-color');
  root?.style?.removeProperty('--sidebar-active-link-background-color');
  root?.style?.removeProperty('--sidebar-active-link-text-color');

  // Derived colors
  root?.style?.removeProperty('--link-color-hover');
  root?.style?.removeProperty('--link-color-focus');
  root?.style?.removeProperty('--panel-link-color-hover');
  root?.style?.removeProperty('--panel-link-color-focus');
  root?.style?.removeProperty('--button-color-hover');
  root?.style?.removeProperty('--button-color-hover-focus');
  root?.style?.removeProperty('--sidebar-text-color-hover');

  document.body?.style?.removeProperty('background-color');
};

interface UXSettingsContextProps {
  settings: UXSettings;
  setSettings: React.Dispatch<React.SetStateAction<UXSettings>>;
  updateCssVariables: (theme: CustomTheme) => void;
  deriveColors:(theme: CustomTheme) => CustomTheme;
  saveSettings: (theme: UXSettings) => void;
}

const UXSettingsContext = createContext<UXSettingsContextProps | null>(null);

interface UXSettingsProviderProps {
  children: ReactNode;
}

export const UXSettingsProvider = ({ children }: UXSettingsProviderProps) => {
  const [settings, setSettings] = useState<UXSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  const saveSettings = (newSettings:UXSettings) => {
    if(!newSettings){ 
      return
    }
    localStorage.setItem('uxSettings', JSON.stringify(newSettings));
  }

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      const savedSettings = localStorage.getItem('uxSettings');
      if (savedSettings) {
        const storedSettings = JSON.parse(savedSettings);
        const mergedSettings = deepMerge(defaultSettings.customThemes, storedSettings.customThemes);
        setSettings({ ...storedSettings, customThemes: { ...mergedSettings } });
      } else {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const initialTheme = mediaQuery.matches ? 'dark' : 'light';
        setSettings({ ...defaultSettings, theme: initialTheme });
      }
    }
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', settings.theme);

      if (settings.theme != "light" && settings.theme != "dark" && settings.customThemes && settings.theme in settings.customThemes) {
        updateCssVariables(deriveColors(settings.customThemes[settings.theme]))
      } else {
        resetCssVariables(); // Reset custom CSS variables when not in custom theme mode
      }
    }
  }, [settings, isHydrated]);

  return (
    <UXSettingsContext.Provider value={{ settings, setSettings, saveSettings, updateCssVariables, deriveColors }}>
      {children}
    </UXSettingsContext.Provider>
  );
};

export const useUXSettings = () => {
  const context = useContext(UXSettingsContext);
  if (!context) {
    throw new Error('useUXSettings must be used within a UXSettingsProvider');
  }
  return context;
};

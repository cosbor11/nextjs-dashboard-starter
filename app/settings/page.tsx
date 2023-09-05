'use client'

import { useAuth } from "@/contexts/AuthContext";
import CustomThemeForm from "@/components/CustomThemeForm";
import { CustomTheme, useUXSettings, UXSettings } from "@/contexts/UXSettingsContext";
import { NextPage } from "next";
import { toast } from 'react-toastify';
import Image from 'next/image'
import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";
import { LockOpenIcon } from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/20/solid";

const Settings: NextPage = () => {
  const { user } = useAuth();
  const { settings, setSettings, saveSettings } = useUXSettings();
  const [showExampleLinkTooltip, setShowExampleLinkTooltip] = useState(false);

  const toggleExampleLinkTooltip = () => {
    setShowExampleLinkTooltip(prev => !prev);
  };

  const onUploadSuccess = (filename: string) => {
    toast.success(`successfully uploaded ${filename}!`)
  }

  const updateSettings = (newSettings: Partial<UXSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const themeSelection = e.target.value;
    const updatedSettings = { ...settings, theme: themeSelection };
    setSettings(updatedSettings);

    if (themeSelection !== "new") {
      saveSettings(updatedSettings);
    }
  };

  const saveCustomTheme = (themeName: string, customTheme: CustomTheme) => {
    if (themeName == "new" || themeName == "light" || themeName == "dark") {
      toast.error("Cannot create a theme name with 'new', 'light', or 'dark'")
      return
    }
    if (themeName) {
      const newSettings: UXSettings = {
        ...settings,
      };
      newSettings.theme = themeName;
      newSettings.customThemes[themeName] = customTheme;
      settings.theme = themeName;
      setSettings(newSettings);
      toast.success(`${themeName} saved!`);
      updateSettings({ theme: themeName });
      saveSettings(newSettings)
    }
  };

  const deleteSelectedTheme = () => {
    const themeToDelete = settings.theme
    const newSettings: UXSettings = {
      ...settings,
    };
    delete newSettings.customThemes[settings.theme]
    newSettings.theme = "new";
    setSettings(newSettings);
    toast.success(`${themeToDelete} was deleted!`);
    updateSettings({ theme: "new" });
  };

  return (
    <main className="flex flex-col justify-center items-center">

      <h1 className="text-xl font-semibold">Settings</h1>

      <div className="panel bg-panel-theme-color p-8 w-screen sm:w-full md:w-2/3 lg:1/3">
        <div className="flex items-center justify-between lg:gap-32 md:gap-28 sm:gap-10 gap-4">
          <label className="text-panel-theme-color font-semibold" htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={settings.theme}
            onChange={handleThemeChange}
            className="btn w-64 bg-transparent text-panel-theme-color border-theme-color-inverted border-2">
            <option>light</option>
            <option>dark</option>
            {
              Object.keys(settings.customThemes).map((themeName) => (
                <option key={themeName}>{themeName}</option>
              ))
            }
          </select>
        </div>

        <div className="bg-theme-color rounded-xl">
          {settings && settings.theme != "dark" && settings.theme != "light" &&
            <CustomThemeForm
              themeName={settings.theme}
              showSideBar={showExampleLinkTooltip}
              initialCustomTheme={settings.customThemes[settings.theme]}
              onSave={saveCustomTheme}
              deleteSelectedTheme={deleteSelectedTheme}
            />
          }
        </div>

        {settings && settings.theme != "dark" && settings.theme != "light" &&
          <div className="flex flex-col w-full items-end">
          <a className="flex font-semibold panel-link-theme-color w-full justify-end items-end hover:cursor-pointer" onClick={toggleExampleLinkTooltip}>
          {!showExampleLinkTooltip && <LockOpenIcon width={16} height={16} className="mr-1 mb-1"/>} 
          {showExampleLinkTooltip && <LockClosedIcon width={16} height={16} className="mr-1 mb-1"/>}  
            sidebar
          </a>
          </div>
        }

      </div>

      <div className="panel flex flex-col items-center justify-between w-screen sm:w-full md:w-2/3 lg:1/3">
        <Image src={"/img/llama-fav.jpeg"} alt={"Llama Pic"} className="border rounded-full bg-gray-50" width={100} height={100} />
        <h1 className="text-xl m-5 w-full lg:w-1/2 align-middle text-center">Upload a llama pic!</h1>
        <h3 className="mx-10 mt-4 text-center">The pictures will be used to provide default profile pictures for new users</h3>
        <div className="bg-panel-theme-color p-8 m-2 sm:m-6 rounded-2xl w-auto">
          <ImageUploader
            className="bg-panel-theme-color"
            namespace="llama-pics"
            cancelButtonVisible={false}
            onUploadSuccess={onUploadSuccess} />
        </div>
      </div>
    </main>
  );
};

export default Settings;


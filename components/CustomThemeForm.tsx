'use client'

import React, { useEffect, useState } from 'react';
import { CustomTheme, useUXSettings } from '../contexts/UXSettingsContext';
import { ArrowUturnLeftIcon, CogIcon } from '@heroicons/react/20/solid';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import FormDialog from './FormDialog';
import { ClipboardIcon, HomeIcon, TrashIcon } from '@heroicons/react/24/outline';
import DecisionDialog from './DecisionDialog';
import TooltipWrapper, { TooltipWrapperPosition } from './TooltipWrapper';
import { toast } from 'react-toastify';
import Logo from './Logo';
import { camelToTitleCase } from '@/src/form-helpers';
import { camelToKebabCase } from '../src/form-helpers';

type CustomThemeFormProps = {
  themeName: string;
  initialCustomTheme: CustomTheme;
  onSave: (themeName: string, customTheme: CustomTheme) => void | undefined;
  deleteSelectedTheme: () => void;
  showSideBar: boolean
}

const CustomThemeForm: React.FC<CustomThemeFormProps> = ({ themeName, initialCustomTheme, onSave, deleteSelectedTheme, showSideBar }) => {
  const [editedTheme, setEditedTheme] = useState<CustomTheme>(initialCustomTheme);
  const [history, setHistory] = useState<CustomTheme[]>([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
  const [cssVars, setCssVars] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  const closeNameModal = () => {
    setShowNameModal(false);
  };

  const { updateCssVariables, deriveColors } = useUXSettings()

  useEffect(() => {
    setCssVars(
      Object.entries(editedTheme)
        .map(([key, value]) => `--${camelToKebabCase(key)}: ${value};`)
        .join('\n')
    );
  }, [editedTheme]);

  useEffect(() => {
    updateCssVariables(deriveColors(editedTheme));
  }, [editedTheme, updateCssVariables, deriveColors])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    e.target.value = newName;
  };

  const handleColorChange = (colorName: keyof CustomTheme, value: string) => {
    setHistory((prevHistory) => [...prevHistory, editedTheme!]);

    const updatedEditedTheme: CustomTheme = {
      ...editedTheme,
      [colorName]: value,
    };

    setEditedTheme(updatedEditedTheme);
  };

  const handleColorTextInputChange = (colorName: keyof CustomTheme, value: string) => {
    if (value.indexOf("#") != 0) {
      value = `#${value}`
    }
    handleColorChange(colorName, value);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastEditedTheme = history[history.length - 1];
      setEditedTheme(lastEditedTheme);
      setHistory(history.slice(0, history.length - 1));
      updateCssVariables(lastEditedTheme);
    }
  };

  const deleteCustomTheme = () => {
    deleteSelectedTheme()
    setShowDeleteConfirmationDialog(false)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(cssVars);
    setCopySuccess('✓ Copied')
    setInterval(() => setCopySuccess(''), 4000)
  };

  return (
    <div className="panel space-y-2">

      <div className='flex'>
       { showSideBar &&
        <nav className="flex flex-1 flex-col sidebar">
          <ul role="list" className="flex flex-1 flex-col gap-y-7 w-14 sm:w-44">
            <li>
              <ul role="list" className="mx-2 mt-2 space-y-1">
              <li >
                  <a href="#"
                    className="group flex gap-x-3 rounded-md 
                    p-2 text-sm leading-6 font-semibold sidebar-active-link"
                  >
                    <HomeIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:block">link</span>
                  </a>
                </li>
                <li >
                  <a href="#"
                    className="group flex gap-x-3 rounded-md 
                    p-2 text-sm leading-6 font-semibold sidebar-link"
                  >
                    <CogIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:block">inactive link</span>
                  </a>
                </li>


              </ul>
              <p className='px-4 py-10 hidden sm:block'>You can customize the sidebar theme colors</p>
            </li>
          </ul>
          
        </nav>
        }
        <div className='w-full ml-5'>
          <Logo className="logo-theme-color" />
          <h3 className="section-header">Custom Theme Colors</h3>
          {editedTheme &&
            Object.keys(editedTheme).map((colorName) => {
              const colorValue = editedTheme[colorName as keyof CustomTheme]
              return (
                <div key={colorName} className="block sm:flex items-center">
                  <label htmlFor={colorName} className="mr-2">
                    {camelToTitleCase(colorName)}
                  </label>
                  <div className="flex md:items-center lg:items-center xl:items-center ml-auto">

                    {/* Text Input */}
                    <input
                      type="text"
                      id={colorName}
                      value={colorValue}
                      onChange={(e) =>
                        handleColorTextInputChange(colorName as keyof CustomTheme, e.target.value)
                      }
                      className="w-40 h-10 px-2 border rounded"
                    />

                    {/* Color Picker */}
                    <input
                      type="color"
                      value={colorValue}
                      onChange={(e) =>
                        handleColorChange(colorName as keyof CustomTheme, e.target.value)
                      }
                      className="h-10 ml-2 cursor-pointer hover:ring-1 ring-offset-1 ring-blue-400"
                    />
                  </div>
                </div>
              );
            })}

        </div>

      </div>

      <div className="mt-4 flex space-x-4">

        <SecondaryButton
          onClick={handleUndo}
          disabled={history.length === 0} // Disable the button when history is empty
          className="flex items-center w-20">
          <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
        </SecondaryButton>

        <SecondaryButton
          onClick={() => {
            if (themeName == "new") {
              toast.error("Cannot delete 'new' theme! It is used to create new themes")
              return
            }
            if (themeName == "dark" || themeName == "light") {
              toast.error("Cannot delete default themes")
              return
            }
            setShowDeleteConfirmationDialog(true)
          }}
          className="flex items-center w-full">
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete
        </SecondaryButton>

        <PrimaryButton
          onClick={() => {
            if (themeName == "new") {
              setShowNameModal(true);
            } else if (themeName != "light" && themeName != "dark") {
              onSave(themeName, editedTheme)
            }
          }}
          className="flex items-center w-full">
          Save
        </PrimaryButton>
      </div>

      <div className="flex h-full mt-6 justify-end">

        <TooltipWrapper
          tooltip={
            <div className="flex flex-col">
              <pre>{cssVars}</pre>
              {copySuccess == "" && <ClipboardIcon onClick={handleCopyToClipboard} height={20} width={20} className="self-start mt-2 text-white hover:text-blue-300" />}
              {copySuccess != "" && <span className="self-start mt-2 text-white">{copySuccess}</span>}
            </div>
          }
          position={TooltipWrapperPosition.Above}>
          <a className="flex font-semibold link-theme-color w-40 justify-end hover:cursor-pointer">
            css vars
          </a>
        </TooltipWrapper>

      </div>

      <FormDialog
        show={showNameModal}
        onCancel={closeNameModal}
        onSubmit={(e) => {
          e.preventDefault()
          const themeNameInput = document.getElementById("name") as HTMLInputElement;
          const themeName = themeNameInput.value;
          if (themeName) {
            onSave(themeName, editedTheme)
            setShowNameModal(false)
          }
        }}
        title="Theme Name">
        <div className="flex gap-3">
          <label htmlFor="name" className="p-1">Name</label>
          <input required autoFocus onChange={handleNameChange} type="input" id="name" name="name" className="rounded w-full p-1 border" />
        </div>
      </FormDialog>

      <DecisionDialog
        show={showDeleteConfirmationDialog}
        decisions={["Yes", "No"]}
        onClose={() => { setShowDeleteConfirmationDialog(false); }}
        onDecision={function (decision: string): void {
          if (decision == "Yes") {
            deleteCustomTheme()
          } else {
            setShowDeleteConfirmationDialog(false);
          }
        }}
        title={`Are you sure you want to delete this theme?`}
        setShow={setShowDeleteConfirmationDialog} icon={<TrashIcon />}
      />
    </div>
  );
};

export default CustomThemeForm;


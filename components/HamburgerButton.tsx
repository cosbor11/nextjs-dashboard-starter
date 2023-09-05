
import React from 'react';
import {
    Bars3Icon,
  } from '@heroicons/react/24/outline'

import Logo from '@/components/Logo'

type HamburgerButtonProps = {
  onClick: (open: boolean) => void;
};

function HamburgerButton({ onClick }: HamburgerButtonProps) {
    return (
        <button
            type="button"
            className="-m-2.5 text-gray-700 flex items-center p-1 bg-transparent rounded-full outline outline-gray-500 hover:outline-orange-400 hover:shadow-inner"
            onClick={() => onClick(true)}
        >
            <span className="sr-only">Open sidebar</span>
            <Logo className="panel-logo-theme-color" width={38} height={38} />
            <Bars3Icon color='var(--app-panel-logo-color)' className="h-6 w-6" aria-hidden="true" />
        </button>
    );
}
  
  export default HamburgerButton;
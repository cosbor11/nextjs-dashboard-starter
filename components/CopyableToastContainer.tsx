/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import React, { useEffect } from 'react';

const CopyableToastContainer: React.FC = () => {
  const clipboardSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="silver" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
</svg>`;

  useEffect(() => {
    const interval = setInterval(() => {
      const toasts = document.querySelectorAll('.Toastify__toast');
      toasts.forEach((toast) => {
        if (toast.classList.contains('Toastify__toast--error') || toast.classList.contains('Toastify__toast--warning')) {
          if (!toast.querySelector('.copy-button')) {
            const btn = document.createElement('button');
            btn.classList.add('copy-button', 'absolute', 'bottom-2', 'right-2', 'w-6', 'h-6', 'text-gray-500');

            btn.innerHTML = clipboardSvg;

            const tooltip = document.createElement('span');
            tooltip.classList.add('hidden', 'tooltip-text', 'text-xs', 'bg-black', 'text-white', 'rounded', 'p-1', 'absolute', '-top-8', 'right-0');
            tooltip.textContent = 'Copy';

            btn.onmouseenter = () => {
              tooltip.classList.remove('hidden');
            };
            btn.onmouseleave = () => {
              tooltip.classList.add('hidden');
            };

            const successSpan = document.createElement('span');
            successSpan.classList.add('hidden', 'absolute', 'bottom-2', 'right-2');
            successSpan.textContent = '✓copied!';

            btn.onclick = function (): void {
              const message = toast.querySelector('.Toastify__toast-body')?.textContent || '';
              navigator.clipboard.writeText(message).then(() => {
                btn.classList.add('hidden');
                successSpan.classList.remove('hidden');
              });
            };

            btn.appendChild(tooltip);
            toast.appendChild(btn);
            toast.appendChild(successSpan);
          }
        }
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ToastContainer />
  );
};

export default CopyableToastContainer;

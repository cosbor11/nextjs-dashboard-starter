import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

interface ToastExtensionsProps {
  type?: string;
}

const toastExtensions = ({ type }: ToastExtensionsProps): string => {
  setTimeout(() => {
    const toasts = document.querySelectorAll<HTMLElement>('.selectable-toast');
    toasts.forEach((toast) => {
      if (!toast.querySelector('.copy-button')) {
        const btn = document.createElement('button') as HTMLButtonElement;
        btn.innerHTML = 'Copy';
        btn.classList.add('copy-button');
        btn.onclick = (): void => {
          navigator.clipboard.writeText(toast.textContent || '');
        };
        toast.appendChild(btn);
      }
    });
  }, 0);
  return 'selectable-toast';
};
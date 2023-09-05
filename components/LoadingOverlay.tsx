import {  ReactNode } from 'react';
import Logo from './Logo';

const LoadingOverlay: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div className={`fixed inset-0 bg-theme-color flex items-center justify-center z-50`}>
    <div className='animate-pulse'>
      {children}
      <Logo height={90} width={90} />
      <h1 className="text-xl mt-4">Loading ...</h1>
    </div>
  </div>
);

export default LoadingOverlay;
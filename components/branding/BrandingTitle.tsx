import React from 'react';
import Branding from './Branding';

const BrandingTitle: React.FC<{ className?: string; textClassName?: string }> = ({ className="", textClassName = "text-xl logo-theme-color" }) => {
  return (
    <div className={`flex ${className}`}>
        <h1 className={`px-1 font-semibold tracking-tighter ${textClassName} `}>{Branding.name}</h1>
        <a href="/" className={`font-mono font-bold app-title-text-color tracking-tighter ${textClassName}`}>{Branding.appName}</a>
    </div>
  );
};

export default BrandingTitle;
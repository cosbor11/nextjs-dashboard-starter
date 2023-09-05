import React from 'react';
import Logo from './Logo';
import Title from './branding/BrandingTitle';

const LogoWithTitle: React.FC<{ width?: number; height?: number }> = ({ width = 42, height = 42 }) => (
    <div className="flex h-16 shrink-0 items-center pt-3">
        <Logo className="logo-theme-color" width={width} height={height} />
        <Title />
    </div>
);

export default LogoWithTitle;
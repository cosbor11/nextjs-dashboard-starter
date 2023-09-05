import React from 'react';
import BrandingSvg from './branding/BrandingSvg';

const Logo: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = 'logo-theme-color',
  width = 32,
  height = 32,
}) => (
  <BrandingSvg className={className} width={width} height={height} />
);

export default Logo;
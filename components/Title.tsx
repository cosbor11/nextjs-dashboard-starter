import React from 'react';
import BrandingTitle from './branding/BrandingTitle';

const Title: React.FC<{ className?: string; textClassName?: string }> = ({ className="", textClassName = "text-xl" }) => {
  return (
    <BrandingTitle className={className} textClassName={textClassName} />
  );
};

export default Title;
import React, { Fragment, ReactNode } from 'react';

interface SecondaryButtonProps {
  onClick?(e: React.FormEvent<Element>): void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | "reset";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ disabled = false, children, onClick=()=>{}, className = "", type="button" }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`secondary-btn ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default SecondaryButton;
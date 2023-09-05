import React, { Children, Fragment, ReactNode } from 'react';

interface  PrimaryButtonProps {
  onClick?(e:React.FormEvent<Element>): void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean
  type?: "button" | "submit" | "reset" | "reset";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ disabled = false, onClick, className, children, type="button" }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`primary-btn ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
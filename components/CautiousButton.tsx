import React, { useState } from 'react';
import DecisionDialog from './DecisionDialog';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface CautiousButtonProps {
  onConfim?(): void;
  className?: string;
  disabled?: boolean;
  children?: any;
  type?: "button" | "submit" | "reset" | "reset";
  areYouSureMessage?:string
}

const CautiousButton: React.FC<CautiousButtonProps> = ({ 
  disabled = false,  onConfim = () => { },
  className = "", type = "button", children,
  areYouSureMessage="Are you sure you want to proceed?" }) => {

  const [isAreYouSureDialogOpen, setIsAreYouSureDialogOpen] = useState(false);

  return (
    <><button
      type={type}
      disabled={disabled}
      className={`cautious-btn ${className}`}
      onClick={() => {
        setIsAreYouSureDialogOpen(true); 
      }}>
        {children}
    </button>
    <DecisionDialog
        show={isAreYouSureDialogOpen}
        decisions={["Yes", "No"]}
        onClose={() => { setIsAreYouSureDialogOpen(false); }}
        onDecision={(decision: string) => {
          setIsAreYouSureDialogOpen(false);
          if (decision == "Yes") 
            onConfim();
          }
        }
        title={areYouSureMessage}
        setShow={setIsAreYouSureDialogOpen} 
        icon={<QuestionMarkCircleIcon />} 
        />
    </>
  );
};

export default CautiousButton;
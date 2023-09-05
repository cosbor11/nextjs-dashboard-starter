import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import TooltipWrapper, { TooltipWrapperPosition } from './TooltipWrapper';

interface AccordionProps {
  isOpen: boolean;
  title: string;
  toggleAccordion: () => void;
  children: React.ReactNode;
  className?: string;
}

const AccordionSection: React.FC<AccordionProps> = ({ isOpen, children, title, className="" }) => {
  const [expanded, setExpanded] = useState(isOpen)
  const toggle =() => { setExpanded(!expanded)}
  return (
    <div className={`${className}`}>
      <div  className="w-full flex justify-between items-center hover:cursor-pointer button-theme-color-hover" onClick={toggle}>
        <span className="w-full text-center font-semibold" >
          {title}
        </span>
        {expanded ?
          <TooltipWrapper tooltip="click to close" width={80} position={TooltipWrapperPosition.Above}>
            <MinusCircleIcon className='ml-3' height={20} width={20} />
          </TooltipWrapper> 
          
          :
          <TooltipWrapper tooltip="click to expand" width={80} position={TooltipWrapperPosition.Above}>
            <PlusCircleIcon className='ml-3' height={20} width={20} />
          </TooltipWrapper>
          
        }
      </div>
      {expanded && (
        <div className="flex flex-col mt-2 p-4 w-full items-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;
import React, { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";

export enum TooltipWrapperPosition {
  Above = "above",
  Below = "below",
}

interface TooltipWrapperProps {
  tooltip: React.ReactNode;
  position?: TooltipWrapperPosition;
  children: React.ReactNode;
  width?: string | number;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ tooltip, position = TooltipWrapperPosition.Below, children, width }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  let timeoutId: NodeJS.Timeout | null = null;
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  };

  useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const style: React.CSSProperties = {};
      if (rect.right > viewportWidth) {
        style.right = '5';
      }

      if (rect.bottom > viewportHeight) {
        style.bottom = '5';
      }

      setTooltipStyle(style);
    }
  }, [showTooltip]);

  const tooltipClasses: Record<TooltipWrapperPosition, string> = {
    [TooltipWrapperPosition.Above]: "bottom-full",
    [TooltipWrapperPosition.Below]: "top-full",
  };

  const widthStyle = typeof width === "number" ? `${width}px` : width;

  return (
    <div className="relative inline-block hover:cursor-pointer">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowTooltip(false)}
      >
        {children}
      </div>
      <Transition
        show={showTooltip}
        enter="transition-opacity ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={tooltipRef}
          className={`absolute z-10 p-2 bg-gray-700 text-white rounded-md ${tooltipClasses[position]}`}
          style={{ ...tooltipStyle, width: widthStyle }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {tooltip}
        </div>
      </Transition>
    </div>
  );
};

export default TooltipWrapper;

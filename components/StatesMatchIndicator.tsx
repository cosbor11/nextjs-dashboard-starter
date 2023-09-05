import React from 'react';

interface StatesMatchIndicatorProps {
  state1: any;
  state2: any;
}

const StatesMatchIndicator: React.FC<StatesMatchIndicatorProps> = ({
  state1,
  state2,
}) => {
  return (
    <div className='flex mt-1 mb-5 justify-end items-start'>
      {state1 && state2 && state1 !== state2 && (
        <><div className="h-1 w-5/6 matchColor"></div><div className="h-1 w-1/6 top-0 justify-start text-xs text-right text-green-500">mismatch</div></>
      )}
      {state1 && state2 && state1 === state2 && (
        <><div className="h-1 w-5/6 bg-green-500"></div><div className="h-1 w-1/6 top-0 justify-start text-xs text-right text-green-500">match!</div></>
      )}
    </div>
  );
};

export default StatesMatchIndicator;
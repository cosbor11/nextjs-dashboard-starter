import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  progressPercent?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progressPercent }) => {
  const [progress, setProgress] = useState(progressPercent || 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (progressPercent === undefined) {
      interval = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      }, 500); // Increase 10% every half second
    } else {
      setProgress(progressPercent);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [progressPercent]);

  return (
    <div className="h-2 relative w-full rounded-full overflow-hidden my-4">
      <div className="w-full h-full bg-gray-200 absolute"></div>
      <div className="h-full bg-green-500 absolute" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
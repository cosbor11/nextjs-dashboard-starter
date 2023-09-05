type PasswordStrengthMeterProps = {
    strength: number;
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
    const activeColors = ['bg-red-500', 'bg-red-400', 'bg-orange-300', 'bg-green-500'];
    const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 1: return "weak";
      case 2: return "fair";
      case 3: return "good";
      case 4: return "excellent!";
      default: return "";
    }
  };

    return (
        <div className='flex gap-1 mb-3'>
            <div className={`h-1 mt-1 w-full ${strength >= 1 ? activeColors[0] : ''}`}></div>
            <div className={`h-1 mt-1 w-full ${strength >= 2 ? activeColors[1] : ''}`} ></div>
            <div className={`h-1 mt-1 w-full ${strength >= 3 ? activeColors[2] : ''}`}></div>
            <div className={`h-1 mt-1 w-full ${strength >= 4 ? activeColors[3] : ''}`}></div>
            <div className="h-1 w-1/5 right-0 justify-start text-xs text-start bg-transparent text-green-600">{getStrengthLabel(strength)}</div>
        </div>
    );
};

export default PasswordStrengthMeter;
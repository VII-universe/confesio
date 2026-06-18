import React from "react";
import BrainIcon from "./BrainIcon";
import HandIcon from "./HandIcon";
import ProfileIcon from "./ProfileIcon";
import TemperatureIcon from "./TemperatureIcon";

type SatisfactionBlockProps = {
  label: string;
  value: number;
  icon: "brain" | "hand" | "profile" | "temperature";
};

const SatisfactionBlock = ({ label, value, icon }: SatisfactionBlockProps) => {
  const getIcon = () => {
    switch (icon) {
      case "brain":
        return <BrainIcon className="text-white size-12" />;
      case "hand":
        return <HandIcon className="text-white size-12" />;
      case "profile":
        return <ProfileIcon className="text-white size-12" />;
      case "temperature":
        return <TemperatureIcon className="text-white size-12" />;
      default:
        return null;
    }
  };

  const getPercentage = () => {
    switch (label) {
      case "EEG":
        return ((value - 120) / 50) * 100;
      case "GSR":
        return ((value - 55) / 15) * 100;
      case "RSP":
        return ((value - 2.1) / 0.6) * 100;
      case "TEMP":
        return ((value - 35.8) / 1.4) * 100;
      default:
        return 50;
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-end gap-4">
        <div className="bg-[#7F3DFF] rounded-xl size-20 flex items-center justify-center shadow-[0_0_8px_rgba(127,61,255,0.4)]">
          {getIcon()}
        </div>
        <p className="text-[14px] text-gray-400 font-medium">{label}</p>
      </div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-[14px] text-white font-bold">{value}</p>
        <div className="w-full h-4 bg-[#1F1D2C] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#7F3DFF] to-[#D4FF3E] rounded-full"
            style={{ 
              width: `${Math.min(100, Math.max(5, getPercentage()))}%`,
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SatisfactionBlock;

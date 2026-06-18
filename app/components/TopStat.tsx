import React from 'react'

import BrainIcon from './icons/BrainIcon';
import EyeIcon from './icons/EyeIcon';
import HeadIcon from './icons/HeadIcon';
import LightbulbIcon from './icons/LightbulbIcon';

type IconType = 'brain' | 'eye' | 'head' | 'lightbulb';

type TopStatProps = {
  title: string;
  originalPercentage: number;
  newPercentage: number;
  iconType: IconType;
}

const TopStat: React.FC<TopStatProps> = ({ title, originalPercentage, newPercentage, iconType }) => {
  const getIconComponent = (type: IconType) => {
    const iconMap = {
      brain: BrainIcon,
      eye: EyeIcon,
      head: HeadIcon,
      lightbulb: LightbulbIcon,
    };
    return iconMap[type];
  };

  const getIconTheme = (type: IconType) => {
    const themeMap = {
      lightbulb: { bg: "bg-[#D4FF3E]/15", text: "text-[#D4FF3E]" },
      eye: { bg: "bg-[#00F5FF]/15", text: "text-[#00F5FF]" },
      brain: { bg: "bg-[#FF2CF4]/15", text: "text-[#FF2CF4]" },
      head: { bg: "bg-[#7F3DFF]/15", text: "text-[#7F3DFF]" },
    };
    return themeMap[type] || { bg: "bg-white/10", text: "text-white" };
  };

  const isPositive = newPercentage >= 0;
  const percentageSign = isPositive ? '+' : '-';
  const percentageColor = isPositive ? 'text-[#01B574]' : 'text-[#E31A1A]';
  const theme = getIconTheme(iconType);

  return (
    <div className='h-80 rounded-2xl p-16 flex justify-between items-center w-full glass-panel hover:scale-[1.03] active:scale-[0.98] cursor-pointer'>
      <div className='flex flex-col gap-4'>
        <h3 className="font-bold text-gray-400 text-[12px] uppercase tracking-wider">{title}</h3>
        <div className='flex gap-8 items-center'>
          <p className="text-[20px] font-bold text-white leading-none">{originalPercentage}%</p>
          <p className={`text-[12px] font-semibold ${percentageColor}`}>
            {percentageSign}{Math.abs(newPercentage)}%
          </p>
        </div>
      </div>
      <div className={`${theme.bg} ${theme.text} p-10 rounded-xl h-44 w-44 flex items-center justify-center shrink-0`}>
        {(() => {
          const Icon = getIconComponent(iconType);
          return Icon ? <Icon className='size-22' /> : null;
        })()}
      </div>
    </div>
  );
};

export default TopStat;
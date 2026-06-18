import React from "react";

import DashboardIcon from "./icons/DashboardIcon";
import FileIcon from "./icons/FileIcon";
import ProfileIcon from "./icons/ProfileIcon";
import SettingsIcon from "./icons/SettingsIcon";
import SignInIcon from "./icons/SignInIcon";
import SignUpIcon from "./icons/SignUpIcon";
import TablesIcon from "./icons/TablesIcon";

type NavButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  iconType?:
    | "dashboard"
    | "files"
    | "profile"
    | "settings"
    | "sign-in"
    | "sign-up"
    | "tables";
  isActive?: boolean;
  compact?: boolean;
};

const NavButton = ({
  label,
  variant = "primary",
  onClick,
  iconType,
  isActive = false,
  compact = false,
}: NavButtonProps) => {
  const getIconComponent = (type: NavButtonProps["iconType"]) => {
    const iconMap = {
      dashboard: DashboardIcon,
      files: FileIcon,
      profile: ProfileIcon,
      settings: SettingsIcon,
      "sign-in": SignInIcon,
      "sign-up": SignUpIcon,
      tables: TablesIcon,
    };
    return type ? iconMap[type] : null;
  };

  const mainBackground = isActive
      ? "bg-[#7F3DFF] shadow-[0_0_15px_rgba(127,61,255,0.4)] text-white"
      : "hover:bg-white/5 transition-all duration-300";
  const iconColor = isActive ? "text-[#D4FF3E]" : "text-gray-400 group-hover:text-white";
  const iconBackground = isActive ? "bg-[#12111A]" : "bg-[#1C1B26]";

  return (
    <button
      className={`${mainBackground} group flex cursor-pointer items-center rounded-xl transition-all duration-300 ease-out hover:scale-105 active:scale-[0.98] ${
        compact 
          ? "w-40 h-40 justify-center p-0" 
          : "w-full gap-12 py-12 px-16"
      }`}
      onClick={onClick}
      title={label}
    >
      {iconType && (
        <div className={`size-30 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBackground}`}>
          {(() => {
            const Icon = getIconComponent(iconType);
            return Icon ? <Icon className={`size-15 ${iconColor}`} /> : null;
          })()}
        </div>
      )}
      {!compact && (
        <span className={`font-bold text-[14px]/[100%] transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
      )}
    </button>
  );
};

export default NavButton;

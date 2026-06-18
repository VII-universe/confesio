"use client";

import React, { useState } from "react";
import NavButton from "./NavButton";
import Image from "next/image";
import QuestionmarkIcon from "./icons/QuestionmarkIcon";

interface NavigationProps {
  compact?: boolean;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const CustomLogo = ({ compact = false }: { compact?: boolean }) => (
  <div className={`flex ${compact ? "flex-col" : "flex-row"} gap-8 items-center justify-center py-8 cursor-pointer group`}>
    <div className="flex gap-4 relative">
      <div className="w-6 h-18 bg-[#D4FF3E] rounded-full rotate-12 transform shadow-[0_0_12px_rgba(212,255,62,0.65)] group-hover:scale-y-110 transition-transform duration-300" />
      <div className="w-6 h-18 bg-[#7F3DFF] rounded-full rotate-12 transform shadow-[0_0_12px_rgba(127,61,255,0.65)] group-hover:scale-y-110 transition-transform duration-300" />
    </div>
    {!compact && (
      <span className="font-bold text-xl bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent ml-8">
        Confesio
      </span>
    )}
  </div>
);

const Navigation = ({ compact = false, activeTab = "dashboard", setActiveTab = () => {} }: NavigationProps) => {
  return (
    <div className={`h-full shrink-0 ${compact ? "w-80" : "w-full"} p-12 rounded-2xl items-center glass-panel flex flex-col justify-between py-24`}>
      <div className="flex flex-col items-center w-full">
        {/* Elite Custom Logo */}
        <CustomLogo compact={compact} />
        
        <div className="w-full h-1 bg-gradient-to-r my-16 from-transparent via-[#1F1D2C] to-transparent" />
        
        {/* Core Navigation Items */}
        <div className="flex w-full flex-col gap-12 items-center px-4">
          <NavButton label="Dashboard" iconType="dashboard" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} compact={compact} />
          <NavButton label="Files" iconType="files" isActive={activeTab === "files"} onClick={() => setActiveTab("files")} compact={compact} />
          <NavButton label="Profile" iconType="profile" isActive={activeTab === "profile"} onClick={() => setActiveTab("profile")} compact={compact} />
          <NavButton label="Settings" iconType="settings" isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} compact={compact} />
        </div>
        
        <div className="w-full h-1 bg-gradient-to-r my-20 from-transparent via-[#1F1D2C] to-transparent" />
        
        {/* Secondary navigation items */}
        <div className="flex w-full flex-col gap-12 items-center px-4">
          <NavButton label="Sign In" iconType="sign-in" variant="secondary" isActive={activeTab === "sign-in"} onClick={() => setActiveTab("sign-in")} compact={compact} />
          <NavButton label="Sign Up" iconType="sign-up" variant="secondary" isActive={activeTab === "sign-up"} onClick={() => setActiveTab("sign-up")} compact={compact} />
          <NavButton label="Tables" iconType="tables" variant="secondary" isActive={activeTab === "tables"} onClick={() => setActiveTab("tables")} compact={compact} />
        </div>
      </div>
      
      {/* Bottom Profile Avatar */}
      <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#7F3DFF] to-[#D4FF3E] p-1 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200" title="Jakub Fidler">
        <div className="w-full h-full bg-[#12111A] rounded-full flex items-center justify-center text-xs font-bold text-white">
          JF
        </div>
      </div>
    </div>
  );
};

export default Navigation;

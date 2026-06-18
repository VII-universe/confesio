"use client";

import React, { useState } from "react";
import ThreeDotsIcon from "./icons/ThreeDotsIcon";
import CustomGaugeScore from "./CustomGaugeScore";
import WomanIcon from "./icons/WomanIcon";
import MenIcon from "./icons/MenIcon";
import ProfileIcon from "./icons/ProfileIcon";

type FilterType = "all" | "men" | "women";

const NeuronsPanel = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getGaugeData = () => {
    switch (filter) {
      case "men":
        return { value: 0.65, displayValue: "6.5", color: "#00F5FF" };
      case "women":
        return { value: 0.80, displayValue: "8.0", color: "#FF2CF4" };
      case "all":
      default:
        return { value: 0.75, displayValue: "9.3", color: "#D4FF3E" };
    }
  };

  const gaugeData = getGaugeData();

  return (
    <div className="h-full rounded-2xl p-12 px-16 glass-panel flex flex-col justify-between gap-16 relative z-50">
      <div className="flex justify-between items-center relative">
        <h3 className="text-[18px] font-bold">Neurons impact score</h3>
        <div className="relative">
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="size-38 rounded-xl bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors duration-200"
          >
            <ThreeDotsIcon className="text-[#7551FF] size-16" />
          </div>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-[160px] bg-[#12111A] border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 flex flex-col py-2">
              <button onClick={() => setIsMenuOpen(false)} className="text-left px-16 py-8 hover:bg-white/5 text-[14px] text-white transition-colors whitespace-nowrap">Export CSV</button>
              <button onClick={() => setIsMenuOpen(false)} className="text-left px-16 py-8 hover:bg-white/5 text-[14px] text-white transition-colors whitespace-nowrap">Share Report</button>
              <div className="w-full h-px bg-white/10 my-4" />
              <button onClick={() => setIsMenuOpen(false)} className="text-left px-16 py-8 hover:bg-white/5 text-[14px] text-red-400 transition-colors whitespace-nowrap">Remove Widget</button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-4 gap-16">
        <div className="flex flex-col gap-21 w-full sm:w-auto flex-1">
          <div className="py-4 px-24 border border-borderBlue/50 w-full flex flex-col rounded-xl hover:border-[#582CFF]/50 transition-colors duration-300">
            <p className="text-gray-400 text-[14px] font-medium">Invited</p>
            <p className="text-[18px] text-white font-bold py-5 whitespace-nowrap">
              145 people
            </p>
            <p className="text-[11px] text-gray-400 opacity-30 font-medium whitespace-nowrap">
              age between 18 and 35
            </p>
          </div>
          <div className="flex w-full h-full">
            <div 
              onClick={() => setFilter("all")}
              className={`h-91 flex-1 bg-[#1A1A2E]/80 hover:bg-[#1A1A2E] p-16 flex flex-col gap-3 relative rounded-tl-xl rounded-bl-xl cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-r border-[#ffffff]/5 ${filter === "all" ? "ring-2 ring-[#D4FF3E] z-20 scale-[1.03]" : "hover:scale-[1.03] hover:z-10"}`}
            >
              <p className="text-gray-400 text-[13px] font-medium">All</p>
              <p className="text-[16px]/[140%] font-bold">145</p>
              <ProfileIcon className="text-white/30 h-40 w-30 absolute bottom-0 right-6 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div 
              onClick={() => setFilter("men")}
              className={`h-91 flex-1 bg-[#091742]/80 hover:bg-[#091742] p-16 flex flex-col gap-3 relative cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border-r border-[#ffffff]/5 ${filter === "men" ? "ring-2 ring-[#00F5FF] z-20 scale-[1.03]" : "hover:scale-[1.03] hover:z-10"}`}
            >
              <p className="text-gray-400 text-[13px] font-medium">Men</p>
              <p className="text-[16px]/[140%] font-bold">65</p>
              <MenIcon className="text-white/30 h-40 w-30 absolute bottom-0 right-6 transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div 
              onClick={() => setFilter("women")}
              className={`h-91 flex-1 bg-[#430a5f]/80 hover:bg-[#430a5f] p-16 flex flex-col gap-3 relative rounded-tr-xl rounded-br-xl cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${filter === "women" ? "ring-2 ring-[#FF2CF4] z-20 scale-[1.03]" : "hover:scale-[1.03] hover:z-10"}`}
            >
              <p className="text-gray-400 text-[13px] font-medium">Women</p>
              <p className="text-[16px]/[140%] font-bold">80</p>
              <WomanIcon className="text-white/30 h-40 w-30 absolute bottom-0 right-6 transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>
        </div>
        <div>
          <CustomGaugeScore
            value={gaugeData.value}
            size={200}
            label="Total Score"
            color={gaugeData.color}
            displayValue={gaugeData.displayValue}
            strokeWidth={10}
          />
        </div>
      </div>
      <p className="text-[14px]/[140%] text-gray-400">Launch: The asset delivers exceptional memory performance and maintains strong focus, making it highly</p>
    </div>
  );
};

export default NeuronsPanel;

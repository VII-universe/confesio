import React from "react";
import CustomGauge from "./CustomGauge";

const FinalScorePanel = () => {
  return (
    <div className="size-full rounded-2xl p-12 max-w-284 glass-panel justify-between flex flex-col gap-16 min-h-[340px]">
      <div>
        <h2 className="text-lg font-bold">Satisfaction Panel</h2>
        <p className="text-[14px] text-gray-400">From video nissan_N01.mp4</p>
      </div>
      <CustomGauge
        value={0.75}
        size={200}
        label="Satisfaction"
        color="#D4FF3E"
        displayValue="75%"
        strokeWidth={10}
      />
      <div className="w-full px-12 py-16 flex justify-center relative bg-gradient-to-tl from-[#0A0E23B5] to-[#7F3DFF] rounded-xl shadow-[0_4px_20px_rgba(127,61,255,0.25)] hover:shadow-[0_4px_25px_rgba(127,61,255,0.45)] transition-shadow duration-300">
        <p className="absolute top-16 left-16 text-gray-400">0%</p>

        <div className="flex flex-col items-center self-center">
          <p className="text-[28px]/[100%] font-bold pb-8">95%</p>
          <p className="text-[12px]/[100%] text-gray-400">Based on Analyses</p>
        </div>

        <p className="absolute top-16 right-16 text-gray-400">100%</p>
      </div>
    </div>
  );
};

export default FinalScorePanel;

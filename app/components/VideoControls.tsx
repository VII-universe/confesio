"use client";

import React from "react";
import ThreeDotsIcon from "./icons/ThreeDotsIcon";

interface DataCategory {
  id: string;
  name: string;
  color: string;
}

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  activeCategories: string[];
  onCategoryToggle: (categoryId: string, active: boolean) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onChangeVectorVisibility: (vectorId: string, visible: boolean) => void;
  vectors: Record<string, boolean>;
}

const dataCategories: DataCategory[] = [
  { id: "vector1", name: "TEMP Skin Temperature", color: "#3b82f6" },
  { id: "vector2", name: "EEG Brain Activity", color: "#10b981" },
  { id: "vector3", name: "GSR Skin Conductance", color: "#ef4444" },
];

export default function VideoControls({
  videoRef,
  activeCategories,
  onCategoryToggle,
  onPlay,
  onPause,
  onChangeVectorVisibility,
  vectors
}: VideoControlsProps) {
  React.useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;
    const handlePlay = () => {
      if (onPlay) onPlay();
    };
    const handlePause = () => {
      if (onPause) onPause();
    };
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef, onPlay, onPause]);
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    console.log(
      `[VideoControls.tsx] Checkbox changed for ${categoryId}. Checked: ${checked}`
    );
    onCategoryToggle(categoryId, checked);
  };

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="rounded-xl p-16 flex flex-col gap-16 mt-5 lg:mt-0 flex-shrink-0 glass-panel h-full relative z-40">
      <div className="flex justify-between items-center gap-24 relative">
        <h3 className="text-[18px] font-bold">Data categories</h3>
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
      <div id="categoryCheckboxes" className="flex flex-col gap-16">
        {dataCategories.map((category, index) => (
          <div
            key={category.id}
            className="flex items-center gap-3 cursor-pointer text-base text-gray-800"
          >
            <label
              htmlFor={`category-${category.id}`}
              className="flex items-center gap-3 cursor-pointer select-none text-lg text-white"
            >
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.id}
                checked={vectors[category.id] || false}
                onChange={(e) => {
                  onChangeVectorVisibility(category.id, e.target.checked);
                }}
                className="sr-only peer"
              />
              <span
                className={`relative w-24 h-14 flex items-center rounded-full transition-colors duration-300
                  ${
                    vectors[category.id]
                      ? "bg-[#582CFF]"
                      : "bg-black"
                  }
                `}
              >
                <span
                  className={`absolute left-2 top-2 w-10 h-10 bg-white rounded-full transition-all duration-300
                    ${
                      vectors[category.id]
                        ? "translate-x-12"
                        : "translate-x-0"
                    }
                  `}
                />
              </span>
              <span className="ml-6 text-[14px]/[150%]">{category.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

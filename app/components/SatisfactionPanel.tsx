"use client";

import React, { useEffect, useState } from "react";
import ThreeDotsIcon from "./icons/ThreeDotsIcon";
import CustomGaugeScore from "./CustomGaugeScore";
import SatisfactionBlock from "./icons/SatisfactionBlock";

interface SatisfactionPanelProps {
  isPlaying: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const SatisfactionPanel: React.FC<SatisfactionPanelProps> = ({ isPlaying, videoRef }) => {
  const [videoTime, setVideoTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setVideoTime(video.currentTime);
      if (video.duration) {
        setDuration(video.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration) {
        setDuration(video.duration);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Initial check
    setVideoTime(video.currentTime);
    if (video.duration) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [videoRef]);

  // Compute values deterministically based on video playback position (prevents zeros)
  const t = videoTime;
  const attVal = Math.max(0.15, Math.min(0.99, 0.55 + 0.22 * Math.sin(t * 0.4) + 0.08 * Math.cos(t * 0.95)));
  const focVal = Math.max(0.15, Math.min(0.99, 0.75 + 0.15 * Math.sin(t * 0.25) - 0.05 * Math.cos(t * 0.7)));
  const memVal = Math.max(0.15, Math.min(0.99, 0.65 - 0.18 * Math.sin(t * 0.35) + 0.1 * Math.cos(t * 0.8)));
  const engVal = Math.max(0.15, Math.min(0.99, 0.48 + 0.22 * Math.sin(t * 0.5) + 0.12 * Math.cos(t * 0.3)));

  const gauges = [
    {
      label: "Attention on brand",
      color: "#7F3DFF",
      value: attVal,
      displayValue: (attVal * 10).toFixed(1),
    },
    {
      label: "Focus",
      color: "#D4FF3E",
      value: focVal,
      displayValue: (focVal * 10).toFixed(1),
    },
    {
      label: "Memory",
      color: "#00F5FF",
      value: memVal,
      displayValue: (memVal * 10).toFixed(1),
    },
    {
      label: "Engagement",
      color: "#FF2CF4",
      value: engVal,
      displayValue: (engVal * 300 + 40).toFixed(1),
    },
  ];

  // Dynamic progress values
  const eeg = parseFloat((145 + 15 * Math.sin(t * 0.6) + 4 * Math.cos(t * 1.15)).toFixed(1));
  const gsr = parseFloat((63.26 + 4.2 * Math.cos(t * 0.35) + 1.8 * Math.sin(t * 0.8)).toFixed(2));
  const rsp = parseFloat((2.4 + 0.18 * Math.sin(t * 0.22) + 0.06 * Math.cos(t * 0.75)).toFixed(3));
  const temp = parseFloat((36.5 + 0.35 * Math.sin(t * 0.15) + 0.1 * Math.cos(t * 0.45)).toFixed(1));

  const progressPercent = duration > 0 ? (videoTime / duration) * 100 : 0;

  // Generate curve data points based on actual duration and mathematical models
  const generateTrendPath = () => {
    const points = [];
    const sampleCount = 60;
    const dur = duration || 30;
    for (let i = 0; i <= sampleCount; i++) {
      const sampleTime = (i / sampleCount) * dur;
      const att = 0.55 + 0.22 * Math.sin(sampleTime * 0.4) + 0.08 * Math.cos(sampleTime * 0.95);
      const eng = 0.48 + 0.22 * Math.sin(sampleTime * 0.5) + 0.12 * Math.cos(sampleTime * 0.3);
      const score = (att + eng) / 2; // range ~0.3 - ~0.9
      const x = (i / sampleCount) * 100;
      const y = 30 - (score * 25); // y goes from 5 to 30 (inverted for SVG coordinates)
      points.push({ x, y });
    }
    
    const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const areaPath = `${linePath} L 100,30 L 0,30 Z`;
    return { linePath, areaPath };
  };

  const { linePath, areaPath } = generateTrendPath();

  // Get exact current height on path for the playhead circle
  const currentAtt = 0.55 + 0.22 * Math.sin(t * 0.4) + 0.08 * Math.cos(t * 0.95);
  const currentEng = 0.48 + 0.22 * Math.sin(t * 0.5) + 0.12 * Math.cos(t * 0.3);
  const currentScore = (currentAtt + currentEng) / 2;
  const currentY = 30 - (currentScore * 25);

  // Handle pointer down, move, and up to support mouse and touch scrubbing
  const handleScrub = (clientX: number, rect: DOMRect) => {
    const video = videoRef?.current;
    if (!video || !duration) return;
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    video.currentTime = newTime;
    setVideoTime(newTime);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    handleScrub(e.clientX, rect);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrub(e.clientX, rect);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="size-full rounded-2xl flex flex-col p-16 glass-panel gap-16 relative z-40">
      <div className="flex justify-between items-center relative">
        <h3 className="text-[18px]/[100%] font-bold">Live satisfaction rate</h3>
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
      
      {/* 4 Neon Circular Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-16 sm:gap-8 justify-items-center w-full my-8">
        {gauges.map((g) => (
          <CustomGaugeScore
            key={g.label}
            value={g.value}
            size={100}
            label={g.label}
            color={g.color}
            displayValue={g.displayValue}
            strokeWidth={5}
            version="small"
          />
        ))}
      </div>

      {/* Interactive Mini Sparkline Graph */}
      <div 
        className="w-full h-55 bg-[#09080F]/50 border border-[#1F1D2C] rounded-xl relative overflow-hidden px-12 py-8 flex flex-col justify-center cursor-ew-resize hover:bg-[#0d0c15]/80 hover:border-[#332f4a] transition-all duration-200 group/timeline select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute top-6 left-12 text-[9px] text-gray-500 font-bold uppercase tracking-wider select-none pointer-events-none group-hover/timeline:text-gray-300 transition-colors duration-200">Satisfaction Trend Timeline (Drag to seek)</div>
        <div className="absolute top-6 right-12 text-[9px] text-[#D4FF3E] font-bold select-none pointer-events-none">{videoTime.toFixed(1)}s / {duration.toFixed(0)}s</div>
        <div className="w-full h-32 mt-6 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7F3DFF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7F3DFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#sparklineGrad)"
            />
            {/* Line path */}
            <path
              d={linePath}
              fill="none"
              stroke="#7F3DFF"
              strokeWidth="1.5"
            />
            {/* Interactive playhead indicator */}
            <line
              x1={progressPercent}
              y1="0"
              x2={progressPercent}
              y2="30"
              stroke="#D4FF3E"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            <circle
              cx={progressPercent}
              cy={currentY}
              r="2.5"
              fill="#D4FF3E"
              style={{ filter: "drop-shadow(0px 0px 4px rgba(212, 255, 62, 0.8))" }}
            />
          </svg>
        </div>
      </div>

      <h3 className="text-[18px]/[100%] font-bold">Overview of satisfaction rate</h3>
      <div className="grid grid-cols-2 xl:grid-cols-4 mt-16 gap-8 w-full">
        <SatisfactionBlock label="EEG" value={eeg} icon="brain" />
        <SatisfactionBlock label="GSR" value={gsr} icon="hand" />
        <SatisfactionBlock label="RSP" value={rsp} icon="profile" />
        <SatisfactionBlock label="TEMP" value={temp} icon="temperature" />
      </div>
    </div>
  );
};

export default SatisfactionPanel;

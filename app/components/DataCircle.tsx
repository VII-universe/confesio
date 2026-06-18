'use client';

import React, { useEffect, useState } from 'react';

type DataCircleProps = {
  score: number; // e.g. 9.3
};

const DataCircle: React.FC<DataCircleProps> = ({ score }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / 10, 1); // Cap at 1 (100%)
  const targetDashOffset = circumference * (1 - percentage);
  
  const [dashOffset, setDashOffset] = useState(circumference); // Start at 0%
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate the circle
    const timer = setTimeout(() => {
      setDashOffset(targetDashOffset);
    }, 100); // Small delay to ensure the component is mounted

    // Animate the score number
    const duration = 1000; // 1 second
    const startTime = Date.now();
    const startScore = 0;
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutCubic for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = startScore + (score - startScore) * easeProgress;
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      }
    };
    
    requestAnimationFrame(animateScore);

    return () => clearTimeout(timer);
  }, [score, targetDashOffset]);

  return (
    <div className="relative w-[200px] h-[200px] rounded-full bg-[#0a0a23] flex items-center justify-center">
      <svg
        className="absolute top-0 left-0"
        width="200"
        height="200"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1e2a38"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1fe0a2"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>

      <div className="text-center text-white z-10">
        <div className="text-sm text-white/70">Safety</div>
        <div className="text-3xl font-bold">{animatedScore.toFixed(1)}</div>
        <div className="text-xs text-white/50">Total Score</div>
      </div>
    </div>
  );
};

export default DataCircle;

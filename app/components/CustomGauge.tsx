"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SmileIcon from "./icons/SmileIcon";

interface CustomGaugeProps {
  value: number; // 0-1 range
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  displayValue?: string;
  // ...existing code...
}
export default function CustomGauge(props: CustomGaugeProps) {
  const { value, color, size = 120, strokeWidth = 8 } = props;
  const [animatedValue, setAnimatedValue] = useState(0);
  const gsapRef = useRef<gsap.core.Tween | null>(null);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (gsapRef.current) {
        gsapRef.current.kill();
      }
      gsapRef.current = gsap.to(
        { val: 0 },
        {
          val: value,
          duration: 2.5,
          ease: "power2.out",
          onUpdate: function () {
            setAnimatedValue(this.targets()[0].val);
          },
          onComplete: () => {
            setAnimatedValue(value);
            firstLoad.current = false;
          },
        }
      );
      return () => {
        if (gsapRef.current) gsapRef.current.kill();
      };
    } else {
      setAnimatedValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference * (1 - Math.min(Math.max(animatedValue, 0), 1));
  const center = size / 2;

  return (
    <div className="flex flex-col items-center py-12">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={
              !firstLoad.current
                ? { transition: "stroke-dashoffset 0.3s ease-in-out" }
                : undefined
            }
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#4CFF2C] rounded-full size-65 p-4">
            <SmileIcon className="text-black size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

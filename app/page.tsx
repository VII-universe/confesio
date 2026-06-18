"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import ScreenshotHandler from "./components/ScreenshotHandler";
import VideoPlayer from "./components/VideoPlayer";
import DataGraph from "./components/DataGraph";
import VideoControls from "./components/VideoControls";
import Navigation from "./components/Navigation";
import TopStatsPanel from "./components/TopStatsPanel";
import BottomPanel from "./components/BottomPanel";
import NeuronsPanel from "./components/NeuronsPanel";
import FinalScorePanel from "./components/FinalScorePanel";
import SatisfactionPanel from "./components/SatisfactionPanel";
import MobileHeader from "./components/MobileHeader";
import Image from "next/image";

export default function VideoDataVisualizer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeCategories, setActiveCategories] = useState<string[]>([
    "impressions",
    "clicks",
    "conversions",
    "engagement",
  ]);

  const [visibleVectors, setVisibleVectors] = useState<Record<string, boolean>>(
    {
      vector1: true,
      vector2: true,
      vector3: true,
    }
  );

  const handleVectorVisibilityChange = useCallback(
    (vectorId: string, visible: boolean) => {
      setVisibleVectors((prev) => ({
        ...prev,
        [vectorId]: visible,
      }));
    },
    []
  );

  useEffect(() => {
    // Handle vector visibility changes
    console.log("[page.tsx] Vector visibility changed:", visibleVectors);
  }, [visibleVectors]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handleCategoryToggle = useCallback(
    (categoryId: string, active: boolean) => {
      console.log(
        `[page.tsx] Toggling category: ${categoryId}, Active: ${active}`
      );
      setActiveCategories((prev) => {
        if (active && !prev.includes(categoryId)) {
          const newState = [...prev, categoryId];
          console.log("[page.tsx] New activeCategories state:", newState);
          return newState;
        } else if (!active && prev.includes(categoryId)) {
          const newState = prev.filter((id) => id !== categoryId);
          console.log("[page.tsx] New activeCategories state:", newState);
          return newState;
        }
        return prev;
      });
    },
    []
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  if (!isAuthenticated) {
    return (
      <LoginForm loginDisabled={true} onAuthenticated={handleAuthentication} />
    );
  }

  return (
    <>
      <ScreenshotHandler
        videoRef={videoRef}
        activeCategories={activeCategories}
      />
      <div className="font-sans min-h-screen lg:h-screen lg:overflow-hidden p-16 lg:px-48 lg:py-16 flex flex-col lg:flex-row gap-16 relative text-white bg-gradient-to-br from-[#09080E] via-[#0E0D17] to-[#07060C]">
        <Image
          src="/images/background.jpg"
          alt="Confesio Background"
          className="fixed top-0 left-0 w-full h-full object-cover z-[-1] opacity-[0.03]"
          width={1920}
          height={1080}
        />
        
        {/* Mobile top navigation header */}
        <MobileHeader />

        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block shrink-0 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <Navigation compact={true} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="w-full flex flex-col gap-16 justify-between lg:h-full lg:overflow-y-auto no-scrollbar pb-32 lg:pb-0">
          {activeTab === "dashboard" ? (
            <>
              <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <TopStatsPanel />
              </div>
              <div className="flex flex-col lg:flex-row gap-16">
                <div id="screenshot-panel" className="flex flex-col gap-16 flex-10 w-full animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                  <VideoPlayer ref={videoRef} />
                  <DataGraph
                    videoRef={videoRef}
                    activeCategories={activeCategories}
                    onCategoryToggle={handleCategoryToggle}
                    visibleVectors={visibleVectors}
                  />
                </div>
                <div className="flex flex-col gap-16 flex-12 w-full">
                  <div className="w-full flex flex-col sm:flex-row gap-16 flex-10">
                    <div className="flex-1 w-full animate-fade-in-up flex flex-col" style={{ animationDelay: "400ms" }}>
                      <NeuronsPanel />
                    </div>
                    <div className="w-full sm:w-auto shrink-0 flex justify-center sm:flex sm:flex-col animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                      <FinalScorePanel />
                    </div>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row gap-16 flex-9">
                    <div className="w-full sm:w-[300px] shrink-0 animate-fade-in-up flex flex-col" style={{ animationDelay: "600ms" }}>
                      <VideoControls
                        videoRef={videoRef}
                        activeCategories={activeCategories}
                        onCategoryToggle={handleCategoryToggle}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onChangeVectorVisibility={handleVectorVisibilityChange}
                        vectors={visibleVectors}
                      />
                    </div>
                    <div className="flex-1 w-full animate-fade-in-up flex flex-col" style={{ animationDelay: "700ms" }}>
                      <SatisfactionPanel isPlaying={isPlaying} videoRef={videoRef} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
                <BottomPanel />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center lg:overflow-y-auto no-scrollbar glass-panel rounded-2xl animate-fade-in-up">
              <div className="size-80 rounded-full bg-white/5 flex items-center justify-center mb-24">
                <span className="text-[#D4FF3E] text-[32px]">✨</span>
              </div>
              <h2 className="text-3xl font-bold mb-8 capitalize">{activeTab.replace("-", " ")}</h2>
              <p className="text-gray-400 text-lg">Tato sekce je zatím prázdná a připravená na váš obsah.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


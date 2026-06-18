"use client";

import React, { useEffect, useCallback } from "react";

interface DataCategory {
  id: string;
  name: string;
  color: string;
}

interface ScreenshotHandlerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  activeCategories: string[];
}

const dataCategories: DataCategory[] = [
  { id: "impressions", name: "Impressions", color: "#3b82f6" },
  { id: "clicks", name: "Clicks", color: "#10b981" },
  { id: "conversions", name: "Conversions", color: "#ef4444" },
  { id: "engagement", name: "Engagement", color: "#f59e0b" },
];

// Dynamic import for html2canvas-pro
let html2canvas:
  | ((
      element: HTMLElement,
      options?: Html2CanvasOptions
    ) => Promise<HTMLCanvasElement>)
  | null = null;

interface Html2CanvasOptions {
  allowTaint?: boolean;
  useCORS?: boolean;
  scale?: number;
  backgroundColor?: string | null;
  logging?: boolean;
  width?: number;
  height?: number;
  scrollX?: number;
  scrollY?: number;
}

export default function ScreenshotHandler({
  videoRef,
  activeCategories,
}: ScreenshotHandlerProps) {
  const updateDataDisplay = useCallback(
    (currentVideoTime: number) => {
      const dataValuesGrid = document.getElementById("dataValuesGrid");
      if (!dataValuesGrid) return;

      let gridContent = "";
      activeCategories.forEach((categoryId) => {
        const category = dataCategories.find((cat) => cat.id === categoryId);
        if (category) {
          // Generate mock value for display (this should come from actual data)
          const mockValue = Math.random() * 100;
          gridContent += `
          <div class="bg-gray-50 rounded-lg p-4 text-center border-l-4" style="border-left-color: ${
            category.color
          };">
            <div class="text-lg font-bold" style="color: ${
              category.color
            };">${mockValue.toFixed(2)}</div>
            <div class="text-sm text-gray-600">${category.name}</div>
          </div>
        `;
        }
      });
      dataValuesGrid.innerHTML = gridContent;
    },
    [activeCategories]
  );

  const showDataDisplay = useCallback(
    async (currentVideoTime: number) => {
      const dataDisplaySection = document.getElementById("dataDisplaySection");
      if (!dataDisplaySection) return;

      updateDataDisplay(currentVideoTime);

      dataDisplaySection.style.display = "block";
      dataDisplaySection.style.opacity = "0";
      dataDisplaySection.style.transform = "translateY(-20px)";

      // Force reflow
      dataDisplaySection.offsetHeight;

      dataDisplaySection.style.opacity = "1";
      dataDisplaySection.style.transform = "translateY(0)";

      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    [updateDataDisplay]
  );

  const showVideoTimeOverlay = useCallback(
    (currentTime: number, duration: number): (() => void) | undefined => {
      const video = videoRef.current;
      const videoContainer = document.querySelector(
        "#video-data-container .w-full.rounded-xl"
      ) as HTMLElement;
      if (!video || !videoContainer) return undefined;

      // Create time overlay element
      const timeOverlay = document.createElement("div");
      timeOverlay.id = "video-time-overlay";
      timeOverlay.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      white-space: nowrap;
    `;
      timeOverlay.textContent = `${currentTime.toFixed(
        2
      )}s / ${duration.toFixed(2)}s`;

      // Make video container relative positioned
      const originalPosition = videoContainer.style.position;
      videoContainer.style.position = "relative";
      videoContainer.appendChild(timeOverlay);

      return () => {
        if (timeOverlay.parentNode) {
          timeOverlay.parentNode.removeChild(timeOverlay);
        }
        videoContainer.style.position = originalPosition;
      };
    },
    [videoRef]
  );

  const hideDataDisplay = useCallback(async () => {
    const dataDisplaySection = document.getElementById("dataDisplaySection");
    if (!dataDisplaySection) return;

    dataDisplaySection.style.opacity = "0";
    dataDisplaySection.style.transform = "translateY(-20px)";

    await new Promise((resolve) => setTimeout(resolve, 300));
    dataDisplaySection.style.display = "none";
  }, []);

  const fadeOutGraph = useCallback(async () => {
    const graphSection = document.querySelector(
      "#video-graph-container > div:last-child"
    ) as HTMLElement;
    if (!graphSection) return;

    graphSection.style.transition = "opacity 0.3s ease-in-out";
    graphSection.style.opacity = "0";
    graphSection.style.pointerEvents = "none";

    await new Promise((resolve) => setTimeout(resolve, 300));
  }, []);

  const fadeInGraph = useCallback(async () => {
    const graphSection = document.querySelector(
      "#video-graph-container > div:last-child"
    ) as HTMLElement;
    if (!graphSection) return;

    graphSection.style.opacity = "1";
    graphSection.style.pointerEvents = "auto";

    await new Promise((resolve) => setTimeout(resolve, 300));
  }, []);

  const takeScreenshot = useCallback(async () => {
    if (!html2canvas) {
      alert(
        "Screenshot library is still loading. Please try again in a moment."
      );
      return;
    }

    try {
      const video = videoRef.current;
      const screenshotPanel = document.getElementById("screenshot-panel");
      const hideEl = document.getElementById("screenshot-hide");
      const visibleEl = document.getElementById("screenshot-visible");

      if (!video || !screenshotPanel || !hideEl || !visibleEl) {
        throw new Error("Required elements not found");
      }

      document.body.classList.add("screenshot-mode");

      // Animate hide/show for screenshot-hide and screenshot-visible
      const originalHideOpacity = hideEl.style.opacity;
      const originalVisibleOpacity = visibleEl.style.opacity;
      const originalHideTransition = hideEl.style.transition;
      const originalVisibleTransition = visibleEl.style.transition;
      hideEl.style.transition = "opacity 0.3s";
      visibleEl.style.transition = "opacity 0.3s";
      hideEl.style.opacity = "0";
      visibleEl.style.opacity = "1";

      // Remove border radius for clean screenshot if needed
      const originalRadius = screenshotPanel.style.borderRadius || "";
      const originalBg = screenshotPanel.style.backgroundColor || "";
      const originalTransition = screenshotPanel.style.transition || "";
      screenshotPanel.style.borderRadius = "0";
      screenshotPanel.style.transition = "background-color 0.3s";
      screenshotPanel.style.backgroundColor = "#000";

      // Wait for the transitions to finish (320ms)
      await new Promise((resolve) => setTimeout(resolve, 320));

      const canvas = await html2canvas(screenshotPanel, {
        allowTaint: true,
        useCORS: true,
        scale: 1,
        backgroundColor: "#000000",
        logging: false,
        width: screenshotPanel.offsetWidth,
        height: screenshotPanel.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Animate back to original background and revert hide/show
      screenshotPanel.style.backgroundColor = originalBg;
      screenshotPanel.style.transition = originalTransition;
      screenshotPanel.style.borderRadius = originalRadius;
      hideEl.style.opacity = originalHideOpacity;
      visibleEl.style.opacity = originalVisibleOpacity;
      hideEl.style.transition = originalHideTransition;
      visibleEl.style.transition = originalVisibleTransition;

      // Wait for the transition back (if any)
      await new Promise((resolve) => setTimeout(resolve, 320));

      document.body.classList.remove("screenshot-mode");

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          alert("Failed to create screenshot blob");
          return;
        }
        const url = URL.createObjectURL(blob);
        // Open screenshot in a new window/tab
        window.open(url, '_blank');

        // Download as before
        const a = document.createElement("a");
        a.href = url;
        a.download = `screenshot-panel-${video.currentTime.toFixed(2)}s.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Optionally, you may want to delay revoking the object URL to ensure the new window loads the image
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      });
    } catch (error: unknown) {
      console.error("Screenshot failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Screenshot failed: ${errorMessage}`);
      document.body.classList.remove("screenshot-mode");
    }
  }, [videoRef]);

  useEffect(() => {
    // Load html2canvas-pro dynamically
    const loadHtml2Canvas = async () => {
      try {
        const imported = await import("html2canvas-pro");
        html2canvas = imported.default || imported;
      } catch (error) {
        console.error("Failed to load html2canvas-pro:", error);
      }
    };

    loadHtml2Canvas();

    // Listen for screenshot events
    const handleScreenshotEvent = () => {
      takeScreenshot();
    };

    window.addEventListener("take-screenshot", handleScreenshotEvent);

    return () => {
      window.removeEventListener("take-screenshot", handleScreenshotEvent);
    };
  }, [takeScreenshot]);

  return null; // This component doesn't render anything visible
}

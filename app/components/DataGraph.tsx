"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState, useCallback } from "react";

// ... (interfaces remain the same) ...

interface DataPoint {
  time: number;
  value: number;
}

interface DataCategory {
  id: string;
  name: string;
  color: string;
}

interface AnimationState {
  startTime: number;
  duration: number;
  type: "appear" | "disappear";
}

interface AxisAnimationState {
  startTime: number;
  duration: number;
  startMin: number;
  startMax: number;
  endMin: number;
  endMax: number;
}

interface DataGraphProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  activeCategories: string[];
  onCategoryToggle?: (categoryId: string, active: boolean) => void;
  categoryImages?: Record<string, boolean>;
  vectorImg?: any;
  visibleVectors: Record<string, boolean>;
}

const dataCategories: DataCategory[] = [
  { id: "impressions", name: "TEMP", color: "#3b82f6" },
  { id: "clicks", name: "EEG", color: "#10b981" },
  { id: "conversions", name: "GSR", color: "#ef4444" },
];

const AXIS_ANIMATION_DURATION = 500;
const LINE_DRAG_HIT_AREA_PX = 10;

// Toggle this to disable drawing the 4 data value rows
const DRAW_DATA_VALUE_ROWS = false;

export default function DataGraph({
  videoRef,
  activeCategories,
  categoryImages = {},
  vectorImg,
  visibleVectors,
}: DataGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentValueDisplayRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const prevActiveCategoriesRef = useRef<string[]>([]);

  const [videoDuration, setVideoDuration] = useState(30);
  const [allParsedData, setAllParsedData] = useState<
    Record<string, DataPoint[]>
  >({});
  const [categoryAnimationStates, setCategoryAnimationStates] = useState<
    Record<string, AnimationState>
  >({});
  const categoryAnimationStatesRef = useRef(categoryAnimationStates);
  useEffect(() => {
    categoryAnimationStatesRef.current = categoryAnimationStates;
  }, [categoryAnimationStates]);
  const [currentOverallMinValue, setCurrentOverallMinValue] = useState(0);
  const [currentOverallMaxValue, setCurrentOverallMaxValue] = useState(1000);
  const [axisAnimationState, setAxisAnimationState] =
    useState<AxisAnimationState | null>(null);
  const [isDraggingLine, setIsDraggingLine] = useState(false);
  const [wasVideoPlayingBeforeDrag, setWasVideoPlayingBeforeDrag] =
    useState(false);

  const generateMockData = useCallback(
    (categoryId: string, duration: number): DataPoint[] => {
      const data: DataPoint[] = [];
      const pointsPerSecond = 10;
      const totalPoints = Math.ceil(duration * pointsPerSecond) + 1;

      let baseValue = 0;
      let amplitude = 0;
      let frequency = 0;
      let noiseFactor = 0;

      switch (categoryId) {
        case "impressions":
          baseValue = 500;
          amplitude = 50;
          frequency = 1;
          noiseFactor = 10;
          break;
        case "clicks":
          baseValue = 300;
          amplitude = 30;
          frequency = 0.7;
          noiseFactor = 8;
          break;
        case "conversions":
          baseValue = 150;
          amplitude = 20;
          frequency = 0.4;
          noiseFactor = 5;
          break;
        default:
          baseValue = 0;
          amplitude = 0;
          frequency = 0;
          noiseFactor = 0;
      }

      for (let i = 0; i < totalPoints; i++) {
        const time = Math.min(i / pointsPerSecond, duration);
        const value = Math.max(
          0,
          baseValue +
            amplitude * Math.sin((time * frequency * Math.PI) / 2) +
            (Math.random() - 0.5) * noiseFactor
        );

        data.push({
          time: parseFloat(time.toFixed(2)),
          value: parseFloat(value.toFixed(2)),
        });

        if (time >= duration) break;
      }
      return data;
    },
    []
  );

  const drawAxes = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      duration: number,
      minValue: number,
      maxValue: number
    ) => {
      const padding = 45;
      const bottomPadding = 65;
      const graphWidth = canvas.width - padding * 2;
      const graphHeight = canvas.height - padding - bottomPadding;
      const originX = padding;
      const originY = canvas.height - bottomPadding;

      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1;
      ctx.font = "8px Inter, sans-serif";
      ctx.fillStyle = "#fff"; // axis text white
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(originX, padding);
      ctx.lineTo(originX, originY);
      ctx.stroke();

      // X-axis
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + graphWidth, originY);
      ctx.stroke();

      // Y-axis labels and grid
      const numYLabels = 5;
      for (let i = 0; i <= numYLabels; i++) {
        const value = minValue + (maxValue - minValue) * (i / numYLabels);
        const y = originY - graphHeight * (i / numYLabels);
        ctx.beginPath();
        ctx.strokeStyle = "#505077";
        ctx.setLineDash([4, 4]);
        ctx.moveTo(originX, y);
        ctx.lineTo(originX + graphWidth, y);
        ctx.stroke();
        ctx.fillStyle = "#fff"; // axis text white
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(value.toFixed(0), originX - 10, y);
      }

      // X-axis labels and grid with dynamic time steps
      let timeStep = 1; // Default 1 second steps
      if (duration > 25) {
        timeStep = 5; // 5 second steps for videos longer than 25 seconds
      } else if (duration > 10) {
        timeStep = 2; // 2 second steps for videos longer than 10 seconds
      }

      for (let time = 0; time <= duration; time += timeStep) {
        const x = originX + graphWidth * (time / duration);
        if (time > 0) {
          ctx.beginPath();
          ctx.strokeStyle = "#505077";
          ctx.setLineDash([4, 4]);
          ctx.moveTo(x, originY);
          ctx.lineTo(x, padding);
          ctx.stroke();
        }
        ctx.fillStyle = "#fff"; // axis text white
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(`${time.toFixed(0)}s`, x, originY + 10);
      }
      ctx.setLineDash([]);
    },
    []
  );

  const drawGraph = useCallback(
    (currentVideoTime: number) => {
      const canvas = canvasRef.current;
      const currentValueDisplay = currentValueDisplayRef.current;
      const timeDisplay = timeDisplayRef.current;

      if (!canvas || !currentValueDisplay || !timeDisplay) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      canvas.style.zIndex = "2";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Set graph background color (transparent)
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const graphDisplayDuration = videoDuration;
      const padding = 45;
      const bottomPadding = 65;
      const graphWidth = canvas.width - padding * 2;
      const graphHeight = canvas.height - padding - bottomPadding;
      const originX = padding;
      const originY = canvas.height - bottomPadding;

      const categoriesToDraw = new Set([
        ...activeCategories,
        ...Object.keys(categoryAnimationStates),
      ]);
      let calculatedOverallMinValue = Infinity;
      let calculatedOverallMaxValue = -Infinity;
      let hasActualData = false;

      // Calculate min/max values
      categoriesToDraw.forEach((categoryId) => {
        const data = allParsedData[categoryId];
        if (data && data.length > 0) {
          const relevantValues = data
            .filter((p) => p.time <= graphDisplayDuration)
            .map((d) => d.value);
          if (relevantValues.length > 0) {
            hasActualData = true;
            calculatedOverallMinValue = Math.min(
              calculatedOverallMinValue,
              ...relevantValues
            );
            calculatedOverallMaxValue = Math.max(
              calculatedOverallMaxValue,
              ...relevantValues
            );
          }
        }
      });

      if (!hasActualData || categoriesToDraw.size === 0) {
        calculatedOverallMinValue = 0;
        calculatedOverallMaxValue = 1000;
      }

      calculatedOverallMaxValue *= 1.1;
      calculatedOverallMinValue = Math.max(0, calculatedOverallMinValue * 0.9);

      // Handle axis animation
      if (
        !axisAnimationState ||
        axisAnimationState.endMin !== calculatedOverallMinValue ||
        axisAnimationState.endMax !== calculatedOverallMaxValue
      ) {
        setAxisAnimationState({
          startTime: performance.now(),
          duration: AXIS_ANIMATION_DURATION,
          startMin: currentOverallMinValue,
          startMax: currentOverallMaxValue,
          endMin: calculatedOverallMinValue,
          endMax: calculatedOverallMaxValue,
        });
      }

      let currentMin = currentOverallMinValue;
      let currentMax = currentOverallMaxValue;

      if (axisAnimationState) {
        const elapsed = performance.now() - axisAnimationState.startTime;
        const progress = Math.min(1, elapsed / axisAnimationState.duration);
        currentMin =
          axisAnimationState.startMin +
          (axisAnimationState.endMin - axisAnimationState.startMin) * progress;
        currentMax =
          axisAnimationState.startMax +
          (axisAnimationState.endMax - axisAnimationState.startMax) * progress;

        setCurrentOverallMinValue(currentMin);
        setCurrentOverallMaxValue(currentMax);

        if (progress >= 1) {
          setAxisAnimationState(null);
        }
      }

      drawAxes(ctx, canvas, graphDisplayDuration, currentMin, currentMax);

      // Draw data lines (disabled if DRAW_DATA_VALUE_ROWS is false)
      if (DRAW_DATA_VALUE_ROWS) {
        categoriesToDraw.forEach((categoryId) => {
          const category = dataCategories.find((cat) => cat.id === categoryId);
          const data = allParsedData[categoryId];
          if (data && category) {
            ctx.beginPath();
            ctx.strokeStyle = category.color;
            ctx.lineWidth = 2;

            const animation = categoryAnimationStates[categoryId];
            let currentAnimationProgress = 1;

            if (animation) {
              const elapsed = performance.now() - animation.startTime;
              currentAnimationProgress = Math.min(
                1,
                elapsed / animation.duration
              );
            }

            data.forEach((point, index) => {
              if (point.time <= graphDisplayDuration) {
                const x =
                  originX + (point.time / graphDisplayDuration) * graphWidth;
                let y =
                  originY -
                  ((point.value - currentMin) / (currentMax - currentMin)) *
                    graphHeight;

                if (animation) {
                  if (animation.type === "appear") {
                    y = originY - (originY - y) * currentAnimationProgress;
                  } else if (animation.type === "disappear") {
                    y =
                      y * (1 - currentAnimationProgress) +
                      originY * currentAnimationProgress;
                  }
                }

                if (
                  index === 0 ||
                  data[index - 1].time > graphDisplayDuration
                ) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }
            });
            ctx.stroke();
          }
        });
      }

      // Draw timeline indicator
      const clampedVideoTime = Math.min(currentVideoTime, graphDisplayDuration);
      const lineX =
        originX + (clampedVideoTime / graphDisplayDuration) * graphWidth;
      ctx.beginPath();
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.moveTo(lineX, padding);
      ctx.lineTo(lineX, originY);
      ctx.stroke();

      // Update value display
      let displayContent = "";
      activeCategories.forEach((categoryId) => {
        const category = dataCategories.find((cat) => cat.id === categoryId);
        const data = allParsedData[categoryId];
        if (data && category) {
          const closestPoint = data.reduce((prev, curr) =>
            Math.abs(curr.time - clampedVideoTime) <
            Math.abs(prev.time - clampedVideoTime)
              ? curr
              : prev
          );
          if (closestPoint) {
            displayContent += `<span style="color: ${category.color};">${
              category.name
            }: ${closestPoint.value.toFixed(2)}</span><br>`;
          }
        }
      });

      if (displayContent) {
        currentValueDisplay.innerHTML = displayContent;
        const finalX = lineX + 70;
        const canvasRelativeY = padding + 70;
        currentValueDisplay.style.position = "absolute";
        currentValueDisplay.style.left = `${finalX}px`;
        currentValueDisplay.style.top = `${canvasRelativeY}px`;
        currentValueDisplay.style.color = "#fff";
        currentValueDisplay.style.backgroundColor = "#060B28";
        currentValueDisplay.style.borderColor = "#5a30ff";
        currentValueDisplay.style.borderWidth = "1px";
        currentValueDisplay.style.padding = "4px 8px";
        currentValueDisplay.style.opacity = "1";
        currentValueDisplay.style.transform = "translateY(-50%)";
      } else {
        currentValueDisplay.style.opacity = "0";
      }

      // Update time display
      timeDisplay.innerHTML = `${clampedVideoTime.toFixed(2)}s`;
      timeDisplay.style.position = "absolute";
      timeDisplay.style.color = "#fff";
      timeDisplay.style.backgroundColor = "#060B28";
      timeDisplay.style.borderColor = "#5a30ff";
      timeDisplay.style.borderWidth = "1px";
      timeDisplay.style.padding = "4px 8px";
      timeDisplay.style.left = `calc(${lineX}px + 6%)`;
      timeDisplay.style.top = `${originY + 59}px`;
      timeDisplay.style.opacity = "1";
      timeDisplay.style.transform = "translateX(-50%)";
    },
    [
      videoDuration,
      activeCategories,
      allParsedData,
      categoryAnimationStates,
      currentOverallMinValue,
      currentOverallMaxValue,
      axisAnimationState,
      drawAxes,
    ]
  );

  // CRITICAL: Improved animation loop with proper cleanup and infinite loop prevention
  const animateGraph = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoPlaying = !video.paused && !video.ended;
    const axisAnimating = axisAnimationState !== null;

    // Clean up finished disappear animations only here
    setCategoryAnimationStates((prev) => {
      const now = performance.now();
      let changed = false;
      const newStates: Record<string, AnimationState> = { ...prev };
      Object.keys(prev).forEach((catId) => {
        if (
          prev[catId].type === "disappear" &&
          now - prev[catId].startTime > prev[catId].duration
        ) {
          delete newStates[catId];
          changed = true;
        }
      });
      categoryAnimationStatesRef.current = newStates;
      return changed ? newStates : prev;
    });

    const animationsActive =
      Object.keys(categoryAnimationStatesRef.current).length > 0;

    drawGraph(video.currentTime);

    // Clear any existing animation frame before scheduling a new one
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Only continue animation if necessary - PREVENTS INFINITE LOOPS
    if (videoPlaying || animationsActive || axisAnimating || isDraggingLine) {
      animationFrameRef.current = requestAnimationFrame(animateGraph);
    }
  }, [videoRef, axisAnimationState, isDraggingLine, drawGraph]);

  // Handle canvas interactions
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;

      const padding = 45;
      const graphWidth = canvas.width - padding * 2;
      const originX = padding;
      const lineX = originX + (video.currentTime / videoDuration) * graphWidth;

      if (Math.abs(offsetX - lineX) < LINE_DRAG_HIT_AREA_PX) {
        setIsDraggingLine(true);
        setWasVideoPlayingBeforeDrag(!video.paused);
        video.pause();
        canvas.style.cursor = "grabbing";

        // Start animation if not already running
        if (animationFrameRef.current === null) {
          animateGraph();
        }
      }
    },
    [videoRef, videoDuration, animateGraph]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;

      const padding = 45;
      const graphWidth = canvas.width - padding * 2;
      const originX = padding;
      const lineX = originX + (video.currentTime / videoDuration) * graphWidth;

      if (isDraggingLine) {
        const newX = Math.max(originX, Math.min(originX + graphWidth, offsetX));
        const timeRatio = (newX - originX) / graphWidth;
        const newTime = Math.max(
          0,
          Math.min(videoDuration, timeRatio * videoDuration)
        );
        video.currentTime = newTime;
      } else {
        canvas.style.cursor =
          Math.abs(offsetX - lineX) < LINE_DRAG_HIT_AREA_PX
            ? "grab"
            : "default";
      }
    },
    [videoRef, videoDuration, isDraggingLine]
  );

  const handleMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (isDraggingLine) {
      setIsDraggingLine(false);
      if (canvas) canvas.style.cursor = "default";
      if (wasVideoPlayingBeforeDrag && video) {
        video.play();
      }
    }
  }, [isDraggingLine, wasVideoPlayingBeforeDrag]);

  // Initialize data when video duration changes
  useEffect(() => {
    const newData: Record<string, DataPoint[]> = {};
    dataCategories.forEach((category) => {
      newData[category.id] = generateMockData(category.id, videoDuration);
    });
    setAllParsedData(newData);
  }, [videoDuration, generateMockData]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const actualDuration = video.duration;
      if (Math.abs(videoDuration - actualDuration) > 1) {
        setVideoDuration(actualDuration);
      }
      drawGraph(video.currentTime);
      if (animationFrameRef.current === null) {
        animateGraph();
      }
    };

    const handleTimeUpdate = () => {
      drawGraph(video.currentTime);
    };

    const handlePlay = () => {
      if (animationFrameRef.current === null) {
        animateGraph();
      }
    };

    const stopAnimation = () => {
      if (
        Object.keys(categoryAnimationStates).length === 0 &&
        axisAnimationState === null &&
        !isDraggingLine
      ) {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", stopAnimation);
    video.addEventListener("ended", stopAnimation);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", stopAnimation);
      video.removeEventListener("ended", stopAnimation);
    };
  }, [
    videoRef,
    videoDuration,
    drawGraph,
    animateGraph,
    categoryAnimationStates,
    axisAnimationState,
    isDraggingLine,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const video = videoRef.current;
      if (video) {
        drawGraph(video.currentTime);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [videoRef, drawGraph]);

  // Handle category changes with animations
  useEffect(() => {
    console.log(
      "[DataGraph.tsx] activeCategories prop changed:",
      activeCategories
    );
    const prev = prevActiveCategoriesRef.current;
    if (prev) {
      setCategoryAnimationStates((prevAnims) => {
        const newAnims = { ...prevAnims };

        // Find newly added categories
        activeCategories.forEach((catId) => {
          if (!prev.includes(catId)) {
            console.log(
              `[DataGraph.tsx] Scheduling APPEAR animation for ${catId}`
            );
            newAnims[catId] = {
              startTime: performance.now(),
              duration: 400,
              type: "appear",
            };
          }
        });

        // Find removed categories
        prev.forEach((catId) => {
          if (!activeCategories.includes(catId)) {
            console.log(
              `[DataGraph.tsx] Scheduling DISAPPEAR animation for ${catId}`
            );
            newAnims[catId] = {
              startTime: performance.now(),
              duration: 400,
              type: "disappear",
            };
          }
        });

        console.log("[DataGraph.tsx] New animation states:", newAnims);
        return newAnims;
      });
    }

    prevActiveCategoriesRef.current = activeCategories;

    if (animationFrameRef.current === null) {
      animateGraph();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategories]);

  // CRITICAL: Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    prevActiveCategoriesRef.current = activeCategories; // Initialize on mount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle global mouse events for dragging
  useEffect(() => {
    if (isDraggingLine) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDraggingLine, handleMouseUp]);

  const handleScreenshot = () => {
    // This will be handled by the screenshot component
    const event = new CustomEvent("take-screenshot");
    window.dispatchEvent(event);
  };

  return (
    <div className="relative w-full rounded-xl px-12 py-10 glass-panel">
      <div
        id="screenshot-hide"
        className="w-full flex flex-row justify-between items-center mb-4"
      >
        <h3 className="text-[14px] font-bold text-white pl-12">
          Video Data Trends
        </h3>
        <button
          onClick={handleScreenshot}
          className="bg-gradient-to-r from-[#582CFF] to-[#351A99] py-10 px-30 rounded-xl border border-transparent text-[16px] text-white cursor-pointer hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 ease-out shadow-[0_4px_12px_rgba(88,44,255,0.25)] hover:shadow-[0_4px_16px_rgba(88,44,255,0.4)]"
        >
          Screenshot
        </button>
      </div>
      <div
        id="screenshot-visible"
        className="absolute pointer-events-none top-0 w-full left-0 p-24 flex justify-between items-center opacity-0 transition-opacity"
      >
        {/* Show current time next to values */}
        {(() => {
          let currentTime = 0;
          if (videoRef.current) {
            currentTime = videoRef.current.currentTime;
          }
          return (
            <>
              {dataCategories.map((cat) => {
                const data = allParsedData[cat.id];
                let value = "";
                if (data && videoRef.current) {
                  const closestPoint = data.reduce((prev, curr) =>
                    Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev
                  );
                  value = closestPoint ? closestPoint.value.toFixed(2) : "";
                }
                return (
                  <p key={cat.id} style={{ color: cat.color, fontWeight: 500 }}>
                    {cat.name}: {value}
                  </p>
                );
              })}
              <span style={{ color: '#fff', fontWeight: 500, marginLeft: 16 }}>
                Time: {currentTime.toFixed(2)}s
              </span>
            </>
          );
        })()}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full block rounded-lg "
        style={{ height: "350px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      />
      <div
        ref={currentValueDisplayRef}
        className="absolute opacity-0 transition-opacity duration-200 pointer-events-none text-sm text-gray-800 leading-relaxed whitespace-nowrap px-3 py-2 bg-white/90 rounded-lg shadow-lg z-20 top-8 left-1/2 transform -translate-x-1/2"
      />
      <div
        ref={timeDisplayRef}
        className="absolute opacity-0 transition-opacity duration-200 pointer-events-none text-xs text-gray-800 font-medium px-2 py-1 bg-white/90 rounded-md shadow-md z-20 left-1/2 transform -translate-x-1/2"
      />
      <div className="absolute h-auto bottom-[60%]" style={{ left: "57px", right: "57px" }}>
        <Image
          src="/images/vector-1.png"
          alt="Description of image"
          width={1000}
          height={1000}
          className={`w-full h-auto absolute object-cover z-[0] pointer-events-none transition-opacity duration-200 ${
            visibleVectors.vector1 ? "opacity-100" : "opacity-0"
          }`}
        />
        <Image
          src="/images/vector-2.png"
          alt="Description of image"
          width={1000}
          height={1000}
          className={`w-full h-auto absolute object-cover z-[0] pointer-events-none transition-opacity duration-200 ${
            visibleVectors.vector2 ? "opacity-100" : "opacity-0"
          }`}
        />
        <Image
          src="/images/vector-3.png"
          alt="Description of image"
          width={1000}
          height={1000}
          className={`w-full h-auto absolute object-cover z-[0] pointer-events-none transition-opacity duration-200 ${
            visibleVectors.vector3 ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}

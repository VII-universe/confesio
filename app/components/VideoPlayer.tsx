'use client';

import React, { forwardRef } from 'react';

interface VideoPlayerProps {
  videoSrc?: string;
  className?: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ videoSrc = "/videos/sample-video.mp4", className = "" }, ref) => {
    return (
      <div id="video-data-container" className="w-[100%] rounded-xl glass-panel">
        <div className="w-full rounded-xl overflow-hidden mb-5">
          <video
            ref={ref}
            id="videoPlayer"
            className={`w-full h-auto block ${className}`}
            controls
            preload="auto"
          >
            <source src={`${videoSrc}#t=0.001`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Data display section (hidden by default) */}
        <div
          id="dataDisplaySection"
          className="w-full  rounded-xl mb-5 transition-all duration-300 ease-in-out"
          style={{ display: 'none' }}
        >
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Current Data Values</h3>
            <div id="dataValuesGrid" className="grid grid-cols-2 gap-4">
              {/* Data values will be populated here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;

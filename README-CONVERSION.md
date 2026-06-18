# Video Data Visualizer - Next.js Conversion

This project has been successfully converted from Astro to Next.js with React components.

## 🚀 Features

### Core Components
- **DataGraph**: Interactive canvas-based data visualization with real-time video synchronization
- **VideoPlayer**: HTML5 video player with custom controls
- **VideoControls**: Category toggles and playback controls
- **GaugePanel**: Real-time metrics display using react-gauge-chart
- **LoginForm**: Simple authentication (username: holman, password: 12345)
- **ScreenshotHandler**: Screenshot functionality using html2canvas-pro

### Key Improvements from Astro Version

#### 🔒 Infinite Loop Prevention
- **Safe Animation Loop**: The `animateGraph()` function now has proper cleanup and safeguards
- **Proper useEffect Cleanup**: All animation frames are cancelled on component unmount
- **Condition-based Animation**: Animation only runs when necessary (video playing, animations active, etc.)

#### ⚛️ React Best Practices
- **Proper State Management**: Using React hooks (useState, useEffect, useRef)
- **Memory Leak Prevention**: All event listeners and animation frames are properly cleaned up
- **TypeScript Safety**: Full TypeScript implementation with proper typing
- **Component Isolation**: Each component manages its own state and side effects

#### 🎯 Enhanced Features
- **Real-time Gauge Charts**: New GaugePanel component showing live metrics
- **Better Event Handling**: React's synthetic events instead of DOM manipulation
- **Improved Performance**: React's reconciliation and proper dependency arrays

## 🛠️ Dependencies

- `next`: ^15.4.5
- `react`: ^19.1.0
- `react-dom`: ^19.1.0
- `html2canvas-pro`: For screenshot functionality
- `react-gauge-chart`: For real-time metric gauges
- `tailwindcss`: ^4 (for styling)

## 🎮 Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. The app will start directly (login is disabled by default)

4. Use the video controls to:
   - Play/pause the video
   - Toggle data categories
   - Take screenshots
   - View real-time metrics in gauge charts

## 🔧 Technical Details

### Animation Loop Safety
The original Astro version had potential infinite loop issues in the `animateGraph()` function. The React version addresses this with:

```typescript
const animateGraph = useCallback(() => {
  // Clear any existing animation frame before scheduling new one
  if (animationFrameRef.current !== null) {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }

  // Only continue if necessary - PREVENTS INFINITE LOOPS
  if (videoPlaying || animationsActive || axisAnimating || isDraggingLine) {
    animationFrameRef.current = requestAnimationFrame(animateGraph);
  }
}, [dependencies]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
}, []);
```

### Component Architecture
- **VideoPlayer**: Uses `forwardRef` to expose video element reference
- **DataGraph**: Canvas-based visualization with proper React lifecycle management
- **GaugePanel**: Real-time metrics synchronized with video timeline
- **State Management**: Centralized in main component with prop drilling

### Video File
Place your video file as `sample-video.mp4` in the `public` directory, or update the `videoSrc` prop in the VideoPlayer component.

## 🎨 Styling
The application uses Tailwind CSS for styling with custom CSS for canvas elements and animations. The original Astro styling has been preserved and enhanced.

## 📸 Screenshots
The screenshot functionality captures the video player with overlaid data metrics, temporarily hiding the graph and showing data values in a grid format.

---

**Migration Status**: ✅ Complete
**Infinite Loop Issues**: ✅ Resolved
**React Best Practices**: ✅ Implemented
**TypeScript Support**: ✅ Full coverage
**Performance**: ✅ Optimized

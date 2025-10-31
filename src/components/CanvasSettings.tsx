import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Monitor, Image, Grid, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const RESOLUTION_PRESETS = [
  { name: '1080p', width: 1920, height: 1080 },
  { name: '1440p', width: 2560, height: 1440 },
  { name: '4K', width: 3840, height: 2160 },
  { name: 'Custom', width: 0, height: 0 }
];

export function CanvasSettings() {
  const {
    canvasWidth,
    canvasHeight,
    showBackground,
    backgroundImage,
    zoom,
    pan,
    setCanvasSize,
    setShowBackground,
    setBackgroundImage,
    setZoom,
    setPan
  } = useEditor();

  const [isOpen, setIsOpen] = useState(false);
  const [customWidth, setCustomWidth] = useState(canvasWidth);
  const [customHeight, setCustomHeight] = useState(canvasHeight);

  const handleResolutionChange = (preset: typeof RESOLUTION_PRESETS[0]) => {
    if (preset.name === 'Custom') {
      setCustomWidth(canvasWidth);
      setCustomHeight(canvasHeight);
    } else {
      setCanvasSize(preset.width, preset.height);
    }
  };

  const handleCustomResolution = () => {
    if (customWidth > 0 && customHeight > 0) {
      setCanvasSize(customWidth, customHeight);
    }
  };

  const handleBackgroundToggle = () => {
    setShowBackground(!showBackground);
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackgroundImage(url);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(5.0, zoom * 1.2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, zoom / 1.2));
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const currentPreset = RESOLUTION_PRESETS.find(p => 
    p.width === canvasWidth && p.height === canvasHeight
  ) || RESOLUTION_PRESETS[3]; // Custom

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm"
        title="Canvas Settings"
      >
        <Monitor className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-4">
            {/* Resolution Settings */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Canvas Resolution</h3>
              <div className="grid grid-cols-2 gap-2">
                {RESOLUTION_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleResolutionChange(preset)}
                    className={`btn btn-sm ${
                      currentPreset.name === preset.name ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {preset.name}
                    {preset.name !== 'Custom' && (
                      <span className="text-xs opacity-75 ml-1">
                        {preset.width}×{preset.height}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {currentPreset.name === 'Custom' && (
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                      placeholder="Width"
                      className="input text-xs"
                    />
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                      placeholder="Height"
                      className="input text-xs"
                    />
                  </div>
                  <button
                    onClick={handleCustomResolution}
                    className="btn btn-primary btn-sm w-full"
                  >
                    Apply Custom Resolution
                  </button>
                </div>
              )}
            </div>

            {/* Background Settings */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Background</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showBackground}
                    onChange={handleBackgroundToggle}
                    className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">Show mock desktop background</span>
                </label>

                {showBackground && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                      id="background-upload"
                    />
                    <label
                      htmlFor="background-upload"
                      className="btn btn-secondary btn-sm w-full cursor-pointer"
                    >
                      <Image className="w-4 h-4 mr-1" />
                      Upload Background Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">View Controls</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="btn btn-ghost btn-sm"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-gray-300 min-w-0 flex-1 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  className="btn btn-ghost btn-sm"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetView}
                  className="btn btn-ghost btn-sm"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Canvas Info */}
            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400 space-y-1">
                <div>Canvas: {canvasWidth} × {canvasHeight}</div>
                <div>Zoom: {Math.round(zoom * 100)}%</div>
                <div>Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

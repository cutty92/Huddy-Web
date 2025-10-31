import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { sensorSimulator } from '@/lib/sensor-data';
import { renderElement } from '@/lib/element-renderers';
import { Element, SensorData } from '@/types';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    layout,
    selectedElementIds,
    currentTool,
    snapToGrid,
    gridSize,
    zoom,
    pan,
    showDebug,
    previewMode,
    canvasWidth,
    canvasHeight,
    showBackground,
    backgroundImage,
    selectElement,
    updateElement,
    addElement,
    createElement,
    setPan,
    setZoom
  } = useEditor();

  const [sensorData, setSensorData] = useState<{ [key: string]: SensorData }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');

  // Subscribe to sensor data updates
  useEffect(() => {
    const unsubscribe = sensorSimulator.subscribe((data) => {
      setSensorData(data);
    });
    return unsubscribe;
  }, []);

  // Global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedElementIds.length === 1) {
        const element = layout.elements.find(el => el.id === selectedElementIds[0]);
        if (element) {
          const deltaX = (e.clientX - dragStart.x) / zoom;
          const deltaY = (e.clientY - dragStart.y) / zoom;
          
          const newX = element.visual.x + deltaX;
          const newY = element.visual.y + deltaY;
          
          const snappedX = snapToGrid ? Math.round(newX / gridSize) * gridSize : newX;
          const snappedY = snapToGrid ? Math.round(newY / gridSize) * gridSize : newY;
          
          updateElement(element.id, {
            visual: {
              ...element.visual,
              x: snappedX,
              y: snappedY
            }
          });
          
          setDragStart({ x: e.clientX, y: e.clientY });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, selectedElementIds, dragStart, zoom, snapToGrid, gridSize, layout.elements, updateElement]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only add elements if not clicking on an existing element
    if (e.target === e.currentTarget) {
      if (currentTool === 'select') {
        // Deselect all elements
        selectElement('');
      } else {
        // Add new element using the createElement function
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - pan.x) / zoom;
          const y = (e.clientY - rect.top - pan.y) / zoom;
          
          const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
          const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;

          createElement(currentTool as any, snappedX, snappedY);
        }
      }
    }
  };

  // Handle element click
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (currentTool === 'select') {
      selectElement(elementId);
    }
  };

  // Handle element drag start
  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (currentTool === 'select') {
      selectElement(elementId);
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle canvas mouse move for resizing
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isResizing && selectedElementIds.length === 1) {
      handleResizeMove(e);
    }
  };

  // Handle canvas mouse up
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, elementId: string, handle: string) => {
    e.stopPropagation();
    const element = layout.elements.find(el => el.id === elementId);
    if (element) {
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.visual.width,
        height: element.visual.height
      });
    }
  };

  // Handle resize during mouse move
  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizing && selectedElementIds.length === 1) {
      const element = layout.elements.find(el => el.id === selectedElementIds[0]);
      if (element) {
        const deltaX = (e.clientX - resizeStart.x) / zoom;
        const deltaY = (e.clientY - resizeStart.y) / zoom;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        
        if (resizeHandle.includes('e')) newWidth += deltaX;
        if (resizeHandle.includes('w')) newWidth -= deltaX;
        if (resizeHandle.includes('s')) newHeight += deltaY;
        if (resizeHandle.includes('n')) newHeight -= deltaY;
        
        // Maintain minimum size
        newWidth = Math.max(20, newWidth);
        newHeight = Math.max(20, newHeight);
        
        updateElement(element.id, {
          visual: {
            ...element.visual,
            width: newWidth,
            height: newHeight
          }
        });
      }
    }
  };


  // Render element using the new rendering system
  const renderElementComponent = (element: Element) => {
    const isSelected = selectedElementIds.includes(element.id);
    const currentSensorData = sensorData[element.sensor] || null;

    return renderElement({
      element,
      sensorData: currentSensorData,
      isSelected,
      isDragging,
      zoom,
      onElementClick: handleElementClick,
      onElementMouseDown: handleElementMouseDown
    });
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-900">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{
          backgroundImage: snapToGrid 
            ? `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`
            : 'none',
          backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          minWidth: `${canvasWidth}px`,
          minHeight: `${canvasHeight}px`
        }}
      >
        {/* Background Image */}
        {showBackground && backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              width: '100%',
              height: '100%'
            }}
          />
        )}
        {/* Elements */}
        {layout.elements.map((element) => (
          <div key={element.id} className="relative">
            {renderElementComponent(element)}
          </div>
        ))}
      </div>

      {/* Debug Overlay */}
      {showDebug && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          <div>Zoom: {(zoom * 100).toFixed(0)}%</div>
          <div>Pan: {pan.x}, {pan.y}</div>
          <div>Grid: {snapToGrid ? 'On' : 'Off'} ({gridSize}px)</div>
          <div>Tool: {currentTool}</div>
          <div>Elements: {layout.elements.length}</div>
          <div>Selected: {selectedElementIds.length}</div>
        </div>
      )}

      {/* Preview Mode Overlay */}
      {previewMode && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">
          PREVIEW MODE
        </div>
      )}
    </div>
  );
}

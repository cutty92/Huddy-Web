import React from 'react';
import { Element, SensorData } from '@/types';

interface ElementRendererProps {
  element: Element;
  sensorData: SensorData | null;
  isSelected: boolean;
  isDragging: boolean;
  zoom: number;
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  onElementMouseDown: (e: React.MouseEvent, elementId: string) => void;
}

// Helper function to get element style
const getElementStyle = (element: Element, isSelected: boolean, zoom: number): React.CSSProperties => ({
  position: 'absolute',
  left: element.visual.x * zoom,
  top: element.visual.y * zoom,
  width: element.visual.width * zoom,
  height: element.visual.height * zoom,
  backgroundColor: element.visual.backgroundColor,
  color: element.visual.foregroundColor,
  opacity: element.visual.opacity,
  visibility: element.visual.visible ? 'visible' : 'hidden',
  fontFamily: element.visual.fontFamily,
  fontSize: element.visual.fontSize * zoom,
  fontWeight: element.visual.fontWeight,
  fontStyle: element.visual.fontStyle,
  border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
  borderRadius: '4px',
  cursor: 'move',
  userSelect: 'none'
});

// Helper function to get sensor value and unit
const getSensorInfo = (element: Element, sensorData: SensorData | null) => {
  const value = sensorData?.value || 0;
  const unit = sensorData?.unit || '';
  const percentage = sensorData ? ((value - sensorData.min) / (sensorData.max - sensorData.min)) * 100 : 0;
  return { value, unit, percentage: Math.max(0, Math.min(100, percentage)) };
};

// Basic Elements
export const renderGauge = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className={`flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className="relative w-full h-full">
        {/* Gauge background circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
        
        {/* Gauge fill arc */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: element.visual.needleColor,
            transform: `rotate(${percentage * 1.8 - 90}deg)`,
            transition: 'transform 0.3s ease'
          }}
        ></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Value text */}
        {element.visual.showText && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs font-bold">
              {Math.round(value)}{unit}
            </div>
            <div className="text-xs opacity-75">{element.sensor}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const renderText = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center p-2"
    >
      {element.visual.showText && (
        <div className="text-center">
          <div className="font-bold">
            {Math.round(value)}{unit}
          </div>
          <div className="text-xs opacity-75">
            {element.sensor.replace(/_/g, ' ')}
          </div>
        </div>
      )}
    </div>
  );
};

export const renderBar = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex flex-col justify-center p-2"
    >
      <div className="w-full h-4 bg-gray-600 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
            {element.visual.showText && (
              <div className="text-xs text-center mt-1">
                {Math.round(value)}{unit}
              </div>
            )}
    </div>
  );
};

export const renderCircle = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center rounded-full"
    >
      <div className="relative w-full h-full rounded-full border-4 border-gray-600">
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: element.visual.needleColor,
            transform: `rotate(${percentage * 3.6 - 90}deg)`,
            transition: 'transform 0.3s ease'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-bold">{Math.round(value)}{unit}</div>
        </div>
      </div>
    </div>
  );
};

export const renderRectangle = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center border-2 border-gray-600"
    >
      <div className="text-center">
        <div className="text-xs font-bold">{Math.round(value)}{unit}</div>
        <div className="text-xs opacity-75">{element.sensor}</div>
      </div>
    </div>
  );
};

export const renderLine = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center"
    >
      <div 
        className="w-full bg-gradient-to-r from-green-500 to-red-500"
        style={{ 
          height: `${Math.max(2, percentage / 10)}px`,
          borderRadius: '2px'
        }}
      ></div>
    </div>
  );
};

// Advanced Gauges
export const renderProgressRing = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center"
    >
      <div className="relative w-full h-full">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={element.visual.needleColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.83} 283`}
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-bold">{Math.round(value)}{unit}</div>
            <div className="text-xs opacity-75">{element.sensor}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const renderThermometer = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  // Temperature color coding
  let fillColor = '#0000ff'; // Blue
  if (percentage > 30) fillColor = '#00ff00'; // Green
  if (percentage > 70) fillColor = '#ff0000'; // Red
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center"
    >
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Thermometer tube */}
        <div className="w-4 h-3/4 border-2 border-gray-600 rounded-t-lg overflow-hidden">
          <div 
            className="w-full transition-all duration-300"
            style={{ 
              height: `${percentage}%`,
              backgroundColor: fillColor
            }}
          ></div>
        </div>
        {/* Thermometer bulb */}
        <div 
          className="w-6 h-6 rounded-full border-2 border-gray-600"
          style={{ backgroundColor: fillColor }}
        ></div>
        {/* Value text */}
        <div className="text-xs font-bold mt-1">
          {Math.round(value)}{unit}
        </div>
      </div>
    </div>
  );
};

export const renderSpeedometer = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center"
    >
      <div className="relative w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Speedometer arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="8"
          />
          {/* Speedometer fill */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={element.visual.needleColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 1.57} 157`}
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
          {/* Needle */}
          <line
            x1="100"
            y1="80"
            x2={100 + 60 * Math.cos((percentage * 1.8 - 90) * Math.PI / 180)}
            y2={80 + 60 * Math.sin((percentage * 1.8 - 90) * Math.PI / 180)}
            stroke={element.visual.needleColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xs font-bold">{Math.round(value)}{unit}</div>
          <div className="text-xs opacity-75">{element.sensor}</div>
        </div>
      </div>
    </div>
  );
};

// Indicators
export const renderLED = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  const isOn = value > 50;
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center"
    >
      <div 
        className={`w-full h-full rounded-full border-2 ${
          isOn 
            ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' 
            : 'border-gray-600'
        }`}
        style={{
          backgroundColor: isOn ? element.visual.needleColor : element.visual.backgroundColor,
          boxShadow: isOn ? `0 0 20px ${element.visual.needleColor}` : 'none'
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-xs font-bold text-white">
            {Math.round(value)}{unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export const renderBattery = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  // Battery color coding
  let fillColor = '#ff0000'; // Red
  if (percentage > 20) fillColor = '#ffff00'; // Yellow
  if (percentage > 50) fillColor = '#00ff00'; // Green
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center"
    >
      <div className="relative w-full h-full flex items-center">
        {/* Battery body */}
        <div className="w-4/5 h-3/4 border-2 border-gray-600 rounded-sm">
          <div 
            className="h-full transition-all duration-300 rounded-sm"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: fillColor
            }}
          ></div>
        </div>
        {/* Battery terminal */}
        <div className="w-1/5 h-1/3 border-2 border-gray-600 rounded-r-sm ml-1"></div>
        {/* Value text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs font-bold text-white">
            {Math.round(value)}{unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export const renderSignalBars = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit, percentage } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  const bars = 5;
  const activeBars = Math.ceil((percentage / 100) * bars);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-end justify-center space-x-1"
    >
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm transition-all duration-300 ${
            i < activeBars ? 'bg-green-500' : 'bg-gray-600'
          }`}
          style={{ height: `${(i + 1) * 20}%` }}
        ></div>
      ))}
      <div className="absolute -bottom-6 text-xs font-bold">
        {Math.round(value)}{unit}
      </div>
    </div>
  );
};

// System Elements
export const renderCPUCores = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex flex-col items-center justify-center p-2"
    >
      <div className="grid grid-cols-4 gap-1 w-full">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-600 rounded-sm flex items-center justify-center"
          >
            <div className="text-xs font-bold text-white">
              {Math.round(value * (0.8 + Math.random() * 0.4))}%
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold mt-2">
        {Math.round(value)}{unit}
      </div>
    </div>
  );
};

// Graph Elements
export const renderLineGraph = ({ element, sensorData, isSelected, isDragging, zoom, onElementClick, onElementMouseDown }: ElementRendererProps) => {
  const { value, unit } = getSensorInfo(element, sensorData);
  const elementStyle = getElementStyle(element, isSelected, zoom);
  
  // Generate some mock historical data
  const dataPoints = Array.from({ length: 20 }, (_, i) => ({
    x: (i / 19) * 100,
    y: 50 + Math.sin(i * 0.5) * 30 + Math.random() * 20
  }));
  
  return (
    <div
      key={element.id}
      style={elementStyle}
      onClick={(e) => onElementClick(e, element.id)}
      onMouseDown={(e) => onElementMouseDown(e, element.id)}
      className="flex items-center justify-center p-2 bg-gray-800 rounded"
    >
      <div className="w-full h-full relative">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <polyline
            points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={element.visual.needleColor}
            strokeWidth="2"
          />
        </svg>
        <div className="absolute bottom-0 left-0 text-xs font-bold">
          {Math.round(value)}{unit}
        </div>
      </div>
    </div>
  );
};

// Main renderer function
export const renderElement = (props: ElementRendererProps) => {
  const { element } = props;
  
  switch (element.type) {
    // Basic Elements
    case 'gauge': return renderGauge(props);
    case 'text': return renderText(props);
    case 'bar': return renderBar(props);
    case 'circle': return renderCircle(props);
    case 'rectangle': return renderRectangle(props);
    case 'line': return renderLine(props);
    
    // Advanced Gauges
    case 'progress_ring': return renderProgressRing(props);
    case 'thermometer': return renderThermometer(props);
    case 'speedometer': return renderSpeedometer(props);
    
    // Indicators
    case 'led': return renderLED(props);
    case 'battery': return renderBattery(props);
    case 'signal_bars': return renderSignalBars(props);
    
    // System Elements
    case 'cpu_cores': return renderCPUCores(props);
    
    // Graph Elements
    case 'line_graph': return renderLineGraph(props);
    
    // Default fallback
    default:
      return (
        <div
          key={element.id}
          style={getElementStyle(element, props.isSelected, props.zoom)}
          onClick={(e) => props.onElementClick(e, element.id)}
          onMouseDown={(e) => props.onElementMouseDown(e, element.id)}
          className="flex items-center justify-center bg-gray-700 rounded"
        >
          <div className="text-center">
            <div className="text-xs">❓ {element.type}</div>
            <div className="text-xs opacity-75">{element.sensor}</div>
          </div>
        </div>
      );
  }
};



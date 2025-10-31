// Core layout types based on C# overlay structure
export interface LayoutData {
  version: string;
  elements: Element[];
  metadata?: {
    name?: string;
    description?: string;
    author?: string;
    created?: string;
    modified?: string;
    tags?: string[];
    compatibility?: {
      minVersion?: string;
      maxVersion?: string;
    };
  };
}

export interface Element {
  id: string;
  type: ElementType;
  sensor: SensorId;
  visual: VisualProperties;
  animated: boolean;
  animationSpeed: number;
}

// Element types from the comprehensive specification
export type ElementType = 
  // Basic Elements
  | 'gauge' | 'text' | 'bar' | 'circle' | 'rectangle' | 'line'
  // Advanced Gauges
  | 'progress_ring' | 'dial' | 'thermometer' | 'speedometer' | 'level_meter' | 'radial_gauge' | 'linear_gauge'
  // Indicators
  | 'led' | 'status_light' | 'traffic_light' | 'battery' | 'signal_bars' | 'wifi_indicator'
  // System Elements
  | 'cpu_cores' | 'memory_banks' | 'network_activity' | 'disk_activity' | 'fan_blade' | 'temperature_zones'
  // Graph Elements
  | 'line_graph' | 'area_graph' | 'sparkline' | 'histogram' | 'pie_chart' | 'donut_chart'
  // Interactive Elements
  | 'button' | 'toggle' | 'slider' | 'knob'
  // Effects
  | 'particle_system' | 'wave_form' | 'spectrum_analyzer' | 'flame_effect' | 'liquid_fill';

// Expanded sensor list from C# overlay
export type SensorId = 
  // CPU Sensors
  | 'CPU_Utilization' | 'CPU_Temperature' | 'CPU_Power' | 'CPU_Voltage' | 'CPU_Clock'
  | 'CPU_Core_0' | 'CPU_Core_1' | 'CPU_Core_2' | 'CPU_Core_3' | 'CPU_Core_4' | 'CPU_Core_5' | 'CPU_Core_6' | 'CPU_Core_7'
  // GPU Sensors
  | 'GPU_Utilization' | 'GPU_Temperature' | 'GPU_Memory' | 'GPU_Power' | 'GPU_Clock' | 'GPU_Fan'
  // Memory Sensors
  | 'Memory_Usage' | 'Memory_Total' | 'Memory_Available' | 'Memory_Bandwidth'
  // Network Sensors
  | 'WiFi_Speed' | 'Ethernet_Speed' | 'Network_Upload' | 'Network_Download'
  // Storage Sensors
  | 'Disk_Usage' | 'Disk_Temperature' | 'Disk_Read' | 'Disk_Write'
  // System Sensors
  | 'Motherboard_Temperature' | 'Fan_CPU' | 'Fan_Case_1' | 'Fan_Case_2'
  | 'PSU_Power' | 'PSU_Voltage_12V' | 'PSU_Voltage_5V';

export interface VisualProperties {
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  foregroundColor: string;
  needleColor: string;
  opacity: number;
  visible: boolean;
  showText: boolean;   // Whether to show text labels on the element
  fontFamily: string;
  fontSize: number;
  fontWeight: string;  // Changed to string for C# compatibility
  fontStyle: string;   // Changed to string for C# compatibility
}

// Sensor data for mock simulation
export interface SensorData {
  value: number;
  min: number;
  max: number;
  unit: string;
  isValid: boolean;
}

export interface MockSensorData {
  [sensorId: string]: SensorData;
}

// Editor state types
export interface EditorState {
  layout: LayoutData;
  selectedElementIds: string[];
  clipboard: Element[];
  currentTool: EditorTool;
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
  pan: { x: number; y: number };
  showDebug: boolean;
  previewMode: boolean;
  // Canvas settings
  canvasWidth: number;
  canvasHeight: number;
  showBackground: boolean;
  backgroundImage: string;
}

export type EditorTool = 'select' | ElementType;

// UI state types
export interface UIState {
  activePanel: PanelType;
  panels: {
    properties: boolean;
    assets: boolean;
    sensors: boolean;
    layers: boolean;
  };
  modals: {
    export: boolean;
    import: boolean;
    settings: boolean;
  };
}

export type PanelType = 'properties' | 'assets' | 'sensors' | 'layers';

// Validation types
export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Sensor definition types
export interface SensorDefinition {
  id: string;
  name: string;
  category: string;
  unit: string;
  range: {
    min: number;
    max: number;
  };
  description: string;
  thresholds: {
    value: number;
    level: 'warning' | 'critical' | 'info';
    color: string;
  }[];
}

// History types for undo/redo
export interface HistoryAction {
  type: 'add' | 'remove' | 'update' | 'move' | 'resize';
  elementId: string;
  oldValue?: any;
  newValue?: any;
  timestamp: number;
}

export interface HistoryState {
  actions: HistoryAction[];
  currentIndex: number;
  maxHistory: number;
}

// Asset types
export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'font' | 'sound';
  path: string;
  size: number;
  lastModified: Date;
}

export interface AssetCollection {
  images: { [key: string]: Asset };
  fonts: { [key: string]: Asset };
  sounds: { [key: string]: Asset };
}

// Canvas types
export interface CanvasElement {
  id: string;
  element: Element;
  fabricObject?: any; // Will be replaced with proper fabric.js types when needed
  isSelected: boolean;
  isHovered: boolean;
}

export interface ViewportState {
  width: number;
  height: number;
  zoom: number;
  pan: { x: number; y: number };
  gridSize: number;
  showGrid: boolean;
  showRulers: boolean;
}

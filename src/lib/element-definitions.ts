import { ElementType, SensorId } from '../types';

// Element categories for the palette
export interface ElementCategory {
  id: string;
  name: string;
  icon: string;
  elements: ElementType[];
}

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    id: 'basic',
    name: '📊 Basic',
    icon: '📊',
    elements: ['gauge', 'text', 'bar', 'circle', 'rectangle', 'line']
  },
  {
    id: 'gauges',
    name: '📈 Advanced Gauges',
    icon: '📈',
    elements: ['progress_ring', 'dial', 'thermometer', 'speedometer', 'level_meter', 'radial_gauge', 'linear_gauge']
  },
  {
    id: 'indicators',
    name: '💡 Indicators',
    icon: '💡',
    elements: ['led', 'status_light', 'traffic_light', 'battery', 'signal_bars', 'wifi_indicator']
  },
  {
    id: 'system',
    name: '🔧 System',
    icon: '🔧',
    elements: ['cpu_cores', 'memory_banks', 'network_activity', 'disk_activity', 'fan_blade', 'temperature_zones']
  },
  {
    id: 'graphs',
    name: '📊 Graphs',
    icon: '📊',
    elements: ['line_graph', 'area_graph', 'sparkline', 'histogram', 'pie_chart', 'donut_chart']
  },
  {
    id: 'interactive',
    name: '🎮 Interactive',
    icon: '🎮',
    elements: ['button', 'toggle', 'slider', 'knob']
  },
  {
    id: 'effects',
    name: '✨ Effects',
    icon: '✨',
    elements: ['particle_system', 'wave_form', 'spectrum_analyzer', 'flame_effect', 'liquid_fill']
  }
];

// Element definitions with default properties
export interface ElementDefinition {
  type: ElementType;
  name: string;
  description: string;
  category: string;
  icon: string;
  defaultSize: { width: number; height: number };
  suggestedSensors: SensorId[];
  requiredProperties: string[];
  optionalProperties: string[];
}

export const ELEMENT_DEFINITIONS: Record<ElementType, ElementDefinition> = {
  // Basic Elements
  gauge: {
    type: 'gauge',
    name: 'Gauge',
    description: 'Circular needle gauge for displaying values',
    category: 'basic',
    icon: '⭕',
    defaultSize: { width: 150, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization', 'Memory_Usage'],
    requiredProperties: ['needleColor'],
    optionalProperties: ['backgroundColor', 'foregroundColor']
  },
  text: {
    type: 'text',
    name: 'Text',
    description: 'Dynamic text display for sensor values',
    category: 'basic',
    icon: '📝',
    defaultSize: { width: 100, height: 30 },
    suggestedSensors: ['CPU_Temperature', 'GPU_Temperature', 'Memory_Total'],
    requiredProperties: ['fontFamily', 'fontSize', 'foregroundColor'],
    optionalProperties: ['backgroundColor']
  },
  bar: {
    type: 'bar',
    name: 'Progress Bar',
    description: 'Horizontal or vertical progress bar',
    category: 'basic',
    icon: '📊',
    defaultSize: { width: 200, height: 30 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization', 'Memory_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  circle: {
    type: 'circle',
    name: 'Circle',
    description: 'Value-scaled circular element',
    category: 'basic',
    icon: '⭕',
    defaultSize: { width: 100, height: 100 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  rectangle: {
    type: 'rectangle',
    name: 'Rectangle',
    description: 'Basic rectangular element',
    category: 'basic',
    icon: '⬜',
    defaultSize: { width: 100, height: 50 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: []
  },
  line: {
    type: 'line',
    name: 'Line',
    description: 'Value-thickness line element',
    category: 'basic',
    icon: '📏',
    defaultSize: { width: 200, height: 10 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['foregroundColor'],
    optionalProperties: ['backgroundColor']
  },

  // Advanced Gauges
  progress_ring: {
    type: 'progress_ring',
    name: 'Progress Ring',
    description: 'Circular progress with segments',
    category: 'gauges',
    icon: '🔄',
    defaultSize: { width: 150, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization', 'Memory_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor', 'needleColor'],
    optionalProperties: []
  },
  dial: {
    type: 'dial',
    name: 'Dial',
    description: 'Traditional dial gauge',
    category: 'gauges',
    icon: '🎛️',
    defaultSize: { width: 150, height: 150 },
    suggestedSensors: ['CPU_Temperature', 'GPU_Temperature'],
    requiredProperties: ['backgroundColor', 'foregroundColor', 'needleColor'],
    optionalProperties: []
  },
  thermometer: {
    type: 'thermometer',
    name: 'Thermometer',
    description: 'Temperature with bulb visualization',
    category: 'gauges',
    icon: '🌡️',
    defaultSize: { width: 50, height: 200 },
    suggestedSensors: ['CPU_Temperature', 'GPU_Temperature', 'Disk_Temperature'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  speedometer: {
    type: 'speedometer',
    name: 'Speedometer',
    description: 'Car-style gauge',
    category: 'gauges',
    icon: '🏎️',
    defaultSize: { width: 200, height: 150 },
    suggestedSensors: ['CPU_Clock', 'GPU_Clock'],
    requiredProperties: ['backgroundColor', 'foregroundColor', 'needleColor'],
    optionalProperties: []
  },
  level_meter: {
    type: 'level_meter',
    name: 'Level Meter',
    description: 'Vertical/horizontal level display',
    category: 'gauges',
    icon: '📊',
    defaultSize: { width: 30, height: 200 },
    suggestedSensors: ['Memory_Usage', 'Disk_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  radial_gauge: {
    type: 'radial_gauge',
    name: 'Radial Gauge',
    description: 'Circular value display',
    category: 'gauges',
    icon: '⭕',
    defaultSize: { width: 150, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor', 'needleColor'],
    optionalProperties: []
  },
  linear_gauge: {
    type: 'linear_gauge',
    name: 'Linear Gauge',
    description: 'Straight-line gauge',
    category: 'gauges',
    icon: '📏',
    defaultSize: { width: 200, height: 50 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor', 'needleColor'],
    optionalProperties: []
  },

  // Indicators
  led: {
    type: 'led',
    name: 'LED',
    description: 'On/off light with glow effect',
    category: 'indicators',
    icon: '💡',
    defaultSize: { width: 20, height: 20 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  status_light: {
    type: 'status_light',
    name: 'Status Light',
    description: 'System status indicator',
    category: 'indicators',
    icon: '🟢',
    defaultSize: { width: 30, height: 30 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  traffic_light: {
    type: 'traffic_light',
    name: 'Traffic Light',
    description: 'Multi-state indicator',
    category: 'indicators',
    icon: '🚦',
    defaultSize: { width: 40, height: 100 },
    suggestedSensors: ['CPU_Temperature', 'GPU_Temperature'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  battery: {
    type: 'battery',
    name: 'Battery',
    description: 'Charge level with color coding',
    category: 'indicators',
    icon: '🔋',
    defaultSize: { width: 60, height: 30 },
    suggestedSensors: ['Memory_Usage', 'Disk_Usage', 'GPU_Memory'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  signal_bars: {
    type: 'signal_bars',
    name: 'Signal Bars',
    description: 'Network strength bars',
    category: 'indicators',
    icon: '📶',
    defaultSize: { width: 40, height: 60 },
    suggestedSensors: ['WiFi_Speed', 'Ethernet_Speed', 'Network_Upload'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  wifi_indicator: {
    type: 'wifi_indicator',
    name: 'WiFi Indicator',
    description: 'Wireless signal display',
    category: 'indicators',
    icon: '📶',
    defaultSize: { width: 50, height: 50 },
    suggestedSensors: ['WiFi_Speed', 'Network_Upload'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },

  // System Elements
  cpu_cores: {
    type: 'cpu_cores',
    name: 'CPU Cores',
    description: '8-core CPU visualization',
    category: 'system',
    icon: '🖥️',
    defaultSize: { width: 200, height: 100 },
    suggestedSensors: ['CPU_Utilization', 'CPU_Core_0', 'CPU_Core_1'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  memory_banks: {
    type: 'memory_banks',
    name: 'Memory Banks',
    description: 'RAM module display',
    category: 'system',
    icon: '💾',
    defaultSize: { width: 150, height: 200 },
    suggestedSensors: ['Memory_Usage', 'Memory_Total'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  network_activity: {
    type: 'network_activity',
    name: 'Network Activity',
    description: 'Data flow indicators',
    category: 'system',
    icon: '🌐',
    defaultSize: { width: 200, height: 100 },
    suggestedSensors: ['Network_Upload', 'Network_Download', 'WiFi_Speed'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  disk_activity: {
    type: 'disk_activity',
    name: 'Disk Activity',
    description: 'Storage I/O visualization',
    category: 'system',
    icon: '💿',
    defaultSize: { width: 200, height: 100 },
    suggestedSensors: ['Disk_Read', 'Disk_Write', 'Disk_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  fan_blade: {
    type: 'fan_blade',
    name: 'Fan Blade',
    description: 'Rotating fan display',
    category: 'system',
    icon: '🌀',
    defaultSize: { width: 100, height: 100 },
    suggestedSensors: ['Fan_CPU', 'Fan_Case_1', 'GPU_Fan'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  temperature_zones: {
    type: 'temperature_zones',
    name: 'Temperature Zones',
    description: 'Heat distribution map',
    category: 'system',
    icon: '🌡️',
    defaultSize: { width: 200, height: 150 },
    suggestedSensors: ['CPU_Temperature', 'GPU_Temperature', 'Motherboard_Temperature'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },

  // Graph Elements
  line_graph: {
    type: 'line_graph',
    name: 'Line Graph',
    description: 'Time-series data',
    category: 'graphs',
    icon: '📈',
    defaultSize: { width: 300, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization', 'Memory_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  area_graph: {
    type: 'area_graph',
    name: 'Area Graph',
    description: 'Filled area charts',
    category: 'graphs',
    icon: '📊',
    defaultSize: { width: 300, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  sparkline: {
    type: 'sparkline',
    name: 'Sparkline',
    description: 'Mini trend lines',
    category: 'graphs',
    icon: '⚡',
    defaultSize: { width: 100, height: 30 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['foregroundColor'],
    optionalProperties: ['backgroundColor', 'needleColor']
  },
  histogram: {
    type: 'histogram',
    name: 'Histogram',
    description: 'Bar distributions',
    category: 'graphs',
    icon: '📊',
    defaultSize: { width: 200, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  pie_chart: {
    type: 'pie_chart',
    name: 'Pie Chart',
    description: 'Circular data slices',
    category: 'graphs',
    icon: '🥧',
    defaultSize: { width: 150, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization', 'Memory_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  donut_chart: {
    type: 'donut_chart',
    name: 'Donut Chart',
    description: 'Ring charts',
    category: 'graphs',
    icon: '🍩',
    defaultSize: { width: 150, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization', 'Memory_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },

  // Interactive Elements
  button: {
    type: 'button',
    name: 'Button',
    description: 'Clickable elements',
    category: 'interactive',
    icon: '🔘',
    defaultSize: { width: 100, height: 40 },
    suggestedSensors: [],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  toggle: {
    type: 'toggle',
    name: 'Toggle',
    description: 'Switch controls',
    category: 'interactive',
    icon: '🔄',
    defaultSize: { width: 60, height: 30 },
    suggestedSensors: [],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  slider: {
    type: 'slider',
    name: 'Slider',
    description: 'Range selectors',
    category: 'interactive',
    icon: '🎚️',
    defaultSize: { width: 200, height: 20 },
    suggestedSensors: [],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  knob: {
    type: 'knob',
    name: 'Knob',
    description: 'Rotary controls',
    category: 'interactive',
    icon: '🎛️',
    defaultSize: { width: 60, height: 60 },
    suggestedSensors: [],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },

  // Effects
  particle_system: {
    type: 'particle_system',
    name: 'Particle System',
    description: 'Dynamic particle effects',
    category: 'effects',
    icon: '✨',
    defaultSize: { width: 200, height: 200 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  wave_form: {
    type: 'wave_form',
    name: 'Wave Form',
    description: 'Audio/signal waves',
    category: 'effects',
    icon: '🌊',
    defaultSize: { width: 300, height: 100 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  spectrum_analyzer: {
    type: 'spectrum_analyzer',
    name: 'Spectrum Analyzer',
    description: 'Frequency display',
    category: 'effects',
    icon: '📊',
    defaultSize: { width: 300, height: 150 },
    suggestedSensors: ['CPU_Utilization', 'GPU_Utilization'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  flame_effect: {
    type: 'flame_effect',
    name: 'Flame Effect',
    description: 'Fire animations',
    category: 'effects',
    icon: '🔥',
    defaultSize: { width: 100, height: 150 },
    suggestedSensors: ['CPU_Temperature', 'GPU_Temperature'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  },
  liquid_fill: {
    type: 'liquid_fill',
    name: 'Liquid Fill',
    description: 'Fluid-style fills',
    category: 'effects',
    icon: '💧',
    defaultSize: { width: 100, height: 200 },
    suggestedSensors: ['Memory_Usage', 'Disk_Usage'],
    requiredProperties: ['backgroundColor', 'foregroundColor'],
    optionalProperties: ['needleColor']
  }
};

// Helper function to get element definition
export function getElementDefinition(type: ElementType): ElementDefinition {
  return ELEMENT_DEFINITIONS[type];
}

// Helper function to get elements by category
export function getElementsByCategory(categoryId: string): ElementType[] {
  const category = ELEMENT_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.elements : [];
}

// Helper function to get all element types
export function getAllElementTypes(): ElementType[] {
  return Object.keys(ELEMENT_DEFINITIONS) as ElementType[];
}



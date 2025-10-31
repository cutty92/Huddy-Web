# JSON Layout Builder Web Application Specification

## Overview
This document provides complete specifications for building a web-based JSON layout builder that creates overlay layouts for the Hardware Monitor system. The builder must support 50+ element types and proper sensor binding with visual preview capabilities.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Element Type Specifications](#element-type-specifications)
3. [Sensor Integration](#sensor-integration)
4. [User Interface Requirements](#user-interface-requirements)
5. [JSON Schema & Validation](#json-schema--validation)
6. [Visual Preview System](#visual-preview-system)
7. [Export & Import Features](#export--import-features)
8. [Technical Implementation](#technical-implementation)

---

## System Architecture

### Core Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Element       │    │   Canvas        │    │   Properties    │
│   Palette       │    │   Editor        │    │   Panel         │
│                 │    │                 │    │                 │
│ • 50+ Elements  │◄──►│ • Drag & Drop   │◄──►│ • Visual Props  │
│ • Categories    │    │ • Live Preview  │    │ • Sensor Bind   │
│ • Search/Filter │    │ • Grid/Snap     │    │ • Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   JSON Output   │
                    │                 │
                    │ • Schema Valid  │
                    │ • Export/Import │
                    │ • Live Preview  │
                    └─────────────────┘
```

### Technology Stack Recommendations
- **Frontend**: React/Vue.js with TypeScript
- **Canvas Library**: Fabric.js or Konva.js for drag-and-drop
- **UI Framework**: Material-UI or Ant Design
- **State Management**: Redux/Zustand
- **Validation**: Ajv for JSON Schema validation
- **Preview Rendering**: Canvas API or WebGL

---

## Element Type Specifications

### Element Categories & Types

#### 1. Basic Elements
```typescript
interface BasicElements {
  gauge: GaugeElement;      // Circular needle gauge
  text: TextElement;        // Sensor value display
  bar: BarElement;          // Horizontal/vertical progress
  circle: CircleElement;    // Value-scaled circles
  rectangle: RectElement;   // Basic rectangles
  line: LineElement;        // Value-thickness lines
}
```

#### 2. Advanced Gauges (7 types)
```typescript
interface AdvancedGauges {
  progress_ring: ProgressRingElement;    // Circular progress with segments
  dial: DialElement;                     // Traditional dial gauge
  thermometer: ThermometerElement;       // Temperature with bulb visualization
  speedometer: SpeedometerElement;       // Car-style gauge
  level_meter: LevelMeterElement;        // Vertical/horizontal levels
  radial_gauge: RadialGaugeElement;      // Circular value display
  linear_gauge: LinearGaugeElement;      // Straight-line gauge
}
```

#### 3. Indicator Elements (6 types)
```typescript
interface IndicatorElements {
  led: LEDElement;                // On/off light with glow
  status_light: StatusElement;    // System status indicator
  traffic_light: TrafficElement;  // Multi-state indicator
  battery: BatteryElement;        // Charge level with color coding
  signal_bars: SignalBarsElement; // Network strength bars
  wifi_indicator: WifiElement;    // Wireless signal display
}
```

#### 4. System Specific Elements (6 types)
```typescript
interface SystemElements {
  cpu_cores: CPUCoresElement;           // 8-core CPU visualization
  memory_banks: MemoryBanksElement;     // RAM module display
  network_activity: NetworkElement;     // Data flow indicators
  disk_activity: DiskActivityElement;   // Storage I/O visualization
  fan_blade: FanBladeElement;           // Rotating fan display
  temperature_zones: TempZonesElement;  // Heat distribution map
}
```

#### 5. Graph Elements (6 types)
```typescript
interface GraphElements {
  line_graph: LineGraphElement;     // Time-series data
  area_graph: AreaGraphElement;     // Filled area charts
  sparkline: SparklineElement;      // Mini trend lines
  histogram: HistogramElement;      // Bar distributions
  pie_chart: PieChartElement;       // Circular data slices
  donut_chart: DonutChartElement;   // Ring charts
}
```

#### 6. Interactive Elements (4 types)
```typescript
interface InteractiveElements {
  button: ButtonElement;      // Clickable elements
  toggle: ToggleElement;      // Switch controls
  slider: SliderElement;      // Range selectors
  knob: KnobElement;          // Rotary controls
}
```

#### 7. Effects & Animations (5 types)
```typescript
interface EffectElements {
  particle_system: ParticleElement;     // Dynamic particle effects
  wave_form: WaveFormElement;           // Audio/signal waves
  spectrum_analyzer: SpectrumElement;   // Frequency display
  flame_effect: FlameElement;           // Fire animations
  liquid_fill: LiquidFillElement;       // Fluid-style fills
}
```

### Universal Element Properties
```typescript
interface BaseElement {
  id: string;                    // Unique identifier
  type: ElementType;             // Element type from above
  sensor: SensorName;            // Bound sensor (see sensor list)
  visual: VisualProperties;      // Positioning and styling
  metadata?: ElementMetadata;    // Builder-specific data
}

interface VisualProperties {
  // Positioning (absolute pixels)
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Colors (hex format: #RRGGBB or #RRGGBBAA)
  backgroundColor: string;       // Fill color
  foregroundColor: string;       // Border/outline color
  needleColor: string;          // Accent/needle color
  
  // Transparency & Visibility
  opacity: number;              // 0.0 - 1.0
  visible: boolean;             // Show/hide element
  
  // Typography
  fontFamily: string;           // Font name
  fontSize: number;             // Font size in pixels
  fontWeight: string;           // "normal", "bold", "100"-"900"
  fontStyle: string;            // "normal", "italic", "oblique"
}

interface ElementMetadata {
  name?: string;                // User-friendly name
  description?: string;         // Element description
  category?: string;            // Element category
  tags?: string[];              // Search tags
  created?: string;             // Creation timestamp
  modified?: string;            // Last modification
}
```

---

## Sensor Integration

### Available Sensor Types
The builder must support binding to these LibreHardwareMonitor sensors:

#### CPU Sensors
```typescript
const CPU_SENSORS = [
  "CPU_Utilization",      // Overall CPU usage %
  "CPU_Temperature",      // CPU temperature in °C
  "CPU_Power",           // CPU power consumption in W
  "CPU_Voltage",         // CPU voltage in V
  "CPU_Clock",           // CPU clock speed in MHz
  "CPU_Core_0",          // Individual core usage %
  "CPU_Core_1",          // (up to available cores)
  // ... additional cores
];
```

#### GPU Sensors  
```typescript
const GPU_SENSORS = [
  "GPU_Utilization",      // GPU usage %
  "GPU_Temperature",      // GPU temperature in °C
  "GPU_Memory",          // GPU memory usage %
  "GPU_Power",           // GPU power consumption in W
  "GPU_Clock",           // GPU clock speed in MHz
  "GPU_Fan",             // GPU fan speed in RPM
];
```

#### Memory Sensors
```typescript
const MEMORY_SENSORS = [
  "Memory_Usage",         // RAM usage %
  "Memory_Total",         // Total RAM in GB
  "Memory_Available",     // Available RAM in GB
  "Memory_Bandwidth",     // Memory bandwidth usage %
];
```

#### Network Sensors
```typescript
const NETWORK_SENSORS = [
  "WiFi_Speed",          // WiFi connection speed
  "Ethernet_Speed",      // Ethernet connection speed
  "Network_Upload",      // Upload speed in MB/s
  "Network_Download",    // Download speed in MB/s
];
```

#### Storage Sensors
```typescript
const STORAGE_SENSORS = [
  "Disk_Usage",          // Disk usage %
  "Disk_Temperature",    // Disk temperature in °C
  "Disk_Read",           // Read speed in MB/s
  "Disk_Write",          // Write speed in MB/s
];
```

#### System Sensors
```typescript
const SYSTEM_SENSORS = [
  "Motherboard_Temperature", // Motherboard temp in °C
  "Fan_CPU",                // CPU fan speed in RPM
  "Fan_Case_1",             // Case fan 1 speed in RPM
  "Fan_Case_2",             // Case fan 2 speed in RPM
  "PSU_Power",              // Power supply usage in W
  "PSU_Voltage_12V",        // 12V rail voltage
  "PSU_Voltage_5V",         // 5V rail voltage
];
```

### Sensor Binding UI Requirements

#### Sensor Selection Interface
```typescript
interface SensorSelector {
  // Dropdown/Autocomplete with categories
  categories: {
    CPU: CPUSensor[];
    GPU: GPUSensor[];
    Memory: MemorySensor[];
    Network: NetworkSensor[];
    Storage: StorageSensor[];
    System: SystemSensor[];
  };
  
  // Search functionality
  searchFilter: string;
  filteredSensors: Sensor[];
  
  // Validation
  validateBinding: (element: ElementType, sensor: SensorName) => boolean;
  suggestSensors: (element: ElementType) => SensorName[];
}
```

#### Smart Sensor Suggestions
```typescript
// Suggest appropriate sensors for each element type
const SENSOR_SUGGESTIONS = {
  thermometer: ["CPU_Temperature", "GPU_Temperature", "Disk_Temperature"],
  battery: ["Memory_Usage", "Disk_Usage", "GPU_Memory"],
  cpu_cores: ["CPU_Utilization", "CPU_Core_0", "CPU_Core_1"],
  signal_bars: ["WiFi_Speed", "Ethernet_Speed", "Network_Upload"],
  fan_blade: ["Fan_CPU", "Fan_Case_1", "GPU_Fan"],
  gauge: ["CPU_Utilization", "GPU_Utilization", "Memory_Usage"],
  // ... etc for all element types
};
```

---

## User Interface Requirements

### Main Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                        Top Toolbar                             │
│ [New] [Open] [Save] [Export] [Import] [Undo] [Redo] [Preview]  │
├─────────────────┬───────────────────────────────┬───────────────┤
│   Element       │                               │  Properties   │
│   Palette       │         Canvas Area           │   Panel       │
│                 │                               │               │
│ ┌─────────────┐ │  ┌─────────────────────────┐  │ ┌───────────┐ │
│ │Search: [___]│ │  │                         │  │ │Element:   │ │
│ │             │ │  │     1920 x 1080         │  │ │gauge_1    │ │
│ │📊 Gauges    │ │  │                         │  │ │           │ │
│ │  • gauge    │ │  │  [Selected Element]     │  │ │Sensor:    │ │
│ │  • progress │ │  │                         │  │ │[Dropdown] │ │
│ │  • dial     │ │  │                         │  │ │           │ │
│ │             │ │  │                         │  │ │Visual:    │ │
│ │💡 Indicators│ │  │                         │  │ │X: [100]   │ │
│ │  • led      │ │  │                         │  │ │Y: [200]   │ │
│ │  • battery  │ │  │                         │  │ │W: [150]   │ │
│ │  • signal   │ │  │                         │  │ │H: [150]   │ │
│ │             │ │  └─────────────────────────┘  │ │           │ │
│ │🔧 System    │ │                               │ │Colors:    │ │
│ │  • cpu_cores│ │  Canvas Controls:             │ │BG: [____] │ │
│ │  • memory   │ │  Zoom: [100%] Grid: [✓]      │ │FG: [____] │ │
│ └─────────────┘ │  Snap: [✓]   Lock: [ ]       │ │Needle:[__]│ │
├─────────────────┴───────────────────────────────┴───────────────┤
│                     Bottom Status Bar                          │
│ Elements: 5 | Selected: gauge_1 | Canvas: 1920x1080 | Valid ✓ │
└─────────────────────────────────────────────────────────────────┘
```

### Element Palette Features
```typescript
interface ElementPalette {
  // Categorized element browser
  categories: {
    "📊 Basic": ["gauge", "text", "bar", "circle", "rectangle"];
    "📈 Advanced Gauges": ["progress_ring", "thermometer", "speedometer"];
    "💡 Indicators": ["led", "battery", "signal_bars", "wifi_indicator"];
    "🔧 System": ["cpu_cores", "memory_banks", "network_activity"];
    "📊 Graphs": ["line_graph", "pie_chart", "sparkline"];
    "🎮 Interactive": ["button", "toggle", "slider", "knob"];
    "✨ Effects": ["particle_system", "wave_form", "flame_effect"];
  };
  
  // Search and filtering
  searchQuery: string;
  filteredElements: ElementType[];
  
  // Element preview thumbnails
  generateThumbnail: (elementType: ElementType) => HTMLCanvasElement;
  
  // Drag and drop support
  onDragStart: (elementType: ElementType) => void;
  onDragEnd: () => void;
}
```

### Canvas Editor Features
```typescript
interface CanvasEditor {
  // Canvas properties
  dimensions: { width: 1920, height: 1080 }; // Default full HD
  zoom: number;                               // 25% - 400%
  gridEnabled: boolean;
  gridSize: number;                          // Default 10px
  snapToGrid: boolean;
  
  // Selection and manipulation
  selectedElements: string[];                // Element IDs
  multiSelect: boolean;
  clipboard: LayoutElement[];
  
  // Drag and drop
  onElementDrop: (elementType: ElementType, position: {x: number, y: number}) => void;
  onElementMove: (elementId: string, newPosition: {x: number, y: number}) => void;
  onElementResize: (elementId: string, newSize: {width: number, height: number}) => void;
  
  // Context menu actions
  contextMenu: {
    copy: () => void;
    paste: () => void;
    delete: () => void;
    duplicate: () => void;
    bringToFront: () => void;
    sendToBack: () => void;
  };
  
  // Undo/Redo system
  history: CanvasState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
}
```

### Properties Panel Features
```typescript
interface PropertiesPanel {
  // Element identification
  selectedElement: LayoutElement | null;
  elementName: string;
  elementType: ElementType;
  
  // Sensor binding
  sensorSelector: SensorSelector;
  sensorValidation: ValidationResult;
  
  // Visual properties editor
  position: {
    x: NumberInput;
    y: NumberInput;
    width: NumberInput;
    height: NumberInput;
  };
  
  colors: {
    backgroundColor: ColorPicker;
    foregroundColor: ColorPicker;
    needleColor: ColorPicker;
  };
  
  appearance: {
    opacity: SliderInput;        // 0-100%
    visible: CheckboxInput;
    fontFamily: SelectInput;
    fontSize: NumberInput;
    fontWeight: SelectInput;
    fontStyle: SelectInput;
  };
  
  // Live preview
  previewElement: () => void;
  validateProperties: () => ValidationResult;
}
```

---

## JSON Schema & Validation

### Complete JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Hardware Monitor Layout",
  "type": "object",
  "required": ["elements"],
  "properties": {
    "elements": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/element"
      }
    },
    "metadata": {
      "$ref": "#/definitions/metadata"
    }
  },
  "definitions": {
    "element": {
      "type": "object",
      "required": ["id", "type", "sensor", "visual"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-zA-Z0-9_-]+$",
          "minLength": 1,
          "maxLength": 50
        },
        "type": {
          "type": "string",
          "enum": [
            "gauge", "text", "bar", "circle", "rectangle", "line",
            "progress_ring", "dial", "thermometer", "speedometer", "level_meter", "radial_gauge", "linear_gauge",
            "line_graph", "area_graph", "sparkline", "histogram", "pie_chart", "donut_chart",
            "led", "status_light", "traffic_light", "battery", "signal_bars", "wifi_indicator",
            "digital_display", "seven_segment", "lcd_display", "clock", "timer",
            "button", "toggle", "slider", "knob",
            "heatmap", "radar_chart", "bubble_chart", "sankey", "treemap",
            "cpu_cores", "memory_banks", "network_activity", "disk_activity", "fan_blade", "temperature_zones",
            "particle_system", "wave_form", "spectrum_analyzer", "flame_effect", "liquid_fill"
          ]
        },
        "sensor": {
          "type": "string",
          "enum": [
            "CPU_Utilization", "CPU_Temperature", "CPU_Power", "CPU_Voltage", "CPU_Clock",
            "GPU_Utilization", "GPU_Temperature", "GPU_Memory", "GPU_Power", "GPU_Clock", "GPU_Fan",
            "Memory_Usage", "Memory_Total", "Memory_Available", "Memory_Bandwidth",
            "WiFi_Speed", "Ethernet_Speed", "Network_Upload", "Network_Download",
            "Disk_Usage", "Disk_Temperature", "Disk_Read", "Disk_Write",
            "Motherboard_Temperature", "Fan_CPU", "Fan_Case_1", "Fan_Case_2",
            "PSU_Power", "PSU_Voltage_12V", "PSU_Voltage_5V"
          ]
        },
        "visual": {
          "$ref": "#/definitions/visual"
        },
        "metadata": {
          "$ref": "#/definitions/elementMetadata"
        }
      }
    },
    "visual": {
      "type": "object",
      "required": ["x", "y", "width", "height"],
      "properties": {
        "x": { "type": "number", "minimum": 0, "maximum": 3840 },
        "y": { "type": "number", "minimum": 0, "maximum": 2160 },
        "width": { "type": "number", "minimum": 10, "maximum": 1920 },
        "height": { "type": "number", "minimum": 10, "maximum": 1080 },
        "backgroundColor": {
          "type": "string",
          "pattern": "^(#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})|transparent)$"
        },
        "foregroundColor": {
          "type": "string",
          "pattern": "^(#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})|transparent)$"
        },
        "needleColor": {
          "type": "string",
          "pattern": "^(#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})|transparent)$"
        },
        "opacity": { "type": "number", "minimum": 0, "maximum": 1 },
        "visible": { "type": "boolean" },
        "fontFamily": { "type": "string", "minLength": 1 },
        "fontSize": { "type": "number", "minimum": 8, "maximum": 72 },
        "fontWeight": {
          "type": "string",
          "enum": ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"]
        },
        "fontStyle": {
          "type": "string",
          "enum": ["normal", "italic", "oblique"]
        }
      },
      "additionalProperties": false
    },
    "elementMetadata": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "category": { "type": "string" },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        },
        "created": { "type": "string", "format": "date-time" },
        "modified": { "type": "string", "format": "date-time" }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "description": { "type": "string" },
        "author": { "type": "string" },
        "version": { "type": "string" },
        "created": { "type": "string", "format": "date-time" },
        "modified": { "type": "string", "format": "date-time" },
        "targetResolution": {
          "type": "object",
          "properties": {
            "width": { "type": "number" },
            "height": { "type": "number" }
          }
        }
      }
    }
  }
}
```

### Validation Requirements
```typescript
interface ValidationSystem {
  // Schema validation
  validateJSON: (json: any) => ValidationResult;
  
  // Business rules validation
  validateElementSensorBinding: (element: ElementType, sensor: SensorName) => boolean;
  validateElementPositioning: (element: LayoutElement, canvasSize: {width: number, height: number}) => boolean;
  validateElementOverlaps: (elements: LayoutElement[]) => OverlapWarning[];
  validateColorFormats: (colors: string[]) => boolean;
  
  // Real-time validation
  onElementChange: (element: LayoutElement) => ValidationResult;
  showValidationErrors: (errors: ValidationError[]) => void;
  showValidationWarnings: (warnings: ValidationWarning[]) => void;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  elementId?: string;
  property: string;
  message: string;
  severity: "error" | "warning";
}
```

---

## Visual Preview System

### Canvas Rendering Engine
```typescript
interface PreviewRenderer {
  // Canvas setup
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number;                    // Zoom level
  
  // Element rendering
  renderElement: (element: LayoutElement, mockSensorData: SensorData) => void;
  renderAllElements: (layout: Layout) => void;
  
  // Mock sensor data for preview
  generateMockData: (sensor: SensorName) => SensorData;
  animateMockData: boolean;         // Animate values for preview
  
  // Visual helpers
  showGrid: boolean;
  showRulers: boolean;
  showElementBounds: boolean;
  showElementLabels: boolean;
}

interface SensorData {
  value: number;
  minValue: number;
  maxValue: number;
  unit: string;
  sensorName: string;
  isValid: boolean;
}
```

### Element Rendering Specifications
Each element type must be rendered to match the C++ implementation:

#### Gauge Rendering
```typescript
function renderGauge(element: LayoutElement, sensorData: SensorData, ctx: CanvasRenderingContext2D) {
  const centerX = element.visual.x + element.visual.width / 2;
  const centerY = element.visual.y + element.visual.height / 2;
  const radius = Math.min(element.visual.width, element.visual.height) / 2 - 10;
  
  // Background circle
  ctx.globalAlpha = element.visual.opacity;
  ctx.fillStyle = element.visual.backgroundColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Gauge ring
  ctx.strokeStyle = element.visual.foregroundColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Needle calculation
  const percentage = (sensorData.value - sensorData.minValue) / (sensorData.maxValue - sensorData.minValue);
  const angle = -135 + (percentage * 270); // -135° to +135°
  const angleRad = (angle * Math.PI) / 180;
  
  // Draw needle
  ctx.strokeStyle = element.visual.needleColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + (radius * 0.8) * Math.cos(angleRad),
    centerY + (radius * 0.8) * Math.sin(angleRad)
  );
  ctx.stroke();
  
  // Center dot
  ctx.fillStyle = element.visual.needleColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
  ctx.fill();
}
```

#### Thermometer Rendering
```typescript
function renderThermometer(element: LayoutElement, sensorData: SensorData, ctx: CanvasRenderingContext2D) {
  const bulbRadius = element.visual.width * 0.3;
  const tubeWidth = element.visual.width * 0.4;
  const tubeHeight = element.visual.height - bulbRadius * 2;
  
  // Thermometer outline
  ctx.globalAlpha = element.visual.opacity;
  ctx.strokeStyle = element.visual.foregroundColor;
  ctx.lineWidth = 2;
  
  // Draw tube
  const tubeX = element.visual.x + (element.visual.width - tubeWidth) / 2;
  const tubeY = element.visual.y;
  ctx.strokeRect(tubeX, tubeY, tubeWidth, tubeHeight);
  
  // Draw bulb
  const bulbX = element.visual.x + element.visual.width / 2;
  const bulbY = element.visual.y + tubeHeight + bulbRadius;
  ctx.beginPath();
  ctx.arc(bulbX, bulbY, bulbRadius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Fill based on temperature
  const percentage = (sensorData.value - sensorData.minValue) / (sensorData.maxValue - sensorData.minValue);
  const fillHeight = tubeHeight * percentage;
  
  // Temperature color coding
  let fillColor;
  if (percentage < 0.3) fillColor = '#0000ff';      // Blue
  else if (percentage < 0.7) fillColor = '#00ff00'; // Green
  else fillColor = '#ff0000';                       // Red
  
  ctx.fillStyle = fillColor;
  ctx.fillRect(tubeX + 2, tubeY + tubeHeight - fillHeight, tubeWidth - 4, fillHeight);
  ctx.beginPath();
  ctx.arc(bulbX, bulbY, bulbRadius, 0, 2 * Math.PI);
  ctx.fill();
}
```

### Mock Data Generation
```typescript
const MOCK_SENSOR_DATA = {
  CPU_Utilization: { min: 0, max: 100, unit: '%', typical: 45 },
  CPU_Temperature: { min: 30, max: 90, unit: '°C', typical: 65 },
  GPU_Temperature: { min: 30, max: 85, unit: '°C', typical: 70 },
  Memory_Usage: { min: 0, max: 100, unit: '%', typical: 60 },
  WiFi_Speed: { min: 0, max: 1000, unit: 'Mbps', typical: 250 },
  Fan_CPU: { min: 0, max: 3000, unit: 'RPM', typical: 1200 },
  // ... etc for all sensors
};

function generateMockSensorData(sensor: SensorName): SensorData {
  const config = MOCK_SENSOR_DATA[sensor];
  const variance = 0.2; // ±20% variance
  const randomValue = config.typical * (1 + (Math.random() - 0.5) * variance);
  
  return {
    value: Math.max(config.min, Math.min(config.max, randomValue)),
    minValue: config.min,
    maxValue: config.max,
    unit: config.unit,
    sensorName: sensor,
    isValid: true
  };
}
```

---

## Export & Import Features

### Export Formats
```typescript
interface ExportSystem {
  // JSON export (primary format)
  exportJSON: (layout: Layout) => string;
  exportJSONFile: (layout: Layout, filename: string) => void;
  
  // Template export
  exportTemplate: (layout: Layout, templateInfo: TemplateInfo) => string;
  
  // Image export for preview
  exportPNG: (layout: Layout, options: ExportImageOptions) => Blob;
  exportSVG: (layout: Layout) => string;
  
  // Validation before export
  validateBeforeExport: (layout: Layout) => ValidationResult;
}

interface TemplateInfo {
  name: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  targetResolution: {width: number, height: number};
  requiredSensors: SensorName[];
}

interface ExportImageOptions {
  width: number;
  height: number;
  backgroundColor: string;
  showMockData: boolean;
  quality: number;           // 0.1 - 1.0 for JPEG
}
```

### Import System
```typescript
interface ImportSystem {
  // JSON import
  importJSON: (jsonString: string) => ImportResult;
  importJSONFile: (file: File) => Promise<ImportResult>;
  
  // Template import
  importTemplate: (templateFile: File) => Promise<ImportResult>;
  
  // Validation during import
  validateImport: (data: any) => ValidationResult;
  
  // Migration support
  migrateOldFormat: (oldData: any, version: string) => Layout;
}

interface ImportResult {
  success: boolean;
  layout?: Layout;
  errors: ImportError[];
  warnings: ImportWarning[];
  migrationApplied?: boolean;
}

interface ImportError {
  line?: number;
  property: string;
  message: string;
  suggestion?: string;
}
```

---

## Technical Implementation

### State Management Architecture
```typescript
// Redux/Zustand store structure
interface AppState {
  // Layout data
  layout: {
    elements: LayoutElement[];
    metadata: LayoutMetadata;
  };
  
  // UI state
  ui: {
    selectedElements: string[];
    clipboard: LayoutElement[];
    canvasZoom: number;
    canvasOffset: {x: number, y: number};
    showGrid: boolean;
    snapToGrid: boolean;
    elementPaletteExpanded: boolean;
    propertiesPanelExpanded: boolean;
  };
  
  // Editor state
  editor: {
    isDirty: boolean;
    history: CanvasState[];
    historyIndex: number;
    dragState: DragState | null;
    resizeState: ResizeState | null;
  };
  
  // Validation state
  validation: {
    errors: ValidationError[];
    warnings: ValidationWarning[];
    isValid: boolean;
  };
}

// Actions
interface AppActions {
  // Element management
  addElement: (elementType: ElementType, position: {x: number, y: number}) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<LayoutElement>) => void;
  duplicateElement: (elementId: string) => void;
  
  // Selection management
  selectElement: (elementId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // Clipboard operations
  copyElements: (elementIds: string[]) => void;
  pasteElements: () => void;
  cutElements: (elementIds: string[]) => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  saveState: () => void;
  
  // Layout operations
  loadLayout: (layout: Layout) => void;
  saveLayout: () => void;
  exportLayout: (format: ExportFormat) => void;
  importLayout: (data: any) => void;
  
  // Validation
  validateLayout: () => void;
  validateElement: (elementId: string) => void;
}
```

### Performance Considerations
```typescript
interface PerformanceOptimizations {
  // Canvas rendering
  useVirtualization: boolean;        // Only render visible elements
  useCanvasWorker: boolean;         // Offload rendering to web worker
  throttleRenderUpdates: number;    // Throttle render updates (ms)
  
  // Element updates
  useMemoization: boolean;          // Memoize element render functions
  batchUpdates: boolean;            // Batch multiple element updates
  deferNonCriticalUpdates: boolean; // Defer non-visual updates
  
  // Memory management
  limitHistoryStates: number;       // Max undo/redo states (default: 50)
  cleanupUnusedElements: boolean;   // Remove unused elements from memory
  useObjectPooling: boolean;        // Pool frequently created objects
}
```

### Testing Requirements
```typescript
interface TestingStrategy {
  // Unit tests
  elementRenderingTests: {
    testGaugeRendering: () => void;
    testThermometerRendering: () => void;
    testBatteryRendering: () => void;
    // ... for all 50+ element types
  };
  
  // Integration tests
  jsonValidationTests: {
    testValidJSON: () => void;
    testInvalidJSON: () => void;
    testSensorBinding: () => void;
    testElementPositioning: () => void;
  };
  
  // E2E tests
  userWorkflowTests: {
    testCreateNewLayout: () => void;
    testDragDropElements: () => void;
    testExportImport: () => void;
    testUndoRedo: () => void;
  };
  
  // Visual regression tests
  visualTests: {
    compareElementRendering: (elementType: ElementType) => boolean;
    compareLayoutOutput: (layout: Layout) => boolean;
  };
}
```

---

## Example Implementation Starter Code

### React Component Structure
```typescript
// Main App Component
const LayoutBuilder: React.FC = () => {
  const [layout, setLayout] = useState<Layout>({ elements: [] });
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [canvasRef] = useState(useRef<HTMLCanvasElement>(null));
  
  return (
    <div className="layout-builder">
      <TopToolbar 
        onSave={() => exportLayout(layout)}
        onLoad={(newLayout) => setLayout(newLayout)}
        onUndo={undo}
        onRedo={redo}
      />
      
      <div className="main-content">
        <ElementPalette 
          onElementDrop={(type, position) => addElement(type, position)}
        />
        
        <CanvasEditor 
          ref={canvasRef}
          layout={layout}
          selectedElements={selectedElements}
          onElementSelect={setSelectedElements}
          onElementUpdate={(id, updates) => updateElement(id, updates)}
        />
        
        <PropertiesPanel 
          selectedElement={getSelectedElement()}
          onPropertyChange={(property, value) => updateElementProperty(property, value)}
        />
      </div>
      
      <StatusBar 
        elementCount={layout.elements.length}
        selectedCount={selectedElements.length}
        validationStatus={validateLayout(layout)}
      />
    </div>
  );
};

// Element Palette Component
const ElementPalette: React.FC<{onElementDrop: (type: ElementType, position: Position) => void}> = ({
  onElementDrop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Basic']));
  
  const filteredElements = useMemo(() => {
    return ELEMENT_CATEGORIES.map(category => ({
      ...category,
      elements: category.elements.filter(element => 
        element.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.elements.length > 0);
  }, [searchQuery]);
  
  return (
    <div className="element-palette">
      <div className="search-box">
        <input 
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredElements.map(category => (
        <div key={category.name} className="category">
          <div 
            className="category-header"
            onClick={() => toggleCategory(category.name)}
          >
            {category.icon} {category.name}
            <span className={`expand-icon ${expandedCategories.has(category.name) ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          
          {expandedCategories.has(category.name) && (
            <div className="elements">
              {category.elements.map(elementType => (
                <div 
                  key={elementType}
                  className="element-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, elementType)}
                >
                  <ElementThumbnail type={elementType} />
                  <span>{formatElementName(elementType)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Canvas Editor Component
const CanvasEditor: React.FC<CanvasEditorProps> = ({
  layout,
  selectedElements,
  onElementSelect,
  onElementUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [zoom, setZoom] = useState(1.0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render grid if enabled
    if (showGrid) {
      renderGrid(ctx, zoom);
    }
    
    // Render all elements
    layout.elements.forEach(element => {
      const mockData = generateMockSensorData(element.sensor);
      renderElement(element, mockData, ctx, zoom);
      
      // Highlight selected elements
      if (selectedElements.includes(element.id)) {
        renderSelectionHighlight(element, ctx, zoom);
      }
    });
  }, [layout, selectedElements, zoom]);
  
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const position = {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
    
    onElementDrop(elementType, position);
  };
  
  return (
    <div className="canvas-editor">
      <div className="canvas-controls">
        <label>
          Zoom: 
          <select value={Math.round(zoom * 100)} onChange={(e) => setZoom(Number(e.target.value) / 100)}>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="100">100%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>
        </label>
        
        <label>
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Grid
        </label>
        
        <label>
          <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} />
          Snap
        </label>
      </div>
      
      <canvas
        ref={canvasRef}
        width={1920 * zoom}
        height={1080 * zoom}
        style={{
          width: `${1920 * zoom}px`,
          height: `${1080 * zoom}px`,
          border: '1px solid #ccc'
        }}
        onDrop={handleCanvasDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};
```

This comprehensive specification provides everything needed for an AI to build a professional JSON layout builder that supports all 50+ element types with proper sensor binding and visual preview capabilities.

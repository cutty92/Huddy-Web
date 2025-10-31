# Hardware Monitor JSON Editor

A web-based visual editor for creating and editing JSON layouts for the Hardware Monitor Overlay system.

## Features

- **Visual Editor**: Drag-and-drop interface for creating hardware monitoring layouts
- **Real-time Preview**: Live preview with mock sensor data simulation
- **Schema Validation**: Real-time JSON schema validation with helpful error messages
- **Element Types**: Support for gauges, bars, text, graphs, images, and shapes
- **Sensor Binding**: Easy binding to hardware sensors (CPU, GPU, Memory, Network)
- **Property Editing**: Comprehensive property panels for visual customization
- **Export/Import**: JSON export and import functionality
- **Debug Mode**: Visual debugging tools for element positioning and validation

## Supported Sensor Types

- **CPU**: Utilization, Temperature
- **GPU**: Utilization, Temperature, Memory
- **Memory**: Usage, Total
- **Network**: WiFi Speed, Ethernet Speed

## Technology Stack

- **React 18** with TypeScript
- **Vite** for development and building
- **Zustand** for state management
- **Tailwind CSS** for styling
- **AJV** for JSON schema validation
- **Fabric.js** for canvas manipulation (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hardware-monitor-json-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Layout

1. **Select a Tool**: Choose from the toolbar (Gauge, Bar, Text, Graph, Image, Shape)
2. **Click on Canvas**: Click anywhere on the canvas to place a new element
3. **Edit Properties**: Select an element and use the properties panel to customize
4. **Bind Sensors**: Choose a sensor from the dropdown in the properties panel
5. **Preview**: Toggle preview mode to see live sensor data simulation

### Element Types

- **Gauge**: Circular gauge with needle for temperature, utilization
- **Bar**: Horizontal/vertical progress bar for usage percentages
- **Text**: Dynamic text display for sensor values
- **Graph**: Line/area chart for historical data (planned)
- **Image**: Static images and icons (planned)
- **Shape**: Basic geometric shapes for decoration (planned)

### Sensor Binding

Each element can be bound to a hardware sensor:
- CPU Utilization (%)
- CPU Temperature (°C)
- GPU Utilization (%)
- GPU Temperature (°C)
- GPU Memory (GB)
- Memory Usage (%)
- Total Memory (GB)
- WiFi Speed (Mbps)
- Ethernet Speed (Mbps)

### Export/Import

- **Export**: Click the save button to download the layout as JSON
- **Import**: Click the open button to load an existing layout
- **Validation**: All layouts are validated against the JSON schema before export

## JSON Schema

The editor uses a comprehensive JSON schema for validation. The schema defines:

- Element structure and required properties
- Visual properties (position, size, colors, fonts)
- Sensor binding validation
- Animation properties
- Validation rules and constraints

Schema files are located in the `schema/` directory:
- `overlay-layout.schema.json` - Main layout schema
- `sensor-definitions.schema.json` - Sensor definitions
- `sensor-data.json` - Sensor metadata and thresholds

## Integration with Overlay Software

The exported JSON layouts are designed to work with the C# Hardware Monitor Overlay:

1. **File Structure**: Single JSON file with optional asset folder
2. **Asset Paths**: Relative paths to assets (images, fonts, sounds)
3. **Sensor IDs**: Exact mapping to C# overlay sensor system
4. **Validation**: Same schema used by both editor and overlay

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main canvas editor
│   ├── Header.tsx      # Top toolbar
│   ├── Sidebar.tsx     # Element list
│   ├── PropertiesPanel.tsx  # Property editor
│   └── ValidationPanel.tsx  # Validation display
├── contexts/           # React contexts
├── lib/               # Utility libraries
│   ├── sensor-data.ts # Mock sensor simulation
│   └── validation.ts  # JSON validation
├── store/             # Zustand store
├── types/             # TypeScript types
└── main.tsx           # Entry point

schema/                # JSON schema files
examples/              # Example layouts
```

### Key Features

- **Real-time Validation**: AJV schema validation with custom rules
- **Mock Sensor Data**: Realistic sensor data simulation for preview
- **Drag & Drop**: Canvas-based element manipulation
- **Property Editing**: Comprehensive property panels
- **History System**: Undo/redo functionality (planned)
- **Asset Management**: File upload and management (planned)

### Adding New Element Types

1. Add type to `ElementType` in `types/index.ts`
2. Add rendering logic in `Canvas.tsx`
3. Add property controls in `PropertiesPanel.tsx`
4. Update JSON schema if needed

### Adding New Sensors

1. Add sensor ID to `SensorId` type in `types/index.ts`
2. Add to `SENSOR_OPTIONS` in `PropertiesPanel.tsx`
3. Add mock data in `sensor-data.ts`
4. Update schema validation rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review the JSON schema for validation errors

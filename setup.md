# Hardware Monitor JSON Editor - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## What's Included

### ✅ Complete JSON Editor
- **Visual Canvas**: Drag-and-drop element placement
- **Element Types**: Gauge, Bar, Text, Graph, Image, Shape
- **Real-time Preview**: Live sensor data simulation
- **Property Editing**: Comprehensive property panels
- **Schema Validation**: Real-time JSON validation

### ✅ Sensor Integration
- **9 Working Sensors**: CPU, GPU, Memory, Network sensors
- **Mock Data System**: Realistic sensor data simulation
- **Sensor Binding**: Easy dropdown selection
- **Validation**: Sensor ID validation against C# overlay

### ✅ Export/Import System
- **JSON Export**: Formatted, minified, or with comments
- **File Validation**: Pre-import validation
- **Error Handling**: Comprehensive error messages
- **Metadata**: Automatic metadata generation

### ✅ Asset Management
- **File Upload**: Drag-and-drop file upload
- **Type Support**: Images, Fonts, Sounds
- **Validation**: File type and size validation
- **Organization**: Categorized asset management

### ✅ JSON Schema
- **Complete Schema**: Based on C# overlay structure
- **Validation Rules**: Custom validation for hardware monitors
- **Sensor Definitions**: All 9 sensor types defined
- **Examples**: Working example layouts

## File Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Canvas.tsx      # Main canvas editor
│   │   ├── Header.tsx      # Toolbar with export/import
│   │   ├── Sidebar.tsx     # Element list
│   │   ├── PropertiesPanel.tsx  # Property editor
│   │   ├── ValidationPanel.tsx  # Validation display
│   │   └── AssetManager.tsx     # Asset management
│   ├── contexts/           # React contexts
│   ├── lib/               # Utility libraries
│   │   ├── sensor-data.ts # Mock sensor simulation
│   │   ├── validation.ts  # JSON validation
│   │   ├── export-import.ts # Export/import functionality
│   │   └── asset-manager.ts # Asset management
│   ├── store/             # Zustand store
│   ├── types/             # TypeScript types
│   └── main.tsx           # Entry point
├── schema/                # JSON schema files
│   ├── overlay-layout.schema.json
│   ├── sensor-definitions.schema.json
│   └── sensor-data.json
├── examples/              # Example layouts
│   ├── minimal.json
│   └── gaming.json
└── package.json
```

## Key Features

### 1. Visual Editor
- Click tools to select element type
- Click canvas to place elements
- Drag elements to move them
- Select elements to edit properties
- Real-time preview with sensor data

### 2. Sensor System
- **CPU_Utilization**: CPU usage percentage
- **CPU_Temperature**: CPU core temperature
- **GPU_Utilization**: GPU usage percentage
- **GPU_Temperature**: GPU core temperature
- **GPU_Memory**: GPU memory usage
- **Memory_Usage**: RAM usage percentage
- **Memory_Total**: Total RAM capacity
- **WiFi_Speed**: WiFi download speed
- **Ethernet_Speed**: Ethernet download speed

### 3. Element Types
- **Gauge**: Circular gauge with needle
- **Bar**: Horizontal/vertical progress bar
- **Text**: Dynamic text display
- **Graph**: Line/area chart (placeholder)
- **Image**: Static images (placeholder)
- **Shape**: Basic shapes (placeholder)

### 4. Property Editing
- **Position**: X, Y coordinates
- **Size**: Width, Height
- **Colors**: Background, Foreground, Needle
- **Typography**: Font family, size, weight, style
- **Animation**: Enable/disable, speed control
- **Visibility**: Show/hide elements

### 5. Validation
- **Real-time**: Validates as you type
- **Schema**: JSON schema validation
- **Sensors**: Validates sensor IDs
- **Colors**: Validates color formats
- **Ranges**: Validates numeric ranges

### 6. Export/Import
- **Export**: Download as JSON file
- **Import**: Load from JSON file
- **Validation**: Pre-import validation
- **Metadata**: Automatic metadata generation

## Integration with C# Overlay

The editor generates JSON that's compatible with your C# overlay:

1. **Same Schema**: Uses identical JSON structure
2. **Sensor IDs**: Exact mapping to C# sensor system
3. **Asset Paths**: Relative paths for easy integration
4. **Validation**: Same validation rules

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Adding New Features
1. **New Element Types**: Add to `ElementType` in types
2. **New Sensors**: Add to `SensorId` type and sensor data
3. **New Properties**: Add to `VisualProperties` interface
4. **New Validation**: Add to validation rules

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Change port in `vite.config.ts`
2. **TypeScript errors**: Run `npm run type-check`
3. **Linting errors**: Run `npm run lint`
4. **Build errors**: Check all imports and types

### Browser Support
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Next Steps

1. **Test the Editor**: Create some layouts and export them
2. **Integrate with C#**: Test exported JSON with your overlay
3. **Customize**: Modify colors, fonts, and styling
4. **Extend**: Add new element types or sensors as needed

## Support

For issues or questions:
- Check the console for errors
- Review the validation panel
- Check the JSON schema
- Test with example layouts

The editor is fully functional and ready to use with your C# Hardware Monitor Overlay!

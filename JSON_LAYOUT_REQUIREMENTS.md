# JSON Layout Requirements for Hardware Monitor Overlay

## Current Issue Analysis

Your `layout.json` file has the correct structure but there are specific compatibility issues preventing the elements from displaying properly. Here's what needs to be adjusted:

## ✅ What's Working in Your JSON

```json
{
  "version": "1.0",
  "elements": [
    {
      "id": "gauge_1757094875900",
      "type": "gauge", 
      "sensor": "CPU_Utilization",
      "visual": {
        "x": 940, "y": 0, "width": 100, "height": 100,
        "backgroundColor": "transparent",
        "foregroundColor": "#ffffff",
        "needleColor": "#00ff00",
        "opacity": 1,
        "visible": true
      }
    }
  ]
}
```

**Good aspects:**
- ✅ Root structure with `"elements"` array
- ✅ Element positioning (x, y, width, height)
- ✅ Correct sensor mapping (`"CPU_Utilization"`)
- ✅ Valid JSON syntax
- ✅ Element types (`"gauge"`)

## ❌ Issues That Need Fixing

### 1. **Font Properties Format**
**Current (Wrong):**
```json
"fontWeight": 400,
"fontStyle": 0
```

**Required (Correct):**
```json
"fontWeight": "normal",
"fontStyle": "normal"
```

**Explanation:** The C++ parser expects string values, not numeric values.

### 2. **Missing Required Properties**
Your JSON is missing some properties that the C++ parser expects:

**Add these to each element's `visual` section:**
```json
"visual": {
  // ... your existing properties ...
  "fontFamily": "Consolas",
  "fontSize": 12
}
```

## 🔧 Required JSON Format

Here's the **exact format** your JSON should follow:

```json
{
  "version": "1.0",
  "elements": [
    {
      "id": "gauge_1757094875900",
      "type": "gauge",
      "sensor": "CPU_Utilization",
      "visual": {
        "x": 940,
        "y": 0,
        "width": 100,
        "height": 100,
        "backgroundColor": "transparent",
        "foregroundColor": "#ffffff",
        "needleColor": "#00ff00",
        "opacity": 1,
        "visible": true,
        "fontFamily": "Consolas",
        "fontSize": 12,
        "fontWeight": "normal",
        "fontStyle": "normal"
      },
      "animated": false,
      "animationSpeed": 1
    }
  ]
}
```

## 📋 Complete Property Reference

### Element Structure
```json
{
  "id": "unique_element_id",           // String: Any unique identifier
  "type": "gauge|bar|text",            // String: Element type
  "sensor": "SENSOR_NAME",             // String: Must match exact sensor ID
  "visual": { /* visual properties */ },
  "animated": true|false,              // Boolean: Enable animations
  "animationSpeed": 1.0                // Number: Animation speed multiplier
}
```

### Visual Properties
```json
"visual": {
  "x": 0,                             // Number: X position (pixels)
  "y": 0,                             // Number: Y position (pixels)  
  "width": 100,                       // Number: Width (pixels)
  "height": 100,                      // Number: Height (pixels)
  "backgroundColor": "transparent",    // String: "transparent" or "#RRGGBB"
  "foregroundColor": "#ffffff",       // String: "#RRGGBB" format
  "needleColor": "#00ff00",           // String: "#RRGGBB" format (for gauges)
  "opacity": 1,                       // Number: 0.0 to 1.0
  "visible": true,                    // Boolean: Initial visibility
  "fontFamily": "Consolas",           // String: Font name
  "fontSize": 12,                     // Number: Font size in pixels
  "fontWeight": "normal",             // String: "normal", "bold", "light"
  "fontStyle": "normal"               // String: "normal", "italic"
}
```

## 🎯 Valid Sensor IDs

Your JSON **must** use these **exact** sensor ID strings:

### Working Sensor IDs
```json
"CPU_Utilization"     // CPU usage percentage
"CPU_Temperature"     // CPU temperature
"GPU_Utilization"     // GPU usage percentage
"GPU_Temperature"     // GPU temperature
"GPU_Memory"          // GPU memory total
"Memory_Usage"        // RAM usage percentage
"Memory_Total"        // RAM total capacity
"WiFi_Speed"          // WiFi download speed
"Ethernet_Speed"      // Ethernet speed
```

**❗ Important:** Use these **exact** strings - case sensitive!

## 🖼️ Element Types Supported

### 1. Gauge Elements
```json
{
  "type": "gauge",
  "visual": {
    "needleColor": "#00ff00"  // Required for gauges
  }
}
```

### 2. Bar Elements  
```json
{
  "type": "bar",
  "visual": {
    "backgroundColor": "#333333",  // Bar background
    "foregroundColor": "#00ff00"   // Bar fill color
  }
}
```

### 3. Text Elements
```json
{
  "type": "text", 
  "visual": {
    "fontFamily": "Consolas",     // Required for text
    "fontSize": 14,               // Required for text
    "foregroundColor": "#ffffff"  // Text color
  }
}
```

## 🔄 Fixed Version of Your JSON

Here's your `layout.json` with all necessary fixes:

```json
{
  "version": "1.0",
  "elements": [
    {
      "id": "gauge_1757094875900",
      "type": "gauge",
      "sensor": "CPU_Utilization",
      "visual": {
        "x": 940,
        "y": 0,
        "width": 100,
        "height": 100,
        "backgroundColor": "transparent",
        "foregroundColor": "#ffffff",
        "needleColor": "#00ff00",
        "opacity": 1,
        "visible": true,
        "fontFamily": "Consolas",
        "fontSize": 12,
        "fontWeight": "normal",
        "fontStyle": "normal"
      },
      "animated": false,
      "animationSpeed": 1
    },
    {
      "id": "gauge_1757094875900_copy_1757094898470",
      "type": "gauge",
      "sensor": "CPU_Utilization",
      "visual": {
        "x": 1820,
        "y": 0,
        "width": 100,
        "height": 100,
        "backgroundColor": "transparent",
        "foregroundColor": "#ffffff",
        "needleColor": "#00ff00",
        "opacity": 1,
        "visible": true,
        "fontFamily": "Consolas",
        "fontSize": 12,
        "fontWeight": "normal",
        "fontStyle": "normal"
      },
      "animated": false,
      "animationSpeed": 1
    },
    {
      "id": "gauge_1757094875900_copy_1757094899014",
      "type": "gauge",
      "sensor": "CPU_Utilization",
      "visual": {
        "x": 0,
        "y": 0,
        "width": 100,
        "height": 100,
        "backgroundColor": "transparent",
        "foregroundColor": "#ffffff",
        "needleColor": "#00ff00",
        "opacity": 1,
        "visible": true,
        "fontFamily": "Consolas",
        "fontSize": 12,
        "fontWeight": "normal",
        "fontStyle": "normal"
      },
      "animated": false,
      "animationSpeed": 1
    }
  ],
  "metadata": {
    "version": "1.0",
    "name": "Hardware Monitor Layout",
    "description": "Generated by Hardware Monitor JSON Editor",
    "author": "JSON Editor",
    "created": "2025-09-05T17:55:19.817Z",
    "modified": "2025-09-05T17:55:19.817Z",
    "tags": ["hardware", "monitor", "overlay"],
    "compatibility": {
      "minVersion": "1.0",
      "maxVersion": "2.0"
    }
  }
}
```

## 🚀 Testing Instructions

1. **Update your JSON** with the fixes above
2. **Save as `layout.json`** in the project root directory
3. **Launch HardwareMonitor.exe**
4. **Select "CPU Utilization"** checkbox in the UI
5. **Click "Load JSON Layout"** → select your fixed `layout.json`
6. **Click "Show Overlay"** → should display full-screen with 3 CPU gauges
7. **Toggle CPU Utilization off/on** → gauges should hide/show

## 🎯 Expected Results

✅ **Full-screen overlay** (1920x1080)  
✅ **3 CPU gauges** positioned at (0,0), (940,0), (1820,0)  
✅ **Gauges only visible** when "CPU Utilization" is checked  
✅ **Real-time data** showing actual CPU usage  
✅ **Click-through toggle** working in UI

## ❗ Key Points

- **Don't change sensor IDs** - use exact strings listed above
- **Keep your element IDs** - `"gauge_1757094875900"` format is fine
- **Fix font properties** - use strings not numbers
- **Add missing properties** - fontFamily, fontSize required
- **Test visibility** - toggle sensors to show/hide elements

The main software doesn't need to change its sensor labeling - your JSON just needs to use the correct sensor ID strings that the overlay system expects.


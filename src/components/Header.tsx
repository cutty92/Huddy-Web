import React from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Play, 
  Pause,
  Bug,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadLayout, loadLayoutFromFile, validateFile } from '@/lib/export-import';
import { validateLayout } from '@/lib/validation';
import { CanvasSettings } from './CanvasSettings';

export function Header() {
  const {
    layout,
    currentTool,
    setTool,
    canUndo,
    canRedo,
    undo,
    redo,
    previewMode,
    setPreviewMode,
    showDebug,
    setShowDebug,
    setLayout,
    resetLayout
  } = useEditor();

  const handleNew = () => {
    resetLayout();
    toast.success('New layout created');
  };

  const handleOpen = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file first
        const validation = await validateFile(file);
        if (!validation.valid) {
          toast.error(`Invalid file: ${validation.errors.join(', ')}`);
          return;
        }

        // Load and import layout
        const result = await loadLayoutFromFile(file);
        if (result.success && result.layout) {
          setLayout(result.layout);
          toast.success('Layout imported successfully');
          
          if (result.warnings.length > 0) {
            toast.warning(`Imported with warnings: ${result.warnings.join(', ')}`);
          }
        } else {
          toast.error(`Failed to import layout: ${result.errors.join(', ')}`);
        }
      }
    };
    input.click();
  };

  const handleSave = () => {
    try {
      downloadLayout(layout, 'layout.json', {
        format: 'formatted',
        includeMetadata: true,
        validateBeforeExport: true
      });
      toast.success('Layout exported successfully');
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExport = () => {
    handleSave();
  };

  const handleCreateTestLayout = () => {
    // Create a test layout with multiple elements
    const testLayout = {
      metadata: {
        version: "1.0",
        name: "Test Layout",
        description: "Test layout for C# overlay integration",
        author: "JSON Editor",
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      },
      layout: {
        canvas: {
          width: 1920,
          height: 1080,
          units: "pixels"
        },
        positioning: "absolute",
        scaling: "proportional",
        background: {
          color: "transparent",
          opacity: 0.0
        },
        updateInterval: 1000
      },
      elements: [
        {
          id: "cpu_utilization_gauge",
          type: "gauge",
          enabled: true,
          visible: true,
          position: { x: 100, y: 100, anchor: "top-left", zIndex: 10 },
          size: { width: 150, height: 150 },
          style: {
            colors: {
              primary: "#00ff00",
              secondary: "#ffffff",
              background: "transparent"
            },
            borders: {
              width: 2,
              style: "solid",
              color: "#ffffff",
              radius: 10
            },
            fonts: {
              family: "Consolas",
              size: 12,
              weight: "normal",
              style: "normal"
            }
          },
          sensor: {
            source: "CPU_Utilization",
            unit: "%",
            range: { min: 0, max: 100 },
            thresholds: [
              { value: 70, color: "#ffff00" },
              { value: 85, color: "#ff0000" }
            ]
          },
          animation: {
            enabled: true,
            type: "smooth",
            duration: 300
          }
        },
        {
          id: "gpu_temperature_bar",
          type: "bar",
          enabled: true,
          visible: true,
          position: { x: 300, y: 100, anchor: "top-left", zIndex: 10 },
          size: { width: 200, height: 30 },
          style: {
            colors: {
              primary: "#ff6b35",
              background: "#333333"
            },
            fonts: {
              family: "Consolas",
              size: 12,
              weight: "normal",
              style: "normal"
            }
          },
          sensor: {
            source: "GPU_Temperature",
            unit: "°C",
            range: { min: 30, max: 90 }
          }
        },
        {
          id: "memory_usage_text",
          type: "text",
          enabled: true,
          visible: true,
          position: { x: 100, y: 300, anchor: "top-left", zIndex: 10 },
          size: { width: 200, height: 50 },
          style: {
            colors: {
              primary: "#00ffff"
            },
            fonts: {
              family: "Consolas",
              size: 16,
              weight: "bold",
              style: "normal"
            }
          },
          sensor: {
            source: "Memory_Usage",
            unit: "%",
            formatting: {
              template: "RAM: {value}{unit}"
            }
          }
        }
      ]
    };

    // Update the layout
    setLayout(testLayout);
    toast.success('Test layout created! Ready for export.');
  };

  const handleImport = () => {
    handleOpen();
  };

  // Check if current layout is valid
  const validation = validateLayout(layout);
  const isValid = validation.isValid;
  const errorCount = validation.errors.length;

  const tools = [
    { id: 'select', label: 'Select', icon: '↖' },
    { id: 'gauge', label: 'Gauge', icon: '⭕' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'bar', label: 'Bar', icon: '▬' },
    { id: 'thermometer', label: 'Thermometer', icon: '🌡️' },
    { id: 'battery', label: 'Battery', icon: '🔋' },
    { id: 'led', label: 'LED', icon: '💡' },
    { id: 'cpu_cores', label: 'CPU Cores', icon: '🖥️' }
  ] as const;

  return (
    <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 space-x-4">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">HM</span>
        </div>
        <span className="text-lg font-semibold text-white">Hardware Monitor Editor</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-600" />

      {/* File Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleNew}
          className="btn btn-ghost btn-sm"
          title="New Layout"
        >
          New
        </button>
        <button
          onClick={handleOpen}
          className="btn btn-ghost btn-sm"
          title="Open Layout"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
        <button
          onClick={handleSave}
          className="btn btn-ghost btn-sm"
          title="Save Layout"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          onClick={handleExport}
          className={`btn btn-sm ${isValid ? 'btn-primary' : 'btn-warning'}`}
          title={isValid ? 'Export JSON' : `Export JSON (${errorCount} validation errors)`}
        >
          <Download className="w-4 h-4" />
          <span className="ml-1">Export JSON</span>
          {!isValid && <span className="ml-1 text-xs">({errorCount})</span>}
        </button>
        <button
          onClick={handleCreateTestLayout}
          className="btn btn-secondary btn-sm"
          title="Create Test Layout"
        >
          <Settings className="w-4 h-4" />
          <span className="ml-1">Test Layout</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-600" />

      {/* History Actions */}
      <div className="flex items-center space-x-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="btn btn-ghost btn-sm"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="btn btn-ghost btn-sm"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-600" />

      {/* Tools */}
      <div className="flex items-center space-x-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id as any)}
            className={`btn btn-sm ${
              currentTool === tool.id ? 'btn-primary' : 'btn-ghost'
            }`}
            title={tool.label}
          >
            <span className="text-sm">{tool.icon}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* View Controls */}
      <div className="flex items-center space-x-2">
        <CanvasSettings />
        
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-ghost'}`}
          title={previewMode ? 'Exit Preview' : 'Preview Mode'}
        >
          {previewMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`btn btn-sm ${showDebug ? 'btn-primary' : 'btn-ghost'}`}
          title="Toggle Debug Mode"
        >
          <Bug className="w-4 h-4" />
        </button>
        
        <button
          className="btn btn-ghost btn-sm"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

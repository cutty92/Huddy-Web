import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Element, SensorId } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SENSOR_OPTIONS: { value: SensorId; label: string; category: string }[] = [
  { value: 'CPU_Utilization', label: 'CPU Utilization', category: 'CPU' },
  { value: 'CPU_Temperature', label: 'CPU Temperature', category: 'CPU' },
  { value: 'GPU_Utilization', label: 'GPU Utilization', category: 'GPU' },
  { value: 'GPU_Temperature', label: 'GPU Temperature', category: 'GPU' },
  { value: 'GPU_Memory', label: 'GPU Memory', category: 'GPU' },
  { value: 'Memory_Usage', label: 'Memory Usage', category: 'Memory' },
  { value: 'Memory_Total', label: 'Total Memory', category: 'Memory' },
  { value: 'WiFi_Speed', label: 'WiFi Speed', category: 'Network' },
  { value: 'Ethernet_Speed', label: 'Ethernet Speed', category: 'Network' },
];

const FONT_FAMILIES = [
  'Consolas',
  'Courier New',
  'Monaco',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana'
];

const FONT_WEIGHTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' }
];

const FONT_STYLES = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' }
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-750 transition-colors"
      >
        <span className="font-medium text-white">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface PropertyFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
}

function PropertyField({ label, description, children, error }: PropertyFieldProps) {
  return (
    <div className="space-y-1">
      <label className="property-label">{label}</label>
      {description && (
        <p className="property-description">{description}</p>
      )}
      {children}
      {error && (
        <p className="validation-error">{error}</p>
      )}
    </div>
  );
}

export function PropertiesPanel() {
  const {
    layout,
    selectedElementIds,
    updateElement,
    validationResult,
    canvasWidth,
    canvasHeight
  } = useEditor();

  const selectedElement = selectedElementIds.length === 1 
    ? layout.elements.find(el => el.id === selectedElementIds[0])
    : null;


  if (!selectedElement) {
      return (
    <div className="bg-gray-800 border-l border-gray-700 panel-container">
        <div className="p-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white mb-2">Properties</h3>
          <div className="text-center text-gray-400 py-8">
            <p>Select an element to edit its properties</p>
            <p className="text-xs mt-2">Selected IDs: {selectedElementIds.join(', ') || 'None'}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleVisualUpdate = (updates: Partial<typeof selectedElement.visual>) => {
    updateElement(selectedElement.id, {
      visual: { ...selectedElement.visual, ...updates }
    });
  };

  const handlePositionUpdate = (field: 'x' | 'y', value: number) => {
    updateElement(selectedElement.id, {
      visual: { 
        ...selectedElement.visual, 
        [field]: value 
      }
    });
  };

  const handleSizeUpdate = (field: 'width' | 'height', value: number) => {
    if (aspectRatioLocked) {
      const updates: Partial<Element['visual']> = { [field]: value };
      
      if (field === 'width') {
        // Calculate new height based on locked aspect ratio
        updates.height = value / originalAspectRatio;
      } else {
        // Calculate new width based on locked aspect ratio
        updates.width = value * originalAspectRatio;
      }
      
      updateElement(selectedElement.id, {
        visual: { ...selectedElement.visual, ...updates }
      });
    } else {
      updateElement(selectedElement.id, {
        visual: { 
          ...selectedElement.visual, 
          [field]: value 
        }
      });
    }
  };

  const handleElementUpdate = (updates: Partial<Element>) => {
    updateElement(selectedElement.id, updates);
  };

  // Handle element ID editing with proper focus management
  const [editingId, setEditingId] = useState(false);
  const [tempId, setTempId] = useState(selectedElement.id);
  
  // Aspect ratio lock state
  const [aspectRatioLocked, setAspectRatioLocked] = useState(false);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(
    selectedElement.visual.width / selectedElement.visual.height
  );

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempId(e.target.value);
  };

  const handleIdBlur = () => {
    if (tempId !== selectedElement.id && tempId.trim()) {
      handleElementUpdate({ id: tempId.trim() });
    } else {
      setTempId(selectedElement.id);
    }
    setEditingId(false);
  };

  const handleIdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleIdBlur();
    } else if (e.key === 'Escape') {
      setTempId(selectedElement.id);
      setEditingId(false);
    }
  };

  const handleIdFocus = () => {
    setEditingId(true);
    setTempId(selectedElement.id);
  };

  // Get validation errors for this element
  const elementErrors = validationResult?.errors.filter(
    error => error.path.startsWith(`elements[${layout.elements.indexOf(selectedElement)}]`)
  ) || [];

  return (
    <div className="bg-gray-800 border-l border-gray-700 panel-container">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-lg font-semibold text-white">Properties</h3>
        <p className="text-sm text-gray-400">{selectedElement.id}</p>
      </div>

      {/* Properties */}
      <div className="panel-scrollable scrollbar-thin">
        {/* Basic Properties */}
        <CollapsibleSection title="Basic">
          <PropertyField
            label="Display Name"
            description="User-friendly name for this element (display only)"
          >
            <input
              type="text"
              value={editingId ? tempId : selectedElement.id}
              onChange={handleIdChange}
              onFocus={handleIdFocus}
              onBlur={handleIdBlur}
              onKeyDown={handleIdKeyDown}
              className="input"
            />
          </PropertyField>

          <PropertyField
            label="Element ID"
            description="Internal identifier (read-only)"
          >
            <input
              type="text"
              value={selectedElement.id}
              disabled
              className="input bg-gray-700 text-gray-400"
            />
          </PropertyField>

          <PropertyField
            label="Element Type"
            description="Type of visual element"
          >
            <select
              value={selectedElement.type}
              onChange={(e) => handleElementUpdate({ type: e.target.value as any })}
              className="input"
            >
              <option value="gauge">Gauge</option>
              <option value="bar">Bar</option>
              <option value="text">Text</option>
              <option value="graph">Graph</option>
              <option value="image">Image</option>
              <option value="shape">Shape</option>
            </select>
          </PropertyField>

          <PropertyField
            label="Sensor Binding"
            description="Hardware sensor to display"
          >
            <select
              value={selectedElement.sensor}
              onChange={(e) => handleElementUpdate({ sensor: e.target.value as SensorId })}
              className="input"
            >
              {SENSOR_OPTIONS.map(option => (
                <optgroup key={option.category} label={option.category}>
                  <option value={option.value}>{option.label}</option>
                </optgroup>
              ))}
            </select>
          </PropertyField>

          <PropertyField
            label="Visible"
            description="Whether element is rendered"
          >
            <input
              type="checkbox"
              checked={selectedElement.visual.visible}
              onChange={(e) => handleVisualUpdate({ visible: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            />
          </PropertyField>
        </CollapsibleSection>

        {/* Position & Size */}
        <CollapsibleSection title="Position & Size">
          <div className="space-y-4">
            <PropertyField
              label={`X Position: ${Math.round(selectedElement.visual.x)}`}
              description="Horizontal position in pixels"
            >
              <input
                type="range"
                min="0"
                max={canvasWidth}
                value={selectedElement.visual.x}
                onChange={(e) => handlePositionUpdate('x', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </PropertyField>

            <PropertyField
              label={`Y Position: ${Math.round(selectedElement.visual.y)}`}
              description="Vertical position in pixels"
            >
              <input
                type="range"
                min="0"
                max={canvasHeight}
                value={selectedElement.visual.y}
                onChange={(e) => handlePositionUpdate('y', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </PropertyField>

            <PropertyField
              label="Aspect Ratio Lock"
              description="Maintain width/height ratio when resizing"
            >
              <input
                type="checkbox"
                checked={aspectRatioLocked}
                onChange={(e) => setAspectRatioLocked(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
              />
            </PropertyField>

            <PropertyField
              label={`Width: ${Math.round(selectedElement.visual.width)}`}
              description="Element width in pixels"
            >
              <input
                type="range"
                min="10"
                max="500"
                value={selectedElement.visual.width}
                onChange={(e) => handleSizeUpdate('width', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </PropertyField>

            <PropertyField
              label={`Height: ${Math.round(selectedElement.visual.height)}`}
              description="Element height in pixels"
            >
              <input
                type="range"
                min="10"
                max="500"
                value={selectedElement.visual.height}
                onChange={(e) => handleSizeUpdate('height', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </PropertyField>
          </div>
        </CollapsibleSection>

        {/* Display Options */}
        <CollapsibleSection title="Display Options">
          <PropertyField
            label="Show Text Labels"
            description="Display text labels on this element"
          >
            <input
              type="checkbox"
              checked={selectedElement.visual.showText}
              onChange={(e) => handleVisualUpdate({ showText: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            />
          </PropertyField>
        </CollapsibleSection>

        {/* Colors */}
        <CollapsibleSection title="Colors">
          <PropertyField
            label="Background Color"
            description="Element background color"
          >
            <input
              type="color"
              value={selectedElement.visual.backgroundColor === 'transparent' ? '#000000' : selectedElement.visual.backgroundColor}
              onChange={(e) => handleVisualUpdate({ backgroundColor: e.target.value })}
              className="w-full h-10 rounded border border-gray-600"
            />
            <input
              type="text"
              value={selectedElement.visual.backgroundColor}
              onChange={(e) => handleVisualUpdate({ backgroundColor: e.target.value })}
              className="input mt-2"
              placeholder="transparent, #000000, rgb(0,0,0)"
            />
          </PropertyField>

          <PropertyField
            label="Foreground Color"
            description="Text and foreground color"
          >
            <input
              type="color"
              value={selectedElement.visual.foregroundColor}
              onChange={(e) => handleVisualUpdate({ foregroundColor: e.target.value })}
              className="w-full h-10 rounded border border-gray-600"
            />
            <input
              type="text"
              value={selectedElement.visual.foregroundColor}
              onChange={(e) => handleVisualUpdate({ foregroundColor: e.target.value })}
              className="input mt-2"
              placeholder="#ffffff"
            />
          </PropertyField>

          <PropertyField
            label="Needle Color"
            description="Gauge needle color"
          >
            <input
              type="color"
              value={selectedElement.visual.needleColor}
              onChange={(e) => handleVisualUpdate({ needleColor: e.target.value })}
              className="w-full h-10 rounded border border-gray-600"
            />
            <input
              type="text"
              value={selectedElement.visual.needleColor}
              onChange={(e) => handleVisualUpdate({ needleColor: e.target.value })}
              className="input mt-2"
              placeholder="#00ff00"
            />
          </PropertyField>

          <PropertyField
            label="Opacity"
            description="Element transparency (0.0 - 1.0)"
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement.visual.opacity}
              onChange={(e) => handleVisualUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="text-xs text-gray-400 text-center">
              {Math.round(selectedElement.visual.opacity * 100)}%
            </div>
          </PropertyField>
        </CollapsibleSection>

        {/* Typography */}
        <CollapsibleSection title="Typography">
          <PropertyField
            label="Font Family"
            description="Text font family"
          >
            <select
              value={selectedElement.visual.fontFamily}
              onChange={(e) => handleVisualUpdate({ fontFamily: e.target.value })}
              className="input"
            >
              {FONT_FAMILIES.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </PropertyField>

          <div className="grid grid-cols-2 gap-3">
            <PropertyField
              label="Font Size"
              description="Text size in pixels"
            >
              <input
                type="number"
                value={selectedElement.visual.fontSize}
                onChange={(e) => handleVisualUpdate({ fontSize: parseFloat(e.target.value) || 12 })}
                className="input"
                step="1"
                min="8"
                max="72"
              />
            </PropertyField>

            <PropertyField
              label="Font Weight"
              description="Text weight"
            >
              <select
                value={selectedElement.visual.fontWeight}
                onChange={(e) => handleVisualUpdate({ fontWeight: e.target.value })}
                className="input"
              >
                {FONT_WEIGHTS.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </PropertyField>
          </div>

          <PropertyField
            label="Font Style"
            description="Text style"
          >
              <select
                value={selectedElement.visual.fontStyle}
                onChange={(e) => handleVisualUpdate({ fontStyle: e.target.value })}
                className="input"
              >
                {FONT_STYLES.map(style => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
          </PropertyField>
        </CollapsibleSection>

        {/* Animation */}
        <CollapsibleSection title="Animation">
          <PropertyField
            label="Animated"
            description="Enable animations for this element"
          >
            <input
              type="checkbox"
              checked={selectedElement.animated}
              onChange={(e) => handleElementUpdate({ animated: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            />
          </PropertyField>

          {selectedElement.animated && (
            <PropertyField
              label="Animation Speed"
              description="Animation speed multiplier"
            >
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={selectedElement.animationSpeed}
                onChange={(e) => handleElementUpdate({ animationSpeed: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-xs text-gray-400 text-center">
                {selectedElement.animationSpeed}x
              </div>
            </PropertyField>
          )}
        </CollapsibleSection>
      </div>

      {/* Validation Errors */}
      {elementErrors.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-red-900 bg-opacity-20">
          <h4 className="text-sm font-medium text-red-400 mb-2">Validation Errors</h4>
          <div className="space-y-1">
            {elementErrors.map((error, index) => (
              <div key={index} className="text-xs text-red-300">
                {error.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

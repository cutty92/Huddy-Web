import React, { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { 
  Layers, 
  Image, 
  Activity, 
  Settings,
  Copy,
  Trash2,
  Edit3,
  Check,
  X
} from 'lucide-react';

export function Sidebar() {
  const {
    layout,
    selectedElementIds,
    selectElement,
    removeElement,
    duplicateElement,
    clearSelection,
    updateElement
  } = useEditor();

  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });
  const [editSize, setEditSize] = useState({ width: 0, height: 0 });

  const handleElementClick = (elementId: string) => {
    selectElement(elementId);
  };

  const handleElementDoubleClick = (elementId: string) => {
    // Focus on element in canvas
    selectElement(elementId);
  };


  const handleDuplicateElement = (elementId: string) => {
    duplicateElement(elementId);
  };

  const handleDeleteElement = (elementId: string) => {
    removeElement(elementId);
  };

  const [editingElement, setEditingElement] = useState<string | null>(null);

  const handleStartEditPosition = (elementId: string, element: any) => {
    setEditingElement(elementId);
    setEditPosition({ x: element.visual.x, y: element.visual.y });
  };

  const handleStartEditSize = (elementId: string, element: any) => {
    setEditingElement(elementId);
    setEditSize({ width: element.visual.width, height: element.visual.height });
  };

  const handleConfirmPosition = () => {
    if (editingElement) {
      updateElement(editingElement, {
        visual: {
          ...layout.elements.find(el => el.id === editingElement)!.visual,
          x: editPosition.x,
          y: editPosition.y
        }
      });
      setEditingElement(null);
    }
  };

  const handleConfirmSize = () => {
    if (editingElement) {
      updateElement(editingElement, {
        visual: {
          ...layout.elements.find(el => el.id === editingElement)!.visual,
          width: editSize.width,
          height: editSize.height
        }
      });
      setEditingElement(null);
    }
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 panel-container">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Elements</h2>
        <p className="text-sm text-gray-400">
          {layout.elements.length} element{layout.elements.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Element List */}
      <div className="panel-scrollable scrollbar-thin">
        {layout.elements.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No elements yet</p>
            <p className="text-xs">Add elements using the tools above</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {layout.elements.map((element) => (
              <div
                key={element.id}
                className={`group p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedElementIds.includes(element.id)
                    ? 'bg-primary-600 border-primary-500'
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'
                }`}
                onClick={() => handleElementClick(element.id)}
                onDoubleClick={() => handleElementDoubleClick(element.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs">
                      {element.type === 'gauge' && '⭕'}
                      {element.type === 'bar' && '▬'}
                      {element.type === 'text' && 'T'}
                      {element.type === 'graph' && '📊'}
                      {element.type === 'image' && '🖼️'}
                      {element.type === 'shape' && '⬜'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-white truncate">
                        {element.id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {element.type} • {element.sensor}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateElement(element.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                {/* Delete button on its own line */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteElement(element.id);
                    }}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Element"
                  >
                    Delete
                  </button>
                </div>
                
                {/* Element Properties Preview */}
                <div className="mt-2 text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>Position:</span>
                    {editingElement === element.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={editPosition.x}
                          onChange={(e) => setEditPosition({...editPosition, x: parseFloat(e.target.value) || 0})}
                          className="input text-xs h-5 w-12 px-1"
                          placeholder="X"
                        />
                        <input
                          type="number"
                          value={editPosition.y}
                          onChange={(e) => setEditPosition({...editPosition, y: parseFloat(e.target.value) || 0})}
                          className="input text-xs h-5 w-12 px-1"
                          placeholder="Y"
                        />
                        <button
                          onClick={handleConfirmPosition}
                          className="p-1 hover:bg-green-600 rounded"
                          title="Apply"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span>{Math.round(element.visual.x)}, {Math.round(element.visual.y)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditPosition(element.id, element);
                          }}
                          className="p-1 hover:bg-gray-600 rounded"
                          title="Edit Position"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Size:</span>
                    {editingElement === element.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={editSize.width}
                          onChange={(e) => setEditSize({...editSize, width: parseFloat(e.target.value) || 0})}
                          className="input text-xs h-5 w-12 px-1"
                          placeholder="W"
                        />
                        <input
                          type="number"
                          value={editSize.height}
                          onChange={(e) => setEditSize({...editSize, height: parseFloat(e.target.value) || 0})}
                          className="input text-xs h-5 w-12 px-1"
                          placeholder="H"
                        />
                        <button
                          onClick={handleConfirmSize}
                          className="p-1 hover:bg-green-600 rounded"
                          title="Apply"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span>{Math.round(element.visual.width)} × {Math.round(element.visual.height)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditSize(element.id, element);
                          }}
                          className="p-1 hover:bg-gray-600 rounded"
                          title="Edit Size"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {element.animated && (
                    <div className="flex justify-between">
                      <span>Animation:</span>
                      <span>{element.animationSpeed}x</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={clearSelection}
          className="btn btn-secondary btn-sm w-full"
          disabled={selectedElementIds.length === 0}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}

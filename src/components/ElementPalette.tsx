import React, { useState } from 'react';
import { ELEMENT_CATEGORIES, ELEMENT_DEFINITIONS, getElementsByCategory } from '@/lib/element-definitions';
import { ElementType } from '@/types';

interface ElementPaletteProps {
  onElementSelect: (elementType: ElementType) => void;
}

export function ElementPalette({ onElementSelect }: ElementPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic']));
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleElementClick = (elementType: ElementType) => {
    setSelectedElement(elementType);
    onElementSelect(elementType);
  };

  const filteredCategories = ELEMENT_CATEGORIES.map(category => ({
    ...category,
    elements: category.elements.filter(elementType => {
      const definition = ELEMENT_DEFINITIONS[elementType];
      return definition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             definition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             elementType.toLowerCase().includes(searchQuery.toLowerCase());
    })
  })).filter(category => category.elements.length > 0);

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 panel-container">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Element Palette</h2>
        <p className="text-sm text-gray-400">
          Drag elements to canvas
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <input
          type="text"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="panel-scrollable scrollbar-thin">
        {filteredCategories.map((category) => (
          <div key={category.id} className="border-b border-gray-700">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-white">{category.name}</span>
                <span className="text-xs text-gray-400">({category.elements.length})</span>
              </div>
              <span className={`transform transition-transform ${
                expandedCategories.has(category.id) ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </button>

            {expandedCategories.has(category.id) && (
              <div className="px-4 pb-2 space-y-1">
                {category.elements.map((elementType) => {
                  const definition = ELEMENT_DEFINITIONS[elementType];
                  const isSelected = selectedElement === elementType;
                  
                  return (
                    <div
                      key={elementType}
                      onClick={() => handleElementClick(elementType)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500'
                          : 'bg-gray-750 border-gray-600 hover:bg-gray-700'
                      } border`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-sm">{definition.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">
                            {definition.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {definition.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Element Info */}
      {selectedElement && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <div className="text-sm font-medium text-white mb-2">
            {ELEMENT_DEFINITIONS[selectedElement].name}
          </div>
          <div className="text-xs text-gray-400 mb-2">
            {ELEMENT_DEFINITIONS[selectedElement].description}
          </div>
          <div className="text-xs text-gray-500">
            Size: {ELEMENT_DEFINITIONS[selectedElement].defaultSize.width}×{ELEMENT_DEFINITIONS[selectedElement].defaultSize.height}px
          </div>
        </div>
      )}
    </div>
  );
}



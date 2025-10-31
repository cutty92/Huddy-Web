import React from 'react';
import { ElementPalette } from './ElementPalette';
import { useEditor } from '@/contexts/EditorContext';
import { ElementType } from '@/types';

export function ElementPaletteWrapper() {
  const { setTool } = useEditor();

  const handleElementSelect = (elementType: ElementType) => {
    // Set the current tool to the selected element type
    setTool(elementType);
  };

  return <ElementPalette onElementSelect={handleElementSelect} />;
}

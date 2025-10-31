import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { EditorProvider, useEditor } from './contexts/EditorContext';
import { LayoutEditor } from './components/LayoutEditor';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ElementPalette } from './components/ElementPalette';
import { ElementPaletteWrapper } from './components/ElementPaletteWrapper';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ValidationPanel } from './components/ValidationPanel';
import { AssetManager } from './components/AssetManager';

function AppContent() {
  const { selectedElementIds, removeElement } = useEditor();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Delete key to remove selected elements
      if (event.key === 'Delete' && selectedElementIds.length > 0) {
        event.preventDefault();
        selectedElementIds.forEach(elementId => {
          removeElement(elementId);
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElementIds, removeElement]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      <Header />
      
      <div className="flex-1 grid grid-cols-[250px_250px_1fr_320px] overflow-hidden h-full">
        <ElementPaletteWrapper />
        
        <Sidebar />
        
        <div className="relative overflow-hidden">
          <Canvas />
        </div>
        
        <div className="flex flex-col border-l border-gray-700 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <PropertiesPanel />
            <ValidationPanel />
            <AssetManager />
          </div>
        </div>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <EditorProvider>
      <AppContent />
    </EditorProvider>
  );
}

export default App;

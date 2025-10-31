import React, { createContext, useContext, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { sensorSimulator } from '@/lib/sensor-data';

// Create context
const EditorContext = createContext<ReturnType<typeof useEditorStore> | undefined>(undefined);

// Provider component
export function EditorProvider({ children }: { children: React.ReactNode }) {
  const store = useEditorStore();

  // Start sensor simulation when component mounts
  useEffect(() => {
    sensorSimulator.startSimulation(1000);
    
    return () => {
      sensorSimulator.stopSimulation();
    };
  }, []);

  return (
    <EditorContext.Provider value={store}>
      {children}
    </EditorContext.Provider>
  );
}

// Hook to use the editor store
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

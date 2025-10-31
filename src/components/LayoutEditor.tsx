import React, { useEffect } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { sensorSimulator } from '@/lib/sensor-data';

export function LayoutEditor() {
  const { validateLayout } = useEditor();

  // Validate layout whenever it changes
  useEffect(() => {
    validateLayout();
  }, [validateLayout]);

  // Subscribe to sensor data updates for real-time preview
  useEffect(() => {
    const unsubscribe = sensorSimulator.subscribe(() => {
      // Force re-render when sensor data changes
      // This will be handled by individual components
    });

    return unsubscribe;
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* This component is just a container - the actual layout is in App.tsx */}
      <div className="flex-1 flex">
        {/* Content will be rendered by App.tsx */}
      </div>
    </div>
  );
}

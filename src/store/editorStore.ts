import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LayoutData, Element, EditorState, EditorTool, ValidationResult, HistoryAction, ElementType, SensorId } from '@/types';
import { validateLayout } from '@/lib/validation';
import { sensorSimulator } from '@/lib/sensor-data';
import { ELEMENT_DEFINITIONS } from '@/lib/element-definitions';

// Default layout
const defaultLayout: LayoutData = {
  version: '1.0',
  elements: []
};

// Editor store interface
interface EditorStore extends EditorState {
  // Layout actions
  setLayout: (layout: LayoutData) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  addElement: (element: Element) => void;
  createElement: (type: ElementType, x: number, y: number, sensor?: SensorId) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  
  // Selection actions
  selectElement: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  
  // Editor actions
  setTool: (tool: EditorTool) => void;
  setSnapToGrid: (enabled: boolean) => void;
  setGridSize: (size: number) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  
  // UI actions
  setShowDebug: (show: boolean) => void;
  setPreviewMode: (mode: boolean) => void;
  
  // Canvas actions
  setCanvasSize: (width: number, height: number) => void;
  setShowBackground: (show: boolean) => void;
  setBackgroundImage: (image: string) => void;
  
  // Validation actions
  validateLayout: () => ValidationResult;
  validationResult: ValidationResult | null;
  
  // History actions
  pushHistory: (action: HistoryAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Clipboard actions
  copySelected: () => void;
  paste: () => void;
  cutSelected: () => void;
  
  // Utility actions
  resetLayout: () => void;
  exportLayout: () => string;
  importLayout: (json: string) => boolean;
}

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      layout: defaultLayout,
      selectedElementIds: [],
      clipboard: [],
      currentTool: 'select',
      snapToGrid: true,
      gridSize: 20,
      zoom: 1.0,
      pan: { x: 0, y: 0 },
      showDebug: false,
      previewMode: false,
      validationResult: null,
      canUndo: false,
      canRedo: false,
      // Canvas settings
      canvasWidth: 1920,
      canvasHeight: 1080,
      showBackground: false,
      backgroundImage: '',

      // Layout actions
      setLayout: (layout) => {
        set({ layout });
        get().validateLayout();
      },

      updateElement: (id, updates) => {
        const state = get();
        const newLayout = {
          ...state.layout,
          elements: state.layout.elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
          )
        };
        
        set({ layout: newLayout });
        get().validateLayout();
      },

      addElement: (element) => {
        const state = get();
        const newLayout = {
          ...state.layout,
          elements: [...state.layout.elements, element]
        };
        
        set({ layout: newLayout });
        get().validateLayout();
      },

      createElement: (type, x, y, sensor) => {
        const definition = ELEMENT_DEFINITIONS[type];
        if (!definition) return;

        const element: Element = {
          id: `${type}_${Date.now()}`,
          type,
          sensor: sensor || definition.suggestedSensors[0] || 'CPU_Utilization',
          visual: {
            x,
            y,
            width: definition.defaultSize.width,
            height: definition.defaultSize.height,
            backgroundColor: '#333333',
            foregroundColor: '#ffffff',
            needleColor: '#00ff00',
            opacity: 1,
            visible: true,
            showText: true,
            fontFamily: 'Consolas',
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal'
          },
          animated: false,
          animationSpeed: 1
        };

        get().addElement(element);
      },

      removeElement: (id) => {
        const state = get();
        const newLayout = {
          ...state.layout,
          elements: state.layout.elements.filter(el => el.id !== id)
        };
        
        set({ 
          layout: newLayout,
          selectedElementIds: state.selectedElementIds.filter(selectedId => selectedId !== id)
        });
        get().validateLayout();
      },

      duplicateElement: (id) => {
        const state = get();
        const element = state.layout.elements.find(el => el.id === id);
        if (element) {
          const duplicated = {
            ...element,
            id: `${element.id}_copy_${Date.now()}`,
            visual: {
              ...element.visual,
              x: element.visual.x + 20,
              y: element.visual.y + 20
            }
          };
          get().addElement(duplicated);
        }
      },

      // Selection actions
      selectElement: (id) => {
        set({ selectedElementIds: [id] });
      },

      selectMultiple: (ids) => {
        set({ selectedElementIds: ids });
      },

      clearSelection: () => {
        set({ selectedElementIds: [] });
      },

      toggleSelection: (id) => {
        const state = get();
        const isSelected = state.selectedElementIds.includes(id);
        if (isSelected) {
          set({ selectedElementIds: state.selectedElementIds.filter(selectedId => selectedId !== id) });
        } else {
          set({ selectedElementIds: [...state.selectedElementIds, id] });
        }
      },

      // Editor actions
      setTool: (tool) => {
        set({ currentTool: tool });
      },

      setSnapToGrid: (enabled) => {
        set({ snapToGrid: enabled });
      },

      setGridSize: (size) => {
        set({ gridSize: Math.max(5, Math.min(100, size)) });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.1, Math.min(5.0, zoom)) });
      },

      setPan: (pan) => {
        set({ pan });
      },

      // UI actions
      setShowDebug: (show) => {
        set({ showDebug: show });
      },

      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },

      // Canvas actions
      setCanvasSize: (width, height) => {
        set({ canvasWidth: width, canvasHeight: height });
      },

      setShowBackground: (show) => {
        set({ showBackground: show });
      },

      setBackgroundImage: (image) => {
        set({ backgroundImage: image });
      },

      // Validation actions
      validateLayout: () => {
        const state = get();
        const result = validateLayout(state.layout);
        set({ validationResult: result });
        return result;
      },

      // History actions
      pushHistory: (action) => {
        // Implementation would go here
        // For now, just update the canUndo/canRedo flags
        set({ canUndo: true, canRedo: false });
      },

      undo: () => {
        // Implementation would go here
        set({ canUndo: false, canRedo: true });
      },

      redo: () => {
        // Implementation would go here
        set({ canUndo: true, canRedo: false });
      },

      // Clipboard actions
      copySelected: () => {
        const state = get();
        const selectedElements = state.layout.elements.filter(el =>
          state.selectedElementIds.includes(el.id)
        );
        set({ clipboard: selectedElements });
      },

      paste: () => {
        const state = get();
        const pastedElements = state.clipboard.map(el => ({
          ...el,
          id: `${el.id}_paste_${Date.now()}`,
          visual: {
            ...el.visual,
            x: el.visual.x + 20,
            y: el.visual.y + 20
          }
        }));
        
        const newLayout = {
          ...state.layout,
          elements: [...state.layout.elements, ...pastedElements]
        };
        
        set({ layout: newLayout });
        get().validateLayout();
      },

      cutSelected: () => {
        get().copySelected();
        const state = get();
        state.selectedElementIds.forEach(id => {
          get().removeElement(id);
        });
      },

      // Utility actions
      resetLayout: () => {
        set({ layout: defaultLayout, selectedElementIds: [] });
        get().validateLayout();
      },

      exportLayout: () => {
        const state = get();
        return JSON.stringify(state.layout, null, 2);
      },

      importLayout: (json) => {
        try {
          const layout = JSON.parse(json);
          get().setLayout(layout);
          return true;
        } catch (error) {
          console.error('Failed to import layout:', error);
          return false;
        }
      }
    }),
    {
      name: 'editor-store',
    }
  )
);

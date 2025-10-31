import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import { LayoutData, ValidationResult, ValidationError, SensorId } from '@/types';
import overlayLayoutSchema from '@schema/overlay-layout.schema.json';

// Initialize AJV with formats and error messages
const ajv = new Ajv({ 
  allErrors: true,
  verbose: true,
  strict: false
});
addFormats(ajv);
addErrors(ajv);

// Compile the schema
const validateSchema = ajv.compile(overlayLayoutSchema);

// Valid sensor IDs from the C# implementation and extended specification
const VALID_SENSOR_IDS: SensorId[] = [
  // CPU Sensors
  'CPU_Utilization', 'CPU_Temperature', 'CPU_Power', 'CPU_Voltage', 'CPU_Clock',
  'CPU_Core_0', 'CPU_Core_1', 'CPU_Core_2', 'CPU_Core_3', 'CPU_Core_4', 'CPU_Core_5', 'CPU_Core_6', 'CPU_Core_7',
  // GPU Sensors
  'GPU_Utilization', 'GPU_Temperature', 'GPU_Memory', 'GPU_Power', 'GPU_Clock', 'GPU_Fan',
  // Memory Sensors
  'Memory_Usage', 'Memory_Total', 'Memory_Available', 'Memory_Bandwidth',
  // Network Sensors
  'WiFi_Speed', 'Ethernet_Speed', 'Network_Upload', 'Network_Download',
  // Storage Sensors
  'Disk_Usage', 'Disk_Temperature', 'Disk_Read', 'Disk_Write',
  // System Sensors
  'Motherboard_Temperature', 'Fan_CPU', 'Fan_Case_1', 'Fan_Case_2',
  'PSU_Power', 'PSU_Voltage_12V', 'PSU_Voltage_5V'
];

// Color validation regex
const COLOR_REGEX = /^(transparent|#[0-9a-fA-F]{3,6}|rgb\(\d+,\s*\d+,\s*\d+\)|rgba\(\d+,\s*\d+,\s*\d+,\s*[0-9.]+\)|hsl\(\d+,\s*\d+%,\s*\d+%\)|hsla\(\d+,\s*\d+%,\s*\d+%,\s*[0-9.]+\))$/;

// Validate layout against schema
export function validateLayout(layout: LayoutData): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Schema validation
  const valid = validateSchema(layout);
  if (!valid) {
    const schemaErrors = validateSchema.errors || [];
    schemaErrors.forEach(error => {
      errors.push({
        path: error.instancePath || 'root',
        message: error.message || 'Unknown validation error',
        severity: 'error'
      });
    });
  }

  // Custom validation rules
  if (layout.elements) {
    layout.elements.forEach((element, index) => {
      const elementPath = `elements[${index}]`;

      // Validate sensor ID
      if (element.sensor && !VALID_SENSOR_IDS.includes(element.sensor)) {
        warnings.push({
          path: `${elementPath}.sensor`,
          message: `Unknown sensor ID: ${element.sensor}. Valid sensors: ${VALID_SENSOR_IDS.join(', ')}`,
          severity: 'warning'
        });
      }

      // Validate element ID uniqueness
      const duplicateIds = layout.elements.filter(el => el.id === element.id);
      if (duplicateIds.length > 1) {
        errors.push({
          path: `${elementPath}.id`,
          message: `Duplicate element ID: ${element.id}`,
          severity: 'error'
        });
      }

      // Validate visual properties
      if (element.visual) {
        const visualPath = `${elementPath}.visual`;

        // Validate colors
        if (element.visual.backgroundColor && !COLOR_REGEX.test(element.visual.backgroundColor)) {
          errors.push({
            path: `${visualPath}.backgroundColor`,
            message: `Invalid color format: ${element.visual.backgroundColor}`,
            severity: 'error'
          });
        }

        if (element.visual.foregroundColor && !COLOR_REGEX.test(element.visual.foregroundColor)) {
          errors.push({
            path: `${visualPath}.foregroundColor`,
            message: `Invalid color format: ${element.visual.foregroundColor}`,
            severity: 'error'
          });
        }

        if (element.visual.needleColor && !COLOR_REGEX.test(element.visual.needleColor)) {
          errors.push({
            path: `${visualPath}.needleColor`,
            message: `Invalid color format: ${element.visual.needleColor}`,
            severity: 'error'
          });
        }

        // Validate numeric ranges
        if (element.visual.opacity < 0 || element.visual.opacity > 1) {
          errors.push({
            path: `${visualPath}.opacity`,
            message: `Opacity must be between 0 and 1, got: ${element.visual.opacity}`,
            severity: 'error'
          });
        }

        if (element.visual.fontSize < 8 || element.visual.fontSize > 72) {
          warnings.push({
            path: `${visualPath}.fontSize`,
            message: `Font size should be between 8 and 72 pixels, got: ${element.visual.fontSize}`,
            severity: 'warning'
          });
        }

        // Validate font weight (now string)
        const validFontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
        if (!validFontWeights.includes(element.visual.fontWeight)) {
          errors.push({
            path: `${visualPath}.fontWeight`,
            message: `Font weight must be one of: ${validFontWeights.join(', ')}, got: ${element.visual.fontWeight}`,
            severity: 'error'
          });
        }

        // Validate font style (now string)
        const validFontStyles = ['normal', 'italic', 'oblique'];
        if (!validFontStyles.includes(element.visual.fontStyle)) {
          errors.push({
            path: `${visualPath}.fontStyle`,
            message: `Font style must be one of: ${validFontStyles.join(', ')}, got: ${element.visual.fontStyle}`,
            severity: 'error'
          });
        }

        // Validate dimensions
        if (element.visual.width <= 0) {
          errors.push({
            path: `${visualPath}.width`,
            message: `Width must be greater than 0, got: ${element.visual.width}`,
            severity: 'error'
          });
        }

        if (element.visual.height <= 0) {
          errors.push({
            path: `${visualPath}.height`,
            message: `Height must be greater than 0, got: ${element.visual.height}`,
            severity: 'error'
          });
        }

        if (element.visual.x < 0) {
          warnings.push({
            path: `${visualPath}.x`,
            message: `X position is negative: ${element.visual.x}`,
            severity: 'warning'
          });
        }

        if (element.visual.y < 0) {
          warnings.push({
            path: `${visualPath}.y`,
            message: `Y position is negative: ${element.visual.y}`,
            severity: 'warning'
          });
        }
      }

      // Validate animation properties
      if (element.animated && element.animationSpeed) {
        if (element.animationSpeed < 0.1 || element.animationSpeed > 10.0) {
          warnings.push({
            path: `${elementPath}.animationSpeed`,
            message: `Animation speed should be between 0.1 and 10.0, got: ${element.animationSpeed}`,
            severity: 'warning'
          });
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Validate individual element
export function validateElement(element: any, allElements: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check required fields
  if (!element.id) {
    errors.push({
      path: 'id',
      message: 'Element ID is required',
      severity: 'error'
    });
  }

  if (!element.type) {
    errors.push({
      path: 'type',
      message: 'Element type is required',
      severity: 'error'
    });
  }

  if (!element.sensor) {
    errors.push({
      path: 'sensor',
      message: 'Sensor binding is required',
      severity: 'error'
    });
  }

  if (!element.visual) {
    errors.push({
      path: 'visual',
      message: 'Visual properties are required',
      severity: 'error'
    });
  }

  // Check for duplicate IDs
  const duplicateCount = allElements.filter(el => el.id === element.id).length;
  if (duplicateCount > 1) {
    errors.push({
      path: 'id',
      message: `Duplicate element ID: ${element.id}`,
      severity: 'error'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Validate sensor ID
export function validateSensorId(sensorId: string): boolean {
  return VALID_SENSOR_IDS.includes(sensorId as SensorId);
}

// Get validation error message for a specific path
export function getValidationError(path: string, errors: ValidationError[]): ValidationError | null {
  return errors.find(error => error.path === path) || null;
}

// Get all validation errors for a specific path
export function getValidationErrors(path: string, errors: ValidationError[]): ValidationError[] {
  return errors.filter(error => error.path.startsWith(path));
}

// Format validation error for display
export function formatValidationError(error: ValidationError): string {
  const path = error.path === 'root' ? 'Layout' : error.path;
  return `${path}: ${error.message}`;
}

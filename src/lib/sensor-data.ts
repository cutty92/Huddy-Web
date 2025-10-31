import { MockSensorData, SensorData, SensorId } from '@/types';

// Mock sensor data based on the C# overlay implementation
export const mockSensorData: MockSensorData = {
  // CPU Sensors
  'CPU_Utilization': { value: 45.2, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Temperature': { value: 62.8, min: 30, max: 90, unit: '°C', isValid: true },
  'CPU_Power': { value: 65.5, min: 0, max: 150, unit: 'W', isValid: true },
  'CPU_Voltage': { value: 1.25, min: 0.8, max: 1.5, unit: 'V', isValid: true },
  'CPU_Clock': { value: 3600, min: 800, max: 5000, unit: 'MHz', isValid: true },
  'CPU_Core_0': { value: 45.2, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_1': { value: 38.7, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_2': { value: 52.1, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_3': { value: 41.3, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_4': { value: 35.8, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_5': { value: 48.9, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_6': { value: 43.2, min: 0, max: 100, unit: '%', isValid: true },
  'CPU_Core_7': { value: 39.6, min: 0, max: 100, unit: '%', isValid: true },

  // GPU Sensors
  'GPU_Utilization': { value: 78.5, min: 0, max: 100, unit: '%', isValid: true },
  'GPU_Temperature': { value: 71.2, min: 30, max: 95, unit: '°C', isValid: true },
  'GPU_Memory': { value: 8.4, min: 0, max: 12, unit: 'GB', isValid: true },
  'GPU_Power': { value: 180.3, min: 0, max: 300, unit: 'W', isValid: true },
  'GPU_Clock': { value: 1950, min: 300, max: 2500, unit: 'MHz', isValid: true },
  'GPU_Fan': { value: 1200, min: 0, max: 3000, unit: 'RPM', isValid: true },

  // Memory Sensors
  'Memory_Usage': { value: 67.3, min: 0, max: 100, unit: '%', isValid: true },
  'Memory_Total': { value: 32.0, min: 0, max: 32, unit: 'GB', isValid: true },
  'Memory_Available': { value: 10.5, min: 0, max: 32, unit: 'GB', isValid: true },
  'Memory_Bandwidth': { value: 45.2, min: 0, max: 100, unit: '%', isValid: true },

  // Network Sensors
  'WiFi_Speed': { value: 125.7, min: 0, max: 1000, unit: 'Mbps', isValid: true },
  'Ethernet_Speed': { value: 0, min: 0, max: 1000, unit: 'Mbps', isValid: true },
  'Network_Upload': { value: 12.3, min: 0, max: 100, unit: 'MB/s', isValid: true },
  'Network_Download': { value: 45.7, min: 0, max: 100, unit: 'MB/s', isValid: true },

  // Storage Sensors
  'Disk_Usage': { value: 68.5, min: 0, max: 100, unit: '%', isValid: true },
  'Disk_Temperature': { value: 42.1, min: 20, max: 60, unit: '°C', isValid: true },
  'Disk_Read': { value: 15.2, min: 0, max: 200, unit: 'MB/s', isValid: true },
  'Disk_Write': { value: 8.7, min: 0, max: 200, unit: 'MB/s', isValid: true },

  // System Sensors
  'Motherboard_Temperature': { value: 38.5, min: 20, max: 70, unit: '°C', isValid: true },
  'Fan_CPU': { value: 1200, min: 0, max: 3000, unit: 'RPM', isValid: true },
  'Fan_Case_1': { value: 800, min: 0, max: 2000, unit: 'RPM', isValid: true },
  'Fan_Case_2': { value: 750, min: 0, max: 2000, unit: 'RPM', isValid: true },
  'PSU_Power': { value: 245.8, min: 0, max: 750, unit: 'W', isValid: true },
  'PSU_Voltage_12V': { value: 12.1, min: 11.4, max: 12.6, unit: 'V', isValid: true },
  'PSU_Voltage_5V': { value: 5.05, min: 4.75, max: 5.25, unit: 'V', isValid: true }
};

// Sensor data simulation class
export class SensorDataSimulator {
  private data: MockSensorData;
  private interval: number | null = null;
  private callbacks: ((data: MockSensorData) => void)[] = [];

  constructor(initialData: MockSensorData = mockSensorData) {
    this.data = { ...initialData };
  }

  // Start simulation with realistic sensor value changes
  startSimulation(intervalMs: number = 1000) {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.updateSensorData();
      this.notifyCallbacks();
    }, intervalMs);
  }

  // Stop simulation
  stopSimulation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Get current sensor value
  getSensorValue(sensorId: SensorId): number {
    return this.data[sensorId]?.value || 0;
  }

  // Get current sensor data
  getSensorData(sensorId: SensorId): SensorData | null {
    return this.data[sensorId] || null;
  }

  // Get all sensor data
  getAllSensorData(): MockSensorData {
    return { ...this.data };
  }

  // Subscribe to sensor data updates
  subscribe(callback: (data: MockSensorData) => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  // Update sensor data with realistic changes
  private updateSensorData() {
    const now = Date.now();
    
    // CPU Utilization - varies between 20-80% with occasional spikes
    this.data.CPU_Utilization.value = Math.max(0, Math.min(100, 
      this.data.CPU_Utilization.value + (Math.random() - 0.5) * 10
    ));

    // CPU Temperature - correlates with utilization, 30-90°C range
    const cpuTempBase = 30 + (this.data.CPU_Utilization.value * 0.6);
    this.data.CPU_Temperature.value = Math.max(30, Math.min(90,
      cpuTempBase + (Math.random() - 0.5) * 5
    ));

    // CPU Power - correlates with utilization
    this.data.CPU_Power.value = Math.max(0, Math.min(150,
      (this.data.CPU_Utilization.value / 100) * 120 + (Math.random() - 0.5) * 10
    ));

    // CPU Voltage - slight variations around 1.25V
    this.data.CPU_Voltage.value = Math.max(0.8, Math.min(1.5,
      1.25 + (Math.random() - 0.5) * 0.1
    ));

    // CPU Clock - varies with load
    this.data.CPU_Clock.value = Math.max(800, Math.min(5000,
      2000 + (this.data.CPU_Utilization.value / 100) * 2000 + (Math.random() - 0.5) * 200
    ));

    // CPU Cores - individual core variations
    for (let i = 0; i < 8; i++) {
      const coreKey = `CPU_Core_${i}` as SensorId;
      if (this.data[coreKey]) {
        this.data[coreKey].value = Math.max(0, Math.min(100,
          this.data[coreKey].value + (Math.random() - 0.5) * 15
        ));
      }
    }

    // GPU Utilization - varies between 0-95% with gaming-like patterns
    this.data.GPU_Utilization.value = Math.max(0, Math.min(95,
      this.data.GPU_Utilization.value + (Math.random() - 0.4) * 15
    ));

    // GPU Temperature - correlates with utilization, 30-95°C range
    const gpuTempBase = 30 + (this.data.GPU_Utilization.value * 0.65);
    this.data.GPU_Temperature.value = Math.max(30, Math.min(95,
      gpuTempBase + (Math.random() - 0.5) * 3
    ));

    // GPU Memory - varies with utilization, 0-12GB range
    this.data.GPU_Memory.value = Math.max(0, Math.min(12,
      (this.data.GPU_Utilization.value / 100) * 12 + (Math.random() - 0.5) * 2
    ));

    // GPU Power - correlates with utilization
    this.data.GPU_Power.value = Math.max(0, Math.min(300,
      (this.data.GPU_Utilization.value / 100) * 250 + (Math.random() - 0.5) * 20
    ));

    // GPU Clock - varies with load
    this.data.GPU_Clock.value = Math.max(300, Math.min(2500,
      1000 + (this.data.GPU_Utilization.value / 100) * 1000 + (Math.random() - 0.5) * 100
    ));

    // GPU Fan - correlates with temperature
    this.data.GPU_Fan.value = Math.max(0, Math.min(3000,
      (this.data.GPU_Temperature.value / 95) * 2000 + (Math.random() - 0.5) * 200
    ));

    // Memory Usage - varies between 40-90% with gradual changes
    this.data.Memory_Usage.value = Math.max(40, Math.min(90,
      this.data.Memory_Usage.value + (Math.random() - 0.5) * 5
    ));

    // Memory Available - inverse of usage
    this.data.Memory_Available.value = Math.max(0, Math.min(32,
      (100 - this.data.Memory_Usage.value) / 100 * 32 + (Math.random() - 0.5) * 2
    ));

    // Memory Bandwidth - varies with usage
    this.data.Memory_Bandwidth.value = Math.max(0, Math.min(100,
      (this.data.Memory_Usage.value / 100) * 80 + (Math.random() - 0.5) * 10
    ));

    // Network speeds - varies with time of day simulation
    const timeOfDay = (now / 1000) % 86400; // seconds in day
    const networkMultiplier = 0.5 + 0.5 * Math.sin(timeOfDay / 3600 * Math.PI * 2);
    
    this.data.WiFi_Speed.value = Math.max(0, Math.min(1000,
      50 + networkMultiplier * 200 + (Math.random() - 0.5) * 50
    ));

    this.data.Ethernet_Speed.value = Math.max(0, Math.min(1000,
      100 + networkMultiplier * 300 + (Math.random() - 0.5) * 100
    ));

    // Network Upload/Download - correlates with speeds
    this.data.Network_Upload.value = Math.max(0, Math.min(100,
      (this.data.WiFi_Speed.value / 1000) * 50 + (Math.random() - 0.5) * 10
    ));

    this.data.Network_Download.value = Math.max(0, Math.min(100,
      (this.data.WiFi_Speed.value / 1000) * 80 + (Math.random() - 0.5) * 15
    ));

    // Disk Usage - gradual changes
    this.data.Disk_Usage.value = Math.max(0, Math.min(100,
      this.data.Disk_Usage.value + (Math.random() - 0.5) * 2
    ));

    // Disk Temperature - varies with usage
    this.data.Disk_Temperature.value = Math.max(20, Math.min(60,
      25 + (this.data.Disk_Usage.value / 100) * 20 + (Math.random() - 0.5) * 3
    ));

    // Disk Read/Write - varies with activity
    this.data.Disk_Read.value = Math.max(0, Math.min(200,
      (this.data.Disk_Usage.value / 100) * 50 + (Math.random() - 0.5) * 20
    ));

    this.data.Disk_Write.value = Math.max(0, Math.min(200,
      (this.data.Disk_Usage.value / 100) * 30 + (Math.random() - 0.5) * 15
    ));

    // Motherboard Temperature - correlates with CPU temp
    this.data.Motherboard_Temperature.value = Math.max(20, Math.min(70,
      this.data.CPU_Temperature.value * 0.6 + (Math.random() - 0.5) * 5
    ));

    // CPU Fan - correlates with CPU temperature
    this.data.Fan_CPU.value = Math.max(0, Math.min(3000,
      (this.data.CPU_Temperature.value / 90) * 2000 + (Math.random() - 0.5) * 200
    ));

    // Case Fans - varies with system temperature
    this.data.Fan_Case_1.value = Math.max(0, Math.min(2000,
      (this.data.Motherboard_Temperature.value / 70) * 1500 + (Math.random() - 0.5) * 100
    ));

    this.data.Fan_Case_2.value = Math.max(0, Math.min(2000,
      (this.data.Motherboard_Temperature.value / 70) * 1400 + (Math.random() - 0.5) * 100
    ));

    // PSU Power - sum of CPU and GPU power plus system overhead
    this.data.PSU_Power.value = Math.max(0, Math.min(750,
      this.data.CPU_Power.value + this.data.GPU_Power.value + 50 + (Math.random() - 0.5) * 20
    ));

    // PSU Voltages - slight variations around nominal values
    this.data.PSU_Voltage_12V.value = Math.max(11.4, Math.min(12.6,
      12.0 + (Math.random() - 0.5) * 0.2
    ));

    this.data.PSU_Voltage_5V.value = Math.max(4.75, Math.min(5.25,
      5.0 + (Math.random() - 0.5) * 0.1
    ));

    // Ensure all values are within valid ranges
    Object.keys(this.data).forEach(sensorId => {
      const sensor = this.data[sensorId as SensorId];
      if (sensor) {
        sensor.value = Math.max(sensor.min, Math.min(sensor.max, sensor.value));
        sensor.isValid = true;
      }
    });
  }

  // Notify all subscribers
  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.data));
  }

  // Set specific sensor value (for testing)
  setSensorValue(sensorId: SensorId, value: number) {
    if (this.data[sensorId]) {
      this.data[sensorId].value = Math.max(
        this.data[sensorId].min,
        Math.min(this.data[sensorId].max, value)
      );
      this.notifyCallbacks();
    }
  }

  // Reset to initial values
  reset() {
    this.data = { ...mockSensorData };
    this.notifyCallbacks();
  }
}

// Create singleton instance
export const sensorSimulator = new SensorDataSimulator();

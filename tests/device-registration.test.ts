import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockClarityBitcoin, mockClarityBlockInfo } from './test-utils';

// Mock the Clarity environment
vi.mock('clarity-bitcoin', () => mockClarityBitcoin);
vi.mock('clarity-block-info', () => mockClarityBlockInfo);

describe('Device Registration Contract', () => {
  beforeEach(() => {
    // Reset contract state before each test
    vi.resetModules();
  });
  
  it('should register a new device', async () => {
    const result = await vi.importMock('../contracts/device-registration.clar').registerDevice(
        'SN12345',
        'Ultrasound-X5',
        'MedTech Inc',
        180
    );
    
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(1);
  });
  
  it('should retrieve a registered device', async () => {
    const contract = await vi.importMock('../contracts/device-registration.clar');
    
    // Register a device first
    await contract.registerDevice(
        'SN12345',
        'Ultrasound-X5',
        'MedTech Inc',
        180
    );
    
    // Get the device
    const device = await contract.getDevice(1);
    
    expect(device).toBeDefined();
    expect(device.serialNumber).toBe('SN12345');
    expect(device.model).toBe('Ultrasound-X5');
    expect(device.manufacturer).toBe('MedTech Inc');
    expect(device.calibrationFrequencyDays).toBe(180);
  });
  
  it('should update calibration date', async () => {
    const contract = await vi.importMock('../contracts/device-registration.clar');
    
    // Register a device first
    await contract.registerDevice(
        'SN12345',
        'Ultrasound-X5',
        'MedTech Inc',
        180
    );
    
    // Update calibration date
    const result = await contract.updateCalibrationDate(1);
    expect(result.isOk).toBe(true);
    
    // Get the device to verify update
    const device = await contract.getDevice(1);
    expect(device.lastCalibrationDate).toBeGreaterThan(0);
  });
});

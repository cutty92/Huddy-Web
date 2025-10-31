import { Asset, AssetCollection } from '@/types';

export interface AssetUploadResult {
  success: boolean;
  asset?: Asset;
  error?: string;
}

export interface AssetValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Asset manager class
export class AssetManager {
  private assets: AssetCollection = {
    images: {},
    fonts: {},
    sounds: {}
  };

  // Supported file types
  private readonly SUPPORTED_TYPES = {
    images: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'],
    fonts: ['font/woff', 'font/woff2', 'application/font-woff', 'application/font-woff2'],
    sounds: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  };

  // File size limits (in bytes)
  private readonly SIZE_LIMITS = {
    images: 5 * 1024 * 1024, // 5MB
    fonts: 2 * 1024 * 1024,  // 2MB
    sounds: 10 * 1024 * 1024 // 10MB
  };

  // Get all assets
  getAllAssets(): AssetCollection {
    return { ...this.assets };
  }

  // Get assets by type
  getAssetsByType(type: keyof AssetCollection): { [key: string]: Asset } {
    return { ...this.assets[type] };
  }

  // Get specific asset
  getAsset(id: string, type: keyof AssetCollection): Asset | null {
    return this.assets[type][id] || null;
  }

  // Add asset
  addAsset(asset: Asset, type: keyof AssetCollection): void {
    this.assets[type][asset.id] = asset;
  }

  // Remove asset
  removeAsset(id: string, type: keyof AssetCollection): boolean {
    if (this.assets[type][id]) {
      delete this.assets[type][id];
      return true;
    }
    return false;
  }

  // Upload file
  async uploadFile(file: File, type: keyof AssetCollection): Promise<AssetUploadResult> {
    // Validate file
    const validation = this.validateFile(file, type);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Generate unique ID
    const id = this.generateAssetId(file.name, type);

    // Create asset object
    const asset: Asset = {
      id,
      name: file.name,
      type: type === 'images' ? 'image' : type === 'fonts' ? 'font' : 'sound',
      path: URL.createObjectURL(file), // For now, use blob URL
      size: file.size,
      lastModified: new Date()
    };

    // Add to collection
    this.addAsset(asset, type);

    return {
      success: true,
      asset
    };
  }

  // Validate file before upload
  validateFile(file: File, type: keyof AssetCollection): AssetValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file type
    if (!this.SUPPORTED_TYPES[type].includes(file.type)) {
      errors.push(`Unsupported file type: ${file.type}. Supported types: ${this.SUPPORTED_TYPES[type].join(', ')}`);
    }

    // Check file size
    if (file.size > this.SIZE_LIMITS[type]) {
      errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size: ${(this.SIZE_LIMITS[type] / 1024 / 1024).toFixed(1)}MB`);
    }

    // Check file name
    if (!file.name || file.name.trim() === '') {
      errors.push('File name is required');
    }

    // Check for duplicate names
    const existingAsset = Object.values(this.assets[type]).find(asset => asset.name === file.name);
    if (existingAsset) {
      warnings.push(`Asset with name "${file.name}" already exists`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Generate unique asset ID
  private generateAssetId(filename: string, type: keyof AssetCollection): string {
    const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    let id = `${baseName}`;
    let counter = 1;

    while (this.assets[type][id]) {
      id = `${baseName}_${counter}`;
      counter++;
    }

    return id;
  }

  // Get asset URL
  getAssetUrl(id: string, type: keyof AssetCollection): string | null {
    const asset = this.getAsset(id, type);
    return asset ? asset.path : null;
  }

  // Check if asset exists
  hasAsset(id: string, type: keyof AssetCollection): boolean {
    return !!this.assets[type][id];
  }

  // Get asset statistics
  getAssetStats(): {
    total: number;
    byType: { [K in keyof AssetCollection]: number };
    totalSize: number;
  } {
    const stats = {
      total: 0,
      byType: {
        images: 0,
        fonts: 0,
        sounds: 0
      } as { [K in keyof AssetCollection]: number },
      totalSize: 0
    };

    Object.keys(this.assets).forEach(type => {
      const assetType = type as keyof AssetCollection;
      const count = Object.keys(this.assets[assetType]).length;
      stats.byType[assetType] = count;
      stats.total += count;

      // Calculate total size
      Object.values(this.assets[assetType]).forEach(asset => {
        stats.totalSize += asset.size;
      });
    });

    return stats;
  }

  // Clear all assets
  clearAssets(): void {
    this.assets = {
      images: {},
      fonts: {},
      sounds: {}
    };
  }

  // Export assets manifest
  exportManifest(): string {
    const manifest = {
      version: '1.0',
      generated: new Date().toISOString(),
      assets: this.assets
    };

    return JSON.stringify(manifest, null, 2);
  }

  // Import assets manifest
  importManifest(manifestJson: string): { success: boolean; errors: string[] } {
    try {
      const manifest = JSON.parse(manifestJson);
      
      if (!manifest.assets) {
        return {
          success: false,
          errors: ['Invalid manifest: missing assets property']
        };
      }

      // Validate manifest structure
      const requiredTypes = ['images', 'fonts', 'sounds'];
      for (const type of requiredTypes) {
        if (!manifest.assets[type]) {
          return {
            success: false,
            errors: [`Invalid manifest: missing ${type} property`]
          };
        }
      }

      // Import assets
      this.assets = manifest.assets;

      return {
        success: true,
        errors: []
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to parse manifest: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
}

// Create singleton instance
export const assetManager = new AssetManager();

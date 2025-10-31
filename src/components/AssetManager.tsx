import React, { useState, useRef } from 'react';
import { assetManager, AssetUploadResult } from '@/lib/asset-manager';
import { Asset } from '@/types';
import { Upload, Image, Type, Volume2, Trash2, Download, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export function AssetManager() {
  const [assets, setAssets] = useState(assetManager.getAllAssets());
  const [selectedType, setSelectedType] = useState<keyof typeof assets>('images');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshAssets = () => {
    setAssets(assetManager.getAllAssets());
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const results: AssetUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await assetManager.uploadFile(file, selectedType);
      results.push(result);
    }

    setIsUploading(false);
    refreshAssets();

    // Show results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    if (successful > 0) {
      toast.success(`Successfully uploaded ${successful} asset${successful !== 1 ? 's' : ''}`);
    }

    if (failed > 0) {
      const errors = results.filter(r => !r.success).map(r => r.error).join(', ');
      toast.error(`Failed to upload ${failed} asset${failed !== 1 ? 's' : ''}: ${errors}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDeleteAsset = (assetId: string) => {
    if (assetManager.removeAsset(assetId, selectedType)) {
      refreshAssets();
      toast.success('Asset deleted');
    } else {
      toast.error('Failed to delete asset');
    }
  };

  const handleExportAssets = () => {
    const manifest = assetManager.exportManifest();
    const blob = new Blob([manifest], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Assets manifest exported');
  };

  const handleImportAssets = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const manifest = e.target?.result as string;
          const result = assetManager.importManifest(manifest);
          
          if (result.success) {
            refreshAssets();
            toast.success('Assets imported successfully');
          } else {
            toast.error(`Failed to import assets: ${result.errors.join(', ')}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'images': return <Image className="w-4 h-4" />;
      case 'fonts': return <Type className="w-4 h-4" />;
      case 'sounds': return <Volume2 className="w-4 h-4" />;
      default: return <FolderOpen className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentAssets = assets[selectedType];
  const assetCount = Object.keys(currentAssets).length;

  return (
    <div className="bg-gray-800 border-l border-gray-700 border-t border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">Asset Manager</h3>
        
        {/* Type Tabs */}
        <div className="flex space-x-1 mb-4">
          {Object.keys(assets).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as keyof typeof assets)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                selectedType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {getAssetIcon(type)}
              <span className="capitalize">{type}</span>
              <span className="text-xs opacity-75">
                ({Object.keys(assets[type as keyof typeof assets]).length})
              </span>
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-400 mb-1">
            {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </p>
          <p className="text-xs text-gray-500">
            {selectedType === 'images' && 'PNG, JPG, SVG, WebP (max 5MB)'}
            {selectedType === 'fonts' && 'WOFF, WOFF2, TTF, OTF (max 2MB)'}
            {selectedType === 'sounds' && 'MP3, WAV, OGG (max 10MB)'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={
              selectedType === 'images' ? 'image/*' :
              selectedType === 'fonts' ? 'font/*,.woff,.woff2,.ttf,.otf' :
              'audio/*'
            }
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {assetCount === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm">No {selectedType} uploaded yet</p>
            <p className="text-xs">Upload some files to get started</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {Object.values(currentAssets).map((asset) => (
              <div
                key={asset.id}
                className="group p-3 bg-gray-750 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getAssetIcon(selectedType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {asset.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(asset.size)} • {asset.lastModified.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        const url = assetManager.getAssetUrl(asset.id, selectedType);
                        if (url) {
                          window.open(url, '_blank');
                        }
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                      title="Preview"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1 hover:bg-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={handleExportAssets}
            className="btn btn-secondary btn-sm flex-1"
            disabled={assetCount === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
          
          <button
            onClick={handleImportAssets}
            className="btn btn-secondary btn-sm flex-1"
          >
            <FolderOpen className="w-4 h-4 mr-1" />
            Import
          </button>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          {assetCount} {selectedType} • {formatFileSize(
            Object.values(currentAssets).reduce((sum, asset) => sum + asset.size, 0)
          )}
        </div>
      </div>
    </div>
  );
}

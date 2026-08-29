'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';

interface ProcessedImage {
  originalFile: File;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalPreviewUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedPreviewUrl: string | null;
  quality: number;
  isProcessing: boolean;
  error: string | null;
}

export default function ImageCompressor() {
  const [imageState, setImageState] = useState<ProcessedImage | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, JPEG, or WebP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImageState({
        originalFile: file,
        originalSize: file.size,
        originalWidth: img.width,
        originalHeight: img.height,
        originalPreviewUrl: objectUrl,
        compressedBlob: null,
        compressedSize: 0,
        compressedPreviewUrl: null,
        quality: quality,
        isProcessing: false,
        error: null,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      alert('Failed to load the selected image file.');
    };

    img.src = objectUrl;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const resetState = () => {
    if (imageState) {
      if (imageState.originalPreviewUrl) URL.revokeObjectURL(imageState.originalPreviewUrl);
      if (imageState.compressedPreviewUrl) URL.revokeObjectURL(imageState.compressedPreviewUrl);
    }
    setImageState(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!imageState) return;

    let isMounted = true;
    setImageState((prev) => (prev ? { ...prev, isProcessing: true, error: null } : null));

    const img = new Image();
    img.src = imageState.originalPreviewUrl;

    img.onload = () => {
      if (!isMounted) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setImageState((prev) =>
          prev ? { ...prev, isProcessing: false, error: 'Failed to create canvas context.' } : null
        );
        return;
      }

      if (imageState.originalFile.type === 'image/png') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const outputType =
        imageState.originalFile.type === 'image/png' ? 'image/jpeg' : imageState.originalFile.type;
      const compressionQuality = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!isMounted) return;

          if (!blob) {
            setImageState((prev) =>
              prev ? { ...prev, isProcessing: false, error: 'Image compression failed.' } : null
            );
            return;
          }

          if (imageState.compressedPreviewUrl) {
            URL.revokeObjectURL(imageState.compressedPreviewUrl);
          }

          const compressedUrl = URL.createObjectURL(blob);

          setImageState((prev) =>
            prev
              ? {
                  ...prev,
                  compressedBlob: blob,
                  compressedSize: blob.size,
                  compressedPreviewUrl: compressedUrl,
                  quality: quality,
                  isProcessing: false,
                  error: null,
                }
              : null
          );
        },
        outputType,
        compressionQuality
      );
    };

    img.onerror = () => {
      if (isMounted) {
        setImageState((prev) =>
          prev ? { ...prev, isProcessing: false, error: 'An error occurred while processing the image.' } : null
        );
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageState?.originalPreviewUrl, quality]);

  const calculateReduction = (): { percent: number; isSmaller: boolean } => {
    if (!imageState || !imageState.compressedSize) return { percent: 0, isSmaller: true };
    const diff = imageState.originalSize - imageState.compressedSize;
    const percent = (diff / imageState.originalSize) * 100;
    return {
      percent: Math.abs(parseFloat(percent.toFixed(1))),
      isSmaller: diff >= 0,
    };
  };

  const handleDownload = () => {
    if (!imageState || !imageState.compressedPreviewUrl) return;

    const originalName = imageState.originalFile.name;
    const extensionIndex = originalName.lastIndexOf('.');
    const baseName = extensionIndex !== -1 ? originalName.substring(0, extensionIndex) : originalName;
    const isPngOriginal = imageState.originalFile.type === 'image/png';
    const extension = isPngOriginal ? 'jpg' : originalName.substring(extensionIndex + 1);

    const downloadLink = document.createElement('a');
    downloadLink.href = imageState.compressedPreviewUrl;
    downloadLink.download = `${baseName}-compressed.${extension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const reduction = calculateReduction();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {!imageState ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-semibold">
            📁
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Choose an Image to Compress</h3>
          <p className="text-sm text-slate-500 mb-4">
            Drag and drop your image here, or <span className="text-indigo-600 font-semibold underline">click to browse</span>
          </p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-600">
              PNG
            </span>
            <span className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-600">
              JPG / JPEG
            </span>
            <span className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-600">
              WebP
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="truncate max-w-md">
              <h3 className="font-semibold text-slate-900 truncate">{imageState.originalFile.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {imageState.originalWidth} x {imageState.originalHeight} px • {formatFileSize(imageState.originalSize)}
              </p>
            </div>
            <button
              onClick={resetState}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>✕</span> Start Over
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="quality-slider" className="text-sm font-semibold text-slate-700">
                Quality: <span className="text-indigo-600">{quality}%</span>
              </label>
              {imageState.isProcessing && (
                <span className="text-xs text-indigo-600 font-medium animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  Compressing...
                </span>
              )}
            </div>
            <input
              id="quality-slider"
              type="range"
              min="10"
              max="100"
              step="1"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>10% (Smaller File)</span>
              <span>100% (Higher Quality)</span>
            </div>
          </div>

          {imageState.error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {imageState.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Original Image</span>
              <div className="relative aspect-video w-full rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mb-3">
                <img
                  src={imageState.originalPreviewUrl}
                  alt="Original Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="mt-auto flex justify-between items-center text-sm">
                <span className="text-slate-500">Size:</span>
                <span className="font-semibold text-slate-800">{formatFileSize(imageState.originalSize)}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Compressed Image</span>
                {!imageState.isProcessing && imageState.compressedSize > 0 && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      reduction.isSmaller
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {reduction.isSmaller ? `-${reduction.percent}%` : `+${reduction.percent}%`}
                  </span>
                )}
              </div>
              <div className="relative aspect-video w-full rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mb-3">
                {imageState.isProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">Processing...</span>
                  </div>
                ) : imageState.compressedPreviewUrl ? (
                  <img
                    src={imageState.compressedPreviewUrl}
                    alt="Compressed Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No image</span>
                )}
              </div>
              <div className="mt-auto flex justify-between items-center text-sm">
                <span className="text-slate-500">New Size:</span>
                <span className="font-semibold text-slate-800">
                  {imageState.isProcessing ? '...' : formatFileSize(imageState.compressedSize)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownload}
              disabled={imageState.isProcessing || !imageState.compressedPreviewUrl}
              className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <span>⬇️</span> Download Compressed Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
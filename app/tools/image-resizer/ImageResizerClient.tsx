'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { WordCountIcon } from '@/app/components/ToolIcons';

interface ImageMetadata {
  file: File;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  previewUrl: string;
}

type TargetFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export default function ImageResizerPage() {
  const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(null);
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<TargetFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(90);

  const [resizedPreviewUrl, setResizedPreviewUrl] = useState<string | null>(null);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileProcess = (file: File) => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, or WebP).');
      return;
    }

    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImageMeta({
        file,
        originalWidth: img.width,
        originalHeight: img.height,
        originalSize: file.size,
        previewUrl: objectUrl,
      });
      setWidth(img.width);
      setHeight(img.height);

      if (file.type === 'image/png') setFormat('image/png');
      else if (file.type === 'image/webp') setFormat('image/webp');
      else setFormat('image/jpeg');
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMessage('Failed to load the selected image file.');
    };

    img.src = objectUrl;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileProcess(e.target.files[0]);
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
    if (e.dataTransfer.files?.[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleWidthChange = (val: string) => {
    if (val === '') {
      setWidth('');
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) return;

    setWidth(num);
    if (keepAspectRatio && imageMeta && imageMeta.originalWidth > 0) {
      const calculatedHeight = Math.round((num * imageMeta.originalHeight) / imageMeta.originalWidth);
      setHeight(calculatedHeight);
    }
  };

  const handleHeightChange = (val: string) => {
    if (val === '') {
      setHeight('');
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) return;

    setHeight(num);
    if (keepAspectRatio && imageMeta && imageMeta.originalHeight > 0) {
      const calculatedWidth = Math.round((num * imageMeta.originalWidth) / imageMeta.originalHeight);
      setWidth(calculatedWidth);
    }
  };

  useEffect(() => {
    if (!imageMeta || typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
      return;
    }

    let isMounted = true;
    setIsProcessing(true);

    const img = new Image();
    img.src = imageMeta.previewUrl;

    img.onload = () => {
      if (!isMounted) return;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        setErrorMessage('Failed to initialize canvas render context.');
        return;
      }

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const targetQuality = format === 'image/png' ? undefined : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!isMounted) return;
          setIsProcessing(false);

          if (!blob) {
            setErrorMessage('Failed to generate resized image file.');
            return;
          }

          setResizedPreviewUrl((prevUrl) => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(blob);
          });

          setResizedBlob(blob);
          setResizedSize(blob.size);
        },
        format,
        targetQuality
      );
    };

    img.onerror = () => {
      if (isMounted) {
        setIsProcessing(false);
        setErrorMessage('Error rendering image preview.');
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageMeta, width, height, format, quality]);

  const handleDownload = () => {
    if (!resizedBlob || !imageMeta) return;

    const originalName = imageMeta.file.name;
    const extensionIndex = originalName.lastIndexOf('.');
    const baseName = extensionIndex !== -1 ? originalName.substring(0, extensionIndex) : originalName;

    let extension = 'jpg';
    if (format === 'image/png') extension = 'png';
    else if (format === 'image/webp') extension = 'webp';

    const blobUrl = URL.createObjectURL(resizedBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${baseName}-resized.${extension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
  };

  const handleStartOver = () => {
    if (imageMeta?.previewUrl) URL.revokeObjectURL(imageMeta.previewUrl);
    if (resizedPreviewUrl) URL.revokeObjectURL(resizedPreviewUrl);

    setImageMeta(null);
    setWidth('');
    setHeight('');
    setResizedPreviewUrl(null);
    setResizedBlob(null);
    setResizedSize(0);
    setErrorMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Image Tools"
          title="Image Resizer"
          description="Resize your image dimensions instantly right in your browser without uploading files to server."
          icon={WordCountIcon}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="font-bold text-red-800 hover:text-red-900 p-1 rounded-md focus:outline-none"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {!imageMeta ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : 'border-slate-300 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-semibold shadow-sm">
                  📐
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Choose an Image to Resize</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Drag and drop your image here, or <span className="text-indigo-600 font-semibold underline">click to browse</span>
                </p>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-600 shadow-sm">
                    PNG
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-600 shadow-sm">
                    JPG / JPEG
                  </span>
                  <span className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-600 shadow-sm">
                    WebP
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="truncate max-w-md">
                    <h3 className="font-bold text-slate-900 truncate">{imageMeta.file.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Original: {imageMeta.originalWidth} × {imageMeta.originalHeight} px • {formatFileSize(imageMeta.originalSize)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>✕</span> Start Over
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dimensions</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Width (px)</label>
                          <input
                            type="number"
                            min="1"
                            value={width}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Height (px)</label>
                          <input
                            type="number"
                            min="1"
                            value={height}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={keepAspectRatio}
                          onChange={(e) => setKeepAspectRatio(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 accent-indigo-600"
                        />
                        <span className="text-xs font-medium text-slate-700">Keep aspect ratio</span>
                      </label>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Output Settings</h4>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Output Format</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['image/jpeg', 'image/png', 'image/webp'] as TargetFormat[]).map((fmt) => {
                            const label = fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WebP';
                            return (
                              <button
                                key={fmt}
                                type="button"
                                onClick={() => setFormat(fmt)}
                                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                                  format === fmt
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {format !== 'image/png' && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center">
                            <label htmlFor="resizer-quality" className="text-xs font-medium text-slate-600">
                              Quality
                            </label>
                            <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                          </div>
                          <input
                            id="resizer-quality"
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Preview & Output</span>
                      {isProcessing && (
                        <span className="text-xs text-indigo-600 font-medium animate-pulse flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                          Processing...
                        </span>
                      )}
                    </div>

                    <div className="relative aspect-video w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mb-4 flex-grow">
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-slate-500 font-medium">Resizing image...</span>
                        </div>
                      ) : resizedPreviewUrl ? (
                        <img
                          src={resizedPreviewUrl}
                          alt="Resized Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No image</span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm border-t border-slate-200 pt-3">
                      <div className="flex justify-between text-slate-600 text-xs">
                        <span>New Dimensions:</span>
                        <span className="font-semibold text-slate-800">
                          {width || 0} × {height || 0} px
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-xs">
                        <span>File Size:</span>
                        <span className="font-semibold text-slate-800">
                          {isProcessing ? '...' : formatFileSize(resizedSize)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isProcessing || !resizedBlob}
                    className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <span>⬇️</span> Resize & Download Image
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                🔒 Your image is processed locally in your browser. Nothing is uploaded.
              </p>
            </div>
          </div>

          <RelatedTools currentId="image-resizer" categoryKey="image-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
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

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AspectRatioOption = 'free' | '1:1' | '4:5' | '4:3' | '3:2' | '16:9' | '9:16' | '3:4';
type TargetFormat = 'image/jpeg' | 'image/png' | 'image/webp';

interface PresetOption {
  id: string;
  name: string;
  category: string;
  ratio: AspectRatioOption;
  icon: string;
}

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'free', name: 'Free Crop', category: 'General', ratio: 'free', icon: '✂️' },
  { id: 'square', name: 'Square (1:1)', category: 'General', ratio: '1:1', icon: '🔳' },
  { id: 'profile', name: 'Profile Picture', category: 'Social', ratio: '1:1', icon: '👤' },
  { id: 'ig-post', name: 'Instagram Post', category: 'Social', ratio: '1:1', icon: '📸' },
  { id: 'ig-portrait', name: 'Instagram Portrait (4:5)', category: 'Social', ratio: '4:5', icon: '📱' },
  { id: 'yt-thumb', name: 'YouTube Thumbnail (16:9)', category: 'Landscape', ratio: '16:9', icon: '🎬' },
  { id: 'fb-cover', name: 'Facebook Cover (16:9)', category: 'Landscape', ratio: '16:9', icon: '🖼️' },
  { id: 'tiktok', name: 'TikTok / Reel (9:16)', category: 'Portrait', ratio: '9:16', icon: '🎵' },
  { id: 'landscape-std', name: 'Standard Landscape (4:3)', category: 'Landscape', ratio: '4:3', icon: '📷' },
  { id: 'photo-32', name: 'Photo Print (3:2)', category: 'Landscape', ratio: '3:2', icon: '🖼️' },
];

export default function ImageCropperPage() {
  const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(null);
  const [cropBox, setCropBox] = useState<CropBox>({ x: 10, y: 10, width: 80, height: 80 });
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('free');
  const [activePresetId, setActivePresetId] = useState<string>('free');
  const [zoom, setZoom] = useState<number>(100);
  const [format, setFormat] = useState<TargetFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(90);

  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [croppedSize, setCroppedSize] = useState<number>(0);
  const [croppedWidth, setCroppedWidth] = useState<number>(0);
  const [croppedHeight, setCroppedHeight] = useState<number>(0);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeInteraction, setActiveInteraction] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState<CropBox>({ x: 0, y: 0, width: 0, height: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getNumericRatio = (ratio: AspectRatioOption): number | null => {
    switch (ratio) {
      case '1:1': return 1;
      case '4:5': return 4 / 5;
      case '4:3': return 4 / 3;
      case '3:2': return 3 / 2;
      case '16:9': return 16 / 9;
      case '9:16': return 9 / 16;
      case '3:4': return 3 / 4;
      default: return null;
    }
  };

  const handleFileProcess = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
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

      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      setAspectRatio('free');
      setActivePresetId('free');
      setZoom(100);

      if (file.type === 'image/png') setFormat('image/png');
      else if (file.type === 'image/webp') setFormat('image/webp');
      else setFormat('image/jpeg');
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMessage('Failed to load the selected image file. Please try another image.');
    };

    img.src = objectUrl;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const applyAspectRatio = (ratio: AspectRatioOption, currentBox: CropBox): CropBox => {
    const numericRatio = getNumericRatio(ratio);
    if (!numericRatio || !containerRef.current) {
      return currentBox;
    }

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return currentBox;

    const containerRatio = rect.width / rect.height;
    let newWidth = currentBox.width;
    let newHeight = (newWidth * containerRatio) / numericRatio;

    if (newHeight > 100 - currentBox.y) {
      newHeight = 100 - currentBox.y;
      newWidth = (newHeight * numericRatio) / containerRatio;
    }

    if (currentBox.x + newWidth > 100) {
      newWidth = 100 - currentBox.x;
      newHeight = (newWidth * containerRatio) / numericRatio;
    }

    return {
      ...currentBox,
      width: Math.max(10, newWidth),
      height: Math.max(10, newHeight),
    };
  };

  const handlePresetSelect = (preset: PresetOption) => {
    setActivePresetId(preset.id);
    setAspectRatio(preset.ratio);
    setCropBox((prev) => applyAspectRatio(preset.ratio, prev));
  };

  const startInteraction = (type: 'move' | 'nw' | 'ne' | 'sw' | 'se', clientX: number, clientY: number) => {
    setActiveInteraction(type);
    setDragStart({ x: clientX, y: clientY });
    setCropStart({ ...cropBox });
  };

  const handleMouseDown = (type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => (e: ReactMouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startInteraction(type, e.clientX, e.clientY);
  };

  const handleTouchStart = (type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => (e: ReactTouchEvent) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      startInteraction(type, e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!activeInteraction || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((clientX - dragStart.x) / rect.width) * 100;
      const deltaYPercent = ((clientY - dragStart.y) / rect.height) * 100;

      setCropBox(() => {
        let { x, y, width, height } = cropStart;
        const numericRatio = getNumericRatio(aspectRatio);
        const containerRatio = rect.width / rect.height;

        if (activeInteraction === 'move') {
          x = Math.max(0, Math.min(100 - width, x + deltaXPercent));
          y = Math.max(0, Math.min(100 - height, y + deltaYPercent));
        } else {
          if (activeInteraction.includes('e')) {
            width = Math.max(10, Math.min(100 - x, width + deltaXPercent));
          }
          if (activeInteraction.includes('s')) {
            height = Math.max(10, Math.min(100 - y, height + deltaYPercent));
          }
          if (activeInteraction.includes('w')) {
            const possibleWidth = Math.max(10, width - deltaXPercent);
            const actualDeltaX = width - possibleWidth;
            x = Math.max(0, x + actualDeltaX);
            width = possibleWidth;
          }
          if (activeInteraction.includes('n')) {
            const possibleHeight = Math.max(10, height - deltaYPercent);
            const actualDeltaY = height - possibleHeight;
            y = Math.max(0, y + actualDeltaY);
            height = possibleHeight;
          }

          if (numericRatio) {
            height = (width * containerRatio) / numericRatio;
            if (y + height > 100) {
              height = 100 - y;
              width = (height * numericRatio) / containerRatio;
            }
          }
        }

        return { x, y, width, height };
      });
    };

    const onMouseMove = (e: globalThis.MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: globalThis.TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const stopInteraction = () => setActiveInteraction(null);

    if (activeInteraction) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopInteraction);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', stopInteraction);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopInteraction);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopInteraction);
    };
  }, [activeInteraction, dragStart, cropStart, aspectRatio]);

  const generateCrop = () => {
    if (!imageMeta) return;

    setIsProcessing(true);
    setErrorMessage(null);
    const img = new Image();
    img.src = imageMeta.previewUrl;

    img.onload = () => {
      const sourceX = (cropBox.x / 100) * img.width;
      const sourceY = (cropBox.y / 100) * img.height;
      const sourceWidth = (cropBox.width / 100) * img.width;
      const sourceHeight = (cropBox.height / 100) * img.height;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(sourceWidth));
      canvas.height = Math.max(1, Math.round(sourceHeight));

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        setErrorMessage('Failed to initialize browser canvas context for cropping.');
        return;
      }

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const targetQuality = format === 'image/png' ? undefined : quality / 100;

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMessage('Failed to generate cropped image blob.');
            return;
          }

          if (croppedPreviewUrl) {
            URL.revokeObjectURL(croppedPreviewUrl);
          }

          const url = URL.createObjectURL(blob);
          setCroppedPreviewUrl(url);
          setCroppedSize(blob.size);
          setCroppedWidth(canvas.width);
          setCroppedHeight(canvas.height);
        },
        format,
        targetQuality
      );
    };

    img.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Failed to render source image for cropping.');
    };
  };

  useEffect(() => {
    if (imageMeta && !isProcessing) {
      generateCrop();
    }
  }, [cropBox, format, quality]);

  const handleDownload = () => {
    if (!croppedPreviewUrl || !imageMeta) return;

    const originalName = imageMeta.file.name;
    const extensionIndex = originalName.lastIndexOf('.');
    const baseName = extensionIndex !== -1 ? originalName.substring(0, extensionIndex) : originalName;

    let extension = 'jpg';
    if (format === 'image/png') extension = 'png';
    else if (format === 'image/webp') extension = 'webp';

    const downloadLink = document.createElement('a');
    downloadLink.href = croppedPreviewUrl;
    downloadLink.download = `${baseName}-cropped.${extension}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleStartOver = () => {
    if (imageMeta?.previewUrl) URL.revokeObjectURL(imageMeta.previewUrl);
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);

    setImageMeta(null);
    setCroppedPreviewUrl(null);
    setCroppedSize(0);
    setCroppedWidth(0);
    setCroppedHeight(0);
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
          title="Image Cropper"
          description="Select the part of the image you want to keep. Drag the crop box directly or choose a convenient preset."
          icon={WordCountIcon}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="font-bold text-red-800 hover:text-red-900 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px] ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                }`}
                tabIndex={0}
                role="button"
                aria-label="Upload an image to crop"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-semibold">
                  ✂️
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Upload Image to Crop</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Drag and drop your image here, or <span className="text-indigo-600 font-semibold underline">click to browse</span>
                </p>
                <div className="flex flex-wrap justify-center gap-2">
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
                    <h2 className="font-semibold text-slate-900 truncate">{imageMeta.file.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Original Size: {imageMeta.originalWidth} × {imageMeta.originalHeight} px • {formatFileSize(imageMeta.originalSize)}
                    </p>
                  </div>
                  <button
                    onClick={handleStartOver}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span>✕</span> Start Over
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Choose a Preset Size
                        </label>
                        <span className="text-xs text-slate-500">
                          Current Ratio: <strong className="text-slate-800 capitalize">{aspectRatio}</strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRESET_OPTIONS.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => handlePresetSelect(preset)}
                            className={`p-2.5 text-left rounded-xl border transition-all flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              activePresetId === preset.id
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-base">{preset.icon}</span>
                            <div className="overflow-hidden">
                              <div className="text-xs font-bold truncate">{preset.name}</div>
                              <div className={`text-[10px] truncate ${activePresetId === preset.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {preset.category}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                      <label htmlFor="zoom-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Zoom View
                      </label>
                      <input
                        id="zoom-slider"
                        type="range"
                        min="50"
                        max="150"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Zoom image preview"
                      />
                      <span className="text-xs font-bold text-indigo-600 min-w-[40px] text-right">{zoom}%</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500 text-center sm:text-left">
                        💡 Drag the crop box or drag any of the 4 corner handles to adjust your selection.
                      </p>
                      <div className="relative w-full border border-slate-200 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center p-4 min-h-[380px] select-none">
                        <div
                          ref={containerRef}
                          className="relative overflow-hidden inline-block max-w-full"
                          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                        >
                          <img
                            src={imageMeta.previewUrl}
                            alt="Image to crop"
                            className="max-h-[500px] max-w-full block object-contain pointer-events-none"
                          />

                          <div
                            onMouseDown={handleMouseDown('move')}
                            onTouchStart={handleTouchStart('move')}
                            className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] cursor-move touch-none"
                            style={{
                              left: `${cropBox.x}%`,
                              top: `${cropBox.y}%`,
                              width: `${cropBox.width}%`,
                              height: `${cropBox.height}%`,
                            }}
                            role="region"
                            aria-label="Crop area selection"
                          >
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/30">
                              <div className="border-r border-b border-white/30" />
                              <div className="border-r border-b border-white/30" />
                              <div className="border-b border-white/30" />
                              <div className="border-r border-b border-white/30" />
                              <div className="border-r border-b border-white/30" />
                              <div className="border-b border-white/30" />
                              <div className="border-r border-white/30" />
                              <div className="border-r border-white/30" />
                              <div />
                            </div>

                            <div
                              onMouseDown={handleMouseDown('nw')}
                              onTouchStart={handleTouchStart('nw')}
                              className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-600 border-2 border-white rounded-full cursor-nwse-resize shadow-md touch-none hover:scale-110 transition-transform"
                              aria-label="Resize top-left handle"
                            />
                            <div
                              onMouseDown={handleMouseDown('ne')}
                              onTouchStart={handleTouchStart('ne')}
                              className="absolute -top-3 -right-3 w-6 h-6 bg-indigo-600 border-2 border-white rounded-full cursor-nesw-resize shadow-md touch-none hover:scale-110 transition-transform"
                              aria-label="Resize top-right handle"
                            />
                            <div
                              onMouseDown={handleMouseDown('sw')}
                              onTouchStart={handleTouchStart('sw')}
                              className="absolute -bottom-3 -left-3 w-6 h-6 bg-indigo-600 border-2 border-white rounded-full cursor-nesw-resize shadow-md touch-none hover:scale-110 transition-transform"
                              aria-label="Resize bottom-left handle"
                            />
                            <div
                              onMouseDown={handleMouseDown('se')}
                              onTouchStart={handleTouchStart('se')}
                              className="absolute -bottom-3 -right-3 w-6 h-6 bg-indigo-600 border-2 border-white rounded-full cursor-nwse-resize shadow-md touch-none hover:scale-110 transition-transform"
                              aria-label="Resize bottom-right handle"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={generateCrop}
                      disabled={isProcessing}
                      className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      {isProcessing ? 'Processing Crop...' : 'Apply Crop & Refresh Preview'}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Output Settings</h3>
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
                                className={`py-2 text-xs font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  format === fmt
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
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
                            <label htmlFor="crop-quality-slider" className="text-xs font-medium text-slate-600">
                              Image Quality
                            </label>
                            <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                          </div>
                          <input
                            id="crop-quality-slider"
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Quality percentage"
                          />
                        </div>
                      )}
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cropped Result</span>
                        {isProcessing && (
                          <span className="text-xs text-indigo-600 font-medium animate-pulse flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                            Updating...
                          </span>
                        )}
                      </div>
                      <div className="relative aspect-square w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mb-3">
                        {croppedPreviewUrl ? (
                          <img
                            src={croppedPreviewUrl}
                            alt="Cropped Preview Result"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">Generating preview...</span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm border-t border-slate-200 pt-3">
                        <div className="flex justify-between text-slate-600 text-xs">
                          <span>Cropped Dimensions:</span>
                          <span className="font-semibold text-slate-800">
                            {croppedWidth} × {croppedHeight} px
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-xs">
                          <span>Output File Size:</span>
                          <span className="font-semibold text-slate-800">
                            {formatFileSize(croppedSize)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDownload}
                      disabled={!croppedPreviewUrl || isProcessing}
                      className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      Download Cropped Image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <RelatedTools currentId="image-cropper" categoryKey="image-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
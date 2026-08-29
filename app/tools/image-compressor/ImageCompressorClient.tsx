'use client';

import React, { useState } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import UploadDropzone from '@/app/components/UploadDropzone';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { CompressIcon } from '@/app/components/ToolIcons';

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    compressImage(selectedFile, quality);
  };

  const compressImage = (inputFile: File, q: number) => {
    setIsProcessing(true);
    const img = new Image();
    const url = URL.createObjectURL(inputFile);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            setCompressedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        },
        inputFile.type || 'image/jpeg',
        q / 100
      );
    };
    img.src = url;
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = Number(e.target.value);
    setQuality(q);
    if (file) compressImage(file, q);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Image Tools"
          title="Image Compressor"
          description="Compress PNG, JPG, and WebP images directly in your browser without quality loss."
          icon={CompressIcon}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {!file ? (
            <UploadDropzone
              accept="image/*"
              onFilesSelected={handleFiles}
              title="Upload an image to compress"
              subtitle="Supports JPG, PNG, and WebP"
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
              {/* Controls Header */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{file.name}</h2>
                    <p className="text-xs text-slate-500">Original Size: {formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => { setFile(null); setPreview(null); setCompressedUrl(null); }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 self-start sm:self-auto"
                  >
                    Change Image
                  </button>
                </div>

                {/* Quality Slider */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Compression Quality</span>
                    <span className="text-indigo-600 font-mono">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={handleQualityChange}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Stats Bar */}
              {compressedSize && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">Original</span>
                    <span className="text-sm font-bold text-slate-800">{formatSize(file.size)}</span>
                  </div>
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                    <span className="block text-[10px] font-mono text-indigo-500 uppercase">Compressed</span>
                    <span className="text-sm font-bold text-indigo-700">{formatSize(compressedSize)}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="block text-[10px] font-mono text-emerald-600 uppercase">Saved</span>
                    <span className="text-sm font-bold text-emerald-700">
                      {Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))}%
                    </span>
                  </div>
                </div>
              )}

              {/* Preview & Action */}
              <div className="space-y-4 text-center">
                {preview && compressedUrl && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-medium text-slate-500 mb-2">Original</span>
                      <img src={preview} alt="Original" className="max-h-64 mx-auto rounded-xl object-contain border border-slate-200" />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-slate-500 mb-2">Compressed</span>
                      <img src={compressedUrl} alt="Compressed" className="max-h-64 mx-auto rounded-xl object-contain border border-indigo-200" />
                    </div>
                  </div>
                )}

                {compressedUrl && (
                  <a
                    href={compressedUrl}
                    download={`compressed-${file.name}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
                  >
                    Download Compressed Image
                  </a>
                )}
              </div>
            </div>
          )}

          <RelatedTools currentId="image-compressor" categoryKey="image-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
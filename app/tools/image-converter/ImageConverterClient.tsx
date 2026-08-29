'use client';

import React, { useState, useEffect, useRef, useMemo, ChangeEvent, DragEvent } from 'react';
import Link from 'next/link';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

interface ImageFileMeta {
  file: File;
  name: string;
  originalFormat: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  previewUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFormatExtension(mimeType: OutputFormat): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
  }
}

function getFormatLabel(mimeType: string): string {
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'JPG';
  if (mimeType.includes('png')) return 'PNG';
  if (mimeType.includes('webp')) return 'WebP';
  return mimeType.split('/')[1]?.toUpperCase() || 'UNKNOWN';
}

export default function ImageConverterPage() {
  const [imageMeta, setImageMeta] = useState<ImageFileMeta | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/png');
  const [quality, setQuality] = useState<number>(90);

  const [convertedPreviewUrl, setConvertedPreviewUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [convertedWidth, setConvertedWidth] = useState<number>(0);
  const [convertedHeight, setConvertedHeight] = useState<number>(0);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kusafisha kumbukumbu ya URL ili kuzuia memory leaks
  useEffect(() => {
    return () => {
      if (imageMeta?.previewUrl) {
        URL.revokeObjectURL(imageMeta.previewUrl);
      }
      if (convertedPreviewUrl) {
        URL.revokeObjectURL(convertedPreviewUrl);
      }
    };
  }, []);

  const handleFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Aina ya faili haitumiki. Tafadhali weka JPG, JPEG, PNG, au WebP.');
      return;
    }

    setErrorMessage(null);

    if (imageMeta?.previewUrl) URL.revokeObjectURL(imageMeta.previewUrl);
    if (convertedPreviewUrl) {
      URL.revokeObjectURL(convertedPreviewUrl);
      setConvertedPreviewUrl(null);
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImageMeta({
        file,
        name: file.name,
        originalFormat: getFormatLabel(file.type),
        originalWidth: img.width,
        originalHeight: img.height,
        originalSize: file.size,
        previewUrl: objectUrl,
      });

      if (file.type === 'image/png') {
        setOutputFormat('image/jpeg');
      } else {
        setOutputFormat('image/png');
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setErrorMessage('Imeshindikana kusoma picha uliyoweka.');
    };

    img.src = objectUrl;
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Kuchakata na kubadilisha picha kupitia Canvas API
  useEffect(() => {
    if (!imageMeta) return;

    let isMounted = true;
    setIsConverting(true);

    const img = new Image();
    img.src = imageMeta.previewUrl;

    img.onload = () => {
      if (!isMounted) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        if (isMounted) {
          setIsConverting(false);
          setErrorMessage('Imeshindwa kuanzisha mazingira ya canvas.');
        }
        return;
      }

      // Kuweka rangi nyeupe nyuma kama ni JPG kuzuia uwazi (transparency) kuwa mweusi
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const targetQuality = outputFormat === 'image/png' ? undefined : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!isMounted) return;
          setIsConverting(false);

          if (!blob) {
            setErrorMessage('Ubadilishaji wa picha umeshindikana.');
            return;
          }

          setConvertedPreviewUrl((prevUrl) => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return URL.createObjectURL(blob);
          });

          setConvertedSize(blob.size);
          setConvertedWidth(canvas.width);
          setConvertedHeight(canvas.height);
        },
        outputFormat,
        targetQuality
      );
    };

    img.onerror = () => {
      if (isMounted) {
        setIsConverting(false);
        setErrorMessage('Imeshindikana kuchakata picha.');
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageMeta, outputFormat, quality]);

  const handleDownload = () => {
    if (!convertedPreviewUrl || !imageMeta) return;

    const lastDotIndex = imageMeta.name.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? imageMeta.name.substring(0, lastDotIndex) : imageMeta.name;
    const extension = getFormatExtension(outputFormat);

    const link = document.createElement('a');
    link.href = convertedPreviewUrl;
    link.download = `${baseName}-converted.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartOver = () => {
    if (imageMeta?.previewUrl) URL.revokeObjectURL(imageMeta.previewUrl);
    if (convertedPreviewUrl) URL.revokeObjectURL(convertedPreviewUrl);

    setImageMeta(null);
    setConvertedPreviewUrl(null);
    setConvertedSize(0);
    setConvertedWidth(0);
    setConvertedHeight(0);
    setErrorMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sizeDifference = useMemo(() => {
    if (!imageMeta || !convertedSize) return null;
    const diff = convertedSize - imageMeta.originalSize;
    const percentage = ((Math.abs(diff) / imageMeta.originalSize) * 100).toFixed(1);

    if (diff < 0) {
      return { text: `${percentage}% ndogo zaidi`, isSmaller: true };
    } else if (diff > 0) {
      return { text: `${percentage}% kubwa zaidi`, isSmaller: false };
    }
    return { text: 'Ukubwa sawa', isSmaller: true };
  }, [imageMeta, convertedSize]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <div>
        {/* Header / Utepe wa Juu */}
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-indigo-600 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs">KT</span>
              KachilTools
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              &larr; Rudi kwenye Zana Zote
            </Link>
          </div>
        </header>

        {/* Eneo Kuu la Zana (Tool Workspace) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
              <span>⚡ Zana ya Picha</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Kigeuzi cha Picha (Image Converter)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Badilisha umbizo la picha zako kwenda JPG, PNG, au WebP papo hapo kwa usalama ndani ya kivinjari chako.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            {/* Ujumbe wa Makosa */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between shadow-xs">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="font-bold text-red-800 hover:text-red-900 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  ✕
                </button>
              </div>
            )}

            {!imageMeta ? (
              /* Sehemu ya Kudondosha Picha (Dropzone) */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
                tabIndex={0}
                role="button"
                aria-label="Pakia picha hapa"
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[260px] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/60 scale-[0.99]'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-400'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-14 h-14 mb-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xl shadow-xs">
                  📁
                </div>
                <h2 className="text-sm font-bold text-slate-800 mb-1">Buruta picha yako hapa au bofya kuchagua</h2>
                <p className="text-xs text-slate-400 mb-4">Inasaidia faili za JPG, JPEG, PNG, na WebP</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">JPG</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">PNG</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-600 shadow-2xs">WebP</span>
                </div>
              </div>
            ) : (
              /* Eneo la Mipangilio na Matokeo */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="truncate max-w-md">
                    <h2 className="text-sm font-bold text-slate-900 truncate">{imageMeta.name}</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Asili: {imageMeta.originalFormat} • {imageMeta.originalWidth}×{imageMeta.originalHeight}px • {formatBytes(imageMeta.originalSize)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span>✕</span> Weka Picha Nyingine
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Safu ya Kushoto: Chaguzi */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Chagua Umbizo Jipya (Output Format)
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { mime: 'image/jpeg', label: 'JPG' },
                            { mime: 'image/png', label: 'PNG' },
                            { mime: 'image/webp', label: 'WebP' },
                          ] as const
                        ).map((item) => {
                          const isSelected = outputFormat === item.mime;
                          return (
                            <button
                              key={item.mime}
                              type="button"
                              onClick={() => setOutputFormat(item.mime)}
                              className={`py-2.5 text-xs font-bold rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor="quality-slider"
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            outputFormat === 'image/png' ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          Ubora wa Picha (Quality)
                        </label>
                        {outputFormat !== 'image/png' && (
                          <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                        )}
                      </div>

                      {outputFormat === 'image/png' ? (
                        <p className="text-[11px] text-slate-400 italic">
                          PNG inatumia mfumo usiopunguza ubora (Lossless). Kigeuza ubora hakitumiki hapa.
                        </p>
                      ) : (
                        <input
                          id="quality-slider"
                          type="range"
                          min="10"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Safu ya Kulia: Onyesho la Awali na Takwimu */}
                  <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Matokeo & Onyesho la Awali
                        </span>
                        {isConverting && (
                          <span className="text-[11px] text-indigo-600 font-semibold animate-pulse">
                            Inabadilisha...
                          </span>
                        )}
                      </div>

                      <div className="relative aspect-video w-full rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mb-3">
                        {convertedPreviewUrl ? (
                          <img
                            src={convertedPreviewUrl}
                            alt="Matokeo yaliyobadilishwa"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">Inachakata...</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs border-t border-slate-200/80 pt-3">
                      <div className="flex justify-between text-slate-500">
                        <span>Ukubwa Mpya:</span>
                        <span className="font-semibold text-slate-800">
                          {isConverting ? '...' : formatBytes(convertedSize)}
                        </span>
                      </div>
                      {sizeDifference && (
                        <div className="flex justify-between text-slate-500">
                          <span>Tofauti ya Ukubwa:</span>
                          <span
                            className={`font-semibold ${
                              sizeDifference.isSmaller ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {sizeDifference.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kitufe cha Kupakua */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isConverting || !convertedPreviewUrl}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <span>⬇️</span> Pakua Picha Iliyobadilishwa
                  </button>
                </div>
              </div>
            )}

            {/* Ujumbe wa Faragha */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                🔒 Data yako haitumwi kwenye mtandao wowote. Kila kitu kinafanyika ndani ya kivinjari chako kwa usalama kamili.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} KachilTools. Haki zote zimehifadhiwa.
        </div>
      </footer>
    </main>
  );
}
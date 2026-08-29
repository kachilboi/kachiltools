'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { TextPdfIcon } from '@/app/components/ToolIcons';

type OutputFormat = 'image/jpeg' | 'image/png';
type ScaleOption = 1 | 1.5 | 2 | 3;

interface PDFMeta {
  file: File;
  name: string;
  size: number;
  numPages: number;
}

interface ConvertedPage {
  pageIndex: number; // 1-indexed
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function PdfToImagePage() {
  const [pdfMeta, setPdfMeta] = useState<PDFMeta | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Conversion Options
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [scale, setScale] = useState<ScaleOption>(2);
  const [quality, setQuality] = useState<number>(90); // 10 to 100 for JPG

  // Conversion State
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  // UI States
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfjs, setPdfjs] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamically load PDF.js client-side to prevent SSR issues
  useEffect(() => {
    let isMounted = true;
    import('pdfjs-dist').then((pdfjsLib) => {
      if (!isMounted) return;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      setPdfjs(pdfjsLib);
    }).catch((err) => {
      console.error('Failed to load pdfjs-dist library:', err);
      if (isMounted) {
        setErrorMessage('Failed to initialize PDF renderer. Please refresh the page.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Cleanup object URLs on unmount or reset
  const cleanupConvertedPages = (pages: ConvertedPage[]) => {
    pages.forEach((page) => {
      if (page.dataUrl) {
        URL.revokeObjectURL(page.dataUrl);
      }
    });
  };

  useEffect(() => {
    return () => {
      cleanupConvertedPages(convertedPages);
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, []);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Unsupported file format. Please upload a valid PDF document.');
      return;
    }

    if (!pdfjs) {
      setErrorMessage('PDF engine is still loading. Please wait a moment and try again.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: 100 });

    try {
      if (pdfDoc) {
        pdfDoc.destroy();
        setPdfDoc(null);
      }
      cleanupConvertedPages(convertedPages);
      setConvertedPages([]);

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;

      setPdfDoc(doc);
      setPdfMeta({
        file,
        name: file.name,
        size: file.size,
        numPages: doc.numPages,
      });
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setErrorMessage('Failed to read or parse PDF file. The document may be corrupted or password-protected.');
      setPdfMeta(null);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
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

  const convertPdfPages = async () => {
    if (!pdfDoc || !pdfMeta) return;

    setIsProcessing(true);
    setErrorMessage(null);

    cleanupConvertedPages(convertedPages);
    setConvertedPages([]);

    const totalPages = pdfDoc.numPages;
    const newPages: ConvertedPage[] = [];

    try {
      for (let i = 1; i <= totalPages; i++) {
        setProgress({ current: i, total: totalPages });

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Canvas context failure.');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (outputFormat === 'image/jpeg') {
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const targetQuality = outputFormat === 'image/png' ? undefined : quality / 100;

        await new Promise<void>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                newPages.push({
                  pageIndex: i,
                  dataUrl: url,
                  blob,
                  width: canvas.width,
                  height: canvas.height,
                });
                resolve();
              } else {
                reject(new Error(`Failed to create blob for page ${i}`));
              }
            },
            outputFormat,
            targetQuality
          );
        });
      }

      setConvertedPages(newPages);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setErrorMessage('An error occurred during page conversion. Please try again with lower scale or quality settings.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  useEffect(() => {
    if (pdfDoc) {
      convertPdfPages();
    }
  }, [pdfDoc, outputFormat, scale, quality]);

  const handleDownloadSingle = (page: ConvertedPage) => {
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = pdfMeta?.name.replace(/\.[^/.]+$/, '') || 'document';
    const fileName = `${baseName}-page-${page.pageIndex}.${ext}`;

    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (convertedPages.length === 0 || !pdfMeta) return;

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const ext = outputFormat === 'image/jpeg' ? 'jpg' : 'png';
      const baseName = pdfMeta.name.replace(/\.[^/.]+$/, '') || 'document';

      convertedPages.forEach((page) => {
        const fileName = `${baseName}-page-${page.pageIndex}.${ext}`;
        zip.file(fileName, page.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${baseName}-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error('ZIP creation error:', err);
      setErrorMessage('Failed to create ZIP package for download.');
    }
  };

  const handleStartOver = () => {
    if (pdfDoc) {
      pdfDoc.destroy();
      setPdfDoc(null);
    }
    cleanupConvertedPages(convertedPages);
    setConvertedPages([]);
    setPdfMeta(null);
    setErrorMessage(null);
    setProgress(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Document Tools"
          title="PDF to JPG / PNG Converter"
          description="Convert PDF pages into high-quality JPG or PNG images directly in your browser."
          icon={TextPdfIcon}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="font-bold text-red-800 hover:text-red-900 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {!pdfMeta ? (
              /* Upload Area */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Upload PDF file"
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-14 h-14 mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-semibold shadow-sm">
                  📄
                </div>
                <h2 className="text-base font-bold text-slate-800 mb-1">
                  Drop your PDF here
                </h2>
                <p className="text-xs text-slate-500">
                  or <span className="text-indigo-600 font-semibold underline">click to browse</span> a PDF document
                </p>
              </div>
            ) : (
              /* Conversion Workspace */
              <div className="space-y-6">
                {/* Meta Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="truncate max-w-md">
                    <h2 className="text-sm font-bold text-slate-800 truncate">{pdfMeta.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      PDF • {pdfMeta.numPages} {pdfMeta.numPages === 1 ? 'page' : 'pages'} • {formatBytes(pdfMeta.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span>✕</span> Start Over
                  </button>
                </div>

                {/* Conversion Settings Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {/* Format Choice */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Output Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { mime: 'image/jpeg', label: 'JPG' },
                          { mime: 'image/png', label: 'PNG' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.mime}
                          type="button"
                          onClick={() => setOutputFormat(item.mime)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            outputFormat === item.mime
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution / Scale Option */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Image Scale / Resolution
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { value: 1, label: '1x' },
                          { value: 1.5, label: '1.5x' },
                          { value: 2, label: '2x' },
                          { value: 3, label: '3x' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setScale(item.value)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            scale === item.value
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality Slider (JPG only) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="pdf-quality-slider"
                        className={`text-xs font-bold uppercase tracking-wider ${
                          outputFormat === 'image/png' ? 'text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        JPG Quality
                      </label>
                      {outputFormat === 'image/jpeg' && (
                        <span className="text-xs font-bold text-indigo-600">{quality}%</span>
                      )}
                    </div>
                    {outputFormat === 'image/png' ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        PNG uses lossless format. Quality control disabled.
                      </p>
                    ) : (
                      <input
                        id="pdf-quality-slider"
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 mt-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Quality percentage"
                      />
                    )}
                  </div>
                </div>

                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center space-y-3">
                    <div className="inline-block animate-spin text-2xl text-indigo-600">⚡</div>
                    <h3 className="text-sm font-semibold text-indigo-900">
                      Converting PDF Pages ({progress ? `${progress.current} of ${progress.total}` : 'Initializing...'})
                    </h3>
                    {progress && (
                      <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden max-w-md mx-auto">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-200"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Batch Actions */}
                {!isProcessing && convertedPages.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">
                      Converted {convertedPages.length} {convertedPages.length === 1 ? 'page' : 'pages'} successfully
                    </span>
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      className="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span>📦</span> Download All Pages (.ZIP)
                    </button>
                  </div>
                )}

                {/* Pages Grid Preview */}
                {!isProcessing && convertedPages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {convertedPages.map((page) => (
                      <div
                        key={page.pageIndex}
                        className="border border-slate-200 bg-slate-50/50 rounded-2xl p-3 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
                      >
                        <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                          <img
                            src={page.dataUrl}
                            alt={`PDF Page ${page.pageIndex}`}
                            className="max-h-full max-w-full object-contain"
                          />
                          <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Page {page.pageIndex}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs text-slate-500 px-1">
                            <span>{page.width} × {page.height} px</span>
                            <span className="font-semibold text-slate-700">{formatBytes(page.blob.size)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(page)}
                            className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                          >
                            <span>⬇️</span> Download Page {page.pageIndex}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Privacy Guarantee */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                🔒 Your PDF is processed locally in your browser. Nothing is uploaded.
              </p>
            </div>
          </div>

          <RelatedTools currentId="pdf-to-image" categoryKey="document-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
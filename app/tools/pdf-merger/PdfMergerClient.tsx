'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { TextPdfIcon } from '@/app/components/ToolIcons';

interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function PdfMergerPage() {
  const [pdfFiles, setPdfFiles] = useState<PDFFileItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedFileSize, setMergedFileSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (mergedBlobUrl) {
        URL.revokeObjectURL(mergedBlobUrl);
      }
    };
  }, [mergedBlobUrl]);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validPdfs = fileArray.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (validPdfs.length !== fileArray.length) {
      setErrorMessage('One or more selected files are not valid PDFs and were skipped.');
    } else {
      setErrorMessage(null);
    }

    if (validPdfs.length === 0) return;

    const newItems: PDFFileItem[] = await Promise.all(
      validPdfs.map(async (file) => {
        let pageCount: number | null = null;
        try {
          const buffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          pageCount = doc.getPageCount();
        } catch (err) {
          console.error(`Failed to read page count for ${file.name}:`, err);
        }

        return {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
        };
      })
    );

    setPdfFiles((prev) => [...prev, ...newItems]);
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pdfFiles.length) return;

    const updated = [...pdfFiles];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setPdfFiles(updated);
  };

  const removeItem = (id: string) => {
    setPdfFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setErrorMessage('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setErrorMessage(null);

    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
      setMergedBlobUrl(null);
      setMergedFileSize(null);
    }

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const safeBytes = new Uint8Array(mergedPdfBytes);
      const blob = new Blob([safeBytes.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedBlobUrl(url);
      setMergedFileSize(blob.size);
    } catch (err: unknown) {
      console.error('PDF Merge Error:', err);
      setErrorMessage(
        'Failed to merge the selected PDF files. One of the documents may be encrypted, corrupted, or incompatible.'
      );
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;

    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = 'merged-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartOver = () => {
    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
    }
    setPdfFiles([]);
    setMergedBlobUrl(null);
    setMergedFileSize(null);
    setErrorMessage(null);
    setIsMerging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalPagesSum = pdfFiles.reduce(
    (acc, item) => (item.pageCount ? acc + item.pageCount : acc),
    0
  );
  const totalSizeBytes = pdfFiles.reduce((acc, item) => acc + item.size, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Document Tools"
          title="Merge PDF Files"
          description="Combine multiple PDF files into one document instantly in your browser."
          icon={TextPdfIcon}
        />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
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
              aria-label="Upload PDF files to merge"
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf,.pdf"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-14 h-14 mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl font-semibold shadow-sm">
                📚
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">
                Drop PDF files here
              </h2>
              <p className="text-xs text-slate-500">
                or <span className="text-indigo-600 font-semibold underline">click to browse</span> multiple PDF files
              </p>
            </div>

            {pdfFiles.length > 0 && (
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                      Selected Documents ({pdfFiles.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Total size: {formatBytes(totalSizeBytes)}
                      {totalPagesSum > 0 ? ` • ${totalPagesSum} pages total` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span>✕</span> Clear All
                  </button>
                </div>

                <ul className="space-y-3">
                  {pdfFiles.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3 truncate mr-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 font-bold text-xs rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatBytes(item.size)}
                            {item.pageCount !== null ? ` • ${item.pageCount} ${item.pageCount === 1 ? 'page' : 'pages'}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          title="Move Up"
                          aria-label="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={index === pdfFiles.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          title="Move Down"
                          aria-label="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ml-1"
                          title="Remove"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleMerge}
                    disabled={pdfFiles.length < 2 || isMerging}
                    className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {isMerging ? (
                      <>
                        <span className="animate-spin">⚡</span> Merging PDFs...
                      </>
                    ) : (
                      <>
                        <span>🔗</span> Merge PDFs
                      </>
                    )}
                  </button>
                  {pdfFiles.length < 2 && (
                    <p className="text-xs text-center text-slate-400 mt-2">
                      Add at least one more PDF file to enable merging.
                    </p>
                  )}
                </div>
              </div>
            )}

            {mergedBlobUrl && (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3 text-emerald-800">
                  <span className="text-xl">✅</span>
                  <div>
                    <h3 className="text-sm font-bold">PDFs merged successfully!</h3>
                    <p className="text-xs text-emerald-600">
                      Final merged document size: {mergedFileSize ? formatBytes(mergedFileSize) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <span>⬇️</span> Download Merged PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                🔒 Your PDF files are processed locally in your browser. Nothing is uploaded or stored.
              </p>
            </div>
          </div>

          <RelatedTools currentId="pdf-merger" categoryKey="document-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
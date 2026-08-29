'use client';

import React, { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { WordCountIcon } from '@/app/components/ToolIcons';
import jsPDF from 'jspdf';

type PageSize = 'a4' | 'letter';
type Orientation = 'p' | 'l';

interface GeneratedPdfInfo {
  url: string;
  pageCount: number;
}

// Pure validation/computation helper
function computePdfStats(text: string) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const paragraphCount = text ? text.split('\n').filter(p => p.trim().length > 0).length : 0;
  return { charCount, wordCount, paragraphCount };
}

export default function TextToPdfPage() {
  const [text, setText] = useState<string>('');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('p');
  const [fontSize, setFontSize] = useState<number>(12);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfInfo, setPdfInfo] = useState<GeneratedPdfInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Pure derived state using useMemo
  const stats = useMemo(() => computePdfStats(text), [text]);

  // Clean up Object URL on unmount or re-generation
  useEffect(() => {
    return () => {
      if (pdfInfo?.url) {
        URL.revokeObjectURL(pdfInfo.url);
      }
    };
  }, [pdfInfo]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const handleGeneratePdf = () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);

    // Clean up previous PDF Blob URL
    if (pdfInfo?.url) {
      URL.revokeObjectURL(pdfInfo.url);
      setPdfInfo(null);
    }

    try {
      // Create jsPDF instance
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'pt',
        format: pageSize,
      });

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Margins and line height calculations
      const margin = 40;
      const printableWidth = pageWidth - margin * 2;
      const lineHeight = fontSize * 1.35;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(fontSize);

      // Split text into paragraphs according to user line breaks
      const paragraphs = text.split('\n');
      let currentY = margin;

      paragraphs.forEach((paragraph, index) => {
        // Wrap long lines within printable width
        const lines = doc.splitTextToSize(paragraph || ' ', printableWidth);

        lines.forEach((line: string) => {
          // Check if line exceeds available page height
          if (currentY + lineHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
          }

          doc.text(line, margin, currentY);
          currentY += lineHeight;
        });

        // Add paragraph spacing (except after the last paragraph)
        if (index < paragraphs.length - 1) {
          currentY += lineHeight * 0.3;
        }
      });

      const totalPages = doc.getNumberOfPages();
      const pdfArrayBuffer = doc.output('arraybuffer');
      const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfInfo({
        url,
        pageCount: totalPages,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Unable to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfInfo?.url || !downloadRef.current) return;
    downloadRef.current.href = pdfInfo.url;
    downloadRef.current.download = 'kachiltools-text.pdf';
    downloadRef.current.click();
  };

  const handleStartOver = () => {
    if (pdfInfo?.url) {
      URL.revokeObjectURL(pdfInfo.url);
    }
    setText('');
    setPageSize('a4');
    setOrientation('p');
    setFontSize(12);
    setPdfInfo(null);
    setErrorMessage(null);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Document Tools"
          title="Text to PDF Converter"
          description="Convert your notes, essays, or code snippets into a formatted, professional PDF document instantly."
          icon={WordCountIcon}
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
                  className="font-bold text-red-800 hover:text-red-900 p-1 rounded-md focus:outline-none"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Document Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label htmlFor="pageSize" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Size
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSize)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </select>
              </div>

              <div>
                <label htmlFor="orientation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Orientation
                </label>
                <select
                  id="orientation"
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as Orientation)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="p">Portrait</option>
                  <option value="l">Landscape</option>
                </select>
              </div>

              <div>
                <label htmlFor="fontSize" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Font Size
                </label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>10 pt</option>
                  <option value={12}>12 pt</option>
                  <option value={14}>14 pt</option>
                  <option value={16}>16 pt</option>
                  <option value={18}>18 pt</option>
                  <option value={20}>20 pt</option>
                </select>
              </div>
            </div>

            {/* Text Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="pdfText" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter Your Text
                </label>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span>Characters: {stats.charCount}</span>
                  <span>Words: {stats.wordCount}</span>
                  <span>Paragraphs: {stats.paragraphCount}</span>
                </div>
              </div>
              <textarea
                id="pdfText"
                rows={12}
                value={text}
                onChange={handleTextChange}
                placeholder="Write or paste your text here..."
                className="w-full p-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed text-slate-800 resize-y bg-slate-50/30"
              />
            </div>

            {/* Action Buttons */}
            <div>
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={!text.trim() || isGenerating}
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⚡</span> Generating PDF...
                  </>
                ) : (
                  <>
                    <span>📄</span> Generate PDF
                  </>
                )}
              </button>
            </div>

            {/* PDF Generation Ready Card */}
            {pdfInfo && (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3 text-emerald-800">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="text-sm font-bold">PDF generated successfully!</h3>
                    <p className="text-xs text-emerald-700">
                      File name: <span className="font-semibold">kachiltools-text.pdf</span> • Pages: {pdfInfo.pageCount}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full sm:w-auto flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <span>⬇️</span> Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Hidden Anchor for Download */}
            <a ref={downloadRef} className="hidden" aria-hidden="true" />

            {/* Privacy Guarantee */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                🔒 Your text is processed locally in your browser. Nothing is uploaded.
              </p>
            </div>
          </div>

          <RelatedTools currentId="text-to-pdf" categoryKey="document-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
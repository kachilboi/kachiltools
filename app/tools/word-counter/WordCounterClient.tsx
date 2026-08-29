'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { WordCountIcon } from '@/app/components/ToolIcons';

// Pure computation/helper function outside component
function computeTextStats(text: string) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  const wordsArray = text.trim().length > 0 ? text.trim().split(/\s+/) : [];
  const words = wordsArray.length;

  const sentencesArray = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentences = sentencesArray.length;

  const paragraphsArray = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const paragraphs = paragraphsArray.length;

  const lines = text.length > 0 ? text.split('\n').length : 0;

  const readingTimeMinutes = words / 200;
  let readingTimeText = '0 min';
  if (words > 0) {
    if (readingTimeMinutes < 1) {
      readingTimeText = '< 1 min';
    } else {
      readingTimeText = `${Math.ceil(readingTimeMinutes)} min`;
    }
  }

  const avgWordsPerSentence =
    sentences > 0 ? (words / sentences).toFixed(1) : '0';
  const avgCharsPerWord =
    words > 0 ? (charactersNoSpaces / words).toFixed(1) : '0';

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTimeText,
    avgWordsPerSentence,
    avgCharsPerWord,
  };
}

export default function WordCounterPage() {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [enableLimit, setEnableLimit] = useState<boolean>(false);
  const [maxCharacters, setMaxCharacters] = useState<number>(5000);

  // Pure derived state via useMemo
  const stats = useMemo(() => computeTextStats(text), [text]);

  const isLimitExceeded = enableLimit && stats.characters > maxCharacters;

  // Handlers
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClear = () => {
    setText('');
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kachiltools-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Text Tools"
          title="Word Counter"
          description="Count words, characters, sentences, paragraphs, and reading time instantly."
          icon={WordCountIcon}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Editor & Controls */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                {/* Character Limit Configuration Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableLimit}
                      onChange={(e) => setEnableLimit(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Enable Character Limit
                    </span>
                  </label>

                  {enableLimit && (
                    <div className="flex items-center space-x-2">
                      <label htmlFor="maxChars" className="text-xs font-semibold text-slate-600">
                        Max characters:
                      </label>
                      <input
                        id="maxChars"
                        type="number"
                        min={1}
                        value={maxCharacters}
                        onChange={(e) => setMaxCharacters(Math.max(1, Number(e.target.value)))}
                        className="w-28 p-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                {/* Main Text Editor */}
                <div className="relative">
                  <textarea
                    rows={14}
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Type or paste your text here..."
                    className={`w-full p-4 border rounded-2xl focus:outline-none focus:ring-2 text-slate-800 text-base leading-relaxed resize-y font-sans transition-colors ${
                      isLimitExceeded
                        ? 'border-red-300 focus:ring-red-400 bg-red-50/20'
                        : 'border-slate-300 focus:ring-indigo-500'
                    }`}
                  />

                  {/* Limit Counter Indicator */}
                  {enableLimit && (
                    <div className="mt-2 text-right">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                          isLimitExceeded
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {stats.characters.toLocaleString()} / {maxCharacters.toLocaleString()} characters
                        {isLimitExceeded && ' (Limit Exceeded)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!text}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm flex items-center gap-1.5"
                  >
                    <span>📋</span> {copied ? 'Copied!' : 'Copy Text'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    disabled={!text}
                    className="py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-700 font-semibold rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1.5"
                  >
                    <span>⬇️</span> Download TXT
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={!text}
                    className="py-2.5 px-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed text-red-600 font-semibold rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ml-auto flex items-center gap-1.5"
                  >
                    <span>🗑️</span> Clear Text
                  </button>
                </div>
              </div>

              {/* Text Analysis Info Box */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Text Analysis Guide
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Word Count</span>
                    Counts words separated by whitespace or line breaks.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Character Count</span>
                    Includes spaces, letters, numbers, and punctuation.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Reading Time</span>
                    Estimated using average adult reading speed of 200 WPM.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Statistics Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
                  Statistics Summary
                </h2>

                {/* Primary Highlights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 block">
                      {stats.words.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mt-1 block">
                      Words
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 block">
                      {stats.characters.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1 block">
                      Characters
                    </span>
                  </div>
                </div>

                {/* Secondary Metrics List */}
                <div className="space-y-3 text-sm divide-y divide-slate-100">
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-600 font-medium">Chars (no spaces):</span>
                    <span className="font-mono font-bold text-slate-900">
                      {stats.charactersNoSpaces.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-600 font-medium">Sentences:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {stats.sentences.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-600 font-medium">Paragraphs:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {stats.paragraphs.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-600 font-medium">Lines:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {stats.lines.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-600 font-medium">Reading Time:</span>
                    <span className="font-mono font-bold text-indigo-600">
                      {stats.readingTimeText}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-600 font-medium">Avg. Words / Sentence:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {stats.avgWordsPerSentence}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <span className="text-slate-600 font-medium">Avg. Chars / Word:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {stats.avgCharsPerWord}
                    </span>
                  </div>
                </div>

                {/* Privacy Guarantee */}
                <div className="pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500">
                    🔒 Your text is analyzed locally in your browser. Nothing is uploaded.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools currentId="word-counter" categoryKey="text-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
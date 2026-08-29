'use client';

import React, { useState, ChangeEvent } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { PaletteIcon } from '@/app/components/ToolIcons';

const DEFAULT_COLOR = '#4F46E5';

const PRESET_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#A855F7' },
];

export default function ColorPickerPage() {
  const [currentColor, setCurrentColor] = useState<string>(DEFAULT_COLOR);
  const [hexInput, setHexInput] = useState<string>(DEFAULT_COLOR);
  const [isValidHex, setIsValidHex] = useState<boolean>(true);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Helper: Validate 6-digit or 3-digit HEX
  const validateHex = (hex: string): boolean => {
    return /^#?([0-9A-FA-F]{3}|[0-9A-FA-F]{6})$/.test(hex);
  };

  // Helper: Normalize user input to uppercase #RRGGBB format
  const normalizeHex = (hex: string): string => {
    let cleanHex = hex.trim().replace(/^#/, '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    return `#${cleanHex.toUpperCase()}`;
  };

  // Helper: Convert HEX string to { r, g, b } numbers
  const hexToRgbValues = (hex: string): { r: number; g: number; b: number } => {
    const normalized = normalizeHex(hex);
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return { r, g, b };
  };

  // Convert HEX to formatted RGB string: rgb(r, g, b)
  const getRgbString = (hex: string): string => {
    if (!validateHex(hex)) return 'rgb(0, 0, 0)';
    const { r, g, b } = hexToRgbValues(hex);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert HEX to formatted HSL string: hsl(h, s%, l%)
  const getHslString = (hex: string): string => {
    if (!validateHex(hex)) return 'hsl(0, 0%, 0%)';
    const { r: r255, g: g255, b: b255 } = hexToRgbValues(hex);

    const r = r255 / 255;
    const g = g255 / 255;
    const b = b255 / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);

    return `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;
  };

  // Handlers
  const applyColor = (hex: string) => {
    const normalized = normalizeHex(hex);
    setCurrentColor(normalized);
    setHexInput(normalized);
    setIsValidHex(true);
  };

  const handleNativePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    applyColor(e.target.value);
  };

  const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);

    if (validateHex(val)) {
      setIsValidHex(true);
      setCurrentColor(normalizeHex(val));
    } else {
      setIsValidHex(false);
    }
  };

  const handleGenerateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
      .toUpperCase()}`;
    applyColor(randomColor);
  };

  const handleReset = () => {
    applyColor(DEFAULT_COLOR);
  };

  const handleCopy = async (text: string, formatLabel: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(formatLabel);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedFormat(formatLabel);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  const rgbValue = getRgbString(currentColor);
  const hslValue = getHslString(currentColor);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Design Tools"
          title="Color Picker"
          description="Pick a color and instantly get its HEX, RGB, and HSL values."
          icon={PaletteIcon}
        />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
            {/* Color Preview & Core Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Large Color Preview Box */}
              <div
                className="w-full h-48 sm:h-56 rounded-2xl border border-slate-200 shadow-inner flex flex-col justify-end p-6 transition-colors duration-200 relative overflow-hidden"
                style={{ backgroundColor: currentColor }}
              >
                <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-3 text-white inline-block max-w-max border border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider block text-slate-200">
                    Selected Color
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider">
                    {currentColor}
                  </span>
                </div>
              </div>

              {/* Native Picker & Inputs */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="nativePicker"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                  >
                    Select with Native Picker
                  </label>
                  <div className="flex items-center space-x-3 p-2 border border-slate-200 rounded-xl bg-slate-50">
                    <input
                      id="nativePicker"
                      type="color"
                      value={currentColor}
                      onChange={handleNativePickerChange}
                      className="h-10 w-16 cursor-pointer bg-transparent border-0 rounded"
                    />
                    <span className="text-xs font-medium text-slate-600">
                      Click the swatch to open system color selector
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hexInput"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                  >
                    HEX Color
                  </label>
                  <input
                    id="hexInput"
                    type="text"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    placeholder="#4F46E5"
                    className={`w-full p-3 border rounded-xl font-mono text-base uppercase text-slate-900 focus:outline-none focus:ring-2 ${
                      isValidHex
                        ? 'border-slate-300 focus:ring-indigo-500'
                        : 'border-red-400 focus:ring-red-400 bg-red-50/50'
                    }`}
                  />
                  {!isValidHex && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      Please enter a valid HEX color.
                    </p>
                  )}
                </div>

                {/* Random & Reset Controls */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateRandomColor}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-1.5"
                  >
                    <span>🎲</span> Generate Random Color
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Reset Color
                  </button>
                </div>
              </div>
            </div>

            {/* Presets Palette */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Preset Colors
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => applyColor(preset.hex)}
                    title={`${preset.name} (${preset.hex})`}
                    className="h-10 rounded-xl border border-slate-200 shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative group overflow-hidden"
                    style={{ backgroundColor: preset.hex }}
                  >
                    <span className="sr-only">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formatted Values Display & Copy Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Color Formats
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* HEX Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      HEX
                    </span>
                    <span className="font-mono text-base font-semibold text-slate-900 break-all">
                      {currentColor}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentColor, 'HEX')}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    {copiedFormat === 'HEX' ? 'Copied!' : 'Copy HEX'}
                  </button>
                </div>

                {/* RGB Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      RGB
                    </span>
                    <span className="font-mono text-base font-semibold text-slate-900 break-all">
                      {rgbValue}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(rgbValue, 'RGB')}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    {copiedFormat === 'RGB' ? 'Copied!' : 'Copy RGB'}
                  </button>
                </div>

                {/* HSL Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      HSL
                    </span>
                    <span className="font-mono text-base font-semibold text-slate-900 break-all">
                      {hslValue}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(hslValue, 'HSL')}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    {copiedFormat === 'HSL' ? 'Copied!' : 'Copy HSL'}
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Guarantee */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                🔒 Your color data is processed locally in your browser. Nothing is uploaded.
              </p>
            </div>
          </div>

          <RelatedTools currentId="color-picker" categoryKey="design-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { PasswordIcon } from '@/app/components/ToolIcons';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

type StrengthLevel = 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const isAtLeastOneSelected =
    includeUppercase || includeLowercase || includeNumbers || includeSymbols;

  // Uses Web Crypto API for cryptographically secure random values
  const generatePassword = useCallback(() => {
    if (!isAtLeastOneSelected) {
      setPassword('');
      return;
    }

    let charset = '';
    const guaranteedChars: string[] = [];

    // Build the character set and guarantee at least one char from each selected set
    if (includeUppercase) {
      charset += UPPERCASE;
      guaranteedChars.push(
        UPPERCASE[getSecureRandomInt(UPPERCASE.length)]
      );
    }
    if (includeLowercase) {
      charset += LOWERCASE;
      guaranteedChars.push(
        LOWERCASE[getSecureRandomInt(LOWERCASE.length)]
      );
    }
    if (includeNumbers) {
      charset += NUMBERS;
      guaranteedChars.push(
        NUMBERS[getSecureRandomInt(NUMBERS.length)]
      );
    }
    if (includeSymbols) {
      charset += SYMBOLS;
      guaranteedChars.push(
        SYMBOLS[getSecureRandomInt(SYMBOLS.length)]
      );
    }

    const remainingLength = length - guaranteedChars.length;
    const result: string[] = [...guaranteedChars];

    for (let i = 0; i < remainingLength; i++) {
      result.push(charset[getSecureRandomInt(charset.length)]);
    }

    // Cryptographically secure shuffle (Fisher-Yates)
    for (let i = result.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(i + 1);
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }

    setPassword(result.join(''));
    setCopied(false);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    isAtLeastOneSelected,
  ]);

  // Helper for secure random index generation avoiding bias
  function getSecureRandomInt(max: number): number {
    const array = new Uint32Array(1);
    const maxUint32 = 0xffffffff;
    const limit = maxUint32 - (maxUint32 % max);
    let randomVal: number;

    do {
      crypto.getRandomValues(array);
      randomVal = array[0];
    } while (randomVal >= limit);

    return randomVal % max;
  }

  // Generate an initial password on initial component mount
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy for older browser compatibility
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Evaluate password strength based on entropy, length, and character diversity
  const calculateStrength = (): { level: StrengthLevel; score: number } => {
    if (!password || !isAtLeastOneSelected) {
      return { level: 'Weak', score: 0 };
    }

    let selectedTypesCount = 0;
    if (includeUppercase) selectedTypesCount++;
    if (includeLowercase) selectedTypesCount++;
    if (includeNumbers) selectedTypesCount++;
    if (includeSymbols) selectedTypesCount++;

    if (length < 10 || selectedTypesCount === 1) {
      return { level: 'Weak', score: 1 };
    }
    if (length < 12 || selectedTypesCount === 2) {
      return { level: 'Fair', score: 2 };
    }
    if (length < 16 || selectedTypesCount === 3) {
      return { level: 'Strong', score: 3 };
    }
    return { level: 'Very Strong', score: 4 };
  };

  const strength = calculateStrength();

  const getStrengthBadgeColor = (level: StrengthLevel) => {
    switch (level) {
      case 'Weak':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Fair':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Strong':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Very Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getStrengthBarColor = (level: StrengthLevel) => {
    switch (level) {
      case 'Weak':
        return 'bg-red-500';
      case 'Fair':
        return 'bg-amber-500';
      case 'Strong':
        return 'bg-blue-500';
      case 'Very Strong':
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Security Tools"
          title="Password Generator"
          description="Generate strong random passwords instantly in your browser."
          icon={PasswordIcon}
        />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Generated Password Display */}
            <div>
              <label htmlFor="generatedPassword" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Generated Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="generatedPassword"
                  type="text"
                  readOnly
                  value={password}
                  placeholder={
                    !isAtLeastOneSelected ? 'Select at least one option' : ''
                  }
                  className="w-full pr-32 pl-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-base sm:text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors selection:bg-indigo-100"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!password}
                  className="absolute right-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  {copied ? 'Copied!' : 'Copy Password'}
                </button>
              </div>
            </div>

            {/* Password Strength Bar */}
            {isAtLeastOneSelected && password && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span
                    className={`px-2 py-0.5 rounded-md border text-xs font-bold ${getStrengthBadgeColor(
                      strength.level
                    )}`}
                  >
                    {strength.level}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthBarColor(
                      strength.level
                    )}`}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Warning Message if No Options Selected */}
            {!isAtLeastOneSelected && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
                Select at least one character type.
              </div>
            )}

            {/* Length Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="lengthSlider" className="text-sm font-bold text-slate-800">
                  Password Length
                </label>
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                  Length: {length}
                </span>
              </div>
              <input
                id="lengthSlider"
                type="range"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                Include Character Types
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Uppercase Letters (A-Z)
                  </span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Lowercase Letters (a-z)
                  </span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Numbers (0-9)
                  </span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Symbols (!@#$%^&*)
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={generatePassword}
                disabled={!isAtLeastOneSelected}
                className="flex-1 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm flex items-center justify-center gap-2"
              >
                <span>🔑</span> Generate Password
              </button>
              <button
                type="button"
                onClick={generatePassword}
                disabled={!isAtLeastOneSelected}
                className="py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-700 font-semibold rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm flex items-center justify-center gap-2"
              >
                <span>🔄</span> Regenerate
              </button>
            </div>

            {/* Privacy Guarantee */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                🔒 Passwords are generated locally in your browser. Nothing is uploaded or stored.
              </p>
            </div>
          </div>

          <RelatedTools currentId="password-generator" categoryKey="security-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
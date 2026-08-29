'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import ToolNavbar from '@/app/components/ToolNavbar';
import ToolHero from '@/app/components/ToolHero';
import RelatedTools from '@/app/components/RelatedTools';
import ToolFooter from '@/app/components/ToolFooter';
import { QrIcon } from '@/app/components/ToolIcons';
import QRCode from 'qrcode';

type QrType = 'url' | 'text' | 'email' | 'wifi' | 'phone';
type ErrorCorrectionLevel = 'low' | 'medium' | 'quartile' | 'high';

export default function QrGeneratorPage() {
  const [qrType, setQrType] = useState<QrType>('url');
  
  // Input fields
  const [urlInput, setUrlInput] = useState<string>('https://example.com');
  const [textInput, setTextInput] = useState<string>('Hello, world!');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiEncryption, setWifiEncryption] = useState<string>('WPA');
  const [phoneInput, setPhoneInput] = useState<string>('');

  // Styling options
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<number>(250);
  const [includeMargin, setIncludeMargin] = useState<boolean>(true);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('medium');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute final QR value based on selected type
  const getQrValue = () => {
    switch (qrType) {
      case 'url':
        return urlInput.trim() || 'https://example.com';
      case 'text':
        return textInput;
      case 'email':
        return `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'phone':
        return `tel:${phoneInput}`;
      default:
        return 'https://example.com';
    }
  };

  const qrValue = getQrValue();

  // Render QR code using the installed `qrcode` package
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(
      canvas,
      qrValue,
      {
        width: size,
        margin: includeMargin ? 4 : 0,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      },
      (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      }
    );
  }, [qrValue, size, includeMargin, fgColor, bgColor, errorLevel]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'kachiltools-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage('PNG downloaded successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDownloadSvg = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      handleDownloadPng();
      return;
    }

    QRCode.toString(
      qrValue,
      {
        type: 'svg',
        width: size,
        margin: includeMargin ? 4 : 0,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      },
      (err, svgString) => {
        if (err || !svgString) {
          handleDownloadPng();
          return;
        }

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'kachiltools-qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setSuccessMessage('SVG downloaded successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      <div>
        <ToolNavbar />
        <ToolHero
          category="Generator Tools"
          title="QR Code Generator"
          description="Create custom, high-resolution QR codes for URLs, text, Wi-Fi networks, emails, and phone numbers instantly."
          icon={QrIcon}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Input Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                {/* Type Selection Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Select Content Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['url', 'text', 'email', 'wifi', 'phone'] as QrType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setQrType(type)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                          qrType === type
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Inputs Based on Type */}
                <div className="pt-2">
                  {qrType === 'url' && (
                    <div className="space-y-1.5">
                      <label htmlFor="urlInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Website URL
                      </label>
                      <input
                        id="urlInput"
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                      />
                    </div>
                  )}

                  {qrType === 'text' && (
                    <div className="space-y-1.5">
                      <label htmlFor="textInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Plain Text
                      </label>
                      <textarea
                        id="textInput"
                        rows={4}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter your message here..."
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      />
                    </div>
                  )}

                  {qrType === 'email' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="emailAddress" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          id="emailAddress"
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="emailSubject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Subject (Optional)
                        </label>
                        <input
                          id="emailSubject"
                          type="text"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Hello"
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="emailBody" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Message Body (Optional)
                        </label>
                        <textarea
                          id="emailBody"
                          rows={3}
                          value={emailBody}
                          onChange={(e) => setEmailBody(e.target.value)}
                          placeholder="Write your message..."
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {qrType === 'wifi' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="wifiSsid" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Network Name (SSID)
                        </label>
                        <input
                          id="wifiSsid"
                          type="text"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="Home_WiFi"
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="wifiPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Password
                        </label>
                        <input
                          id="wifiPassword"
                          type="text"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="secretpassword"
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        />
                      </div>
                      <div>
                        <label htmlFor="wifiEncryption" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Encryption Type
                        </label>
                        <select
                          id="wifiEncryption"
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value)}
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">No Password</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {qrType === 'phone' && (
                    <div className="space-y-1.5">
                      <label htmlFor="phoneInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        id="phoneInput"
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                      />
                    </div>
                  )}
                </div>

                {/* Styling Options */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Customization Options
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fgColor" className="block text-xs font-medium text-slate-600 mb-1">
                        QR Code Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="fgColor"
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-10 h-10 rounded-xl border border-slate-300 p-1 bg-white cursor-pointer"
                        />
                        <input
                          type="text"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bgColor" className="block text-xs font-medium text-slate-600 mb-1">
                        Background Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="bgColor"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 rounded-xl border border-slate-300 p-1 bg-white cursor-pointer"
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label htmlFor="errorLevel" className="block text-xs font-medium text-slate-600 mb-1">
                        Error Correction Level
                      </label>
                      <select
                        id="errorLevel"
                        value={errorLevel}
                        onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                      >
                        <option value="low">Low (~7% recovery)</option>
                        <option value="medium">Medium (~15% recovery)</option>
                        <option value="quartile">Quartile (~25% recovery)</option>
                        <option value="high">High (~30% recovery)</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-6">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMargin}
                          onChange={(e) => setIncludeMargin(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Include Quiet Zone Margin
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live QR Preview & Download */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center space-y-6 sticky top-6">
                <h2 className="text-lg font-bold text-slate-900">
                  QR Preview
                </h2>

                {successMessage && (
                  <div className="w-full p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-fade-in">
                    {successMessage}
                  </div>
                )}

                {/* QR Canvas Container */}
                <div
                  className="p-6 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center transition-colors"
                  style={{ backgroundColor: bgColor }}
                >
                  <canvas ref={canvasRef} />
                </div>

                <div className="w-full space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
                  >
                    <span>⬇️</span> Download PNG
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
                  >
                    <span>⬇️</span> Download SVG / File
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 w-full text-center">
                  <p className="text-xs text-slate-500">
                    🔒 Generated locally in your browser. Fully private & secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools currentId="qr-generator" categoryKey="generator-tools" />
        </main>
      </div>
      <ToolFooter />
    </div>
  );
}
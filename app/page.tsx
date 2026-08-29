'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import FaqAccordion from './components/FAQAccordion';
import {
  CompressIcon,
  ResizeIcon,
  CropIcon,
  ConvertIcon,
  PdfImageIcon,
  MergeIcon,
  TextPdfIcon,
  WordCountIcon,
  KeyIcon,
  PaletteIcon,
  QrIcon,
} from './components/ToolIcons';

interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  category: 'Image Tools' | 'PDF Tools' | 'Text Tools' | 'Security Tools' | 'Design & Colors' | 'Utilities';
  iconComponent: React.ElementType;
}

const ALL_TOOLS: Tool[] = [
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress PNG, JPG, and WebP images directly in your browser without losing quality.',
    href: '/tools/image-compressor',
    category: 'Image Tools',
    iconComponent: CompressIcon,
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize image dimensions by pixels or percentage quickly and easily.',
    href: '/tools/image-resizer',
    category: 'Image Tools',
    iconComponent: ResizeIcon,
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images to custom aspect ratios or standard dimensions with precision.',
    href: '/tools/image-cropper',
    category: 'Image Tools',
    iconComponent: CropIcon,
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images between PNG, JPG, WEBP, and BMP formats instantly.',
    href: '/tools/image-converter',
    category: 'Image Tools',
    iconComponent: ConvertIcon,
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to JPG / PNG Converter',
    description: 'Convert PDF pages into high-quality JPG or PNG images on the fly.',
    href: '/tools/pdf-to-image',
    category: 'PDF Tools',
    iconComponent: PdfImageIcon,
  },
  {
    id: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Combine multiple PDF files into a single, organized PDF document.',
    href: '/tools/pdf-merger',
    category: 'PDF Tools',
    iconComponent: MergeIcon,
  },
  {
    id: 'text-to-pdf',
    title: 'Text to PDF',
    description: 'Convert plain text documents or custom notes into formatted PDF files.',
    href: '/tools/text-to-pdf',
    category: 'PDF Tools',
    iconComponent: TextPdfIcon,
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs with reading time estimation.',
    href: '/tools/word-counter',
    category: 'Text Tools',
    iconComponent: WordCountIcon,
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, customizable passwords with symbols, numbers, and custom lengths.',
    href: '/tools/password-generator',
    category: 'Security Tools',
    iconComponent: KeyIcon,
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick colors, convert HEX to RGB or HSL, and generate clean palettes.',
    href: '/tools/color-picker',
    category: 'Design & Colors',
    iconComponent: PaletteIcon,
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create custom QR codes for URLs, text, Wi-Fi passwords, and contact info.',
    href: '/tools/qr-generator',
    category: 'Utilities',
    iconComponent: QrIcon,
  },
];

const CATEGORIES = [
  'All Tools',
  'Image Tools',
  'PDF Tools',
  'Text Tools',
  'Security Tools',
  'Design & Colors',
  'Utilities',
] as const;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tools');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on search query and active category
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Tools' || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // JSON-LD Structured Data for FAQ Schema (SEO)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is KachilTools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'KachilTools is a free collection of web-based utilities for managing images, converting PDFs, processing text, generating QR codes, creating passwords, and more.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the tools on KachilTools free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all tools on KachilTools are 100% free with no registration, subscriptions, or hidden limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are my files uploaded to any server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. KachilTools operates client-side inside your browser. Your images and documents are processed locally on your device.',
        },
      },
      {
        '@type': 'Question',
        name: 'What image formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our image tools support common web formats including PNG, JPG, JPEG, WebP, and BMP.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use KachilTools on my mobile phone?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, KachilTools is fully responsive and designed to work smoothly on mobile phones, tablets, and desktop browsers.',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* FAQ JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        {/* Navigation Header */}
        <header className="border-b border-slate-800/60 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-lg font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-1 py-0.5"
              aria-label="KachilTools Home"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
                K
              </div>
              <span className="font-extrabold text-white tracking-tight text-xl">
                Kachil<span className="text-indigo-400">Tools</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
              <Link href="#tools" className="px-3.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800/60 transition-colors">
                Tools
              </Link>
              <Link href="/about" className="px-3.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800/60 transition-colors">
                About
              </Link>
              <Link href="/contact" className="px-3.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800/60 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Desktop CTA / Privacy Badge */}
            <div className="hidden md:flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Local Processing
              </span>
              <a
                href="#tools"
                className="text-xs font-bold px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-all duration-200"
              >
                Explore Suite
              </a>
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-800 bg-[#090d16] px-4 py-3 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600/20"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Contact
              </Link>
              <Link
                href="/privacy-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Terms
              </Link>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#090d16] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800/80">
          {/* Subtle Grid & Radial Gradient Backdrop */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative max-w-4xl mx-auto space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-indigo-300 text-[11px] font-bold tracking-widest uppercase">
              The Modern Toolkit for Everyday Work
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Everything you need. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
                Nothing you don&apos;t.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Fast, privacy-focused online utilities. Convert, compress, process, and edit your files directly inside your browser. No downloads or sign-ups.
            </p>

            {/* Command-Palette Style Search Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="relative group">
                <input
                  ref={searchInputRef}
                  id="tool-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools or features..."
                  className="w-full pl-12 pr-20 py-4 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-xl text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition-all duration-200"
                />
                <span className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>

                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-white text-xs font-bold p-1 rounded-md bg-slate-800 focus:outline-none"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="hidden sm:flex items-center gap-1 absolute right-3.5 top-3.5 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-400 pointer-events-none">
                    <kbd>⌘</kbd> <kbd>K</kbd>
                  </span>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Free to use
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No registration
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Client-side processing
              </span>
            </div>
          </div>
        </section>

        {/* Fact Strip */}
        <div className="bg-slate-900 border-b border-slate-800/80 py-4 px-4 text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-center text-xs sm:text-sm font-mono">
            <div>
              <span className="font-bold text-indigo-400 text-base">11+</span> Useful Tools
            </div>
            <div className="text-slate-700">•</div>
            <div>
              <span className="font-bold text-indigo-400 text-base">0</span> Software Installs
            </div>
            <div className="text-slate-700">•</div>
            <div>
              <span className="font-bold text-indigo-400 text-base">100%</span> Browser-Based
            </div>
            <div className="text-slate-700">•</div>
            <div>
              <span className="font-bold text-indigo-400 text-base">Free</span> Always Available
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Section Header */}
          <div className="text-center sm:text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Tools built for getting things done.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Simple utilities. Zero friction.
            </p>
          </div>

          {/* OS-Style Segmented Category Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-200">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all rounded-lg focus:outline-none ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => {
                const IconComp = tool.iconComponent;
                return (
                  <article
                    key={tool.id}
                    className="group relative bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-950/5 transition-all duration-200"
                  >
                    <div>
                      {/* Top: Icon & Category Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded">
                          {tool.category}
                        </span>
                      </div>

                      {/* Middle: Title & Description */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom: Action Link */}
                    <Link
                      href={tool.href}
                      className="w-full py-2 px-3 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white font-semibold text-xs rounded-lg border border-slate-200 hover:border-indigo-600 transition-all text-center flex items-center justify-center gap-1.5 group/btn"
                    >
                      <span>Open tool</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-200" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-800 mb-1">No tools found</h3>
              <p className="text-xs text-slate-500 mb-4">
                No tools matched your search &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Tools');
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Privacy Philosophy Section */}
        <section className="bg-[#0b0f19] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-800">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold">
                Privacy By Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your files stay yours.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Supported processing happens client-side inside your browser session. Files are processed locally without unnecessary server uploads.
              </p>
            </div>

            {/* Visual Process Diagram */}
            <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="font-mono text-xs text-indigo-400 mb-1">INPUT</div>
                  <div className="text-sm font-bold text-white">Your File</div>
                </div>

                <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    Processed Locally
                  </span>
                  <svg className="w-6 h-6 rotate-90 md:rotate-0 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="text-[11px] text-slate-400">Client-Side Browser</span>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <div className="font-mono text-xs text-indigo-400 mb-1">OUTPUT</div>
                  <div className="text-sm font-bold text-white">Your Result</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Article & Accordion FAQ */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Article */}
            <article className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Free Online Tools for Everyday Tasks
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                KachilTools provides a clean, fast, and accessible suite of online web utilities designed to solve daily digital tasks. Whether you need to compress high-resolution images for faster web loading, merge separate PDF files for work presentations, or quickly generate secure credentials, our tools deliver results without requiring software installations or account registrations.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By processing files client-side directly within your browser, KachilTools eliminates modern web clutter. Experience instant feedback, responsive layouts optimized for both mobile and desktop screens, and a reliable collection of utilities available whenever you need them.
              </p>
            </article>

            {/* Accordion FAQ Component */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <FaqAccordion />
            </div>
          </div>
        </section>
      </div>

      {/* Production Product Footer */}
      <footer className="bg-[#090d16] text-white border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            {/* Branding Column */}
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                  K
                </div>
                <span className="font-extrabold tracking-tight">KachilTools</span>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simple tools for the modern web. Fast, private, browser-based utilities for daily productivity.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><a href="#tools" className="hover:text-white transition-colors">All Tools</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">Image Tools</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">PDF Tools</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">Text Tools</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Company</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Legal</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} KachilTools. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              100% Client-Side Architecture
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
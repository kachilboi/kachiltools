'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ToolNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800/60 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight focus:outline-none"
          aria-label="KachilTools Home"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
            K
          </div>
          <span className="font-extrabold text-white tracking-tight text-xl">
            Kachil<span className="text-indigo-400">Tools</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link href="/#tools" className="px-3.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800/60 transition-colors">
            Tools
          </Link>
          <Link href="/about" className="px-3.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800/60 transition-colors">
            About
          </Link>
          <Link href="/contact" className="px-3.5 py-1.5 rounded-md hover:text-white hover:bg-slate-800/60 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Local Processing
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation"
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

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090d16] px-4 py-3 space-y-1">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600/20">
            Home
          </Link>
          <Link href="/#tools" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
            Tools
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
            About
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
            Contact
          </Link>
          <Link href="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
            Privacy Policy
          </Link>
          <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
            Terms of Service
          </Link>
        </div>
      )}
    </header>
  );
}
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#090d16] text-white border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                K
              </div>
              <span className="font-extrabold tracking-tight">KachilTools</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast, private, browser-based digital utilities. Built for modern digital workflows without unnecessary server uploads.
            </p>
          </div>

          {/* Product Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><a href="/#tools" className="hover:text-white transition-colors">All Tools</a></li>
              <li><a href="/#tools" className="hover:text-white transition-colors">Image Tools</a></li>
              <li><a href="/#tools" className="hover:text-white transition-colors">PDF Tools</a></li>
              <li><a href="/#tools" className="hover:text-white transition-colors">Text Tools</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Company</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Legal</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} KachilTools. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Client-Side Architecture Enabled
          </p>
        </div>
      </div>
    </footer>
  );
}
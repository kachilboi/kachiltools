'use client';

import React from 'react';
import Link from 'next/link';

interface ToolItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

const TOOLS_REGISTRY: Record<string, ToolItem[]> = {
  'image-tools': [
    { id: 'image-compressor', title: 'Image Compressor', description: 'Compress PNG, JPG & WebP without losing quality.', href: '/tools/image-compressor' },
    { id: 'image-resizer', title: 'Image Resizer', description: 'Resize pixel dimensions or percentage easily.', href: '/tools/image-resizer' },
    { id: 'image-cropper', title: 'Image Cropper', description: 'Crop images to standard aspect ratios.', href: '/tools/image-cropper' },
    { id: 'image-converter', title: 'Image Converter', description: 'Convert between PNG, JPG, WebP, and BMP.', href: '/tools/image-converter' },
  ],
  'pdf-tools': [
    { id: 'pdf-to-image', title: 'PDF to Image', description: 'Convert PDF pages into high-res images.', href: '/tools/pdf-to-image' },
    { id: 'pdf-merger', title: 'PDF Merger', description: 'Combine multiple PDFs into a single file.', href: '/tools/pdf-merger' },
    { id: 'text-to-pdf', title: 'Text to PDF', description: 'Convert text documents into formatted PDFs.', href: '/tools/text-to-pdf' },
  ],
  'text-tools': [
    { id: 'word-counter', title: 'Word Counter', description: 'Count words, chars, sentences, and reading time.', href: '/tools/word-counter' },
    { id: 'password-generator', title: 'Password Generator', description: 'Generate strong, secure custom passwords.', href: '/tools/password-generator' },
  ],
};

export default function RelatedTools({ currentId, categoryKey = 'image-tools' }: { currentId: string; categoryKey?: string }) {
  const tools = (TOOLS_REGISTRY[categoryKey] || TOOLS_REGISTRY['image-tools']).filter((t) => t.id !== currentId);

  return (
    <section className="mt-16 pt-12 border-t border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Related Utilities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500/50 hover:shadow-md transition-all"
          >
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {tool.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
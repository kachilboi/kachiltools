'use client';

import React from 'react';

interface ToolHeroProps {
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function ToolHero({ category, title, description, icon: Icon }: ToolHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#090d16] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
      <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
          {category}
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {title}
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          🔒 Processed locally in your browser — zero file uploads
        </div>
      </div>
    </section>
  );
}
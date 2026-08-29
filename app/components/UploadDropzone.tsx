'use client';

import React, { useRef } from 'react';

interface UploadDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export default function UploadDropzone({
  accept = 'image/*',
  multiple = false,
  onFilesSelected,
  title = 'Upload your file',
  subtitle = 'Drag & drop or click to browse',
}: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="group relative cursor-pointer border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white hover:bg-slate-50/80 rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 shadow-sm"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors duration-200 mb-4 shadow-sm">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>

      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>

      {accept && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-[11px] font-mono text-slate-600 uppercase">
          Formats: {accept.replace(/\*/g, '').replace(/image\//g, '').toUpperCase()}
        </div>
      )}
    </div>
  );
}
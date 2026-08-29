'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is KachilTools?',
    answer: 'KachilTools is a free collection of web-based utilities for managing images, converting PDFs, processing text, generating QR codes, creating passwords, and more.',
  },
  {
    question: 'Are the tools on KachilTools free to use?',
    answer: 'Yes, all tools on KachilTools are 100% free with no registration, subscriptions, or hidden limits.',
  },
  {
    question: 'Are my files uploaded to any server?',
    answer: 'No. KachilTools operates client-side inside your browser. Your images and documents are processed locally on your device.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'Our image tools support common web formats including PNG, JPG, JPEG, WebP, and BMP.',
  },
  {
    question: 'Can I use KachilTools on my mobile phone?',
    answer: 'Yes, KachilTools is fully responsive and designed to work smoothly on mobile phones, tablets, and desktop browsers.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <span>{item.question}</span>
              <span className={`w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400' : ''}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
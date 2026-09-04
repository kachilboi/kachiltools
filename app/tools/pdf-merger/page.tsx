import { Metadata } from 'next';
import PdfMergerClient from './PdfMergerClient';

export const metadata: Metadata = {
  title: 'Free Online PDF Merger - Combine PDF Files',
  description:
    'Merge multiple PDF files into a single document online for free. Combine PDF documents quickly and securely directly in your browser.',
  keywords: [
    'PDF merger online',
    'merge PDF',
    'combine PDF files',
    'merge multiple PDFs',
    'combine PDF documents',
    'merge PDF online free',
    'free PDF merger',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/pdf-merger',
  },
  openGraph: {
    title: 'Free Online PDF Merger - Combine PDF Files | KachilTools',
    description:
      'Merge multiple PDF files into a single document online for free directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/pdf-merger',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online PDF Merger - Combine PDF Files | KachilTools',
    description:
      'Merge multiple PDF files into a single document online for free directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PdfMergerClient />;
}
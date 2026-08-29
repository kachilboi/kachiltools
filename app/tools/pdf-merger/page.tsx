// app/tools/pdf-merger/page.tsx
import { Metadata } from 'next';
import PdfMergerClient from './PdfMergerClient';

export const metadata: Metadata = {
  title: 'Free PDF Merger Online',
  description:
    'Combine multiple PDF documents into a single organized file directly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/pdf-merger',
  },
  openGraph: {
    title: 'Free PDF Merger Online | KachilTools',
    description:
      'Combine multiple PDF documents into a single organized file directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/pdf-merger',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Merger Online | KachilTools',
    description:
      'Combine multiple PDF documents into a single organized file directly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PdfMergerClient />;
}
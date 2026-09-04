import { Metadata } from 'next';
import TextToPdfClient from './TextToPdfClient';

export const metadata: Metadata = {
  title: 'Free Text to PDF Converter - Convert Text & TXT to PDF',
  description:
    'Convert plain text and TXT files into a downloadable PDF document online for free. Fast, secure, and easy text to PDF conversion directly in your browser.',
  keywords: [
    'text to PDF',
    'text to PDF converter',
    'convert text to PDF',
    'TXT to PDF',
    'create PDF from text',
    'free text to PDF converter',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/text-to-pdf',
  },
  openGraph: {
    title: 'Free Text to PDF Converter - Convert Text & TXT to PDF | KachilTools',
    description:
      'Convert plain text and TXT files into a downloadable PDF document online for free directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/text-to-pdf',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Text to PDF Converter - Convert Text & TXT to PDF | KachilTools',
    description:
      'Convert plain text and TXT files into a downloadable PDF document online for free directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <TextToPdfClient />;
}
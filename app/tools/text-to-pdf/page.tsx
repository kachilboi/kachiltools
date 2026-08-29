// app/tools/text-to-pdf/page.tsx
import { Metadata } from 'next';
import TextToPdfClient from './TextToPdfClient';

export const metadata: Metadata = {
  title: 'Text to PDF Converter Online',
  description:
    'Convert plain text documents and notes into clean downloadable PDF files in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/text-to-pdf',
  },
  openGraph: {
    title: 'Text to PDF Converter Online | KachilTools',
    description:
      'Convert plain text documents and notes into clean downloadable PDF files.',
    url: 'https://kachiltools.vercel.app/tools/text-to-pdf',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text to PDF Converter Online | KachilTools',
    description:
      'Convert plain text documents and notes into clean downloadable PDF files.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <TextToPdfClient />;
}
import { Metadata } from 'next';
import PdfToImageClient from './PdfToImageClient';

export const metadata: Metadata = {
  title: 'Free PDF to Image Converter - Convert PDF to JPG & PNG',
  description:
    'Convert PDF pages into high-quality JPG or PNG images online for free. Fast, secure, and easy PDF to image conversion directly in your browser.',
  keywords: [
    'PDF to JPG',
    'PDF to PNG',
    'PDF to image',
    'convert PDF to JPG online',
    'convert PDF to PNG online',
    'PDF pages to images',
    'PDF image converter',
    'free PDF to image converter',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/pdf-to-image',
  },
  openGraph: {
    title: 'Free PDF to Image Converter - Convert PDF to JPG & PNG | KachilTools',
    description:
      'Convert PDF pages into high-quality JPG or PNG images online for free directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/pdf-to-image',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF to Image Converter - Convert PDF to JPG & PNG | KachilTools',
    description:
      'Convert PDF pages into high-quality JPG or PNG images online for free directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PdfToImageClient />;
}
// app/tools/pdf-to-image/page.tsx
import { Metadata } from 'next';
import PdfToImageClient from './PdfToImageClient';

export const metadata: Metadata = {
  title: 'PDF to Image Converter Online',
  description:
    'Extract and convert PDF pages into image files directly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/pdf-to-image',
  },
  openGraph: {
    title: 'PDF to Image Converter Online | KachilTools',
    description:
      'Extract and convert PDF pages into image files directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/pdf-to-image',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Image Converter Online | KachilTools',
    description:
      'Extract and convert PDF pages into image files directly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PdfToImageClient />;
}
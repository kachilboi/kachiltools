// app/tools/image-converter/page.tsx
import { Metadata } from 'next';
import ImageConverterClient from './ImageConverterClient';

export const metadata: Metadata = {
  title: 'Free Image Converter Online',
  description:
    'Convert images between JPG, PNG, and WebP formats instantly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-converter',
  },
  openGraph: {
    title: 'Free Image Converter Online | KachilTools',
    description:
      'Convert images between JPG, PNG, and WebP formats instantly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/image-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Converter Online | KachilTools',
    description:
      'Convert images between JPG, PNG, and WebP formats instantly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ImageConverterClient />;
}
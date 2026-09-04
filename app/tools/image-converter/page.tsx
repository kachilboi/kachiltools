import { Metadata } from 'next';
import ImageConverterClient from './ImageConverterClient';

export const metadata: Metadata = {
  title: 'Free Online Image Converter - JPG, PNG & WebP',
  description:
    'Convert images between JPG, PNG, and WebP formats online for free. Fast, secure, and easy image conversion directly in your browser.',
  keywords: [
    'image converter online',
    'convert image online',
    'JPG to PNG',
    'PNG to JPG',
    'JPG to WebP',
    'PNG to WebP',
    'WebP to JPG',
    'WebP to PNG',
    'convert JPG PNG WebP',
    'free image converter',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-converter',
  },
  openGraph: {
    title: 'Free Online Image Converter - JPG, PNG & WebP | KachilTools',
    description:
      'Convert images between JPG, PNG, and WebP formats online for free directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/image-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Converter - JPG, PNG & WebP | KachilTools',
    description:
      'Convert images between JPG, PNG, and WebP formats online for free directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ImageConverterClient />;
}
import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient';

export const metadata: Metadata = {
  title: 'Free Online Image Resizer - Resize JPG, PNG & WebP',
  description:
    'Resize JPG, PNG, and WebP images online for free. Change image dimensions by pixels or percentage quickly and securely right in your browser.',
  keywords: [
    'image resizer online',
    'resize image online',
    'resize JPG',
    'resize PNG',
    'resize WebP',
    'change image dimensions',
    'resize image by pixels',
    'resize image by percentage',
    'free image resizer',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-resizer',
  },
  openGraph: {
    title: 'Free Online Image Resizer - Resize JPG, PNG & WebP | KachilTools',
    description:
      'Resize JPG, PNG, and WebP images online for free by exact dimensions or percentage directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/image-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Resizer - Resize JPG, PNG & WebP | KachilTools',
    description:
      'Resize JPG, PNG, and WebP images online for free by exact dimensions or percentage directly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ImageResizerClient />;
}
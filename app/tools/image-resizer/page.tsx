// app/tools/image-resizer/page.tsx
import { Metadata } from 'next';
import ImageResizerClient from './ImageResizerClient';

export const metadata: Metadata = {
  title: 'Free Image Resizer Online',
  description:
    'Resize JPG, PNG, and WebP images by exact dimensions or percentage directly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-resizer',
  },
  openGraph: {
    title: 'Free Image Resizer Online | KachilTools',
    description:
      'Resize JPG, PNG, and WebP images by exact dimensions or percentage directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/image-resizer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Resizer Online | KachilTools',
    description:
      'Resize JPG, PNG, and WebP images by exact dimensions or percentage directly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ImageResizerClient />;
}
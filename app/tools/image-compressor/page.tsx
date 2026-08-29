// app/tools/image-compressor/page.tsx
import { Metadata } from 'next';
import ImageCompressorClient from './ImageCompressorClient';

export const metadata: Metadata = {
  title: 'Free Image Compressor Online',
  description:
    'Compress JPG, PNG, and WebP images directly in your browser with KachilTools. Fast and easy image size reduction.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-compressor',
  },
  openGraph: {
    title: 'Free Image Compressor Online | KachilTools',
    description:
      'Compress JPG, PNG, and WebP images directly in your browser with KachilTools.',
    url: 'https://kachiltools.vercel.app/tools/image-compressor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Compressor Online | KachilTools',
    description:
      'Compress JPG, PNG, and WebP images directly in your browser with KachilTools.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ImageCompressorClient />;
}
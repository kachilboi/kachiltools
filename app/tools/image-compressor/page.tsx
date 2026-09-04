import { Metadata } from 'next';
import ImageCompressorClient from './ImageCompressorClient';

export const metadata: Metadata = {
  title: 'Free Online Image Compressor - Reduce Image Size',
  description:
    'Compress JPG, PNG, and WebP images online for free. Reduce image file size instantly right in your browser with complete privacy and fast processing.',
  keywords: [
    'image compressor online',
    'compress image online',
    'reduce image size',
    'compress JPG',
    'compress PNG',
    'compress WebP',
    'image size reducer',
    'free image compressor',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-compressor',
  },
  openGraph: {
    title: 'Free Online Image Compressor - Reduce Image Size | KachilTools',
    description:
      'Compress JPG, PNG, and WebP images online for free. Reduce image file size instantly right in your browser.',
    url: 'https://kachiltools.vercel.app/tools/image-compressor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Compressor - Reduce Image Size | KachilTools',
    description:
      'Compress JPG, PNG, and WebP images online for free. Reduce image file size instantly right in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ImageCompressorClient />;
}
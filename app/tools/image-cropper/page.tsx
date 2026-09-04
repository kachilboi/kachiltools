import { Metadata } from 'next';
import ImageCropperClient from './ImageCropperClient';

export const metadata: Metadata = {
  title: 'Free Online Image Cropper - Crop JPG, PNG & WebP',
  description:
    'Crop JPG, PNG, and WebP images online for free. Easily trim and crop photos right in your browser with fast and secure client-side processing.',
  keywords: [
    'image cropper online',
    'crop image online',
    'crop JPG',
    'crop PNG',
    'crop WebP',
    'crop photo online',
    'resize and crop image',
    'free image cropper',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-cropper',
  },
  openGraph: {
    title: 'Free Online Image Cropper - Crop JPG, PNG & WebP | KachilTools',
    description:
      'Crop JPG, PNG, and WebP images online for free. Easily trim and crop photos right in your browser.',
    url: 'https://kachiltools.vercel.app/tools/image-cropper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Cropper - Crop JPG, PNG & WebP | KachilTools',
    description:
      'Crop JPG, PNG, and WebP images online for free. Easily trim and crop photos right in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ImageCropperClient />;
}
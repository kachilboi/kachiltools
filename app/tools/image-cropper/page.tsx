// app/tools/image-cropper/page.tsx
import { Metadata } from 'next';
import ImageCropperClient from './ImageCropperClient';

export const metadata: Metadata = {
  title: 'Free Image Cropper Online',
  description:
    'Crop and trim photos and images easily in your browser with KachilTools. Fast and simple image framing.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/image-cropper',
  },
  openGraph: {
    title: 'Free Image Cropper Online | KachilTools',
    description:
      'Crop and trim photos and images easily in your browser with KachilTools.',
    url: 'https://kachiltools.vercel.app/tools/image-cropper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Cropper Online | KachilTools',
    description:
      'Crop and trim photos and images easily in your browser with KachilTools.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ImageCropperClient />;
}
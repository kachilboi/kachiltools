// app/tools/color-picker/page.tsx
import { Metadata } from 'next';
import ColorPickerClient from './ColorPickerClient';

export const metadata: Metadata = {
  title: 'Online Color Picker & HEX/RGB Converter',
  description:
    'Pick colors, explore color codes, and convert between HEX, RGB, and HSL formats instantly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/color-picker',
  },
  openGraph: {
    title: 'Online Color Picker & HEX/RGB Converter | KachilTools',
    description:
      'Pick colors, explore color codes, and convert between HEX, RGB, and HSL formats instantly.',
    url: 'https://kachiltools.vercel.app/tools/color-picker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Color Picker & HEX/RGB Converter | KachilTools',
    description:
      'Pick colors, explore color codes, and convert between HEX, RGB, and HSL formats instantly.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ColorPickerClient />;
}
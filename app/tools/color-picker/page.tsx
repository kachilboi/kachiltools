import { Metadata } from 'next';
import ColorPickerClient from './ColorPickerClient';

export const metadata: Metadata = {
  title: 'Free Online Color Picker - HEX, RGB & HSL Converter',
  description:
    'Pick colors and convert between HEX, RGB, and HSL formats online for free. Find and copy exact color codes easily directly in your browser.',
  keywords: [
    'color picker',
    'online color picker',
    'HEX color picker',
    'RGB color picker',
    'HSL color picker',
    'HEX to RGB',
    'RGB to HEX',
    'color code converter',
    'free color picker',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/color-picker',
  },
  openGraph: {
    title: 'Free Online Color Picker - HEX, RGB & HSL Converter | KachilTools',
    description:
      'Pick colors and convert between HEX, RGB, and HSL formats online for free directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/color-picker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Color Picker - HEX, RGB & HSL Converter | KachilTools',
    description:
      'Pick colors and convert between HEX, RGB, and HSL formats online for free directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ColorPickerClient />;
}
import { Metadata } from 'next';
import QrGeneratorClient from './QrGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Online QR Code Generator - Create QR Codes for URLs & WiFi',
  description:
    'Generate custom QR codes online for free. Create QR codes for URLs, WiFi networks, text, and more directly in your browser.',
  keywords: [
    'QR code generator',
    'QR code generator online',
    'free QR code generator',
    'create QR code',
    'generate QR code',
    'URL QR code',
    'WiFi QR code',
    'text QR code',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/qr-generator',
  },
  openGraph: {
    title: 'Free Online QR Code Generator - Create QR Codes for URLs & WiFi | KachilTools',
    description:
      'Generate custom QR codes online for free. Create QR codes for URLs, WiFi networks, text, and more directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online QR Code Generator - Create QR Codes for URLs & WiFi | KachilTools',
    description:
      'Generate custom QR codes online for free. Create QR codes for URLs, WiFi networks, text, and more directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <QrGeneratorClient />;
}
// app/tools/qr-generator/page.tsx
import { Metadata } from 'next';
import QrGeneratorClient from './QrGeneratorClient';

export const metadata: Metadata = {
  title: 'Free QR Code Generator Online',
  description:
    'Create custom QR codes for URLs, text, WiFi, and contacts instantly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/qr-generator',
  },
  openGraph: {
    title: 'Free QR Code Generator Online | KachilTools',
    description:
      'Create custom QR codes for URLs, text, WiFi, and contacts instantly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free QR Code Generator Online | KachilTools',
    description:
      'Create custom QR codes for URLs, text, WiFi, and contacts instantly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <QrGeneratorClient />;
}
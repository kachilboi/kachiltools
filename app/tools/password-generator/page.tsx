// app/tools/password-generator/page.tsx
import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';

export const metadata: Metadata = {
  title: 'Secure Password Generator Online',
  description:
    'Generate strong, random, and customizable secure passwords instantly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/password-generator',
  },
  openGraph: {
    title: 'Secure Password Generator Online | KachilTools',
    description:
      'Generate strong, random, and customizable secure passwords instantly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/password-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secure Password Generator Online | KachilTools',
    description:
      'Generate strong, random, and customizable secure passwords instantly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PasswordGeneratorClient />;
}
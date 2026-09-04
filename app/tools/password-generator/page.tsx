import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Online Password Generator - Strong & Secure Passwords',
  description:
    'Generate strong, secure, and random passwords online for free. Customize length, symbols, numbers, and letters instantly in your browser.',
  keywords: [
    'password generator',
    'strong password generator',
    'secure password generator',
    'random password generator',
    'online password generator',
    'customizable password generator',
    'free password generator',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/password-generator',
  },
  openGraph: {
    title: 'Free Online Password Generator - Strong & Secure Passwords | KachilTools',
    description:
      'Generate strong, secure, and random passwords online for free with customizable options directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/password-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Password Generator - Strong & Secure Passwords | KachilTools',
    description:
      'Generate strong, secure, and random passwords online for free with customizable options directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <PasswordGeneratorClient />;
}
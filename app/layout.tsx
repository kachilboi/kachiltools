import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kachiltools.vercel.app'),
  title: {
    default: 'KachilTools | Free Online Browser Tools for Images, PDFs & Text',
    template: '%s | KachilTools',
  },
  description:
    'Explore free online browser tools on KachilTools. Easily compress and resize images, merge PDFs, count words, generate secure passwords, pick colors, and create QR codes instantly with no installation required.',
  applicationName: 'KachilTools',
  authors: [{ name: 'KachilTools' }],
  generator: 'Next.js',
  keywords: [
    'free online tools',
    'free online tools website',
    'online tools',
    'browser tools',
    'free browser tools',
    'image tools',
    'PDF tools',
    'text tools',
    'image compressor',
    'image resizer',
    'image converter',
    'PDF merger',
    'PDF to JPG',
    'text to PDF',
    'word counter',
    'password generator',
    'color picker',
    'QR code generator',
  ],
  category: 'Utilities',
  referrer: 'origin-when-cross-origin',
  creator: 'KachilTools',
  publisher: 'KachilTools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://kachiltools.vercel.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kachiltools.vercel.app',
    siteName: 'KachilTools',
    title: 'KachilTools | Free Online Browser Tools for Images, PDFs & Text',
    description:
      'Explore free online browser tools on KachilTools for image processing, PDF utilities, text counting, secure passwords, and QR codes. Fast, private, and runs directly in your browser.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KachilTools | Free Online Browser Tools',
    description:
      'Explore free online browser tools on KachilTools for image processing, PDF utilities, text counting, secure passwords, and QR codes.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="qDLCv3uhtDG5lU2VdZjhZ_I8FTYZnxu5Ez7OU0sp5Tw"
        />
        <Script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2755514133196879"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
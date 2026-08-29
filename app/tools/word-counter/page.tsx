// app/tools/word-counter/page.tsx
import { Metadata } from 'next';
import WordCounterClient from './WordCounterClient';

export const metadata: Metadata = {
  title: 'Free Word Counter & Character Count Tool',
  description:
    'Count words, characters, sentences, and paragraphs in real time directly in your browser with KachilTools.',
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/word-counter',
  },
  openGraph: {
    title: 'Free Word Counter & Character Count Tool | KachilTools',
    description:
      'Count words, characters, sentences, and paragraphs in real time directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/word-counter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Word Counter & Character Count Tool | KachilTools',
    description:
      'Count words, characters, sentences, and paragraphs in real time directly in your browser.',
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <WordCounterClient />;
}
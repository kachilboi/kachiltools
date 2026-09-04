import { Metadata } from 'next';
import WordCounterClient from './WordCounterClient';

export const metadata: Metadata = {
  title: 'Free Online Word Counter - Words, Characters & Sentences',
  description:
    'Count words, characters, sentences, and paragraphs in real time with this free online word counter. Fast, accurate, and easy to use directly in your browser.',
  keywords: [
    'word counter',
    'online word counter',
    'character counter',
    'word and character counter',
    'sentence counter',
    'paragraph counter',
    'free word counter',
  ],
  alternates: {
    canonical: 'https://kachiltools.vercel.app/tools/word-counter',
  },
  openGraph: {
    title: 'Free Online Word Counter - Words, Characters & Sentences | KachilTools',
    description:
      'Count words, characters, sentences, and paragraphs in real time with this free online word counter directly in your browser.',
    url: 'https://kachiltools.vercel.app/tools/word-counter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Word Counter - Words, Characters & Sentences | KachilTools',
    description:
      'Count words, characters, sentences, and paragraphs in real time with this free online word counter directly in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <WordCounterClient />;
}
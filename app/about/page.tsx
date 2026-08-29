// app/about/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
  title: 'About | KachilTools',
  description: 'Discover KachilTools - free, fast, and privacy-focused browser utilities.',
};

export default function AboutPage() {
  const categories = [
    { title: 'Image Tools', desc: 'Compress, resize, convert, and adjust images directly in your browser.' },
    { title: 'PDF Tools', desc: 'Merge, split, compress, and inspect PDF files securely.' },
    { title: 'Text Tools', desc: 'Format text, calculate word counts, clean up strings, and transform formats.' },
    { title: 'Security Tools', desc: 'Generate secure passwords, hash text, and inspect cryptographic keys.' },
    { title: 'Design & Colors', desc: 'Explore color palettes, convert hex/RGB/HSL codes, and generate CSS assets.' },
    { title: 'Utilities', desc: 'Calculators, unit converters, and general daily productivity assets.' },
  ];

  return (
    <PageLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">About KachilTools</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <strong>KachilTools</strong> is a modern collection of fast, free, and accessible online utilities built to simplify everyday digital tasks. 
            Designed to eliminate cumbersome software installs, our goal is to provide reliable tools right inside your browser.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h2 className="text-2xl font-bold mb-4">Core Tool Categories</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.title} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400 mb-1">{cat.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-4">
          <h2 className="text-2xl font-bold">Privacy-First Architecture</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Where possible, our tools are built to run client-side in your web browser using modern WebAssembly and JavaScript standards. 
            This means your personal documents, images, and data never leave your local device, offering enhanced privacy and instant speed.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            No registration or account setup is required for basic tools. You can get straight to work without friction.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 rounded-2xl p-6 border border-blue-100 dark:border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Have feedback or suggestions?</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">We are continuously expanding our toolkit based on community needs.</p>
          </div>
          <Link href="/contact" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
            Get in Touch
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
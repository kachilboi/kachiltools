// app/privacy-policy/page.tsx
import { Metadata } from 'next';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | KachilTools',
  description: 'Learn how KachilTools handles your data, local client-side processing, cookies, and privacy standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: August 29, 2026</p>

        <section className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Overview</h2>
            <p>
              Welcome to <strong>KachilTools</strong> (accessible from <a href="https://kachiltools.com" className="text-blue-600 hover:underline">https://kachiltools.com</a>). 
              We offer free, accessible browser-based web utilities designed for daily productivity. Your privacy is important to us, and this policy outlines 
              how information is handled when using our site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Client-Side Local Data Processing</h2>
            <p>
              Many of the tools offered on KachilTools process files and data locally directly within your web browser (client-side execution). 
              Files, text, images, or documents you load into local processing tools are not intentionally uploaded to, stored on, or harvested by our web servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Cookies & Analytics</h2>
            <p>
              KachilTools may use essential cookies and basic session storage strictly necessary to operate the site or remember local user settings (e.g., interface preferences). 
              We may utilize general web analytics tools to gather aggregated, non-personally identifiable traffic metrics to help us optimize site layout and utility features.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4. Advertising & Third-Party Services</h2>
            <p>
              To maintain our services free of charge, third-party advertising networks or scripts may be introduced in the future. These external providers 
              may set third-party cookies or scripts to serve relevant ads according to standard web practices. External tools, scripts, or embedded assets adhere to their respective privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">5. Children’s Privacy</h2>
            <p>
              KachilTools does not knowingly collect or solicit personal information from children under 13 years of age. If you believe a child has submitted personal information through our website, please notify us so we can promptly remove it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">6. Policy Updates</h2>
            <p>
              We reserve the right to revise or update this Privacy Policy as our features evolve. Any changes will be posted on this page along with an updated revision date.
            </p>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
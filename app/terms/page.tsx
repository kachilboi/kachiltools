// app/terms/page.tsx
import { Metadata } from 'next';
import PageLayout from '../components/PageLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | KachilTools',
  description: 'Read the Terms of Service governing your use of KachilTools utilities and services.',
};

export default function TermsPage() {
  return (
    <PageLayout>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: August 29, 2026</p>

        <section className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using <strong>KachilTools</strong> (<a href="https://kachiltools.com" className="text-blue-600 hover:underline">https://kachiltools.com</a>), 
              you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please refrain from using the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Acceptable Use & User Responsibility</h2>
            <p>
              KachilTools provides browser utilities intended for lawful online operations. You are solely responsible for all content, text, data, or files you process using our tools. 
              You agree not to use KachilTools to process illegal material, violate intellectual property, or attempt to compromise website security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Intellectual Property</h2>
            <p>
              The original brand design, code layout, logos, and features on KachilTools belong to KachilTools. Users retain full ownership rights over all content they upload or generate through local browser processing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4. Service Availability & Disclaimers</h2>
            <p>
              KachilTools is offered on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, express or implied. We do not guarantee continuous uninterrupted uptime or that output from specific tools will meet every requirement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">5. Limitation of Liability</h2>
            <p>
              Under no circumstances shall KachilTools or its developers be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our website or web utilities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">6. Modifications to Terms</h2>
            <p>
              We reserve the right to amend these terms at any time. Continued usage of KachilTools after changes take effect indicates acceptance of the updated terms.
            </p>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}
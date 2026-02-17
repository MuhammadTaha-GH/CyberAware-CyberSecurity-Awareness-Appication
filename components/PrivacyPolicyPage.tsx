
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Privacy <span className="text-cyan-500">Policy</span></h1>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Last Updated: December 2025</p>
      </header>

      <div className="space-y-10 text-gray-400">
        <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Data Collection</h2>
          <p className="leading-relaxed">
            We collect minimal data necessary to provide our services:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
            <li>Email address (for authentication and profile management)</li>
            <li>Learning progress and quiz scores (to track your improvement)</li>
            <li>Chat history (to provide context for the AI Assistant)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">How We Use Your Information</h2>
          <p className="leading-relaxed">
            Your data is used solely to personalize your learning experience and improve our threat intelligence algorithms. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Security of Data</h2>
          <p className="leading-relaxed">
            We utilize industry-standard encryption and secure Supabase protocols to protect your information. As a security platform, your privacy and data integrity are our top priorities.
          </p>
        </section>

        <section className="border-t border-gray-800 pt-8 mt-12">
          <p className="text-sm font-medium">
            Contact our security officer for data requests: <span className="text-cyan-500">privacy@cyberaware.io</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;


import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Terms & <span className="text-cyan-500">Conditions</span></h1>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Last Updated: December 2025</p>
      </header>

      <div className="prose prose-invert prose-cyan max-w-none space-y-10 text-gray-400">
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
             <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
             1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            By accessing and using CyberAware (the "Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
             <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
             2. Use of Service
          </h2>
          <p className="leading-relaxed">
            CyberAware provides educational content and simulated security testing. You agree to use the Platform only for lawful educational purposes. You may not use the platform for unauthorized network penetration, data harvesting, or any illegal activities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
             <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
             3. User Accounts
          </h2>
          <p className="leading-relaxed">
            You are responsible for maintaining the confidentiality of your credentials. Any activity under your account is your responsibility. Suspicious activities may lead to account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
             <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
             4. Disclaimer
          </h2>
          <p className="leading-relaxed italic">
            The information provided on this platform is for educational purposes only. While we strive for accuracy, CyberAware does not guarantee that following the provided advice will prevent 100% of cyber attacks. Security is a continuous process.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;

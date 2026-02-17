
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Our <span className="text-cyan-500">Mission</span></h1>
        <p className="text-gray-400 text-xl font-medium tracking-tight">Securing the digital horizon through awareness.</p>
      </header>

      <div className="space-y-12">
        <section className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-10 md:p-16">
          <h2 className="text-2xl font-bold text-white mb-6">Empowering Individuals</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Cyber Security Daily Briefing was founded on a simple premise: in an increasingly connected world, security is not just a technical requirement—it's a human necessity. We believe that informed users are the strongest link in the security chain.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            Our platform simplifies complex cyber security intelligence, delivering actionable guidance and interactive learning experiences. We empower users to make informed, secure digital decisions every day.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-gray-900 border border-gray-800 rounded-[2rem]">
              <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 border border-cyan-500/20 font-bold text-xl">01</div>
              <h3 className="text-xl font-bold text-white mb-4">Real-Time Intelligence</h3>
              <p className="text-gray-500 text-sm leading-relaxed">We monitor global threat landscapes to provide you with immediate alerts on phishing, malware, and zero-day vulnerabilities.</p>
           </div>
           <div className="p-10 bg-gray-900 border border-gray-800 rounded-[2rem]">
              <div className="w-12 h-12 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 border border-cyan-500/20 font-bold text-xl">02</div>
              <h3 className="text-xl font-bold text-white mb-4">Interactive Learning</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our AI-driven simulations and flashcards transform passive reading into active, reflexive security habits.</p>
           </div>
        </div>

        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Join the Defense</h2>
          <p className="text-gray-500 max-w-xl mx-auto italic">
            "To simplify cyber security awareness by delivering real-time intelligence, actionable guidance, and interactive learning empowering users to make informed and secure digital decisions."
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

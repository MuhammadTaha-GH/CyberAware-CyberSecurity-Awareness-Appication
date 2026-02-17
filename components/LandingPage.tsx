
import React from 'react';

interface LandingPageProps {
  setView: (view: any) => void;
  hasSession: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView, hasSession }) => {
  const features = [
    {
      icon: '🔴',
      title: 'Real-Time Threat Feed',
      desc: 'Receive instant cyber security updates including phishing attacks, malware campaigns, vulnerabilities, and emerging threats. Updates appear in real time with clear severity indicators.'
    },
    {
      icon: '🤖',
      title: 'AI Cyber Assistant',
      desc: 'Get instant answers to cyber security questions through an AI-powered chatbot trained specifically for cyber awareness, threats, and best practices.'
    },
    {
      icon: '🧠',
      title: 'Learn & Test Your Knowledge',
      desc: 'Improve your cyber security skills with AI-generated self-tests and quizzes. Track your learning progress and build stronger digital awareness.'
    },
    {
      icon: '🔐',
      title: 'Secure & Role-Based Access',
      desc: 'Admins manage intelligence and analytics, while users focus on learning and awareness ensuring a secure and controlled environment.'
    }
  ];

  const targetAudience = [
    'Students and cyber security learners',
    'IT professionals and analysts',
    'Organizations seeking threat awareness',
    'Anyone who wants to stay safe online'
  ];

  return (
    <div className="relative overflow-hidden selection:bg-cyan-500/30">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyan-600/5 blur-[120px] rounded-full -z-10"></div>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
          Live Security Intelligence
        </div>
        
        <h1 className="text-5xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
          Cyber Security <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Daily Briefing</span>
        </h1>
        
        <h2 className="text-xl lg:text-2xl font-medium text-gray-300 mb-8 tracking-tight">
          Real-Time Threat Awareness. Smarter Digital Defense.
        </h2>
        
        <p className="text-lg text-gray-400 max-w-3xl mb-12 leading-relaxed">
          Stay ahead of cyber threats with instant updates, intelligent analysis, and interactive learning all in one secure platform. Cyber Security Daily Briefing delivers real-time alerts, expert insights, and AI-powered awareness tools to help you understand, analyze, and respond to modern cyber risks effectively.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={() => setView(hasSession ? 'dashboard' : 'signup')}
            className="w-full sm:w-auto px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-cyan-900/40 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {hasSession ? 'Return to Dashboard' : 'Start Learning Now'}
          </button>
          <button 
            onClick={() => setView(hasSession ? 'dashboard' : 'login')}
            className="w-full sm:w-auto px-10 py-5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            Access Dashboard
          </button>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-y border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Why This Platform <span className="text-cyan-500">Matters</span></h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Cyber attacks are evolving every day, and delayed awareness can lead to serious damage. This platform acts as a centralized cyber intelligence hub, providing verified threat updates, risk analysis, and practical guidance without overwhelming complexity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-square bg-gray-900 border border-gray-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Instant</div>
             </div>
             <div className="aspect-square bg-gray-900 border border-gray-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center translate-y-8">
                <div className="text-3xl mb-3">🛡️</div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Verified</div>
             </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">What You <span className="text-cyan-500">Get</span></h2>
          <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">Comprehensive Security Suite</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-10 bg-gray-900/50 border border-gray-800 rounded-[2.5rem] hover:border-cyan-500/50 transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.05)]">
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audience & Mission */}
      <section className="bg-gray-900/30 border-y border-gray-800/50 py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Who Is This <span className="text-cyan-500">For</span></h2>
            <div className="space-y-4">
              {targetAudience.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-300 text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-950 p-12 rounded-[3rem] border border-gray-800 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">“</div>
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Our <span className="text-cyan-500">Mission</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed italic">
              To simplify cyber security awareness by delivering real-time intelligence, actionable guidance, and interactive learning empowering users to make informed and secure digital decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-tight">Ready to Secure Your <span className="text-cyan-500">Identity?</span></h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
          Sign in to access live threat updates, explore analytics, ask cyber questions, and strengthen your security knowledge all from a single dashboard.
        </p>
        <button 
          onClick={() => setView(hasSession ? 'dashboard' : 'signup')}
          className="px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-cyan-900/40 transition-all hover:scale-105 active:scale-95"
        >
          {hasSession ? 'Enter Intelligence Terminal' : 'Register Secure Profile'}
        </button>
      </section>
    </div>
  );
};

export default LandingPage;

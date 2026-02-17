
import React from 'react';

interface FooterProps {
  setView: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <div className="flex flex-col gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group w-fit"
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20 group-hover:bg-cyan-50 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Cyber<span className="text-cyan-400">Aware</span></span>
          </div>
          <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs">
            Empowering global digital citizens through real-time security intelligence and interactive AI learning.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <button 
            onClick={() => setView('about')}
            className="text-gray-400 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Mission
          </button>
          <button 
            onClick={() => setView('terms')}
            className="text-gray-400 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Terms
          </button>
          <button 
            onClick={() => setView('privacy')}
            className="text-gray-400 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Privacy
          </button>
        </div>

        <div className="text-right">
          <p className="text-gray-600 text-[10px] font-mono tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} CyberAware Intelligence Platform. <br />
            All Rights Reserved. Secure Protocol Active.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

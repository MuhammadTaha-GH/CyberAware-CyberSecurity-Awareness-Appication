
import React from 'react';
// Changed import from User to UserProfile to align with App.tsx state
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile | null;
  onLogout: () => void;
  setView: (view: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, setView }) => {
  return (
    <nav className="fixed top-0 w-full h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setView('landing')}
      >
        <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/20 group-hover:bg-cyan-50 transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Cyber<span className="text-cyan-400">Aware</span></span>
      </div>

      <div className="flex items-center gap-6">
        {currentUser ? (
          <>
            <div className="flex flex-col items-end">
              {/* Fix: Removed reference to currentUser.username as it is not defined in UserProfile */}
              <span className="text-sm font-medium text-gray-200">{currentUser.email}</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest">{currentUser.role}</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-all"
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('login')}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => setView('signup')}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-900/40 transition-all font-medium"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

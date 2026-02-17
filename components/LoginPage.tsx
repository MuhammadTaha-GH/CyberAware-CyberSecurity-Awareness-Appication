
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  mode: 'login' | 'signup';
  setView: (view: 'login' | 'signup' | 'landing' | 'dashboard') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ mode, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Password Strength State
  const [strength, setStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (mode === 'signup') {
      setStrength({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      });
    }
  }, [password, mode]);

  const isPasswordSecure = Object.values(strength).every(Boolean);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    if (mode === 'signup' && !isPasswordSecure) {
      setError('Password does not meet the required security protocols.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        
        if (authError) {
          if (authError.message.includes('confirmation email')) {
            setError('Supabase Email Limit Reached: To fix this, go to your Supabase Dashboard -> Authentication -> Settings and DISABLE "Confirm email". Then try signing up again.');
            setLoading(false);
            return;
          }
          throw authError;
        }

        if (data.user && !data.session) {
          setInfo('Verification link dispatched. Check your inbox to authorize this terminal. If you see this but want instant access, disable "Confirm email" in Supabase settings.');
        } else if (data.session) {
          setView('dashboard');
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
        setView('dashboard');
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      if (err.message?.includes('users') && err.message?.includes('not found')) {
        window.location.reload();
      } else {
        setError(err.message || 'Authentication sequence failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const Requirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-wider transition-colors ${met ? 'text-cyan-400' : 'text-gray-600'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-gray-800'}`}></div>
      {label}
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
      
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-cyan-600/10 rounded-2xl flex items-center justify-center text-cyan-500 mx-auto mb-6 border border-cyan-500/20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
          {mode === 'login' ? 'System Access' : 'Create Identity'}
        </h2>
        <p className="text-gray-500 text-sm font-medium">Secure perimeter authentication required.</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        <div className="group">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Terminal Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 bg-black/40 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none text-white font-medium transition-all"
            placeholder="operative@cyberguard.net"
            required
          />
        </div>
        <div className="group">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Access Cipher</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 bg-black/40 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none text-white font-medium transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        {mode === 'signup' && (
          <div className="p-5 bg-black/30 border border-gray-800 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Security Protocols</p>
             <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Requirement met={strength.length} label="8+ Characters" />
                <Requirement met={strength.uppercase} label="Uppercase" />
                <Requirement met={strength.lowercase} label="Lowercase" />
                <Requirement met={strength.number} label="Number" />
                <Requirement met={strength.special} label="Special Char" />
             </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl text-xs text-red-400 animate-in shake duration-500">
            <p className="font-bold mb-1 uppercase tracking-widest text-[9px]">Critical Failure</p>
            <p className="opacity-90 leading-relaxed">{error}</p>
          </div>
        )}

        {info && (
          <div className="p-4 bg-cyan-950/30 border border-cyan-900/50 rounded-2xl text-xs text-cyan-400 font-medium leading-relaxed">
             {info}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading || (mode === 'signup' && !isPasswordSecure)}
          className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-cyan-900/20 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (mode === 'login' ? 'Decrypt & Enter' : 'Register Profile')}
        </button>
      </form>
      
      <div className="mt-10 text-center pt-8 border-t border-gray-800/50">
        <p className="text-gray-500 text-xs font-bold tracking-wide">
          {mode === 'login' ? "UNAUTHORIZED?" : "IDENTIFIED?"}
          <button 
            type="button"
            className="ml-3 text-cyan-500 font-black hover:text-cyan-400 uppercase tracking-widest text-[10px] transition-colors"
            onClick={() => {
              setView(mode === 'login' ? 'signup' : 'login');
              setError('');
              setInfo('');
            }}
          >
            {mode === 'login' ? 'Create Account' : 'Gateway Login'}
          </button>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-in.shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

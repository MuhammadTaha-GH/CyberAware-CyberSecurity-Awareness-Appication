
import React, { useState } from 'react';

const SQL_SCHEMA = `-- 1. CREATE CORE TABLES
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. AUTOMATIC USER CREATION TRIGGER
-- This function runs inside the DB whenever a new user signs up in Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function after every signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 4. DEFINE ACCESS POLICIES
-- Users: View own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

-- Admins: Full manage users
DROP POLICY IF EXISTS "Admins manage users" ON public.users;
CREATE POLICY "Admins manage users" ON public.users FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Updates: Public can read; Admins manage
DROP POLICY IF EXISTS "Everyone can read updates" ON public.security_updates;
CREATE POLICY "Everyone can read updates" ON public.security_updates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage updates" ON public.security_updates;
CREATE POLICY "Admins manage updates" ON public.security_updates FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Chat: User manages own history
DROP POLICY IF EXISTS "Users manage own chat" ON public.chat_history;
CREATE POLICY "Users manage own chat" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);

-- Chat: Admin view all history
DROP POLICY IF EXISTS "Admins view all chats" ON public.chat_history;
CREATE POLICY "Admins view all chats" ON public.chat_history FOR ALL 
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 5. ADMIN UTILITY
-- Run this manually to promote yourself to admin:
-- UPDATE public.users SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';`;

const SchemaWizard: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full bg-gray-900 border border-cyan-900/30 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10"></div>
        
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-500 border border-cyan-500/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">System Initialization</h1>
            <p className="text-gray-400 font-medium">Automatic user profiling is currently offline.</p>
          </div>
        </div>

        <div className="bg-black/40 rounded-3xl p-8 mb-10 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Advanced SQL Blueprint v3.0 (FULL ADMIN)</span>
            <button 
              onClick={copyToClipboard}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
            >
              {copied ? 'Copied!' : 'Copy SQL Script'}
            </button>
          </div>
          <pre className="text-[11px] text-cyan-500/60 font-mono overflow-x-auto h-64 bg-black/20 p-4 rounded-xl leading-relaxed">
            {SQL_SCHEMA}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
           <div className="p-6 bg-blue-900/10 border border-blue-800/30 rounded-2xl">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                 <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Blueprint Info
              </h4>
              <p className="text-blue-200 text-xs leading-relaxed">
                This version enables <strong>Full Admin Control</strong> over users and chat logs. Please update your DB if you already ran an older version.
              </p>
           </div>
           <div className="p-6 bg-orange-900/10 border border-orange-800/30 rounded-2xl">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                 <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 Critical Rule
              </h4>
              <p className="text-orange-200 text-xs leading-relaxed">
                Ensure you promote yourself to admin in the SQL Editor after running the script.
              </p>
           </div>
        </div>

        <button 
          onClick={onRetry}
          className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all"
        >
          Verify Database Sync
        </button>
      </div>
    </div>
  );
};

export default SchemaWizard;

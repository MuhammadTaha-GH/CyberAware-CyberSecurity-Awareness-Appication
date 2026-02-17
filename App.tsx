
import React, { useState, useEffect } from 'react';
import { UserProfile, SecurityUpdate } from './types';
import { supabase } from './services/supabase';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import ChatBot from './components/ChatBot';
import SchemaWizard from './components/SchemaWizard';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Footer from './components/Footer';

type ViewType = 'landing' | 'login' | 'signup' | 'dashboard' | 'about' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<ViewType>('landing');
  const [updates, setUpdates] = useState<SecurityUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaError, setSchemaError] = useState<boolean>(false);

  const checkDatabaseSchema = async () => {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error && (error.code === '42P01' || error.message.includes('not found'))) {
      setSchemaError(true);
    }
  };

  useEffect(() => {
    checkDatabaseSchema();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.email);
        setView('dashboard');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id, session.user.email);
        setView('dashboard');
      } else {
        setCurrentUser(null);
        if (view === 'dashboard') setView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code === '42P01') {
          setSchemaError(true);
          return;
        }
        if (error.code === 'PGRST116' && email) {
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([{ id: userId, email: email, role: 'user' }])
            .select()
            .single();
          
          if (!createError && newProfile) {
            setCurrentUser(newProfile);
          }
        }
        return;
      }
      if (data) setCurrentUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from('security_updates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      if (error.code === '42P01') setSchemaError(true);
      return;
    }
    if (data) setUpdates(data);
  };

  useEffect(() => {
    if (session) fetchUpdates();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (schemaError) {
    return <SchemaWizard onRetry={() => {
      setSchemaError(false);
      window.location.reload();
    }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-cyan-500 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">Initializing Protocol</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30 flex flex-col">
      <Navbar currentUser={currentUser} onLogout={handleLogout} setView={(v) => setView(v as ViewType)} />
      
      <main className="flex-grow pt-16 pb-20">
        {view === 'landing' && <LandingPage setView={(v) => setView(v as ViewType)} hasSession={!!session} />}
        {(view === 'login' || view === 'signup') && (
          <LoginPage mode={view as 'login' | 'signup'} setView={(v) => setView(v as ViewType)} />
        )}
        {view === 'about' && <AboutPage />}
        {view === 'terms' && <TermsPage />}
        {view === 'privacy' && <PrivacyPolicyPage />}

        {view === 'dashboard' && (
          currentUser ? (
            currentUser.role === 'admin' ? (
              <AdminDashboard updates={updates} onRefresh={fetchUpdates} />
            ) : (
              <UserDashboard updates={updates} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center pt-32 px-6">
               <div className="animate-bounce w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <h2 className="text-2xl font-bold mb-2">Synchronizing Credentials...</h2>
               <p className="text-gray-500 text-sm max-w-sm text-center">Identifying security profile. If this takes too long, your database might be uninitialized.</p>
               <button onClick={() => window.location.reload()} className="mt-8 px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-xs font-bold uppercase tracking-widest">Retry Connection</button>
            </div>
          )
        )}
      </main>

      {currentUser && currentUser.role === 'user' && <ChatBot userId={currentUser.id} />}
      
      <Footer setView={(v) => setView(v as ViewType)} />
    </div>
  );
};

export default App;

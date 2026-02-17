
import React, { useState } from 'react';
import { SecurityUpdate, Severity, Category } from '../types';
import { supabase } from '../services/supabase';

interface AdminDashboardProps {
  updates: SecurityUpdate[];
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ updates, onRefresh }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    type: Category.NETWORK as string,
    severity: 'Medium' as Severity
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      await supabase.from('security_updates').update({ ...form }).eq('id', editingId);
    } else {
      await supabase.from('security_updates').insert([{ ...form, created_by: user.id }]);
    }
    
    setIsFormOpen(false);
    setEditingId(null);
    setForm({ title: '', summary: '', type: Category.NETWORK, severity: 'Medium' });
    onRefresh();
  };

  const handleDeleteUpdate = async (id: string) => {
    if (confirm('Permanently remove this intelligence module?')) {
      await supabase.from('security_updates').delete().eq('id', id);
      onRefresh();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Security <span className="text-cyan-500">Command</span></h2>
          <p className="text-gray-400 mt-2 font-medium">Internal Intelligence & Awareness Management</p>
        </div>
        <button 
          onClick={() => { setIsFormOpen(true); setEditingId(null); }}
          className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-cyan-900/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Deploy Intelligence
        </button>
      </header>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
           <h3 className="text-2xl font-bold text-white tracking-tight">Active Awareness Modules</h3>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 border-b border-gray-800">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Intel Module</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Domain</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Risk Level</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {updates.map(u => (
                <tr key={u.id} className="hover:bg-cyan-500/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                     <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{u.title}</div>
                     <div className="text-[10px] text-gray-600 font-mono mt-1 uppercase">MOD_ID: {u.id.split('-')[0]}</div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] text-gray-400 font-bold uppercase bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">{u.type}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${
                      u.severity === 'Critical' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 
                      u.severity === 'High' ? 'border-orange-500/30 text-orange-500 bg-orange-500/5' :
                      u.severity === 'Medium' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                      'border-green-500/30 text-green-500 bg-green-500/5'
                    }`}>
                      {u.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                       <button 
                         onClick={() => { setEditingId(u.id); setForm({ title: u.title, summary: u.summary, type: u.type, severity: u.severity }); setIsFormOpen(true); }} 
                         className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                         title="Modify Intel"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                       </button>
                       <button 
                         onClick={() => handleDeleteUpdate(u.id)} 
                         className="w-10 h-10 bg-red-950/20 hover:bg-red-900/40 rounded-xl flex items-center justify-center text-red-500/70 hover:text-red-500 transition-all"
                         title="Retract Module"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {updates.length === 0 && (
            <div className="py-32 text-center">
               <p className="text-gray-500 italic">No intelligence modules are currently deployed.</p>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-2 bg-cyan-600"></div>
              <h3 className="text-3xl font-black text-white mb-8 tracking-tight">{editingId ? 'Edit Intel Module' : 'Deploy New Intelligence'}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Module Heading</label>
                    <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all" placeholder="Enter descriptive title..." required />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Domain</label>
                       <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer">
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Risk Severity</label>
                       <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value as Severity})} className="w-full bg-black/40 border border-gray-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer">
                          {['Low', 'Medium', 'High', 'Critical'].map(sev => <option key={sev} value={sev}>{sev}</option>)}
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Actionable Intelligence Summary</label>
                    <textarea value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="w-full h-48 bg-black/40 border border-gray-800 rounded-3xl px-6 py-5 text-white outline-none focus:ring-2 focus:ring-cyan-500 resize-none leading-relaxed transition-all" placeholder="Provide detailed security guidance..." required />
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Abort</button>
                    <button type="submit" className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-cyan-900/40 transition-all">Deploy to Network</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

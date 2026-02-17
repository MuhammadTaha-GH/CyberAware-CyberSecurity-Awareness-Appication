
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiChatResponse } from '../services/geminiService';
import { supabase } from '../services/supabase';
import { ChatMessage } from '../types';

interface ChatBotProps {
  userId: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text: userMessage }] }
    ];
    setMessages(newMessages);
    
    setIsTyping(true);
    const response = await getGeminiChatResponse(messages, userMessage);
    setIsTyping(false);

    // Persist to Supabase Chat History
    await supabase.from('chat_history').insert([{
      user_id: userId,
      question: userMessage,
      answer: response
    }]);

    setMessages([
      ...newMessages,
      { role: 'model', parts: [{ text: response }] }
    ]);
  };

  return (
    <div className="fixed bottom-16 right-6 z-[200]">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
            <span className="font-bold text-white text-sm">CyberGuard AI</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'}`}>
                  {m.parts[0].text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-cyan-500 animate-pulse">Decrypting intelligence...</div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-gray-950 border-t border-gray-800">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query security database..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-cyan-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:bg-cyan-500 transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.827-1.213L3 21l1.33-4.432A7.998 7.998 0 015 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatBot;

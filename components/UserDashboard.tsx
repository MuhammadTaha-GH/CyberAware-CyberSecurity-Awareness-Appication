
import React, { useState, useEffect } from 'react';
import { SecurityUpdate, Severity, Category, QuizQuestion, Flashcard } from '../types';
import { generateQuiz, generateFlashcards } from '../services/geminiService';

interface UserDashboardProps {
  updates: SecurityUpdate[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ updates }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'learning'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewUpdate, setPreviewUpdate] = useState<SecurityUpdate | null>(null);

  // Learning State
  const [learningMode, setLearningMode] = useState<'select' | 'quiz' | 'flashcards'>('select');
  const [learningCategory, setLearningCategory] = useState<string>(Category.PHISHING);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loadingLearning, setLoadingLearning] = useState(false);
  
  // Quiz Session State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Flashcard Session State
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredUpdates = selectedCategory === 'All' 
    ? updates 
    : updates.filter(u => u.type === selectedCategory);

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const categories = ['All', ...Object.values(Category)];

  // Learning Hub Functions
  const startQuiz = async () => {
    setLoadingLearning(true);
    const questions = await generateQuiz(learningCategory);
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setShowExplanation(false);
    setLearningMode('quiz');
    setLoadingLearning(false);
  };

  const startFlashcards = async () => {
    setLoadingLearning(true);
    const cards = await generateFlashcards(learningCategory);
    setFlashcards(cards);
    setCurrentFlashcardIndex(0);
    setIsFlipped(false);
    setLearningMode('flashcards');
    setLoadingLearning(false);
  };

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === quizQuestions[currentQuizIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Navigation Tabs */}
      <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-800 backdrop-blur-sm w-fit mb-10">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
            activeTab === 'feed' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-900/20' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
          Intel Feed
        </button>
        <button
          onClick={() => setActiveTab('learning')}
          className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
            activeTab === 'learning' ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-900/20' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Learning Hub
        </button>
      </div>

      {activeTab === 'feed' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Security Intel <span className="text-cyan-500">Feed</span></h2>
              <p className="text-gray-400 text-lg">Real-time awareness for the digital frontline.</p>
            </div>
            <div className="relative group">
               <select 
                 className="appearance-none bg-gray-900 border border-gray-800 text-white px-6 py-3 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold text-sm cursor-pointer"
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
               >
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUpdates.map(update => (
              <div 
                key={update.id}
                onClick={() => setPreviewUpdate(update)}
                className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-8 cursor-pointer hover:border-cyan-500/50 transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 bg-cyan-600/10 rounded-xl flex items-center justify-center text-cyan-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                   </div>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${getSeverityColor(update.severity)}`}>
                    {update.severity.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 tracking-widest">{new Date(update.created_at).toLocaleDateString()}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-cyan-400 transition-colors">
                  {update.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {update.summary}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{update.type}</span>
                   <span className="text-xs font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">Quick View &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          {updates.length === 0 && (
            <div className="text-center py-40 border-2 border-dashed border-gray-800 rounded-3xl">
               <p className="text-gray-500 italic">No awareness updates found for this category.</p>
            </div>
          )}
        </div>
      ) : (
        /* Learning Hub View */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[600px]">
          {learningMode === 'select' && (
            <div className="max-w-4xl mx-auto py-10">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">AI Learning <span className="text-cyan-500">Simulator</span></h2>
                <p className="text-gray-400 text-lg">Hone your security reflexes with AI-generated interactive modules.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-12 shadow-2xl">
                <div className="mb-10">
                   <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Select Target Intelligence Domain</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.values(Category).slice(0, 10).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setLearningCategory(cat)}
                          className={`p-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                            learningCategory === cat 
                              ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400' 
                              : 'bg-black/20 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button 
                     onClick={startQuiz}
                     disabled={loadingLearning}
                     className="group relative h-64 bg-gray-950 border border-gray-800 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center gap-4"
                   >
                     <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     {loadingLearning ? (
                       <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                     ) : (
                       <>
                         <div className="text-5xl">🎯</div>
                         <div className="text-center">
                            <div className="text-xl font-black text-white uppercase tracking-wider">Start Quiz</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">MCQ Awareness Assessment</div>
                         </div>
                       </>
                     )}
                   </button>

                   <button 
                     onClick={startFlashcards}
                     disabled={loadingLearning}
                     className="group relative h-64 bg-gray-950 border border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-4"
                   >
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     {loadingLearning ? (
                       <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                     ) : (
                       <>
                         <div className="text-5xl">🗂️</div>
                         <div className="text-center">
                            <div className="text-xl font-black text-white uppercase tracking-wider">Flash Cards</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Rapid Knowledge Retrieval</div>
                         </div>
                       </>
                     )}
                   </button>
                </div>
              </div>
            </div>
          )}

          {learningMode === 'quiz' && quizQuestions.length > 0 && (
            <div className="max-w-3xl mx-auto py-10 animate-in zoom-in-95 duration-300">
               {!quizFinished ? (
                 <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-1.5 bg-cyan-600 transition-all duration-500" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                    
                    <div className="flex justify-between items-center mb-10">
                       <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Module: {learningCategory}</span>
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Step {currentQuizIndex + 1} of {quizQuestions.length}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-10 leading-relaxed">
                      {quizQuestions[currentQuizIndex].question}
                    </h3>

                    <div className="space-y-4 mb-10">
                       {quizQuestions[currentQuizIndex].options.map((opt, i) => (
                         <button
                           key={i}
                           onClick={() => handleOptionClick(i)}
                           disabled={selectedOption !== null}
                           className={`w-full p-6 rounded-2xl border text-left font-medium transition-all flex justify-between items-center ${
                             selectedOption === null 
                               ? 'bg-black/20 border-gray-800 text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/5' 
                               : i === quizQuestions[currentQuizIndex].correctIndex
                                 ? 'bg-green-500/10 border-green-500 text-green-400'
                                 : selectedOption === i
                                   ? 'bg-red-500/10 border-red-500 text-red-400'
                                   : 'bg-black/10 border-gray-800 text-gray-600'
                           }`}
                         >
                           {opt}
                           {selectedOption !== null && i === quizQuestions[currentQuizIndex].correctIndex && (
                             <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                           )}
                         </button>
                       ))}
                    </div>

                    {showExplanation && (
                      <div className="bg-cyan-600/5 border border-cyan-500/20 rounded-2xl p-6 mb-10 animate-in fade-in slide-in-from-top-2">
                         <div className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">Technical Insight</div>
                         <p className="text-sm text-gray-300 leading-relaxed">{quizQuestions[currentQuizIndex].explanation}</p>
                      </div>
                    )}

                    {selectedOption !== null && (
                      <button 
                        onClick={nextQuestion}
                        className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-cyan-900/20"
                      >
                        {currentQuizIndex === quizQuestions.length - 1 ? 'Finish Assessment' : 'Next Intelligence Check'}
                      </button>
                    )}
                 </div>
               ) : (
                 <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-16 text-center shadow-2xl">
                    <div className="w-24 h-24 bg-cyan-600/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">🏆</div>
                    <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Assessment Complete</h3>
                    <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em] mb-12">Security Clearance Verified</p>
                    
                    <div className="text-7xl font-black text-cyan-500 mb-4">{Math.round((score / quizQuestions.length) * 100)}%</div>
                    <div className="text-sm text-gray-400 mb-12">You identified {score} out of {quizQuestions.length} threats correctly.</div>

                    <div className="flex gap-4">
                       <button 
                         onClick={() => setLearningMode('select')}
                         className="flex-1 py-5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                       >
                         Back to Hub
                       </button>
                       <button 
                         onClick={startQuiz}
                         className="flex-1 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-cyan-900/20"
                       >
                         Re-simulate Quiz
                       </button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {learningMode === 'flashcards' && flashcards.length > 0 && (
            <div className="max-w-2xl mx-auto py-10 animate-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center mb-10 px-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{learningCategory}</span>
                    <span className="text-lg font-bold text-white mt-1">Active Memory Bank</span>
                  </div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Card {currentFlashcardIndex + 1} / {flashcards.length}</div>
               </div>

               <div 
                 className="relative w-full h-96 perspective-1000 cursor-pointer group"
                 onClick={() => setIsFlipped(!isFlipped)}
               >
                 <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-gray-900 border border-gray-800 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-blue-500/30">
                       <div className="absolute top-8 right-8 text-2xl opacity-20 group-hover:opacity-100 transition-opacity">🔍</div>
                       <h3 className="text-3xl font-bold text-white leading-tight">{flashcards[currentFlashcardIndex].front}</h3>
                       <p className="mt-8 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Click to reveal intelligence</p>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-900/20 border border-blue-500/50 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center shadow-2xl rotate-y-180 backdrop-blur-md">
                       <h3 className="text-2xl font-bold text-blue-100 leading-relaxed italic">
                         {flashcards[currentFlashcardIndex].back}
                       </h3>
                       <p className="mt-8 text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">Insight Acknowledged</p>
                    </div>
                 </div>
               </div>

               <div className="flex gap-4 mt-12 px-6">
                  <button 
                    onClick={() => {
                      if (currentFlashcardIndex > 0) {
                        setCurrentFlashcardIndex(prev => prev - 1);
                        setIsFlipped(false);
                      } else {
                        setLearningMode('select');
                      }
                    }}
                    className="flex-1 py-4 bg-gray-900 border border-gray-800 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:bg-gray-800"
                  >
                    {currentFlashcardIndex === 0 ? 'Exit' : 'Previous Module'}
                  </button>
                  <button 
                    onClick={() => {
                      if (currentFlashcardIndex < flashcards.length - 1) {
                        setCurrentFlashcardIndex(prev => prev + 1);
                        setIsFlipped(false);
                      } else {
                        setLearningMode('select');
                      }
                    }}
                    className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-900/30"
                  >
                    {currentFlashcardIndex === flashcards.length - 1 ? 'Complete Sequence' : 'Next Intelligence Block'}
                  </button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Hover Preview Modal (Global) */}
      {previewUpdate && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl animate-in fade-in duration-300" 
          onClick={() => setPreviewUpdate(null)}
        >
          <div 
            className="max-w-3xl w-full bg-gray-900 border border-gray-800 rounded-[2.5rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 relative overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col gap-3">
                <span className={`inline-flex w-fit px-4 py-1 rounded-xl text-xs font-bold border ${getSeverityColor(previewUpdate.severity)}`}>
                  {previewUpdate.severity} Severity
                </span>
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Issued by Security Protocol</span>
              </div>
              <button 
                onClick={() => setPreviewUpdate(null)} 
                className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-8 leading-tight">{previewUpdate.title}</h2>
            <div className="bg-gray-950/50 border border-gray-800 rounded-3xl p-8 mb-10">
               <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{previewUpdate.summary}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-gray-800 text-[10px] font-bold text-gray-500 tracking-widest">
              <div className="flex gap-8">
                <div>CATEGORY: <span className="text-white ml-2">{previewUpdate.type.toUpperCase()}</span></div>
                <div>TIMESTAMP: <span className="text-white ml-2">{new Date(previewUpdate.created_at).toLocaleString()}</span></div>
              </div>
              <button 
                onClick={() => setPreviewUpdate(null)}
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold tracking-normal transition-all"
              >
                Acknowledge Intel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Extensions for 3D Effects */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputForm } from './components/InputForm';
import { AnalysisReport } from './components/AnalysisReport';
import { AnalysisRequest, AnalysisResult, HistoryItem } from './types';
import { analyzeRequirements } from './services/geminiService';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('dg_history');
    const savedResults = localStorage.getItem('dg_results');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  const saveToStorage = (newHistory: HistoryItem[], newResults: Record<string, AnalysisResult>) => {
    localStorage.setItem('dg_history', JSON.stringify(newHistory));
    localStorage.setItem('dg_results', JSON.stringify(newResults));
  };

  const handleAnalysisSubmit = async (data: AnalysisRequest) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeRequirements(data);
      
      const newHistoryItem: HistoryItem = {
        id: result.id,
        title: result.projectTitle,
        timestamp: result.timestamp,
        riskLevel: result.riskLevel
      };

      const newHistory = [newHistoryItem, ...history];
      const newResults = { ...results, [result.id]: result };

      setHistory(newHistory);
      setResults(newResults);
      setActiveAnalysisId(result.id);
      saveToStorage(newHistory, newResults);

    } catch (err) {
      setError("Failed to generate analysis. Please ensure your API key is configured correctly and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = (id: string) => {
    setActiveAnalysisId(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewAnalysis = () => {
    setActiveAnalysisId(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden print:h-auto print:overflow-visible">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 h-full transition-all duration-300 ease-in-out print:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-64'} 
        ${!isSidebarOpen && 'md:w-0 md:overflow-hidden'}
      `}>
        <Sidebar 
          history={history} 
          onSelectHistory={handleSelectHistory} 
          onNewAnalysis={handleNewAnalysis}
          activeId={activeAnalysisId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full print:h-auto print:overflow-visible">
        {/* Top Bar (Mobile/Toggle) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 print:hidden">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center space-x-2">
            {!process.env.API_KEY && (
               <div className="hidden md:flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                 API KEY MISSING
               </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto print:overflow-visible print:h-auto">
          {error && (
            <div className="m-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center justify-center print:hidden">
              {error}
            </div>
          )}

          {activeAnalysisId && results[activeAnalysisId] ? (
            <AnalysisReport result={results[activeAnalysisId]} />
          ) : (
            <InputForm onSubmit={handleAnalysisSubmit} isAnalyzing={isAnalyzing} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
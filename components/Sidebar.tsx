import React from 'react';
import { HistoryItem, RiskLevel } from '../types';
import { LayoutDashboard, History, PlusCircle, AlertTriangle, CheckCircle, AlertOctagon, Info } from 'lucide-react';

interface SidebarProps {
  history: HistoryItem[];
  onSelectHistory: (id: string) => void;
  onNewAnalysis: () => void;
  activeId: string | null;
}

const getRiskIcon = (level: RiskLevel) => {
  switch (level) {
    case RiskLevel.CRITICAL: return <AlertOctagon className="w-4 h-4 text-red-500" />;
    case RiskLevel.HIGH: return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    case RiskLevel.MEDIUM: return <Info className="w-4 h-4 text-yellow-500" />;
    case RiskLevel.LOW: return <CheckCircle className="w-4 h-4 text-green-500" />;
    default: return <Info className="w-4 h-4 text-gray-500" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ history, onSelectHistory, onNewAnalysis, activeId }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">DeliveryGuard</span>
      </div>

      <div className="p-4">
        <button
          onClick={onNewAnalysis}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Analysis</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-2 flex items-center space-x-2">
          <History className="w-4 h-4" />
          <span>Recent Analyses</span>
        </div>
        
        <div className="space-y-2">
          {history.length === 0 && (
            <p className="text-slate-600 text-sm italic text-center py-4">No history yet.</p>
          )}
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item.id)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-start space-x-3 ${
                activeId === item.id ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="mt-0.5 shrink-0">{getRiskIcon(item.riskLevel)}</div>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  );
};
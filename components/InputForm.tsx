import React, { useState } from 'react';
import { AnalysisRequest } from '../types';
import { Play, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: AnalysisRequest) => void;
  isAnalyzing: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isAnalyzing }) => {
  const [requirements, setRequirements] = useState('');
  const [timelines, setTimelines] = useState('');
  const [constraints, setConstraints] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) return;
    onSubmit({ requirements, timelines, constraints });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">New Estimation Project</h1>
        <p className="text-slate-600">Provide details about your project to generate a comprehensive delivery risk and effort estimation report.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Business Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe the core functionality, user stories, and business goals..."
            className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Expected Timelines
            </label>
            <textarea
              value={timelines}
              onChange={(e) => setTimelines(e.target.value)}
              placeholder="e.g., MVP in 3 months, Hard deadline Dec 1st..."
              className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Constraints & Assumptions
            </label>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g., Must use AWS, Team size of 3, HIPAA compliance..."
              className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isAnalyzing || !requirements.trim()}
            className={`
              flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5
              ${isAnalyzing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Analyzing Complexity...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Generate Estimation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
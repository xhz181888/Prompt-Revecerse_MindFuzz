import React, { useState } from 'react';
import { Copy, Check, Sparkles, Send } from 'lucide-react';
import { AnalysisResult } from '../types';

interface PromptDisplayProps {
  result: AnalysisResult | null;
  loading: boolean;
  onRefine: (instruction: string) => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ result, loading, onRefine }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'chinese'>('english');
  const [refineText, setRefineText] = useState('');

  const handleCopy = async () => {
    if (!result) return;
    const textToCopy = result[activeTab];
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refineText.trim()) {
      onRefine(refineText);
      setRefineText('');
    }
  };

  if (!result && !loading) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up pb-20">
      <div className="relative group">
        {/* Label Badge */}
        <div className="absolute -top-3 left-4 px-3 py-0.5 bg-[#09090b] z-10 flex items-center gap-2 border border-zinc-800 rounded-full">
           {loading ? (
             <span className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
               正在分析 / Analyzing...
             </span>
           ) : (
             <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
               <Sparkles className="w-3.5 h-3.5" />
               生成结果 / Result
             </span>
           )}
        </div>

        <div className={`
          relative w-full rounded-2xl border bg-zinc-900/30 backdrop-blur-sm overflow-hidden transition-all duration-500
          ${loading ? 'border-indigo-500/30 shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)]' : 'border-zinc-800 hover:border-zinc-700 shadow-2xl'}
        `}>
          
          {/* Tabs */}
          {!loading && result && (
            <div className="flex border-b border-zinc-800/80 bg-zinc-900/50">
              <button
                onClick={() => setActiveTab('english')}
                className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all relative
                  ${activeTab === 'english' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                English
                {activeTab === 'english' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500" />}
              </button>
              <button
                onClick={() => setActiveTab('chinese')}
                className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all relative
                  ${activeTab === 'chinese' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                中文 (Chinese)
                {activeTab === 'chinese' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500" />}
              </button>
            </div>
          )}

          <div className="p-6 md:p-8">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-5/6"></div>
                <div className="h-4 bg-zinc-800/50 rounded w-2/3"></div>
                <div className="h-4 bg-zinc-800/30 rounded w-1/2 mt-4"></div>
              </div>
            ) : result ? (
              <>
                <div className="min-h-[140px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <p className="text-zinc-300 text-sm md:text-base leading-loose font-light whitespace-pre-wrap font-mono">
                    {result[activeTab]}
                  </p>
                </div>
                
                {/* Action Bar */}
                <div className="mt-8 flex items-center justify-end gap-2">
                   <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors border border-zinc-700/50 shadow-lg"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">已复制 / Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>复制 / Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Refine Input */}
                <div className="mt-8 pt-6 border-t border-zinc-800/50">
                  <label className="block text-xs text-zinc-500 font-medium uppercase tracking-wider mb-3">
                    细节润色 / Refine Prompt
                  </label>
                  <form onSubmit={handleRefineSubmit} className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-500" />
                    <input
                      type="text"
                      value={refineText}
                      onChange={(e) => setRefineText(e.target.value)}
                      placeholder="输入修改建议，例如：'光线再暗一点' / 'Make lighting darker'..."
                      className="relative w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-4 pr-12 py-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!refineText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDisplay;
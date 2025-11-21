import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import PromptDisplay from './components/PromptDisplay';
import ControlPanel from './components/ControlPanel';
import SettingsModal from './components/SettingsModal';
import { UploadedFile, GenerationState, AnalysisResult, AnalysisStyle, ModelType } from './types';
import { reverseEngineerPrompt, refinePrompt } from './services/geminiService';
import { AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({ status: 'idle' });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AnalysisStyle>('photorealistic');
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-2.5-flash');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Only set the file, do NOT auto analyze
  const handleFileSelect = (uploadedFile: UploadedFile) => {
    setFile(uploadedFile);
    setResult(null);
    setGenerationState({ status: 'idle' });
  };

  const handleClear = () => {
    setFile(null);
    setGenerationState({ status: 'idle' });
    setResult(null);
  };

  const handleStartAnalysis = async () => {
    if (!file) return;
    setGenerationState({ status: 'analyzing' });
    setResult(null);
    
    try {
      const data = await reverseEngineerPrompt(file.base64, file.mimeType, selectedStyle, selectedModel);
      setResult(data);
      setGenerationState({ status: 'success' });
    } catch (error) {
      setGenerationState({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to analyze content' 
      });
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!file || !result) return;
    
    setGenerationState({ status: 'analyzing' });
    try {
      const newResult = await refinePrompt(
        file.base64, 
        file.mimeType, 
        result, 
        instruction
      );
      setResult(newResult);
      setGenerationState({ status: 'success' });
    } catch (error) {
      setGenerationState({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to refine prompt' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative">
      {/* Ambient Background Glow with Animation */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-12 max-w-5xl mx-auto w-full">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="flex-1 flex flex-col items-center gap-8 mt-4">
          
          <ControlPanel
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            disabled={generationState.status === 'analyzing'}
          />

          <div className="w-full flex flex-col items-center gap-6">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onClear={handleClear}
              currentFile={file}
              disabled={generationState.status === 'analyzing'}
              isAnalyzing={generationState.status === 'analyzing'}
            />

            {/* Action Button Area */}
            <div className="h-16 flex items-center justify-center w-full">
              {file && !result && generationState.status !== 'analyzing' && (
                <button
                  onClick={handleStartAnalysis}
                  className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)] flex items-center gap-3 animate-slide-up"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                  <span>Start Analysis / 开始反推</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {generationState.status === 'error' && (
            <div className="w-full max-w-2xl p-4 rounded-xl bg-red-950/20 border border-red-900/50 flex items-center gap-3 text-red-400 animate-fade-in shadow-lg">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{generationState.message}</p>
              {generationState.message?.includes("API Key") && (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="ml-auto text-xs underline hover:text-red-300"
                >
                  Settings / 设置
                </button>
              )}
            </div>
          )}

          <PromptDisplay 
            result={result} 
            loading={generationState.status === 'analyzing'}
            onRefine={handleRefine}
          />
          
          {/* Features Info Footer - Only show on initial idle state */}
          {generationState.status === 'idle' && !file && (
             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left w-full max-w-4xl opacity-40 hover:opacity-80 transition-opacity duration-700">
                <div className="space-y-2 group cursor-default">
                   <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                     Dual Core AI
                   </h3>
                   <p className="text-xs text-zinc-500 leading-relaxed">切换 Flash 极速版或 Pro 旗舰版模型，平衡速度与深度。</p>
                </div>
                <div className="space-y-2 group cursor-default">
                   <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                     Multimodal Mind
                   </h3>
                   <p className="text-xs text-zinc-500 leading-relaxed">精准识别镜头语言、光影变化、字幕内容与画面节奏。</p>
                </div>
                <div className="space-y-2 group cursor-default">
                   <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">
                     Contextual Refine
                   </h3>
                   <p className="text-xs text-zinc-500 leading-relaxed">支持多轮对话细节微调，打造完美的生成式提示词。</p>
                </div>
             </div>
          )}

        </main>

        <footer className="py-8 text-center mt-auto">
          <p className="text-zinc-800 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-zinc-700 transition-colors cursor-default">
            MindFuzz · Powered by Gemini 3 Pro
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
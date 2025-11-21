import React from 'react';
import { Zap, Brain } from 'lucide-react';
import { ModelType } from '../types';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelect: (model: ModelType) => void;
  disabled: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect, disabled }) => {
  return (
    <div className="flex bg-zinc-950/50 p-1 rounded-xl border border-zinc-800/50 relative">
      <button
        onClick={() => onSelect('gemini-2.5-flash')}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium transition-all relative z-10
          ${selectedModel === 'gemini-2.5-flash' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Zap className={`w-3.5 h-3.5 ${selectedModel === 'gemini-2.5-flash' ? 'text-yellow-400' : ''}`} />
        <div className="flex flex-col items-start leading-none gap-1">
          <span>Gemini 2.5 Flash</span>
          <span className="text-[9px] opacity-60 font-light">Extreme Speed</span>
        </div>
      </button>

      <button
        onClick={() => onSelect('gemini-3-pro-preview')}
        disabled={disabled}
        className={`
          flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium transition-all relative z-10
          ${selectedModel === 'gemini-3-pro-preview' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Brain className={`w-3.5 h-3.5 ${selectedModel === 'gemini-3-pro-preview' ? 'text-purple-400' : ''}`} />
        <div className="flex flex-col items-start leading-none gap-1">
          <span>Gemini 3 Pro</span>
          <span className="text-[9px] opacity-60 font-light">Max Intelligence</span>
        </div>
      </button>

      {/* Animated Background Slider */}
      <div 
        className={`
          absolute top-1 bottom-1 rounded-lg bg-zinc-800 shadow-lg transition-all duration-300 ease-out border border-zinc-700
          ${selectedModel === 'gemini-2.5-flash' ? 'left-1 right-1/2' : 'left-1/2 right-1'}
        `}
      />
    </div>
  );
};

export default ModelSelector;
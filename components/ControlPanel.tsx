import React from 'react';
import { AnalysisStyle, ModelType } from '../types';
import StyleSelector from './StyleSelector';
import ModelSelector from './ModelSelector';

interface ControlPanelProps {
  selectedStyle: AnalysisStyle;
  onStyleSelect: (style: AnalysisStyle) => void;
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedStyle,
  onStyleSelect,
  selectedModel,
  onModelSelect,
  disabled
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up z-30">
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="flex flex-col gap-6">
          {/* Section 1: Model Intelligence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">AI Kernel</span>
              <span className="text-[9px] text-zinc-600 font-mono">V2.5 / V3.0 PREVIEW</span>
            </div>
            <ModelSelector 
              selectedModel={selectedModel} 
              onSelect={onModelSelect} 
              disabled={disabled} 
            />
          </div>

          <div className="h-[1px] w-full bg-zinc-800/50" />

          {/* Section 2: Style Engine */}
          <div className="space-y-3">
             <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Style Lens</span>
              <span className="text-[9px] text-zinc-600 font-mono">VISUAL FILTER</span>
            </div>
            <StyleSelector 
              selectedStyle={selectedStyle} 
              onSelect={onStyleSelect} 
              disabled={disabled} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
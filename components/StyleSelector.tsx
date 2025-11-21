import React from 'react';
import { Camera, Palette, Zap, Monitor } from 'lucide-react';
import { AnalysisStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: AnalysisStyle;
  onSelect: (style: AnalysisStyle) => void;
  disabled: boolean;
}

const styles: { id: AnalysisStyle; label: string; subLabel: string; icon: React.FC<any> }[] = [
  { id: 'photorealistic', label: '写实', subLabel: 'Realistic', icon: Camera },
  { id: 'anime', label: '动漫', subLabel: 'Anime', icon: Zap },
  { id: 'creative', label: '抽象', subLabel: 'Creative', icon: Palette },
  { id: 'minimalist', label: '极简', subLabel: 'Minimal', icon: Monitor },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect, disabled }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-1 md:gap-2">
        {styles.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => onSelect(style.id)}
              disabled={disabled}
              className={`
                flex flex-col items-center justify-center py-3 px-1 rounded-xl text-xs transition-all duration-200
                ${isSelected 
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-lg' 
                  : 'bg-zinc-900/50 text-zinc-500 border border-transparent hover:bg-zinc-800/50 hover:text-zinc-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
              `}
            >
              <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-indigo-400' : 'opacity-70'}`} />
              <span className="font-medium scale-95 md:scale-100">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;
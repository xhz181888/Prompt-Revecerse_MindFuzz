import React from 'react';
import { BrainCircuit, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="w-full py-8 relative animate-fade-in">
      {/* Settings Button Absolute Positioned */}
      <div className="absolute top-8 right-0 md:right-4 z-20">
        <button 
          onClick={onOpenSettings}
          className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors rounded-full hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800"
          title="API Key Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 mb-3">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold tracking-wider">
            <span className="text-zinc-100">PROMPT REVERSE</span>
            <span className="ml-2 text-gradient font-extrabold">MindFuzz</span>
          </h1>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-zinc-400 font-light tracking-[0.2em] uppercase">
            Visual to Text Engine
          </p>
          <div className="h-[1px] w-12 bg-zinc-800 my-2"></div>
          <p className="text-xs text-zinc-500 font-light">
            全能视觉反推工具 · Image & Video Analysis
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useCallback, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Film, X, ScanLine, MonitorPlay, AlertTriangle, Loader2 } from 'lucide-react';
import { UploadedFile } from '../types';
import { fileToBase64, getFileType } from '../utils';

interface FileUploadProps {
  onFileSelect: (file: UploadedFile) => void;
  onClear: () => void;
  currentFile: UploadedFile | null;
  disabled: boolean;
  isAnalyzing?: boolean;
}

// Limits to prevent browser crash (OOM) since we handle files in memory (Base64)
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClear, currentFile, disabled, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const type = getFileType(file);
    if (type === 'unknown') {
      alert("请上传有效的图片或视频文件。\nPlease upload a valid image or video file.");
      return;
    }

    // Size Validation
    const maxSize = type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const maxSizeMB = maxSize / (1024 * 1024);
    if (file.size > maxSize) {
      alert(`文件过大 (当前: ${(file.size / 1024 / 1024).toFixed(1)}MB)。\n为防止浏览器崩溃，请上传小于 ${maxSizeMB}MB 的${type === 'video' ? '视频' : '图片'}。\n\nFile too large. Please upload ${type} smaller than ${maxSizeMB}MB to prevent browser crash.`);
      return;
    }

    setIsProcessing(true);
    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      onFileSelect({
        file,
        previewUrl,
        type,
        base64,
        mimeType: file.type
      });
    } catch (err) {
      console.error("Error processing file", err);
      alert("读取文件失败，请重试。\nFailed to process file.");
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile, disabled]);

  const handleInputClick = () => {
    if (!currentFile && fileInputRef.current && !isProcessing) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up z-20">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="hidden"
        accept="image/*,video/*"
        disabled={disabled || isProcessing}
      />
      
      {currentFile ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl group transition-all duration-500">
           {/* Close Button */}
           {!isAnalyzing && (
             <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              disabled={disabled}
              className="absolute top-4 right-4 z-30 p-2 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white rounded-full transition-all disabled:opacity-0 disabled:cursor-default hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
           )}

          <div className="w-full aspect-video relative flex items-center justify-center bg-black group-hover:border-indigo-500/20 transition-colors">
            {/* Scanning Effect Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div className="absolute w-full h-[2px] bg-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-scan"></div>
                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                {/* Grid Overlay for Tech Feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
              </div>
            )}

            {currentFile.type === 'image' ? (
              <img 
                src={currentFile.previewUrl} 
                alt="Preview" 
                className={`max-w-full max-h-full object-contain shadow-lg transition-opacity duration-500 ${isAnalyzing ? 'opacity-60 blur-sm' : 'opacity-100'}`}
              />
            ) : (
              <video 
                src={currentFile.previewUrl} 
                controls={!isAnalyzing}
                autoPlay
                muted
                loop
                className={`max-w-full max-h-full object-contain shadow-lg transition-opacity duration-500 ${isAnalyzing ? 'opacity-60 blur-sm' : 'opacity-100'}`}
              />
            )}
            
            {/* Meta Info Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-4 left-4 z-10">
              <div className="flex items-center gap-2 text-xs text-zinc-300 uppercase tracking-wider font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                {isAnalyzing ? (
                  <><ScanLine className="w-3 h-3 animate-spin text-indigo-400" /> 正在深度分析 / Analyzing...</>
                ) : (
                  <>
                    {currentFile.type === 'image' ? <ImageIcon className="w-3 h-3 text-indigo-400" /> : <MonitorPlay className="w-3 h-3 text-purple-400" />}
                    <span className="truncate max-w-[200px]">{currentFile.file.name}</span>
                    {currentFile.type === 'video' && <span className="text-[10px] text-zinc-500 border-l border-zinc-600 pl-2 ml-1">Video</span>}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleInputClick}
          className={`
            relative w-full aspect-[2/1] md:aspect-[21/9] rounded-xl border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-4 group overflow-hidden
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
              : 'border-zinc-800 hover:border-indigo-500/30 hover:bg-zinc-900/50 bg-zinc-900/20'
            }
            ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] group-hover:opacity-[0.07] transition-opacity" />

          <div className={`
            relative z-10 p-5 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
            ${isDragging ? 'text-indigo-400 border-indigo-500/50 shadow-indigo-500/20' : 'text-zinc-500'}
          `}>
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>
          <div className="relative z-10 text-center space-y-1.5">
            <p className="text-zinc-200 font-medium tracking-wide group-hover:text-indigo-200 transition-colors">
              {isProcessing ? "正在读取文件... / Processing..." : "点击或拖拽上传图片/视频"}
            </p>
            <p className="text-zinc-500 text-xs uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
               {isProcessing ? "Please wait..." : "Click or Drag to Upload (Max 25MB Video)"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
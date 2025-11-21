export interface UploadedFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  base64: string;
  mimeType: string;
}

export interface AnalysisResult {
  english: string;
  chinese: string;
}

export type AnalysisStyle = 'photorealistic' | 'anime' | 'creative' | 'minimalist';

export type ModelType = 'gemini-2.5-flash' | 'gemini-3-pro-preview';

export interface GenerationState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  message?: string;
}
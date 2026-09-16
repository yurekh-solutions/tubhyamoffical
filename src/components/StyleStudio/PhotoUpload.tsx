import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface PhotoUploadProps {
  onPhotoSelect: (file: File, preview: string) => void;
  preview?: string;
  onReplace: () => void;
}

const PhotoUpload = ({ onPhotoSelect, preview, onReplace }: PhotoUploadProps) => {
  const { isLight } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoSelect(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoSelect(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const T = {
    bg: isLight ? '#FFFFFF' : '#1C1714',
    border: isLight ? '#E0D5C8' : 'rgba(255,211,172,0.2)',
    borderActive: '#8B5E3C',
    text: isLight ? '#1A1410' : '#FFF5EB',
    textSec: isLight ? '#6B5E52' : 'rgba(255,211,172,0.7)',
    accent: '#8B5E3C',
  };

  if (preview) {
    return (
      <div className="relative">
        <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden border-2" style={{ borderColor: T.borderActive }}>
          <img
            src={preview}
            alt="Uploaded photo"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onReplace}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-center text-sm mt-4" style={{ color: T.textSec }}>
          Click "Replace" to upload a different photo
        </p>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:scale-[1.02]"
      style={{
        borderColor: isDragging ? T.borderActive : T.border,
        background: isLight ? '#FAF5EF' : '#241E18',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: T.accent + '20' }}>
          <Upload size={32} style={{ color: T.accent }} />
        </div>
        <div className="text-center">
          <p className="font-semibold mb-2" style={{ color: T.text }}>
            Drop your full-body photo here
          </p>
          <p className="text-sm" style={{ color: T.textSec }}>
            or click to browse
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: T.textSec }}>
          <ImageIcon size={14} />
          <span>JPG, PNG up to 10MB</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;

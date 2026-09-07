import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`w-full aspect-square md:aspect-video lg:aspect-square flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer group ${
        isDragging ? 'border-fc-pink bg-fc-emerald-light/20' : 'border-fc-emerald-light hover:border-fc-yellow'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center text-center p-8">
        <Upload className={`w-12 h-12 mb-6 transition-colors ${isDragging ? 'text-fc-pink' : 'text-fc-emerald-light group-hover:text-fc-yellow'}`} strokeWidth={1} />
        <h3 className="font-serif text-3xl md:text-4xl text-fc-cream mb-4 uppercase tracking-tighter">
          Drop Image<br />
          <span className="text-xl md:text-2xl text-fc-emerald-light font-mono italic">or select file</span>
        </h3>
        <p className="font-mono text-xs text-fc-emerald-light uppercase tracking-[0.2em] mt-8">
          Supported: JPG / PNG / WEBP
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;

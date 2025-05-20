import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

interface ImageUploadProps {
  onImageChange?: (file: File | null) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  className?: string;
  label?: string;
  previewWidth?: number;
  previewHeight?: number;
  minHeight?: number;
}

export function ImageUpload({
  onImageChange,
  maxSizeMB = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
  label = '拖拽或点击上传图片',
  previewWidth = 300,
  previewHeight = 300,
  minHeight = 200
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    
    if (!file) {
      setImagePreview(null);
      onImageChange && onImageChange(null);
      return;
    }
    
    // 验证文件类型
    if (!acceptedFileTypes.includes(file.type)) {
      setError(`不支持的文件类型。请上传 ${acceptedFileTypes.map(type => type.replace('image/', '.')).join(', ')} 格式的图片`);
      return;
    }
    
    // 验证文件大小
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`文件大小超过限制 (${maxSizeMB}MB)`);
      return;
    }
    
    // 开始加载
    setIsLoading(true);
    
    // 创建预览URL
    const previewUrl = URL.createObjectURL(file);
    
    // 预加载图片以获取尺寸
    const img = new Image();
    img.onload = () => {
      setImagePreview(previewUrl);
      setIsLoading(false);
      onImageChange && onImageChange(file);
    };
    
    img.onerror = () => {
      setError('图片加载失败');
      setIsLoading(false);
      URL.revokeObjectURL(previewUrl);
    };
    
    img.src = previewUrl;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageChange && onImageChange(null);
  };

  // 清理函数
  useEffect(() => {
    return () => {
      // 在组件卸载时清理预览URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-amber-500 bg-amber-50' 
            : imagePreview 
              ? 'border-stone-200 bg-white' 
              : 'border-stone-300 hover:border-amber-300 bg-stone-50 hover:bg-stone-100'
        }`}
        style={{ minHeight: `${minHeight}px` }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={acceptedFileTypes.join(',')}
          onChange={handleInputChange}
        />
        
        <div className="flex items-center justify-center" style={{ minHeight: `${minHeight - 32}px` }}>
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-2"></div>
              <p className="text-stone-600">正在加载图片...</p>
            </div>
          ) : imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="预览图"
                className="mx-auto object-contain rounded"
                style={{ maxWidth: `${previewWidth}px`, maxHeight: `${previewHeight}px` }}
              />
              <button
                className="absolute top-2 right-2 bg-stone-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-stone-900 transition-colors"
                onClick={removeImage}
                aria-label="移除图片"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-stone-600 font-medium">{label}</p>
              <p className="text-stone-500 text-sm mt-1">
                支持格式: {acceptedFileTypes.map(type => type.replace('image/', '.')).join(', ')}
              </p>
              <p className="text-stone-500 text-sm">
                最大文件大小: {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 
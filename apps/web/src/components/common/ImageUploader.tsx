'use client';

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadToImageKit } from '../../lib/imagekit';
import { useToast } from '../../context/ToastContext';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  label?: string;
  currentUrl?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadComplete,
  folder = 'proof_mockups',
  label = 'Upload Image or Screenshot',
  currentUrl,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast({
        title: 'Invalid File',
        description: 'Please upload an image file (PNG, JPEG, WebP, SVG).',
        type: 'error',
      });
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadToImageKit(file, folder);
      setUploadedUrl(res.url);
      onUploadComplete(res.url);
      addToast({
        title: 'Image Uploaded to CDN',
        description: `"${file.name}" is now live on ImageKit CDN.`,
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Upload Failed',
        description: err?.message || 'Could not upload image.',
        type: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-neutral-300">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-950/40 scale-[0.99]'
            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60 hover:bg-neutral-950/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-3 text-indigo-400 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-medium">Uploading to ImageKit CDN...</span>
          </div>
        ) : uploadedUrl ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uploaded &amp; Ready</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">{uploadedUrl}</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
              Replace
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-2 text-center">
            <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-xs font-medium text-neutral-200">
              Drop screenshot here, or <span className="text-indigo-400 underline">browse</span>
            </div>
            <p className="text-[10px] text-neutral-500">Supports PNG, WebP, JPEG up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

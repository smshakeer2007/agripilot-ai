import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, CheckCircle2 } from 'lucide-react';

const PRESET_SAMPLES = [
  {
    id: 'tomato-early-blight',
    title: 'Tomato Early Blight',
    crop: 'Tomato',
    symptoms: 'My tomato plants have dark brown concentric ring spots on lower leaves with yellowing edges. Humidity has been 85% for three days and soil nitrogen is low.',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=600&q=80',
    tag: 'Pathology (Alternaria)'
  },
  {
    id: 'corn-aphids',
    title: 'Corn Aphids & N-Deficit',
    crop: 'Sweet Corn',
    symptoms: 'Corn leaves have V-shaped yellowing along the midrib and dense green aphid clusters secreting sticky honeydew.',
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    tag: 'Pest + Nutrient Stress'
  },
  {
    id: 'wheat-rust',
    title: 'Wheat Stripe Rust',
    crop: 'Winter Wheat',
    symptoms: 'Parallel linear yellow powdery rust pustules along wheat leaf veins following cool damp morning weather.',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    tag: 'Airborne Fungus'
  },
  {
    id: 'cucumber-mildew',
    title: 'Powdery Mildew',
    crop: 'Cucumber / Squash',
    symptoms: 'White powdery fungal coating on upper leaf surface, causing curling and chlorosis.',
    url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=600&q=80',
    tag: 'Erysiphe Canker'
  },
  {
    id: 'bell-pepper-healthy',
    title: 'Healthy Bell Pepper',
    crop: 'Bell Pepper',
    symptoms: 'Glossy dark green leaves, vigorous vegetative development, no necrotic spots or pest marks.',
    url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    tag: 'Optimal Vigor'
  }
];

export function LeafImageDropzone({ onImageSelected, selectedImage, onClearImage, onSelectPreset }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {!selectedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10'
              : 'border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Upload or Drag Plant Leaf Photo
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Supports JPEG, PNG, WebP up to 15MB. Computer vision model will inspect lesions and discolored foliage.
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 p-2">
          <div className="relative h-48 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Leaf to diagnose"
              className="h-full w-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearImage();
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur text-xs font-medium text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Leaf Imagery Attached
            </div>
          </div>
        </div>
      )}

      {/* Preset Hackathon Sample Leaves */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Quick Demo Samples (Click to autofill)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PRESET_SAMPLES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="group p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-left transition-all"
            >
              <div className="h-16 w-full rounded overflow-hidden mb-1.5 bg-slate-950">
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs font-medium text-slate-200 truncate group-hover:text-emerald-400">
                {preset.title}
              </p>
              <span className="text-[10px] text-slate-400 truncate block">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

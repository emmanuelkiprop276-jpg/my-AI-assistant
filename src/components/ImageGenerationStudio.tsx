import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  RefreshCw, 
  Cpu, 
  Sliders, 
  Layers,
  Wand2,
  Share2
} from 'lucide-react';
import { GeneratedImage, UserSubscription } from '../types';

interface ImageGenerationStudioProps {
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
}

export const ImageGenerationStudio: React.FC<ImageGenerationStudioProps> = ({
  subscription,
  onOpenSubscriptionModal,
}) => {
  const [prompt, setPrompt] = useState('Futuristic AI server core with glowing blue and purple neural pathways in dark high-tech laboratory');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk Neon');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Gallery of user creations
  const [gallery, setGallery] = useState<GeneratedImage[]>([
    {
      id: 'sample-1',
      prompt: 'Cybernetic quantum computing processor with violet photonic circuits',
      style: 'Cyberpunk Neon',
      aspectRatio: '1:1',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230b1335"/><stop offset="100%" stop-color="%231e1045"/></linearGradient></defs><rect width="600" height="600" fill="url(%23g)"/><circle cx="300" cy="300" r="180" fill="none" stroke="%233b82f6" stroke-width="3"/><polygon points="300,160 420,230 420,370 300,440 180,370 180,230" fill="none" stroke="%23a855f7" stroke-width="4"/><circle cx="300" cy="300" r="80" fill="%23131c46" stroke="%2360a5fa" stroke-width="2"/><text x="300" y="305" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle">ENG MANUH AI</text><text x="300" y="335" font-family="monospace" font-size="12" fill="%23c084fc" text-anchor="middle">QUANTUM CORE</text></svg>',
      createdAt: Date.now() - 3600000,
      model: 'gemini-3.1-flash-lite-image',
    },
  ]);

  const styles = [
    { id: 'Cyberpunk Neon', name: 'Cyberpunk Neon', desc: 'Glowing electric blues & magenta' },
    { id: 'Tech Realistic', name: 'Photorealistic Tech', desc: 'Cinematic 8K camera rendering' },
    { id: '3D Digital Art', name: '3D Octane Render', desc: 'Glossy volumetric studio lighting' },
    { id: 'Blueprint Diagram', name: 'Technical Blueprint', desc: 'Architectural schematic drawing' },
    { id: 'Futuristic Sci-Fi', name: 'Futuristic Sci-Fi', desc: 'Deep space & orbital megastructures' },
    { id: 'Minimalist Vector', name: 'Minimalist Tech', desc: 'Crisp geometric vector icon art' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square', icon: '■' },
    { id: '16:9', label: '16:9 Landscape', icon: '▬' },
    { id: '9:16', label: '9:16 Mobile', icon: '▮' },
    { id: '4:3', label: '4:3 Standard', icon: '▰' },
  ];

  const samplePrompts = [
    'Autonomous AI robot engineer designing fiber-optic communication grid at holographic workbench',
    'Dark navy data center with glowing purple server blades and cooling vapor mist',
    'Futuristic city skyline at dusk with flying transport drones and electric blue lighting',
    'Abstract neural network visualization with interconnected purple nodes and pulsing laser beams',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        const newImg: GeneratedImage = {
          id: `img-${Date.now()}`,
          prompt: data.prompt || prompt,
          style: selectedStyle,
          aspectRatio,
          imageUrl: data.imageUrl,
          createdAt: Date.now(),
          model: data.model || 'gemini-3.1-flash-lite-image',
        };
        setCurrentImage(newImg);
        setGallery((prev) => [newImg, ...prev]);
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = () => {
    const enhancements = [
      'cinematic volumetric lighting, 8k resolution, raytracing reflections, dark navy studio atmosphere, award winning render',
      'highly intricate details, hyper-realistic textures, glowing neon purple edge highlights, unreal engine 5 render',
      'photorealistic depth of field, dramatic shadows, futuristic industrial engineering aesthetics',
    ];
    const picked = enhancements[Math.floor(Math.random() * enhancements.length)];
    setPrompt((prev) => `${prev.trim()}, ${picked}`);
  };

  const handleDownloadImage = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.imageUrl;
    link.download = `eng-manuh-ai-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-6 bg-[#050814] text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0b1333] via-[#161038] to-[#1a1140] border border-purple-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Generative AI Art Studio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                AI Image Generation
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Transform natural text descriptions into high-resolution visual art and tech blueprints.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Powered by:</span>
              <span className="px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 font-mono text-xs font-semibold">
                gemini-3.1-flash-lite-image
              </span>
            </div>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#090d24] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              {/* Prompt Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    Image Prompt
                  </label>
                  <button
                    onClick={handleEnhancePrompt}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Enhance Prompt
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create in vivid detail..."
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl bg-[#060a17] border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
                />
              </div>

              {/* Style Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Visual Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedStyle === s.id
                          ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-[#060a17] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {aspectRatios.map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                        aspectRatio === ar.id
                          ? 'bg-blue-900/60 border-blue-500 text-white font-bold'
                          : 'bg-[#060a17] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs block">{ar.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm transition shadow-xl shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Cpu className="w-5 h-5 animate-spin" />
                    <span>Synthesizing Image with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Artwork</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Inspiration Starters */}
            <div className="p-4 rounded-3xl bg-[#090d24] border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Prompt Inspirations:
              </span>
              <div className="space-y-1.5">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(sp)}
                    className="w-full text-left p-2 rounded-xl text-[11px] text-slate-300 hover:text-white bg-[#060a17] hover:bg-slate-800/80 transition truncate block"
                  >
                    "{sp}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Display */}
            <div className="bg-[#090d24] border border-slate-800 rounded-3xl p-5 shadow-2xl min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="text-center space-y-4 p-8">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin [animation-duration:1.5s]" />
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white font-heading">
                    Synthesizing Visual Pixels...
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    ENG MANUH AI is applying diffusion neural weights and color grading for "{selectedStyle}".
                  </p>
                </div>
              ) : currentImage || gallery[0] ? {
                ...(() => {
                  const active = currentImage || gallery[0];
                  return (
                    <div className="w-full space-y-4">
                      {/* Image Viewer */}
                      <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-slate-800 max-h-[420px] flex items-center justify-center group">
                        <img
                          src={active.imageUrl}
                          alt={active.prompt}
                          className="max-h-[400px] w-auto object-contain transition-transform group-hover:scale-[1.02] duration-300"
                        />

                        {/* Top Overlay Actions */}
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleDownloadImage(active)}
                            className="p-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md transition cursor-pointer"
                            title="Download Image"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Metadata Details */}
                      <div className="p-3.5 rounded-2xl bg-[#060a17] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-200 line-clamp-1">
                            {active.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="text-purple-400 font-medium">{active.style}</span>
                            <span>•</span>
                            <span className="font-mono">{active.aspectRatio}</span>
                            <span>•</span>
                            <span className="font-mono text-blue-400">{active.model}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(active.prompt);
                            setCopiedPrompt(true);
                            setTimeout(() => setCopiedPrompt(false), 2000);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 text-xs cursor-pointer self-start sm:self-auto shrink-0"
                        >
                          {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })()
              } : (
                <div className="text-center p-8 space-y-3 text-slate-500">
                  <ImageIcon className="w-16 h-16 mx-auto text-slate-700" />
                  <p className="text-sm font-medium text-slate-400">No artwork generated yet</p>
                  <p className="text-xs text-slate-500">
                    Type a prompt on the left and click "Generate AI Artwork".
                  </p>
                </div>
              )}
            </div>

            {/* Gallery Strip */}
            {gallery.length > 0 && (
              <div className="bg-[#090d24] border border-slate-800 rounded-3xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Recent Creations ({gallery.length})
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {gallery.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        currentImage?.id === img.id
                          ? 'border-purple-500 scale-105'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

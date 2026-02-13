import React, { useState, useEffect } from 'react';
import { Palette, FileText, Image as ImageIcon, Sparkles, Download, Settings, ChevronRight, RefreshCw, Edit, Key } from 'lucide-react';

const generateSessionSecret = () => {
  return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const AIDesignStudio = () => {
  const [sessionSecret, setSessionSecret] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedType, setSelectedType] = useState(null);
  const [creationMode, setCreationMode] = useState(null);
  const [designPrompt, setDesignPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [editRequest, setEditRequest] = useState('');
  
  const [guidedStep, setGuidedStep] = useState(1);
  const [guidedAnswers, setGuidedAnswers] = useState({
    purpose: '',
    audience: '',
    mood: '',
    colors: '',
    text: ''
  });
  
  const [designOptions, setDesignOptions] = useState({
    font: 'modern',
    size: 'instagram-post',
    theme: 'vibrant',
    style: 'realistic',
    niche: 'tech'
  });

  useEffect(() => {
    const secret = generateSessionSecret();
    setSessionSecret(secret);
  }, []);

  const validateLicense = async () => {
    setIsValidating(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (licenseKey.length > 5) {
        setIsAuthenticated(true);
      } else {
        setError('Invalid license key. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate license. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const designTypes = [
    { id: 'logo', name: 'Logo', icon: Palette, desc: 'Brand identity designs' },
    { id: 'flyer', name: 'Flyer', icon: FileText, desc: 'Event & promotional materials' },
    { id: 'thumbnail', name: 'Thumbnail', icon: ImageIcon, desc: 'YouTube & social media' },
    { id: 'social', name: 'Social Post', icon: Sparkles, desc: 'Instagram, Facebook, Twitter' }
  ];

  const creationModes = [
    { id: 'quick', name: 'Quick Mode', desc: 'Describe what you want in one go' },
    { id: 'guided', name: 'Guided Mode', desc: 'Step-by-step questions to refine your vision' }
  ];

  const createGradientBackground = (ctx, width, height, theme, style) => {
    if (theme === 'vibrant') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1e3a8a');
      gradient.addColorStop(0.5, '#312e81');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'pastel') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#fce7f3');
      gradient.addColorStop(0.5, '#e0e7ff');
      gradient.addColorStop(1, '#dbeafe');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'dark') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
  };

  const drawGlossyButton = (ctx, x, y, width, height, text, color1, color2) => {
    // Button shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    
    // Button background gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    
    // Rounded rectangle
    ctx.beginPath();
    const radius = height / 2;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    
    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.shadowColor = 'transparent';
    
    // Button text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${height * 0.35}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
  };

  const drawIcon = (ctx, x, y, size, type) => {
    ctx.save();
    
    if (type === 'star') {
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;
      
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.5;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (type === 'sparkle') {
      ctx.fillStyle = '#60a5fa';
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Cross sparkle
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const generateDesign = async (prompt) => {
    setIsGenerating(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const dimensions = {
        'instagram-post': [1080, 1080],
        'youtube-thumb': [1920, 1080],
        'a4-flyer': [1240, 1754],
        'logo-square': [1000, 1000]
      };
      
      const [width, height] = dimensions[designOptions.size];
      canvas.width = width;
      canvas.height = height;
      
      // Background
      createGradientBackground(ctx, width, height, designOptions.theme, designOptions.style);
      
      // Add decorative elements
      for (let i = 0; i < 8; i++) {
        drawIcon(ctx, Math.random() * width, Math.random() * height, 15 + Math.random() * 20, 'star');
      }
      for (let i = 0; i < 12; i++) {
        drawIcon(ctx, Math.random() * width, Math.random() * height, 10 + Math.random() * 15, 'sparkle');
      }
      
      if (selectedType === 'logo') {
        // Logo design
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Main logo shape with gradient
        const logoGradient = ctx.createLinearGradient(centerX - 200, centerY - 200, centerX + 200, centerY + 200);
        logoGradient.addColorStop(0, '#3b82f6');
        logoGradient.addColorStop(0.5, '#8b5cf6');
        logoGradient.addColorStop(1, '#ec4899');
        
        ctx.fillStyle = logoGradient;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        ctx.shadowBlur = 40;
        
        // Draw shield/badge shape
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 150);
        ctx.lineTo(centerX + 120, centerY - 80);
        ctx.lineTo(centerX + 120, centerY + 80);
        ctx.lineTo(centerX, centerY + 150);
        ctx.lineTo(centerX - 120, centerY + 80);
        ctx.lineTo(centerX - 120, centerY - 80);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        
        // Inner design element
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
        ctx.stroke();
        
        // Brand name
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.08}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        
        const words = prompt.split(' ').slice(0, 2);
        ctx.fillText(words.join(' ').toUpperCase() || 'YOUR BRAND', centerX, centerY + height * 0.35);
        
      } else if (selectedType === 'flyer' || selectedType === 'social') {
        // Flyer/Social Post design
        const centerX = width / 2;
        
        // Main title area with glow effect
        ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
        ctx.shadowBlur = 30;
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.08}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const titleWords = prompt.split(' ').slice(0, 3);
        const title = titleWords.join(' ').toUpperCase() || 'YOUR TITLE';
        ctx.fillText(title, centerX, height * 0.15);
        
        ctx.shadowColor = 'transparent';
        
        // Subtitle
        ctx.fillStyle = '#fbbf24';
        ctx.font = `bold ${width * 0.05}px Arial, sans-serif`;
        ctx.fillText('Professional Design', centerX, height * 0.28);
        
        // Feature boxes
        const boxWidth = width * 0.4;
        const boxHeight = height * 0.15;
        const startY = height * 0.45;
        
        // Left box
        drawGlossyButton(ctx, width * 0.1, startY, boxWidth, boxHeight, 'FEATURE 1', '#3b82f6', '#1e40af');
        
        // Right box
        drawGlossyButton(ctx, width * 0.5, startY, boxWidth, boxHeight, 'FEATURE 2', '#ec4899', '#be185d');
        
        // Bottom box
        drawGlossyButton(ctx, width * 0.1, startY + boxHeight * 1.3, boxWidth, boxHeight, 'FEATURE 3', '#8b5cf6', '#6d28d9');
        
        // Last box
        drawGlossyButton(ctx, width * 0.5, startY + boxHeight * 1.3, boxWidth, boxHeight, 'FEATURE 4', '#10b981', '#047857');
        
        // Bottom text
        ctx.fillStyle = '#ffffff';
        ctx.font = `${width * 0.035}px Arial, sans-serif`;
        ctx.fillText('Perfect for: ' + designOptions.niche, centerX, height * 0.88);
        
      } else if (selectedType === 'thumbnail') {
        // YouTube Thumbnail
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Large attention-grabbing text
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 8;
        ctx.font = `bold ${width * 0.1}px Impact, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const thumbText = prompt.split(' ').slice(0, 2).join(' ').toUpperCase() || 'CLICK HERE';
        
        ctx.strokeText(thumbText, centerX, centerY - height * 0.1);
        ctx.fillText(thumbText, centerX, centerY - height * 0.1);
        
        // Subtext with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(width * 0.2, centerY + height * 0.1, width * 0.6, height * 0.15);
        
        ctx.fillStyle = '#fbbf24';
        ctx.font = `bold ${width * 0.045}px Arial, sans-serif`;
        ctx.fillText('Watch Now!', centerX, centerY + height * 0.175);
        
        // Arrow or play button
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(width * 0.85, centerY);
        ctx.lineTo(width * 0.85 + 60, centerY - 50);
        ctx.lineTo(width * 0.85 + 60, centerY + 50);
        ctx.closePath();
        ctx.fill();
      }
      
      const imageUrl = canvas.toDataURL('image/png');
      
      setGeneratedDesign({
        type: selectedType,
        prompt: prompt,
        options: designOptions,
        imageUrl: imageUrl,
        description: `Professional ${selectedType} design created with ${designOptions.style} style and ${designOptions.theme} theme.`,
        timestamp: Date.now()
      });
      
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Failed to generate design. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = () => {
    if (designPrompt.trim()) {
      generateDesign(designPrompt);
    }
  };

  const handleGuidedNext = () => {
    if (guidedStep < 5) {
      setGuidedStep(guidedStep + 1);
    } else {
      const fullPrompt = `${guidedAnswers.purpose} ${guidedAnswers.text}`;
      generateDesign(fullPrompt);
    }
  };

  const handleEditDesign = () => {
    if (editRequest.trim()) {
      generateDesign(generatedDesign.prompt + ' ' + editRequest);
      setEditRequest('');
    }
  };

  const handleRegenerate = () => {
    if (creationMode === 'quick' && designPrompt.trim()) {
      generateDesign(designPrompt);
    } else if (creationMode === 'guided') {
      const fullPrompt = `${guidedAnswers.purpose} ${guidedAnswers.text}`;
      generateDesign(fullPrompt);
    }
  };

  const handleDownload = () => {
    if (generatedDesign && generatedDesign.imageUrl) {
      const link = document.createElement('a');
      link.href = generatedDesign.imageUrl;
      link.download = `${selectedType}-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetToStart = () => {
    setSelectedType(null);
    setCreationMode(null);
    setGeneratedDesign(null);
    setDesignPrompt('');
    setGuidedStep(1);
    setGuidedAnswers({ purpose: '', audience: '', mood: '', colors: '', text: '' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLicenseKey('');
    resetToStart();
    setSessionSecret(generateSessionSecret());
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Design Studio</h1>
            <p className="text-gray-600">Enter your license key to access the design tools</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Key
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter your license key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && validateLicense()}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={validateLicense}
              disabled={isValidating || !licenseKey}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isValidating ? 'Validating...' : 'Activate License'}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have a license? <a href="#" className="text-blue-600 hover:underline">Purchase Now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Design Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            {selectedType && (
              <button onClick={resetToStart} className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                New Design
              </button>
            )}
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {!selectedType && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What would you like to create?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {designTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all"
                  >
                    <Icon className="w-12 h-12 text-purple-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedType && !creationMode && (
          <div>
            <button onClick={() => setSelectedType(null)} className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-1">
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How would you like to create your {selectedType}?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creationModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setCreationMode(mode.id)}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{mode.name}</h3>
                  <p className="text-sm text-gray-600">{mode.desc}</p>
                  <ChevronRight className="w-5 h-5 text-purple-600 mt-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedType && creationMode && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <button onClick={() => setCreationMode(null)} className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                ← Back
              </button>

              <div className="bg-white rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Design Settings
                </h3>

                {creationMode === 'quick' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your design
                    </label>
                    <textarea
                      value={designPrompt}
                      onChange={(e) => setDesignPrompt(e.target.value)}
                      placeholder="e.g., Prompt Polish Pro - AI tool for crafting better prompts"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 resize-none"
                    />
                  </div>
                )}

                {creationMode === 'guided' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(step => (
                        <div 
                          key={step} 
                          className={step <= guidedStep ? 'h-2 flex-1 rounded bg-purple-600' : 'h-2 flex-1 rounded bg-gray-200'}
                        ></div>
                      ))}
                    </div>

                    {guidedStep === 1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What is the purpose of this design?
                        </label>
                        <input
                          type="text"
                          value={guidedAnswers.purpose}
                          onChange={(e) => setGuidedAnswers({...guidedAnswers, purpose: e.target.value})}
                          placeholder="e.g., Brand logo for a coffee shop"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}

                    {guidedStep === 2 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Who is your target audience?
                        </label>
                        <input
                          type="text"
                          value={guidedAnswers.audience}
                          onChange={(e) => setGuidedAnswers({...guidedAnswers, audience: e.target.value})}
                          placeholder="e.g., Young professionals, 25-35 years old"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}

                    {guidedStep === 3 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What mood or feeling should it convey?
                        </label>
                        <input
                          type="text"
                          value={guidedAnswers.mood}
                          onChange={(e) => setGuidedAnswers({...guidedAnswers, mood: e.target.value})}
                          placeholder="e.g., Energetic, professional, friendly"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}

                    {guidedStep === 4 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Any specific colors or color preferences?
                        </label>
                        <input
                          type="text"
                          value={guidedAnswers.colors}
                          onChange={(e) => setGuidedAnswers({...guidedAnswers, colors: e.target.value})}
                          placeholder="e.g., Blue and orange, warm tones"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}

                    {guidedStep === 5 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Any text or message to include?
                        </label>
                        <input
                          type="text"
                          value={guidedAnswers.text}
                          onChange={(e) => setGuidedAnswers({...guidedAnswers, text: e.target.value})}
                          placeholder="e.g., Prompt Polish Pro"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visual Style</label>
                  <select value={designOptions.style} onChange={(e) => setDesignOptions({...designOptions, style: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="realistic">Realistic</option>
                    <option value="futuristic">Futuristic</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="3d">3D Render</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size/Format</label>
                  <select value={designOptions.size} onChange={(e) => setDesignOptions({...designOptions, size: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="instagram-post">Instagram Post (1080x1080)</option>
                    <option value="youtube-thumb">YouTube Thumbnail (1920x1080)</option>
                    <option value="a4-flyer">A4 Flyer</option>
                    <option value="logo-square">Logo (1000x1000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select value={designOptions.theme} onChange={(e) => setDesignOptions({...designOptions, theme: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="vibrant">Vibrant (Space Theme)</option>
                    <option value="pastel">Pastel</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niche/Industry</label>
                  <select value={designOptions.niche} onChange={(e) => setDesignOptions({...designOptions, niche: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="tech">Technology</option>
                    <option value="food">Food & Beverage</option>
                    <option value="fashion">Fashion</option>
                    <option value="corporate">Corporate</option>
                    <option value="creative">Creative Arts</option>
                  </select>
                </div>

                {creationMode === 'quick' ? (
                  <button
                    onClick={handleQuickGenerate}
                    disabled={isGenerating || !designPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isGenerating ? 'Generating...' : 'Generate Design'}
                  </button>
                ) : (
                  <button
                    onClick={handleGuidedNext}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {guidedStep < 5 ? (
                      <span className="flex items-center gap-2">Next <ChevronRight className="w-5 h-5" /></span>
                    ) : (
                      <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> {isGenerating ? 'Generating...' : 'Generate Design'}</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  {generatedDesign && (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Download className="w-4 h-4" />
                        Download PNG
                      </button>
                    </div>
                  )}
                </div>

                {!generatedDesign ? (
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {isGenerating ? 'Generating your design...' : 'Configure your design and click generate'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <img 
                        src={generatedDesign.imageUrl} 
                        alt="Generated design" 
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Request Changes
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editRequest}
                          onChange={(e) => setEditRequest(e.target.value)}
                          placeholder="e.g., Make the colors brighter, change text..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && handleEditDesign()}
                        />
                        <button
                          onClick={handleEditDesign}
                          disabled={!editRequest.trim() || isGenerating}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
                        >
                          {isGenerating ? 'Updating...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDesignStudio;

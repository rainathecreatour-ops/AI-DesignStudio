import React, { useState, useEffect } from 'react';
import { Palette, FileText, Image as ImageIcon, Sparkles, Download, Settings, ChevronRight, RefreshCw, Edit, Key } from 'lucide-react';

const generateSessionSecret = () => {
  return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

function App() {
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
    size: 'instagram-post',
    theme: 'vibrant'
  });

  useEffect(() => {
    const secret = generateSessionSecret();
    setSessionSecret(secret);
  }, []);

  const validateLicense = async () => {
    setIsValidating(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (licenseKey.length > 5) {
        setIsAuthenticated(true);
      } else {
        setError('License key must be at least 6 characters');
      }
    } catch (err) {
      setError('Validation failed');
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
    { id: 'guided', name: 'Guided Mode', desc: 'Step-by-step questions' }
  ];

  const generateDesign = async (prompt) => {
    setIsGenerating(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (designOptions.theme === 'vibrant') {
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.5, '#312e81');
        gradient.addColorStop(1, '#1e1b4b');
      } else if (designOptions.theme === 'pastel') {
        gradient.addColorStop(0, '#fce7f3');
        gradient.addColorStop(1, '#dbeafe');
      } else {
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(1, '#1e293b');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Stars for vibrant theme
      if (designOptions.theme === 'vibrant') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
        }
      }
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Main content based on type
      if (selectedType === 'logo') {
        // Circle logo
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 100, 150, 0, Math.PI * 2);
        ctx.fill();
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.08}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(prompt.substring(0, 20).toUpperCase() || 'LOGO', centerX, centerY + 150);
        
      } else if (selectedType === 'flyer') {
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.08}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(prompt.substring(0, 20).toUpperCase() || 'TITLE', centerX, height * 0.2);
        
        // Subtitle
        ctx.fillStyle = '#fbbf24';
        ctx.font = `bold ${width * 0.04}px Arial`;
        ctx.fillText('Professional Design', centerX, height * 0.3);
        
        // Feature boxes
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(width * 0.1, height * 0.5, width * 0.35, height * 0.12);
        ctx.fillRect(width * 0.55, height * 0.5, width * 0.35, height * 0.12);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.035}px Arial`;
        ctx.fillText('FEATURE 1', width * 0.275, height * 0.56);
        ctx.fillText('FEATURE 2', width * 0.725, height * 0.56);
        
      } else if (selectedType === 'thumbnail') {
        // Big bold text
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 8;
        ctx.font = `bold ${width * 0.1}px Impact, Arial`;
        ctx.textAlign = 'center';
        const text = prompt.substring(0, 15).toUpperCase() || 'WATCH';
        ctx.strokeText(text, centerX, centerY);
        ctx.fillText(text, centerX, centerY);
        
        // Arrow
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(width * 0.85, centerY);
        ctx.lineTo(width * 0.92, centerY - 50);
        ctx.lineTo(width * 0.92, centerY + 50);
        ctx.closePath();
        ctx.fill();
        
      } else {
        // Social post
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.07}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(prompt.substring(0, 25).toUpperCase() || 'POST', centerX, centerY - 100);
        
        // Icon
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(centerX, centerY + 100, 100, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const imageUrl = canvas.toDataURL('image/png');
      
      setGeneratedDesign({
        type: selectedType,
        prompt: prompt,
        options: designOptions,
        imageUrl: imageUrl,
        description: `${selectedType} design`,
        timestamp: Date.now()
      });
      
    } catch (err) {
      setError('Failed to generate: ' + err.message);
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
      const fullPrompt = `${guidedAnswers.purpose} ${guidedAnswers.text}`.trim();
      if (fullPrompt) {
        generateDesign(fullPrompt);
      }
    }
  };

  const handleRegenerate = () => {
    if (creationMode === 'quick' && designPrompt.trim()) {
      generateDesign(designPrompt);
    } else if (creationMode === 'guided') {
      const fullPrompt = `${guidedAnswers.purpose} ${guidedAnswers.text}`.trim();
      if (fullPrompt) {
        generateDesign(fullPrompt);
      }
    }
  };

  const handleDownload = () => {
    if (generatedDesign?.imageUrl) {
      const link = document.createElement('a');
      link.href = generatedDesign.imageUrl;
      link.download = `${selectedType}-${Date.now()}.png`;
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
    setError('');
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
            <p className="text-gray-600">Enter license key (type anything 6+ chars)</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Type anything..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && validateLicense()}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={validateLicense}
              disabled={isValidating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isValidating ? 'Validating...' : 'Activate'}
            </button>
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
          {selectedType && (
            <button onClick={resetToStart} className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
              New Design
            </button>
          )}
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
            <button onClick={() => setSelectedType(null)} className="text-purple-600 hover:text-purple-700 mb-4">
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose creation mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creationModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setCreationMode(mode.id)}
                  className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{mode.name}</h3>
                  <p className="text-sm text-gray-600">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedType && creationMode && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <button onClick={() => setCreationMode(null)} className="text-purple-600 hover:text-purple-700">
                ← Back
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="bg-white rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

                {creationMode === 'quick' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your design
                    </label>
                    <textarea
                      value={designPrompt}
                      onChange={(e) => setDesignPrompt(e.target.value)}
                      placeholder="e.g., Prompt Polish Pro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 resize-none"
                    />
                  </div>
                )}

                {creationMode === 'guided' && guidedStep === 5 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text to include?
                    </label>
                    <input
                      type="text"
                      value={guidedAnswers.text}
                      onChange={(e) => setGuidedAnswers({...guidedAnswers, text: e.target.value})}
                      placeholder="e.g., Your Brand"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select 
                    value={designOptions.size} 
                    onChange={(e) => setDesignOptions({...designOptions, size: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="instagram-post">Instagram (1080x1080)</option>
                    <option value="youtube-thumb">YouTube (1920x1080)</option>
                    <option value="a4-flyer">Flyer</option>
                    <option value="logo-square">Logo (1000x1000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select 
                    value={designOptions.theme} 
                    onChange={(e) => setDesignOptions({...designOptions, theme: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="vibrant">Vibrant (Space)</option>
                    <option value="pastel">Pastel</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                {creationMode === 'quick' ? (
                  <button
                    onClick={handleQuickGenerate}
                    disabled={isGenerating || !designPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </button>
                ) : (
                  <button
                    onClick={handleGuidedNext}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {guidedStep < 5 ? (
                      <span>Next <ChevronRight className="w-5 h-5 inline" /></span>
                    ) : (
                      <><Sparkles className="w-5 h-5" /> Generate</>
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
                        className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  )}
                </div>

                {!generatedDesign ? (
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Generating...</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Enter text and generate</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={generatedDesign.imageUrl} 
                      alt="Generated design" 
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

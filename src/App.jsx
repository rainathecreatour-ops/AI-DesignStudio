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

 const generateDesign = async (prompt) => {
  setIsGenerating(true);
  setError('');
  
  try {
    const sizeSpecs = {
      'instagram-post': 'square 1:1 aspect ratio',
      'youtube-thumb': 'widescreen 16:9 aspect ratio',
      'a4-flyer': 'portrait aspect ratio',
      'logo-square': 'square format'
    };

    const fullPrompt = `Generate an image for a ${selectedType} design.

Requirements:
${prompt}

Style: ${designOptions.style}
Theme: ${designOptions.theme} colors
Typography: ${designOptions.font} font style
Format: ${sizeSpecs[designOptions.size]}
Industry: ${designOptions.niche}

Create a professional, polished ${selectedType} design that is visually striking and ready to use.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: fullPrompt
          }
        ],
        tools: [
          {
            type: "image_generation_20250110",
            name: "image_generation"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    // Extract generated image from response
    let imageUrl = null;
    let description = '';
    
    for (const block of data.content) {
      if (block.type === 'image') {
        imageUrl = `data:${block.source.media_type};base64,${block.source.data}`;
      } else if (block.type === 'text') {
        description += block.text;
      }
    }
    
    if (!imageUrl) {
      throw new Error('No image was generated in the response. The AI may need a more specific prompt.');
    }
    
    setGeneratedDesign({
      type: selectedType,
      prompt: prompt,
      options: designOptions,
      imageUrl: imageUrl,
      description: description,
      timestamp: Date.now()
    });
    
  } catch (err) {
    console.error('Generation failed:', err);
    setError(err.message || 'Failed to generate image. Please try again with a different prompt.');
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
      const fullPrompt = `Purpose: ${guidedAnswers.purpose}. Target audience: ${guidedAnswers.audience}. Mood: ${guidedAnswers.mood}. Colors: ${guidedAnswers.colors}. Text to include: ${guidedAnswers.text}`;
      generateDesign(fullPrompt);
    }
  };

  const handleEditDesign = async () => {
    if (editRequest.trim() && generatedDesign) {
      setIsGenerating(true);
      
      const editPrompt = `Take this existing ${selectedType} design and modify it: ${editRequest}

Original prompt: ${generatedDesign.prompt}

Keep the same general style but incorporate the requested changes.`;
      
      await generateDesign(editPrompt);
      setEditRequest('');
    }
  };

  const handleRegenerate = () => {
    if (creationMode === 'quick' && designPrompt.trim()) {
      generateDesign(designPrompt);
    } else if (creationMode === 'guided') {
      const fullPrompt = `Purpose: ${guidedAnswers.purpose}. Target audience: ${guidedAnswers.audience}. Mood: ${guidedAnswers.mood}. Colors: ${guidedAnswers.colors}. Text: ${guidedAnswers.text}`;
      generateDesign(fullPrompt);
    }
  };

  const handleDownload = () => {
    if (generatedDesign && generatedDesign.imageUrl) {
      const link = document.createElement('a');
      link.href = generatedDesign.imageUrl;
      link.download = `design-${selectedType}-${Date.now()}.png`;
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLicenseKey('');
    setSelectedType(null);
    setCreationMode(null);
    setGeneratedDesign(null);
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
                Don't have a license? <a href="https://gumroad.com/l/your-product" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Purchase on Gumroad</a>
              </p>
            </div>

            {sessionSecret && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Session ID:</p>
                <p className="text-xs font-mono text-gray-700 break-all">{sessionSecret}</p>
              </div>
            )}
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

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                      placeholder="e.g., A modern tech startup logo with blue and white colors, minimalist style, featuring a rocket icon..."
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
                          placeholder="e.g., Brew & Co."
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
                    <option value="anime">Anime</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="abstract">Abstract</option>
                    <option value="vintage">Vintage</option>
                    <option value="3d">3D Render</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                  <select value={designOptions.font} onChange={(e) => setDesignOptions({...designOptions, font: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="playful">Playful</option>
                    <option value="bold">Bold</option>
                    <option value="elegant">Elegant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size/Format</label>
                  <select value={designOptions.size} onChange={(e) => setDesignOptions({...designOptions, size: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="instagram-post">Instagram Post (1080x1080)</option>
                    <option value="youtube-thumb">YouTube Thumbnail (1280x720)</option>
                    <option value="a4-flyer">A4 Flyer (210x297mm)</option>
                    <option value="logo-square">Logo Square (500x500)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select value={designOptions.theme} onChange={(e) => setDesignOptions({...designOptions, theme: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="vibrant">Vibrant</option>
                    <option value="pastel">Pastel</option>
                    <option value="monochrome">Monochrome</option>
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
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                {creationMode === 'quick' ? (
                  <button
                    onClick={handleQuickGenerate}
                    disabled={isGenerating || !designPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isGenerating ? 'Generating Image...' : 'Generate Design'}
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
                      <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> {isGenerating ? 'Generating Image...' : 'Generate Design'}</span>
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
                        Download
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

                    {generatedDesign.description && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{generatedDesign.description}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Request Edits
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editRequest}
                          onChange={(e) => setEditRequest(e.target.value)}
                          placeholder="e.g., Make the colors brighter, add more elements..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && handleEditDesign()}
                        />
                        <button
                          onClick={handleEditDesign}
                          disabled={!editRequest.trim() || isGenerating}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
                        >
                          {isGenerating ? 'Updating...' : 'Update'}
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

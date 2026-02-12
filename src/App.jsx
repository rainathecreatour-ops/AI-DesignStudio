import React, { useState, useEffect } from 'react';
import { Palette, FileText, Image as ImageIcon, Sparkles, Download, Settings, ChevronRight, Key } from 'lucide-react';

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
  
  const [designOptions, setDesignOptions] = useState({
    font: 'modern',
    size: 'instagram-post',
    theme: 'vibrant',
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
      
      if (licenseKey.startsWith('DEMO-') || licenseKey.length > 10) {
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
    { id: 'quick', name: 'Quick Mode', desc: 'Describe what you want' },
    { id: 'guided', name: 'Guided Mode', desc: 'Answer questions step-by-step' },
    { id: 'reference', name: 'Reference Mode', desc: 'Upload an image to mimic' }
  ];

  const generateDesign = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedDesign({
        type: selectedType,
        prompt: designPrompt,
        options: designOptions,
        preview: true,
        sessionId: sessionSecret
      });
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
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
                placeholder="DEMO-XXXX-XXXX-XXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && validateLicense()}
              />
              <p className="text-xs text-gray-500 mt-1">
                Demo: Use any key starting with DEMO-
              </p>
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
                <p className="text-xs text-gray-500 mb-1">Session ID (for debugging):</p>
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
            <span className="text-xs text-gray-500 font-mono">{sessionSecret ? sessionSecret.substring(0, 12) + '...' : ''}</span>
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
                    className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all group"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      placeholder="e.g., A modern tech startup logo with blue and white colors, minimalist style..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 resize-none"
                    />
                  </div>
                )}

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

                <button
                  onClick={generateDesign}
                  disabled={isGenerating || (creationMode === 'quick' && !designPrompt)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Design'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 min-h-[600px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  {generatedDesign && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  )}
                </div>

                {!generatedDesign ? (
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Configure your design and click generate</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 rounded-lg p-8 bg-gray-50">
                    <div className="bg-white rounded-lg p-12 shadow-lg">
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto"></div>
                        <h2 className="text-3xl font-bold text-gray-900">Your Design</h2>
                        <p className="text-gray-600">{designPrompt || 'AI-generated design preview'}</p>
                        <div className="flex gap-2 justify-center pt-4">
                          <div className="w-8 h-8 bg-purple-600 rounded"></div>
                          <div className="w-8 h-8 bg-blue-600 rounded"></div>
                          <div className="w-8 h-8 bg-pink-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      This is a demo preview. In production, AI-generated design will appear here.
                    </p>
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

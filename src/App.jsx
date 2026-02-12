import React, { useState } from 'react';
import { Palette, FileText, Image as ImageIcon, Sparkles, Download, Settings, ChevronRight, RefreshCw, Edit } from 'lucide-react';

const AIDesignStudio = () => {
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const description = 'A ' + designOptions.style + ' style ' + selectedType + ' design. ' + prompt + '. The design features ' + designOptions.theme + ' colors with ' + designOptions.font + ' typography. Formatted for ' + designOptions.size + ' in the ' + designOptions.niche + ' industry. The layout is clean and professional with attention-grabbing visual elements that effectively communicate the message.';
      
      setGeneratedDesign({
        type: selectedType,
        prompt: prompt,
        options: designOptions,
        description: description,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Generation failed:', err);
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
      const fullPrompt = 'Purpose: ' + guidedAnswers.purpose + '. Target audience: ' + guidedAnswers.audience + '. Mood: ' + guidedAnswers.mood + '. Colors: ' + guidedAnswers.colors + '. Text: ' + guidedAnswers.text;
      generateDesign(fullPrompt);
    }
  };

  const handleEditDesign = () => {
    if (editRequest.trim()) {
      const updatedDescription = generatedDesign.description + ' UPDATED: ' + editRequest;
      setGeneratedDesign({
        ...generatedDesign,
        description: updatedDescription,
        timestamp: Date.now()
      });
      setEditRequest('');
    }
  };

  const handleRegenerate = () => {
    if (creationMode === 'quick' && designPrompt.trim()) {
      generateDesign(designPrompt);
    } else if (creationMode === 'guided') {
      const fullPrompt = 'Purpose: ' + guidedAnswers.purpose + '. Target audience: ' + guidedAnswers.audience + '. Mood: ' + guidedAnswers.mood + '. Colors: ' + guidedAnswers.colors + '. Text: ' + guidedAnswers.text;
      generateDesign(fullPrompt);
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
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
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
                  <div className="space-y-4">
                    <div className="border-2 border-gray-300 rounded-lg p-8 bg-gradient-to-br from-purple-50 to-blue-50">
                      <div className="bg-white rounded-lg p-8 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Generated Design</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{generatedDesign.description}</p>
                      </div>
                    </div>

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
                        />
                        <button
                          onClick={handleEditDesign}
                          disabled={!editRequest.trim()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
                        >
                          Update
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

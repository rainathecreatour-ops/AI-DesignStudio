import React, { useState } from 'react';
import './index.css';

function App() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [designPrompt, setDesignPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const login = () => {
    if (licenseKey.length > 5) {
      setIsAuthenticated(true);
    }
  };

  const generateDesign = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 1080;
      canvas.height = 1080;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#1e3a8a');
      gradient.addColorStop(0.5, '#312e81');
      gradient.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);
      
      // Stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1080;
        const y = Math.random() * 1080;
        ctx.fillRect(x, y, 2, 2);
      }
      
      // Text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(designPrompt.toUpperCase() || 'YOUR DESIGN', 540, 540);
      
      const imageUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
    }, 1500);
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'design.png';
      link.click();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #faf5ff, #dbeafe, #fce7f3)' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>AI Design Studio</h1>
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="Enter license key (6+ chars)"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginBottom: '1rem' }}
            onKeyPress={(e) => e.key === 'Enter' && login()}
          />
          <button
            onClick={login}
            style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(to right, #9333ea, #2563eb)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Activate
          </button>
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>What would you like to create?</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1200px' }}>
          {['Logo', 'Flyer', 'Thumbnail', 'Social Post'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '2px solid #e5e7eb', cursor: 'pointer', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <button onClick={() => setSelectedType(null)} style={{ marginBottom: '2rem', color: '#9333ea', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
        ← Back
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', maxWidth: '1400px' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Design Settings</h3>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
          <textarea
            value={designPrompt}
            onChange={(e) => setDesignPrompt(e.target.value)}
            placeholder="e.g., Prompt Polish Pro"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', marginBottom: '1rem', minHeight: '100px' }}
          />
          
          <button
            onClick={generateDesign}
            disabled={isGenerating || !designPrompt.trim()}
            style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(to right, #9333ea, #2563eb)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating || !designPrompt.trim() ? 0.5 : 1 }}
          >
            {isGenerating ? 'Generating...' : 'Generate Design'}
          </button>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Preview</h3>
            {generatedImage && (
              <button
                onClick={downloadImage}
                style={{ padding: '0.5rem 1rem', background: '#9333ea', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                Download
              </button>
            )}
          </div>

          {!generatedImage ? (
            <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#6b7280' }}>
                {isGenerating ? 'Generating...' : 'Enter description and click generate'}
              </p>
            </div>
          ) : (
            <img src={generatedImage} alt="Generated design" style={{ width: '100%', borderRadius: '0.5rem' }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

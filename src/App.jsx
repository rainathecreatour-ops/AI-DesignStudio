import React, { useState } from 'react';
import './index.css';

function App() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [designPrompt, setDesignPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  
  // Design options
  const [options, setOptions] = useState({
    style: '3d',
    theme: 'vibrant',
    format: 'square',
    industry: 'tech'
  });

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
      
      // Set canvas size based on format
      const sizes = {
        'square': [1080, 1080],
        'youtube': [1920, 1080],
        'story': [1080, 1920],
        'facebook': [1200, 630]
      };
      
      const [width, height] = sizes[options.format];
      canvas.width = width;
      canvas.height = height;
      
      // Background based on theme
      const themes = {
        'vibrant': { colors: ['#1e3a8a', '#312e81', '#1e1b4b'], accent: '#fbbf24' },
        'pastel': { colors: ['#fce7f3', '#e0e7ff', '#dbeafe'], accent: '#ec4899' },
        'dark': { colors: ['#0f172a', '#1e293b', '#334155'], accent: '#3b82f6' },
        'neon': { colors: ['#000000', '#1a0033', '#330066'], accent: '#00ff88' }
      };
      
      const theme = themes[options.theme];
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, theme.colors[0]);
      gradient.addColorStop(0.5, theme.colors[1]);
      gradient.addColorStop(1, theme.colors[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add decorative elements based on style
      if (options.style === '3d') {
        // 3D floating elements
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 20 + Math.random() * 40;
          
          // 3D cube effect
          ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.random() * 0.4})`;
          ctx.fillRect(x, y, size, size);
          
          ctx.fillStyle = `rgba(147, 197, 253, ${0.3 + Math.random() * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(x + size, y);
          ctx.lineTo(x + size + size * 0.3, y - size * 0.3);
          ctx.lineTo(x + size + size * 0.3, y + size - size * 0.3);
          ctx.lineTo(x + size, y + size);
          ctx.closePath();
          ctx.fill();
        }
      } else if (options.style === 'anime') {
        // Anime-style stars and sparkles
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = 5 + Math.random() * 15;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`;
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5;
            const radius = j % 2 === 0 ? size : size / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      } else if (options.style === 'realistic') {
        // Realistic gradient orbs
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const radius = 50 + Math.random() * 100;
          
          const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          orbGradient.addColorStop(0, `rgba(139, 92, 246, ${0.6 + Math.random() * 0.3})`);
          orbGradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.3 + Math.random() * 0.3})`);
          orbGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          
          ctx.fillStyle = orbGradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (options.style === 'minimalist') {
        // Simple geometric shapes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          const x = width * 0.2 + Math.random() * width * 0.6;
          const y = height * 0.2 + Math.random() * height * 0.6;
          const size = 100 + Math.random() * 200;
          ctx.strokeRect(x, y, size, size);
        }
      } else if (options.style === 'retro') {
        // Retro grid
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
        ctx.lineWidth = 2;
        const gridSize = 50;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
      
      // Add sparkles/stars for certain themes
      if (options.theme === 'vibrant' || options.theme === 'dark' || options.theme === 'neon') {
        ctx.fillStyle = 'white';
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 3;
          ctx.fillRect(x, y, size, size);
        }
      }
      
      // Main content area based on design type
      const centerX = width / 2;
      const centerY = height / 2;
      
      if (selectedType === 'Logo') {
        // Logo design with icon
        const logoSize = Math.min(width, height) * 0.3;
        
        // Icon background circle
        const iconGradient = ctx.createLinearGradient(
          centerX - logoSize/2, 
          centerY - logoSize - 100, 
          centerX + logoSize/2, 
          centerY - logoSize + 100
        );
        iconGradient.addColorStop(0, '#3b82f6');
        iconGradient.addColorStop(0.5, '#8b5cf6');
        iconGradient.addColorStop(1, '#ec4899');
        
        ctx.fillStyle = iconGradient;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 100, logoSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Inner icon shape
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 100, logoSize/3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Brand text
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.06}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        const brandText = designPrompt || 'YOUR BRAND';
        ctx.fillText(brandText.toUpperCase(), centerX, centerY + 150);
        
        // Tagline
        ctx.font = `${width * 0.025}px Arial, sans-serif`;
        ctx.fillStyle = theme.accent;
        ctx.fillText(`${options.industry.toUpperCase()} SOLUTIONS`, centerX, centerY + 200);
        
      } else if (selectedType === 'Flyer') {
        // Flyer layout
        // Main title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.08}px Impact, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 15;
        const title = designPrompt || 'EVENT TITLE';
        ctx.fillText(title.toUpperCase(), centerX, height * 0.25);
        ctx.shadowBlur = 0;
        
        // Subtitle
        ctx.fillStyle = theme.accent;
        ctx.font = `bold ${width * 0.04}px Arial, sans-serif`;
        ctx.fillText('PROFESSIONAL DESIGN EVENT', centerX, height * 0.35);
        
        // Feature boxes
        const boxWidth = width * 0.35;
        const boxHeight = height * 0.12;
        const boxY = height * 0.5;
        
        // Left box
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
        ctx.fillRect(width * 0.1, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(width * 0.1, boxY, boxWidth, boxHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.03}px Arial`;
        ctx.fillText('FEATURE 1', width * 0.1 + boxWidth/2, boxY + boxHeight/2 + 10);
        
        // Right box
        ctx.fillStyle = 'rgba(236, 72, 153, 0.9)';
        ctx.fillRect(width * 0.55, boxY, boxWidth, boxHeight);
        ctx.strokeRect(width * 0.55, boxY, boxWidth, boxHeight);
        ctx.fillText('FEATURE 2', width * 0.55 + boxWidth/2, boxY + boxHeight/2 + 10);
        
        // Bottom info
        ctx.fillStyle = '#ffffff';
        ctx.font = `${width * 0.025}px Arial`;
        ctx.fillText(`PERFECT FOR ${options.industry.toUpperCase()}`, centerX, height * 0.85);
        
      } else if (selectedType === 'Thumbnail') {
        // YouTube thumbnail
        // Giant text
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 10;
        ctx.font = `bold ${width * 0.12}px Impact, Arial, sans-serif`;
        ctx.textAlign = 'center';
        const thumbText = designPrompt || 'CLICK NOW';
        ctx.strokeText(thumbText.toUpperCase(), centerX, centerY);
        ctx.fillText(thumbText.toUpperCase(), centerX, centerY);
        
        // Call to action box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(width * 0.2, centerY + 100, width * 0.6, height * 0.15);
        
        ctx.fillStyle = theme.accent;
        ctx.font = `bold ${width * 0.05}px Arial`;
        ctx.fillText('WATCH NOW!', centerX, centerY + 180);
        
        // Play button/arrow
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(width * 0.85, centerY);
        ctx.lineTo(width * 0.92, centerY - 60);
        ctx.lineTo(width * 0.92, centerY + 60);
        ctx.closePath();
        ctx.fill();
        
      } else if (selectedType === 'Social Post') {
        // Social media post
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${width * 0.07}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 15;
        const socialText = designPrompt || 'SOCIAL POST';
        ctx.fillText(socialText.toUpperCase(), centerX, height * 0.3);
        ctx.shadowBlur = 0;
        
        // Icon circle
        const iconGradient = ctx.createRadialGradient(centerX, centerY + 80, 0, centerX, centerY + 80, 120);
        iconGradient.addColorStop(0, '#8b5cf6');
        iconGradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = iconGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 80, 120, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner icon
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial';
        ctx.fillText('✨', centerX, centerY + 110);
        
        // Bottom text
        ctx.fillStyle = theme.accent;
        ctx.font = `bold ${width * 0.035}px Arial`;
        ctx.fillText(`#${options.industry.toUpperCase()}`, centerX, height * 0.8);
      }
      
      const imageUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${selectedType}-${options.style}-${Date.now()}.png`;
      link.click();
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #faf5ff, #dbeafe, #fce7f3)' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(to bottom right, #9333ea, #2563eb)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>✨</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Design Studio</h1>
            <p style={{ color: '#6b7280' }}>Enter license key to start creating</p>
          </div>
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
            Activate License
          </button>
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Demo: Type any text (6+ characters)
          </p>
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(to bottom right, #9333ea, #2563eb)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>✨</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Design Studio</h1>
          </div>
        </header>
        
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>What would you like to create?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {['Logo', 'Flyer', 'Thumbnail', 'Social Post'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '2px solid #e5e7eb', cursor: 'pointer', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.target.style.borderColor = '#9333ea'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(to bottom right, #9333ea, #2563eb)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>✨</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI Design Studio</h1>
          </div>
          <button 
            onClick={() => setSelectedType(null)} 
            style={{ padding: '0.5rem 1rem', color: '#9333ea', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
          >
            New Design
          </button>
        </div>
      </header>
      
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <button 
          onClick={() => setSelectedType(null)} 
          style={{ marginBottom: '1rem', color: '#9333ea', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
          ← Back
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Settings Panel */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Design Settings</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Text/Brand Name</label>
              <input
                type="text"
                value={designPrompt}
                onChange={(e) => setDesignPrompt(e.target.value)}
                placeholder="e.g., Prompt Polish Pro"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Style</label>
              <select
                value={options.style}
                onChange={(e) => setOptions({...options, style: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              >
                <option value="3d">3D Modern</option>
                <option value="anime">Anime Style</option>
                <option value="realistic">Realistic</option>
                <option value="minimalist">Minimalist</option>
                <option value="retro">Retro/Vaporwave</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Theme</label>
              <select
                value={options.theme}
                onChange={(e) => setOptions({...options, theme: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              >
                <option value="vibrant">Vibrant (Space)</option>
                <option value="pastel">Pastel Dreams</option>
                <option value="dark">Dark Mode</option>
                <option value="neon">Neon Cyber</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Format</label>
              <select
                value={options.format}
                onChange={(e) => setOptions({...options, format: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              >
                <option value="square">Square (Instagram - 1080x1080)</option>
                <option value="youtube">YouTube (1920x1080)</option>
                <option value="story">Story (1080x1920)</option>
                <option value="facebook">Facebook (1200x630)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Industry</label>
              <select
                value={options.industry}
                onChange={(e) => setOptions({...options, industry: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              >
                <option value="tech">Technology</option>
                <option value="food">Food & Beverage</option>
                <option value="fashion">Fashion</option>
                <option value="fitness">Fitness</option>
                <option value="music">Music</option>
                <option value="gaming">Gaming</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
              </select>
            </div>
            
            <button
              onClick={generateDesign}
              disabled={isGenerating || !designPrompt.trim()}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: isGenerating || !designPrompt.trim() ? '#d1d5db' : 'linear-gradient(to right, #9333ea, #2563eb)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.5rem', 
                fontWeight: 'bold', 
                cursor: isGenerating || !designPrompt.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {isGenerating ? '✨ Generating Design...' : '🎨 Generate Design'}
            </button>
          </div>

          {/* Preview Panel */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Preview</h3>
              {generatedImage && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={generateDesign}
                    disabled={isGenerating}
                    style={{ padding: '0.5rem 1rem', background: 'white', color: '#9333ea', border: '2px solid #9333ea', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' }}
                  >
                    🔄 Regenerate
                  </button>
                  <button
                    onClick={downloadImage}
                    style={{ padding: '0.5rem 1rem', background: '#9333ea', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' }}
                  >
                    ⬇️ Download PNG
                  </button>
                </div>
              )}
            </div>

            {!generatedImage ? (
              <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.5rem', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ textAlign: 'center' }}>
                  {isGenerating ? (
                    <>
                      <div style={{ width: '60px', height: '60px', border: '4px solid #e5e7eb', borderTop: '4px solid #9333ea', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Generating your design...</p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
                      <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Configure settings and click generate</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden', background: '#000' }}>
                <img 
                  src={generatedImage} 
                  alt="Generated design" 
                  style={{ width: '100%', display: 'block' }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;

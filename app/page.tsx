"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Minus, Palette, User, Users, Check, Share2, Download, Trash2, Edit3, Settings2 } from 'lucide-react';

// --- Constants & Types ---

type MemberType = 'bridesmaid' | 'bridesman' | 'groomswoman' | 'groomsman';
type DressStyle = 'strapless' | 'one-shoulder' | 'long-sleeve';

interface PartyMember {
  id: string;
  name: string;
  type: MemberType;
  color: string;
  style: DressStyle;
}

const PRESET_PALETTES = [
  { name: 'Sage Green', dress: '#94a287', tie: '#94a287' },
  { name: 'Dusty Blue', dress: '#a1b2c4', tie: '#a1b2c4' },
  { name: 'Champagne', dress: '#e8d6c7', tie: '#e8d6c7' },
  { name: 'Burgundy', dress: '#800020', tie: '#800020' },
  { name: 'Dusty Rose', dress: '#c8a2c8', tie: '#c8a2c8' },
  { name: 'Classic Black', dress: '#000000', tie: '#000000' },
];

const SUIT_PRESETS = [
  { name: 'Navy', hex: '#1a2a44' },
  { name: 'Charcoal', hex: '#36454f' },
  { name: 'Black', hex: '#000000' },
  { name: 'Light Grey', hex: '#d3d3d3' },
  { name: 'Tan', hex: '#d2b48c' },
];

// --- SVG SILHOUETTES ---

const BrideSVG = () => (
  <svg viewBox="0 0 100 300" className="avatar-svg bride-svg">
    <path d="M50 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" fill="#ccc" />
    <path d="M50 65s-15 5-20 35c-5 30-20 160-25 180h90c-5-20-20-150-25-180s-20-35-20-35z" fill="#fff" stroke="#f0f0f0" />
    <path d="M35 100c10 5 20 5 30 0" fill="none" stroke="#fdf6f0" strokeWidth="2" opacity="0.5" />
    <g transform="translate(40, 110) scale(0.7)">
      <circle cx="10" cy="10" r="14" fill="#fff" opacity="0.9" />
      <circle cx="5" cy="5" r="6" fill="#f8e1e1" />
      <circle cx="15" cy="5" r="6" fill="#fdf6f0" />
      <circle cx="10" cy="15" r="6" fill="#e8d6c7" />
    </g>
  </svg>
);

const GroomSVG = ({ suitColor, tieColor }: { suitColor: string, tieColor: string }) => (
  <svg viewBox="0 0 100 300" className="avatar-svg groom-svg">
    <path d="M50 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" fill="#ccc" />
    <path d="M30 65h40v180H30z" fill={suitColor} />
    <path d="M30 65l20 20 20-20v5-5H30v5z" fill="#fff" />
    <path d="M48 68l2 2 2-2v8l-2 2-2-2v-8z" fill={tieColor} />
    <path d="M30 65l18 35V65h-18zm40 0l-18 35V65h18z" fill={suitColor} opacity="0.8" />
    <path d="M30 245h18v40h-18zm22 0h18v40h-18z" fill={suitColor} />
  </svg>
);

const FemaleSVG = ({ color, style, bouquet = true }: { color: string, style: DressStyle, bouquet?: boolean }) => {
  const getDressPath = () => {
    switch (style) {
      case 'strapless': return "M50 85c-15 0-25 15-25 40 0 25-10 125-10 125h70s-10-100-10-125-10-40-25-40z";
      case 'one-shoulder': return "M50 65c-15 0-25 15-25 40 0 25-10 145-10 145h70s-10-120-10-145c0-15-5-25-15-35l-10-5z";
      case 'long-sleeve': return "M50 65c-15 0-25 15-25 40 0 25-10 145-10 145h70s-10-120-10-145-10-40-25-40z M25 70l-10 40v30h5v-30l5-40z M75 70l10 40v30h-5v-30l-5-40z";
      default: return "";
    }
  };
  return (
    <svg viewBox="0 0 100 300" className="avatar-svg">
      <path d="M50 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" fill="#ccc" />
      <path d={getDressPath()} fill={color} />
      {bouquet && (
        <g transform="translate(40, 120) scale(0.6)">
          <circle cx="10" cy="10" r="12" fill="#fff" opacity="0.9" />
          <circle cx="5" cy="5" r="5" fill="#e8d6c7" />
          <circle cx="15" cy="5" r="5" fill="#f8e1e1" />
        </g>
      )}
    </svg>
  );
};

const MaleSVG = ({ suitColor, accentColor, boutonniere = true }: { suitColor: string, accentColor: string, boutonniere?: boolean }) => (
  <svg viewBox="0 0 100 300" className="avatar-svg">
    <path d="M50 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" fill="#ccc" />
    <path d="M30 70h40v170H30z" fill={suitColor} />
    <path d="M48 72h4v15h-4z" fill={accentColor} />
    {boutonniere && (
      <g transform="translate(38, 85)">
        <circle cx="0" cy="0" r="3" fill="#fff" />
        <path d="M0 3v5" stroke="#94a287" strokeWidth="1" />
      </g>
    )}
    <path d="M30 240h18v40h-18zm22 0h18v40h-18z" fill={suitColor} />
  </svg>
);

// --- MAIN PAGE ---

export default function Home() {
  const [brideSide, setBrideSide] = useState<PartyMember[]>([
    { id: '1', name: 'Sarah', type: 'bridesmaid', color: '#94a287', style: 'strapless' },
    { id: '2', name: 'Emily', type: 'bridesmaid', color: '#94a287', style: 'strapless' },
    { id: '3', name: 'Mike', type: 'bridesman', color: '#94a287', style: 'strapless' },
  ]);

  const [groomSide, setGroomSide] = useState<PartyMember[]>([
    { id: '4', name: 'John', type: 'groomsman', color: '#94a287', style: 'strapless' },
    { id: '5', name: 'David', type: 'groomsman', color: '#94a287', style: 'strapless' },
    { id: '6', name: 'Jessica', type: 'groomswoman', color: '#94a287', style: 'strapless' },
  ]);

  const [suitColor, setSuitColor] = useState('#36454f');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const allMembers = [...brideSide, ...groomSide];
  const selectedMember = allMembers.find(m => m.id === selectedMemberId);

  const addBM = () => {
    const newMember: PartyMember = { 
      id: Date.now().toString(), 
      name: 'Name', 
      type: 'bridesmaid', 
      color: '#94a287', 
      style: 'strapless' 
    };
    setBrideSide([...brideSide, newMember]);
  };

  const addGM = () => {
    const newMember: PartyMember = { 
      id: Date.now().toString(), 
      name: 'Name', 
      type: 'groomsman', 
      color: '#94a287', 
      style: 'strapless' 
    };
    setGroomSide([...groomSide, newMember]);
  };

  const updateMember = (id: string, updates: Partial<PartyMember>) => {
    setBrideSide(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    setGroomSide(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    setBrideSide(prev => prev.filter(m => m.id !== id));
    setGroomSide(prev => prev.filter(m => m.id !== id));
    if (selectedMemberId === id) setSelectedMemberId(null);
  };

  return (
    <main className="main-container">
      <header>
        <h1>Bridal Party Palette</h1>
        <p>Coordinate every detail with confidence</p>
      </header>

      {/* Visualizer Area (on Top now) */}
      <section className="visualizer" style={{ marginBottom: '20px' }}>
        <div className="lineup">
          {/* Bride Side */}
          {brideSide.map((m) => (
            <div 
              key={m.id} 
              className={`avatar-container ${selectedMemberId === m.id ? 'selected' : ''}`}
              onClick={() => setSelectedMemberId(m.id)}
            >
              {m.type === 'bridesmaid' ? (
                <FemaleSVG color={m.color} style={m.style} />
              ) : (
                <MaleSVG suitColor={suitColor} accentColor={m.color} />
              )}
              <div className="avatar-label">{m.name}</div>
            </div>
          ))}

          {/* Bride & Groom */}
          <div className="avatar-container">
            <BrideSVG />
            <div className="avatar-label" style={{ fontWeight: 700, color: '#8b5e83' }}>Bride</div>
          </div>
          <div className="avatar-container">
            <GroomSVG suitColor={suitColor} tieColor="#94a287" />
            <div className="avatar-label" style={{ fontWeight: 700, color: '#8b5e83' }}>Groom</div>
          </div>

          {/* Groom Side */}
          {groomSide.map((m) => (
            <div 
              key={m.id} 
              className={`avatar-container ${selectedMemberId === m.id ? 'selected' : ''}`}
              onClick={() => setSelectedMemberId(m.id)}
            >
              {m.type === 'groomswoman' ? (
                <FemaleSVG color={m.color} style={m.style} bouquet={false} />
              ) : (
                <MaleSVG suitColor={suitColor} accentColor={m.color} />
              )}
              <div className="avatar-label">{m.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Options Panel (below) */}
      <div className="setup-panel" style={{ display: 'block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div className="control-group">
            <label><Users size={16} /> Bride's Side</label>
            <div className="preset-grid">
               <button onClick={addBM} className="preset-chip active"><Plus size={14} /> Add Member</button>
            </div>
          </div>
          <div className="control-group">
            <label><Users size={16} /> Groom's Side</label>
            <div className="preset-grid">
               <button onClick={addGM} className="preset-chip active"><Plus size={14} /> Add Member</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Individual Editor */}
          <div className="editor-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: '#fafafa' }}>
            <h3 style={{ marginBottom: '15px' }}>{selectedMember ? `Editing ${selectedMember.name}` : 'Select a person to edit'}</h3>
            {selectedMember ? (
              <div className="control-group" style={{ gap: '15px' }}>
                <div>
                  <label>Name</label>
                  <input 
                    type="text" 
                    value={selectedMember.name} 
                    onChange={e => updateMember(selectedMember.id, { name: e.target.value })}
                    className="number-input"
                    style={{ width: '100%', textAlign: 'left' }}
                  />
                </div>
                <div>
                  <label>Role</label>
                  <div className="preset-grid">
                    {(selectedMemberId && brideSide.some(m => m.id === selectedMemberId) 
                      ? ['bridesmaid', 'bridesman'] 
                      : ['groomsman', 'groomswoman']
                    ).map(t => (
                      <button 
                        key={t}
                        className={`preset-chip ${selectedMember.type === t ? 'active' : ''}`}
                        onClick={() => updateMember(selectedMember.id, { type: t as MemberType })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Color (Dress/Tie)</label>
                  <div className="input-row">
                    <input 
                      type="color" 
                      value={selectedMember.color} 
                      onChange={e => updateMember(selectedMember.id, { color: e.target.value })} 
                    />
                    <span>{selectedMember.color}</span>
                  </div>
                </div>
                { (selectedMember.type === 'bridesmaid' || selectedMember.type === 'groomswoman') && (
                  <div>
                    <label>Dress Style</label>
                    <div className="preset-grid">
                      {(['strapless', 'one-shoulder', 'long-sleeve'] as DressStyle[]).map(s => (
                        <button 
                          key={s}
                          className={`preset-chip ${selectedMember.style === s ? 'active' : ''}`}
                          onClick={() => updateMember(selectedMember.id, { style: s })}
                        >
                          {s.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => removeMember(selectedMember.id)}
                  className="preset-chip" 
                  style={{ color: '#ff4444', borderColor: '#ff4444', marginTop: '10px' }}
                >
                  <Trash2 size={14} /> Remove Member
                </button>
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '0.9rem' }}>Click an avatar in the lineup above to customize their look.</p>
            )}
          </div>

          {/* Global Controls */}
          <div className="global-controls">
            <div className="control-group" style={{ marginBottom: '20px' }}>
              <label>Universal Suit Color</label>
              <div className="preset-grid">
                {SUIT_PRESETS.map(s => (
                  <button 
                    key={s.name}
                    className={`preset-chip ${suitColor === s.hex ? 'active' : ''}`}
                    onClick={() => setSuitColor(s.hex)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="control-group">
              <label>Bulk Palette Apply (All members)</label>
              <div className="preset-grid">
                {PRESET_PALETTES.map(p => (
                  <button 
                    key={p.name}
                    className="preset-chip"
                    onClick={() => {
                      brideSide.forEach(m => updateMember(m.id, { color: p.dress }));
                      groomSide.forEach(m => updateMember(m.id, { color: p.tie }));
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

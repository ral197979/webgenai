'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const STYLES = [
  { id: 'dark-luxury', label: 'Dark Luxury' },
  { id: 'glassmorphism', label: 'Glassmorphism' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'bento-grid', label: 'Bento Grid' },
  { id: 'retro-futuristic', label: 'Retro Future' },
  { id: 'claymorphism', label: 'Claymorphism' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'swiss-design', label: 'Swiss Design' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'art-deco', label: 'Art Deco' },
];

const EXAMPLES = [
  'Luna — AI predictive maintenance platform for industrial facilities',
  'Ava Systems — Embassy facility management software',
  'AI SaaS writing assistant',
  'Luxury real estate agency',
  'Fintech mobile banking app',
  'Creative design studio portfolio',
  'Web3 NFT marketplace',
  'Healthcare telemedicine platform',
];

const STAGES = [
  'Analyzing product type...',
  'Generating design system...',
  'Building layout & components...',
  'Adding scroll animations...',
  'Polishing micro-interactions...',
  'Running UX quality checks...',
];

export default function WebGenAI() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('aurora');
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState('');
  const [view, setView] = useState('preview');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState(0);
  const intervalRef = useRef(null);

  const generate = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError('');
    setHtml('');
    setStage(0);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = Math.min(idx + 1, STAGES.length - 1);
      setStage(idx);
    }, 2000);

    const styleLabel = STYLES.find((s) => s.id === style)?.label || style;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: styleLabel,
        }),
      });

      clearInterval(intervalRef.current);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Generation failed');
      }

      const data = await res.json();
      setHtml(data.html);
      setView('preview');
    } catch (e) {
      clearInterval(intervalRef.current);
      setError(e.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [prompt, style, loading]);

  useEffect(() => {
    if (html && prompt.trim() && !loading) {
      generate();
    }
  }, [html, prompt, style, loading, generate]);

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const slug = prompt
      .slice(0, 30)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasOutput = !!html;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07070F',
        color: '#fff',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes glow { 0%,100%{box-shadow:0 0 16px rgba(99,102,241,.2)} 50%{box-shadow:0 0 32px rgba(99,102,241,.5)} }

        .fu1{animation:fadeUp .6s ease .05s both}
        .fu2{animation:fadeUp .6s ease .2s both}
        .fu3{animation:fadeUp .6s ease .35s both}
        .fu4{animation:fadeUp .6s ease .5s both}

        textarea { width:100%; background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.08); border-radius:14px; color:#fff; padding:14px 16px; font-size:14px; font-family:'DM Sans',sans-serif; resize:none; outline:none; transition:border-color .2s; line-height:1.7; }
        textarea:focus { border-color:rgba(99,102,241,.6); }
        textarea::placeholder { color:rgba(255,255,255,.2); }

        .chip { padding:6px 14px; border-radius:100px; border:1.5px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); color:rgba(255,255,255,.4); font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; white-space:nowrap; font-family:'DM Sans',sans-serif; }
        .chip:hover { border-color:rgba(99,102,241,.4); color:rgba(255,255,255,.75); background:rgba(99,102,241,.07); }
        .chip.active { border-color:#6366F1; background:rgba(99,102,241,.16); color:#fff; animation:glow 3s ease infinite; }

        .ex { padding:4px 12px; border-radius:100px; border:1px solid rgba(255,255,255,.06); background:transparent; color:rgba(255,255,255,.28); font-size:11px; cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
        .ex:hover { border-color:rgba(255,255,255,.16); color:rgba(255,255,255,.6); }

        .gen-btn { width:100%; padding:15px; border-radius:14px; border:none; background:linear-gradient(135deg,#6366F1,#4F46E5,#7C3AED); color:#fff; font-size:15px; font-weight:700; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; position:relative; overflow:hidden; letter-spacing:-.01em; }
        .gen-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 40px rgba(99,102,241,.45); }
        .gen-btn:disabled { opacity:.6; cursor:not-allowed; transform:none!important; }
        .gen-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); background-size:200% 100%; animation:shimmer 2.5s linear infinite; }

        .tab { padding:7px 18px; border-radius:8px; border:none; font-size:12px; font-weight:700; cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif; letter-spacing:.02em; }
        .tab.on { background:rgba(255,255,255,.1); color:#fff; }
        .tab.off { background:transparent; color:rgba(255,255,255,.32); }

        .action-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; border:1.5px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); color:rgba(255,255,255,.6); font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif; }
        .action-btn:hover { background:rgba(255,255,255,.09); color:#fff; border-color:rgba(255,255,255,.2); }
        .action-btn.ok { border-color:rgba(52,211,153,.4); color:#6EE7B7; background:rgba(52,211,153,.07); }

        .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.2); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
        .live-dot { width:6px; height:6px; border-radius:50%; background:#34D399; animation:pulse 2s ease infinite; }

        .progress-track { height:2px; background:rgba(255,255,255,.06); border-radius:1px; overflow:hidden; margin-top:8px; }
        .progress-fill { height:100%; border-radius:1px; background:linear-gradient(90deg,#6366F1,#22D3EE); transition:width .8s ease; }

        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:2px; }

        .label { font-size:10px; color:rgba(255,255,255,.3); letter-spacing:.1em; font-weight:700; display:block; margin-bottom:9px; }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          padding: '0 24px',
          height: 64,
          borderBottom: '1px solid rgba(255,255,255,.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7,7,15,.9)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 200,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'linear-gradient(135deg,#6366F1,#7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '-.03em',
              }}
            >
              WebGen<span style={{ color: '#818CF8' }}>AI</span>
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,.25)',
                letterSpacing: '.1em',
                marginTop: 1,
              }}
            >
              PROMAX · CLAUDE SONNET 4
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="live-dot" />
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,.28)',
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            API Ready
          </span>
        </div>
      </header>

      {/* BODY */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: hasOutput ? 'row' : 'column',
          overflow: 'hidden',
        }}
      >
        {/* LEFT / CENTER PANEL */}
        <div
          style={{
            width: hasOutput ? 340 : '100%',
            maxWidth: hasOutput ? 340 : 560,
            margin: hasOutput ? 0 : '0 auto',
            flexShrink: 0,
            padding: '24px 20px',
            overflowY: 'auto',
            borderRight: hasOutput ? '1px solid rgba(255,255,255,.06)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Hero text (only before first generation) */}
          {!hasOutput && (
            <div className="fu1" style={{ textAlign: 'center', paddingTop: 8 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 14px',
                  borderRadius: 100,
                  border: '1px solid rgba(99,102,241,.3)',
                  background: 'rgba(99,102,241,.07)',
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: '#A5B4FC',
                    letterSpacing: '.07em',
                    fontWeight: 700,
                  }}
                >
                  ✦ PROMAX WEBSITES POWERED BY CLAUDE
                </span>
              </div>
              <h1
                className="fu2"
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(26px,5vw,40px)',
                  letterSpacing: '-.035em',
                  lineHeight: 1.08,
                  marginBottom: 12,
                }}
              >
                Generate Stunning
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(135deg,#818CF8,#22D3EE,#6EE7B7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Websites Instantly
                </span>
              </h1>
              <p
                className="fu3"
                style={{
                  color: 'rgba(255,255,255,.35)',
                  fontSize: 13.5,
                  lineHeight: 1.75,
                }}
              >
                Describe any product. Pick a style.
                <br />
                Get a production-ready, animated website in seconds.
              </p>
            </div>
          )}

          {/* Prompt */}
          <div className={hasOutput ? '' : 'fu4'}>
            <label className="label">DESCRIBE YOUR WEBSITE</label>
            <textarea
              rows={hasOutput ? 5 : 4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate();
              }}
              placeholder="e.g. Luna — AI-powered predictive maintenance for industrial facilities..."
            />
          </div>

          {/* Examples */}
          {!hasOutput && (
            <div>
              <label className="label">QUICK EXAMPLES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    className="ex"
                    onClick={() => setPrompt(ex)}
                  >
                    {ex.slice(0, 25)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Style Selector */}
          <div>
            <label className="label">DESIGN STYLE</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  className={`chip ${style === s.id ? 'active' : ''}`}
                  onClick={() => setStyle(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              className="gen-btn"
              onClick={generate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 9,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span className="spinner" />
                  {STAGES[stage]}
                </span>
              ) : (
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {hasOutput ? '↻ Regenerate' : '⚡ Generate Website'}
                  {!hasOutput && (
                    <span style={{ opacity: 0.5, fontSize: 11, marginLeft: 8 }}>
                      ⌘↵
                    </span>
                  )}
                </span>
              )}
            </button>
            {loading && (
              <div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((stage + 1) / STAGES.length) * 100}%`,
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: 10,
                    color: 'rgba(255,255,255,.2)',
                    marginTop: 5,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  step {stage + 1} / {STAGES.length}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                padding: '11px 14px',
                borderRadius: 10,
                background: 'rgba(239,68,68,.07)',
                border: '1px solid rgba(239,68,68,.2)',
                color: '#FCA5A5',
                fontSize: 12.5,
                lineHeight: 1.6,
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Generation info */}
          {hasOutput && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(99,102,241,.06)',
                border: '1px solid rgba(99,102,241,.18)',
                fontSize: 12,
                color: 'rgba(255,255,255,.45)',
                lineHeight: 1.7,
              }}
            >
              <div
                style={{
                  color: '#A5B4FC',
                  fontWeight: 700,
                  marginBottom: 5,
                  fontSize: 11,
                  letterSpacing: '.05em',
                }}
              >
                ✦ APPLIED
              </div>
              Style:{' '}
              <span style={{ color: 'rgba(255,255,255,.75)' }}>
                {STYLES.find((s) => s.id === style)?.label}
              </span>
              <br />
              Engine:{' '}
              <span style={{ color: 'rgba(255,255,255,.75)' }}>
                Claude Sonnet 4
              </span>
              <br />
              Animations:{' '}
              <span style={{ color: 'rgba(255,255,255,.75)' }}>
                All included
              </span>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        {hasOutput && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              height: 'calc(100vh - 64px)',
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,.06)',
                background: 'rgba(255,255,255,.015)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 3,
                  background: 'rgba(255,255,255,.04)',
                  borderRadius: 9,
                  padding: 3,
                }}
              >
                <button
                  className={`tab ${view === 'preview' ? 'on' : 'off'}`}
                  onClick={() => setView('preview')}
                >
                  ◻ Preview
                </button>
                <button
                  className={`tab ${view === 'code' ? 'on' : 'off'}`}
                  onClick={() => setView('code')}
                >
                  &lt;/&gt; Code
                </button>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button
                  className={`action-btn ${copied ? 'ok' : ''}`}
                  onClick={copy}
                >
                  {copied ? '✓ Copied!' : '⎘ Copy HTML'}
                </button>
                <button className="action-btn" onClick={download}>
                  ↓ Download
                </button>
              </div>
            </div>

            {view === 'preview' && (
              <iframe
                key={html}
                srcDoc={html}
                style={{
                  flex: 1,
                  border: 'none',
                  width: '100%',
                  display: 'block',
                }}
                title="Generated Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            )}

            {view === 'code' && (
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  background: '#0D1117',
                  padding: '20px 24px',
                }}
              >
                <pre
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11.5,
                    color: '#E6EDF3',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {html}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Empty state hint */}
        {!hasOutput && !loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '0 24px 32px',
              color: 'rgba(255,255,255,.15)',
              fontSize: 11,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            fill in your description → pick a style → hit generate
          </div>
        )}
      </div>
    </div>
  );
}

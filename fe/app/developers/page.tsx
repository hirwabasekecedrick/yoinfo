'use client';

import { useState } from 'react';
import Link from 'next/link';

const EMBED_CODE = `<div id="yoinfo-fliiper"
     data-theme="light"
     data-category="deals"></div>
<script src="https://cdn.yoinfo.africa/fliiper-widget.js" async></script>`;

const API_CODE = `curl https://api.yoinfo.africa/v1/feed?category=deals \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

export default function DevelopersPage() {
  const [devTab, setDevTab] = useState<'embed' | 'api'>('embed');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    const text = devTab === 'embed' ? EMBED_CODE : API_CODE;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section className="section">
      <div className="wrap">
        <div className="mbreadcrumb"><Link href="/">yoInfo</Link> / Developers &amp; Partners</div>
        <h1 className="mpage-title">Embed yoInfo <i>Fliiper</i> anywhere</h1>
        <p className="mpage-sub">Drop the Fliiper feed into your own website with a single script tag, or pull the same data into your product with our REST API.</p>

        <div className="dev-grid">
          <div className="dev-side">
            <div className="dev-feature">
              <div className="dev-feature-icon">⚡</div>
              <div>
                <div className="dev-feature-title">One line to embed</div>
                <div className="dev-feature-desc">A single script tag renders a live, auto-updating Fliiper widget wherever you paste it.</div>
              </div>
            </div>
            <div className="dev-feature">
              <div className="dev-feature-icon">🎨</div>
              <div>
                <div className="dev-feature-title">Themeable</div>
                <div className="dev-feature-desc">Light or dark, and filtered to the categories your audience cares about — News, Deals, Jobs, or Tenders.</div>
              </div>
            </div>
            <div className="dev-feature">
              <div className="dev-feature-icon">🔌</div>
              <div>
                <div className="dev-feature-title">Full REST API</div>
                <div className="dev-feature-desc">Query the same feed programmatically and build your own experience on top of it.</div>
              </div>
            </div>
            <div className="dev-feature">
              <div className="dev-feature-icon">🔒</div>
              <div>
                <div className="dev-feature-title">Scoped API keys</div>
                <div className="dev-feature-desc">Every partner gets their own key with usage limits, so access stays secure and accountable.</div>
              </div>
            </div>

            <button className="btn-solid btn-lg" style={{ marginTop: 8 }}>
              Request API Access
            </button>
          </div>

          <div className="dev-panel">
            <div className="dev-tabs">
              <div className={`dev-tab${devTab === 'embed' ? ' active' : ''}`} onClick={() => setDevTab('embed')}>Embed Script</div>
              <div className={`dev-tab${devTab === 'api' ? ' active' : ''}`} onClick={() => setDevTab('api')}>REST API</div>
            </div>

            <div className={`dev-tab-content${devTab === 'embed' ? ' show' : ''}`}>
              <p className="dev-panel-note">Paste this where you want the widget to appear. It loads asynchronously and won&apos;t slow down your page.</p>
              <div className="code-block">
                <div className="code-block-head">
                  <span>HTML</span>
                  <button className={`code-copy-btn${copied ? ' copied' : ''}`} onClick={copyCode}>
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <pre>{EMBED_CODE}</pre>
              </div>
              <p className="dev-panel-note">Available <code>data-category</code> values: <code>all</code>, <code>news</code>, <code>deals</code>, <code>jobs</code>, <code>tenders</code>.</p>
            </div>

            <div className={`dev-tab-content${devTab === 'api' ? ' show' : ''}`}>
              <p className="dev-panel-note">Authenticate with a Bearer token and query the same feed that powers Fliiper and the embed widget.</p>
              <div className="code-block">
                <div className="code-block-head">
                  <span>cURL</span>
                  <button className={`code-copy-btn${copied ? ' copied' : ''}`} onClick={copyCode}>
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <pre>{API_CODE}</pre>
              </div>
              <p className="dev-panel-note">Returns paginated JSON — title, summary, image, category, call-to-action, and expiry for each item. Rate limit: 120 requests/minute per key.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

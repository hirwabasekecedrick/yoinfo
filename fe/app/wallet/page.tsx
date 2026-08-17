'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useIbiceri } from '@/components/ibiceri-provider';

const PLANS = [
  {
    tier: 'Starter', amt: 100, price: 1000, rate: 'RWF 10 / Ibiceri',
    desc: 'Try the platform — a few Fliiper posts or your first press release.',
    perks: ['~20 Fliiper posts with distribution', 'Or 2 press releases', 'Mobile Money or Card'],
    btnClass: 'btn-ghost btn-full',
    tierClass: 'pricing-tier',
    btnLabel: 'Buy Starter',
  },
  {
    tier: 'Growth', amt: 500, price: 4500, rate: 'RWF 9 / Ibiceri · save 10%',
    desc: 'Regular posting across Fliiper, Instagram, and Facebook.',
    perks: ['Weekly multi-channel posting', 'Occasional KT social media boosts', 'Priority Mobile Money processing'],
    btnClass: 'btn-solid btn-full',
    tierClass: 'pricing-tier popular',
    badge: 'Most popular', badgeClass: '',
    btnLabel: 'Buy Growth',
  },
  {
    tier: 'Business', amt: 1500, price: 12000, rate: 'RWF 8 / Ibiceri · save 20%',
    desc: 'Active brands running multi-channel campaigns and media boosts.',
    perks: ['Daily posting across every channel', 'Room for KT Radio & Press releases', 'Full wallet reporting & history'],
    btnClass: 'btn-solid btn-full',
    tierClass: 'pricing-tier best',
    badge: 'Best value', badgeClass: 'gold',
    btnLabel: 'Buy Business',
  },
  {
    tier: 'Enterprise', amt: 0, price: 0, rate: 'Tailored to your organisation',
    desc: 'Ongoing KT Radio, Press, and long-term media contracts.',
    perks: ['Custom Ibiceri bundle size', 'Dedicated account manager', 'Invoiced billing available'],
    tierClass: 'pricing-tier enterprise',
    btnLabel: '📞 Call 0793 903 844',
  },
];

const COSTS = [
  { label: 'Publish a post to one channel', cost: '5 Ibiceri' },
  { label: 'Automatic Kinyarwanda translation', cost: '3 Ibiceri' },
  { label: 'Blast Wizard campaign send', cost: 'Priced per contact & channel' },
  { label: 'Issue an EBM-registered invoice', cost: '2 Ibiceri' },
  { label: 'Publish an item in Comms Newsroom', cost: '4 Ibiceri' },
  { label: 'Distribute a Newsroom item to Fliiper', cost: '+5 Ibiceri' },
  { label: 'Share a Newsroom item via Go Social', cost: '+5 Ibiceri' },
  { label: 'KT Radio DJ mention (each)', cost: '2 Ibiceri' },
  { label: 'KT social media boost (per channel: Instagram, X, Facebook)', cost: '2 Ibiceri' },
  { label: 'Press release — KT Press or Kigali Today', cost: '2 Ibiceri' },
  { label: 'Radio announcement with your own jingle (each)', cost: '10 Ibiceri' },
  { label: 'Long-term media contract', cost: 'Call 0793 903 844', highlight: true },
];

export default function WalletPage() {
  const { balance, transactions, shortfall, topUp } = useIbiceri();
  const [payStep, setPayStep] = useState<'form' | 'processing' | 'success'>('form');
  const [payAmt, setPayAmt] = useState(0);
  const [payPrice, setPayPrice] = useState(0);
  const [payMethod, setPayMethod] = useState<'momo' | 'card'>('momo');
  const [payPhone, setPayPhone] = useState('');
  const [payCardNumber, setPayCardNumber] = useState('');
  const [payCardExpiry, setPayCardExpiry] = useState('');
  const [payCardCvv, setPayCardCvv] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openPaymentModal = (amt: number, price: number) => {
    setPayAmt(amt);
    setPayPrice(price);
    setPayMethod('momo');
    setPayPhone('');
    setPayCardNumber('');
    setPayCardExpiry('');
    setPayCardCvv('');
    setPayStep('form');
    setShowModal(true);
  };

  const submitPayment = () => {
    if (payMethod === 'momo' && !payPhone.trim()) return;
    if (payMethod === 'card' && (!payCardNumber.trim() || !payCardExpiry.trim() || !payCardCvv.trim())) return;
    setPayStep('processing');
    setTimeout(() => {
      const srcLabel = payMethod === 'momo' ? 'Mobile Money' : 'Card';
      topUp(payAmt, `${srcLabel} top-up — ${payAmt} Ibiceri`);
      setPayStep('success');
    }, 2200);
  };

  return (
    <section className="section">
      <div className="wrap">
        <div className="mbreadcrumb"><Link href="/">yoInfo</Link> / Ibiceri Wallet</div>
        <h1 className="mpage-title">Your Ibiceri balance</h1>
        <p className="mpage-sub">yoInfo runs on a pay-as-you-go token system. Every post, blast, and translation is paid for in Ibiceri, topped up anytime with Mobile Money.</p>

        {shortfall && (
          <div className="wallet-shortfall-banner">
            <span>⚠️</span>
            <span>You&apos;re {shortfall} Ibiceri short for that action — pick a plan below to top up and continue.</span>
          </div>
        )}

        <div className="wallet-balance-card">
          <svg className="ibiceri-icon-lg" width="40" height="40" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#E8B04B" stroke="#8A5A00" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="6.4" fill="none" stroke="#8A5A00" strokeWidth="1" />
            <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A5A00" fontFamily="Montserrat,sans-serif">i</text>
          </svg>
          <div>
            <div className="wallet-balance-num">{balance.toLocaleString()} Ibiceri</div>
            <div className="wallet-balance-sub">≈ RWF {(balance * 10).toLocaleString()} at current rate</div>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 30 }}>
          <div className="section-tag">Top up</div>
          <h2 className="section-title">Choose an Ibiceri plan</h2>
          <p className="section-sub">From a first try to running ongoing KT Radio and Press campaigns — pick the plan that matches how often you publish.</p>
        </div>

        <div className="pricing-tier-grid">
          {PLANS.map(plan => (
            <div key={plan.tier} className={plan.tierClass}>
              {plan.badge && <div className={`pricing-tier-badge${plan.badgeClass ? ` ${plan.badgeClass}` : ''}`}>{plan.badge}</div>}
              <div className="pricing-tier-name">{plan.tier}</div>
              <div className="pricing-tier-desc">{plan.desc}</div>
              <div className="pricing-tier-amt">{plan.amt ? `${plan.amt.toLocaleString()} ` : ''}<span>{plan.amt ? 'Ibiceri' : 'Custom'}</span></div>
              <div className="pricing-tier-price">{plan.amt ? `RWF ${plan.price.toLocaleString()}` : 'Volume pricing'}</div>
              <div className="pricing-tier-rate">{plan.rate}</div>
              <ul className="pricing-tier-list">
                {plan.perks.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
              {plan.amt ? (
                <button className={plan.btnClass} onClick={() => openPaymentModal(plan.amt, plan.price)}>{plan.btnLabel}</button>
              ) : (
                <a className="btn-ghost btn-full" href="tel:0793903844">{plan.btnLabel}</a>
              )}
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="sub-h" style={{ marginTop: 0 }}>Recent activity</div>
          <div id="walletTxList">
            {transactions.slice().reverse().map((tx, i) => (
              <div key={i} className="list-row">
                <span>
                  {tx.label}
                  <br />
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 600 }}>{tx.when}</span>
                </span>
                <span className="badge" style={{
                  background: tx.type === 'credit' ? '#EFFAF0' : '#FBEAE7',
                  color: tx.type === 'credit' ? 'var(--ok)' : 'var(--red)',
                }}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount} Ibiceri
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div className="sub-h" style={{ marginTop: 0 }}>What costs Ibiceri?</div>
          {COSTS.map((c, i) => (
            <div key={i} className="list-row">
              <span>{c.label}</span>
              <span className="badge" style={{
                background: c.highlight ? '#FFF7E8' : '#F3E7EF',
                color: c.highlight ? '#8A5A00' : 'var(--muted)',
              }}>{c.cost}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`modal-overlay${showModal ? ' show' : ''}`} onClick={() => setShowModal(false)}>
        <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
          {payStep === 'form' && (
            <>
              <div className="card-head" style={{ marginBottom: 16 }}><h2>Buy Ibiceri</h2></div>
              <div className="ibp-summary">
                <span>{payAmt.toLocaleString()} Ibiceri</span>
                <span>RWF {payPrice.toLocaleString()}</span>
              </div>
              <div className="field-group" style={{ marginTop: 16 }}>
                <label className="field-label">Pay with</label>
                <div className="ibp-provider-row">
                  <div className={`ibp-provider${payMethod === 'momo' ? ' active' : ''}`} onClick={() => setPayMethod('momo')}>📱 Mobile Money</div>
                  <div className={`ibp-provider${payMethod === 'card' ? ' active' : ''}`} onClick={() => setPayMethod('card')}>💳 Card</div>
                </div>
              </div>
              {payMethod === 'momo' ? (
                <div className="field-group" style={{ marginTop: 14 }}>
                  <label className="field-label">Mobile Money number</label>
                  <input type="tel" className="input" placeholder="+250 7XX XXX XXX" value={payPhone} onChange={e => setPayPhone(e.target.value)} />
                </div>
              ) : (
                <>
                  <div className="field-group" style={{ marginTop: 14 }}>
                    <label className="field-label">Card number</label>
                    <input type="text" className="input" placeholder="1234 5678 9012 3456" inputMode="numeric" value={payCardNumber} onChange={e => setPayCardNumber(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label className="field-label">Expiry</label>
                      <input type="text" className="input" placeholder="MM/YY" value={payCardExpiry} onChange={e => setPayCardExpiry(e.target.value)} />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label className="field-label">CVV</label>
                      <input type="text" className="input" placeholder="123" inputMode="numeric" value={payCardCvv} onChange={e => setPayCardCvv(e.target.value)} />
                    </div>
                  </div>
                </>
              )}
              <button className="btn-solid btn-full" style={{ marginTop: 18 }} onClick={submitPayment}>Send Payment Request</button>
              <button className="btn-ghost btn-full" style={{ marginTop: 8 }} onClick={() => setShowModal(false)}>Cancel</button>
            </>
          )}
          {payStep === 'processing' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="ibp-spinner" />
              <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--ink)', marginTop: 16 }}>
                {payMethod === 'momo' ? 'Check your phone' : 'Processing your card'}
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500, marginTop: 6 }}>
                {payMethod === 'momo'
                  ? <>Approve the Mobile Money prompt sent to <b>{payPhone}</b> to complete your purchase of <b>{payAmt.toLocaleString()} Ibiceri</b>.</>
                  : <>Confirming your card payment for <b>{payAmt.toLocaleString()} Ibiceri</b>. Please don&apos;t close this window.</>
                }
              </p>
            </div>
          )}
          {payStep === 'success' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div className="ibp-check">✓</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)', marginTop: 14 }}>Payment successful</div>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500, marginTop: 6 }}>{payAmt.toLocaleString()} Ibiceri added to your wallet.</p>
              <div className="wallet-balance-num" style={{ marginTop: 10 }}>New balance: {balance.toLocaleString()} Ibiceri</div>
              <button className="btn-solid btn-full" style={{ marginTop: 20 }} onClick={() => setShowModal(false)}>Done</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

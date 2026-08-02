'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/tool-layout';
import ProtectedRoute from '@/components/protected-route';
import { useIbiceri } from '@/components/ibiceri-provider';

const TOOL_NAV = [
  { label: 'Update Wizard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { label: 'Blast Wizard', href: '/messaging', icon: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.431-.173.869-.173 1.315 0 .447.062.884.173 1.315m0-9.665a24.301 24.301 0 003.484.045m-3.484 0a24.27 24.27 0 01-3.484-.045' },
  { label: 'Business Profiling', href: '/business', icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 0113.5 9h1.5a1.5 1.5 0 011.5 1.5v8.25' },
  { label: 'Invoice Wizard', href: '/invoices', icon: 'M9 7h6M9 11h6M9 15h3M6 3h9l3 3v15a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z' },
  { label: 'Fliiper', href: '/flipper', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
];

type View = 'dashboard' | 'invoices' | 'new-invoice' | 'invoice-preview' | 'templates' | 'integrations';

interface LineItem { id: number; desc: string; qty: number; price: number; }
interface Invoice { num: string; client: string; amount: number; status: string; ebm: string; due: string; }

const SEED_INVOICES: Invoice[] = [
  { num: 'INV-2026-0001', client: 'Golden Bakery Ltd', amount: 1180000, status: 'Paid', ebm: 'Synced', due: '02 Jul 2026' },
  { num: 'INV-2026-0002', client: 'Kivu Roasters', amount: 590000, status: 'Sent', ebm: 'Synced', due: '30 Jul 2026' },
  { num: 'INV-2026-0003', client: 'Karisimbi Lodge & Retreat', amount: 2500000, status: 'Overdue', ebm: 'Synced', due: '15 Jul 2026' },
  { num: 'INV-2026-0004', client: 'Isoko Handmade Crafts', amount: 1550000, status: 'Draft', ebm: 'Not yet issued', due: '—' },
];

export default function InvoicesPage() {
  const { balance, spend } = useIbiceri();
  const [view, setView] = useState<View>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [nextNumber, setNextNumber] = useState(5);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientTin, setClientTin] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [notes, setNotes] = useState('');
  const [nextLineId, setNextLineId] = useState(1);
  const [ebmStatus, setEbmStatus] = useState('Not yet issued');
  const [issuedNum, setIssuedNum] = useState('');
  const [issuedDate, setIssuedDate] = useState('');

  const [tplName, setTplName] = useState('');
  const [tplTin, setTplTin] = useState('');
  const [tplAddress, setTplAddress] = useState('');
  const [tplFooter, setTplFooter] = useState('Thank you for your business!');
  const [tplSwatch, setTplSwatch] = useState('#C1027D');
  const [logoData, setLogoData] = useState<string | null>(null);
  const [stampData, setStampData] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const calcTotals = () => {
    const subtotal = lineItems.reduce((s, li) => s + li.qty * li.price, 0);
    const vat = subtotal * 0.18;
    const total = subtotal + vat;
    return { subtotal, vat: Math.round(vat), total: Math.round(total) };
  };

  const addLineItem = () => {
    setLineItems(prev => [...prev, { id: nextLineId, desc: '', qty: 1, price: 0 }]);
    setNextLineId(id => id + 1);
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(li => li.id === id ? { ...li, [field]: value } : li));
  };

  const removeLineItem = (id: number) => {
    setLineItems(prev => prev.filter(li => li.id !== id));
  };

  const issueInvoice = () => {
    if (!clientName.trim()) { showToast('Add a client name before issuing'); return; }
    if (!spend(2, 'Invoice issue')) return;
    const num = 'INV-2026-' + String(nextNumber).padStart(4, '0');
    setIssuedNum(num);
    setIssuedDate(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    const ebmRef = 'EBM-RRA-' + Math.floor(100000 + Math.random() * 899999);
    setEbmStatus('Issued · Receipt ' + ebmRef);
    setNextNumber(n => n + 1);
    const { total } = calcTotals();
    setInvoices(prev => [{ num, client: clientName, amount: total, status: 'Sent', ebm: 'Synced', due: '—' }, ...prev]);
    showToast('Invoice ' + num + ' issued and registered with RRA EBM · 2 Ibiceri spent');
  };

  const sendInvoice = (channel: string) => {
    if (!clientContact.trim()) { showToast('Add a client contact to send via ' + channel); return; }
    showToast('Invoice sent via ' + channel + ' to ' + clientContact);
  };

  const openPreview = () => {
    setView('invoice-preview');
  };

  const handleUpload = (kind: 'logo' | 'stamp' | 'signature', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (kind === 'logo') setLogoData(dataUrl);
      else if (kind === 'stamp') setStampData(dataUrl);
      else if (kind === 'signature') setSignatureData(dataUrl);
      showToast(kind.charAt(0).toUpperCase() + kind.slice(1) + ' uploaded');
    };
    reader.readAsDataURL(file);
  };

  const filteredInvoices = invoices.filter(inv =>
    (filterStatus === 'all' || inv.status === filterStatus) &&
    (search === '' || inv.client.toLowerCase().includes(search.toLowerCase()) || inv.num.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCounts = {
    total: invoices.reduce((s, inv) => {
      if (inv.status === 'Paid') return s + inv.amount;
      return s;
    }, 0),
    outstanding: invoices.reduce((s, inv) => {
      if (inv.status === 'Sent' || inv.status === 'Overdue') return s + inv.amount;
      return s;
    }, 0),
    paid: invoices.reduce((s, inv) => {
      if (inv.status === 'Paid') return s + inv.amount;
      return s;
    }, 0),
    ebm: invoices.filter(i => i.ebm === 'Synced').length,
  };

  const { subtotal, vat, total } = calcTotals();
  const initials = (tplName || 'Your Business').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'YB';

  return (
    <ProtectedRoute>
      <ToolLayout
        title={
          view === 'dashboard' ? 'Dashboard' :
          view === 'invoices' ? 'Invoices' :
          view === 'new-invoice' ? 'New Invoice' :
          view === 'invoice-preview' ? 'Preview & Print' :
          view === 'templates' ? 'Templates' : 'Integrations'
        }
        subtitle={
          view === 'dashboard' ? 'Every invoice, receipt, and EBM submission in one place.' :
          view === 'invoices' ? 'Track every invoice from draft to paid.' :
          view === 'new-invoice' ? 'RRA/EBM-compliant, numbered automatically.' :
          view === 'invoice-preview' ? 'Review the invoice exactly as your client will see it.' :
          view === 'templates' ? 'Add your logo, address, and colours once — reuse them on every invoice.' :
          'Connect Invoice Wizard to your EBM device and accounting software.'
        }
        navItems={TOOL_NAV}
      >
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['dashboard', 'invoices', 'new-invoice', 'templates', 'integrations'] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                view === v ? 'bg-[#C1027D] text-white border-[#C1027D]' : 'bg-white text-gray-500 border-[#f0e4ec] hover:border-[#D93F9E]'
              }`}>
              {v === 'new-invoice' ? '+ New Invoice' : v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* ═══════════════ DASHBOARD ═══════════════ */}
        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="stat-card"><div className="stat-icon bg-[#FBEAF5] text-[#C1027D]">💰</div><div><div className="stat-value">RWF {activeCounts.total.toLocaleString()}</div><div className="stat-label">Invoiced this month</div></div></div>
              <div className="stat-card"><div className="stat-icon bg-[#FDF3E3] text-[#C98A1B]">⏳</div><div><div className="stat-value">RWF {activeCounts.outstanding.toLocaleString()}</div><div className="stat-label">Outstanding</div></div></div>
              <div className="stat-card"><div className="stat-icon bg-[#EFFAF0] text-green-600">✅</div><div><div className="stat-value">RWF {activeCounts.paid.toLocaleString()}</div><div className="stat-label">Paid</div></div></div>
              <div className="stat-card"><div className="stat-icon bg-[#EFFAF0] text-green-600">📡</div><div><div className="stat-value">{activeCounts.ebm}</div><div className="stat-label">EBM synced</div></div></div>
            </div>
            <div className="flex gap-3 mb-6 flex-wrap">
              <button className="btn btn-primary" onClick={() => setView('new-invoice')}>+ New Invoice</button>
              <button className="btn btn-outline" onClick={() => setView('templates')}>Manage Templates</button>
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Recent invoices</h3>
                <button className="text-xs font-bold text-[#C1027D]" onClick={() => setView('invoices')}>View all →</button>
              </div>
              {invoices.slice(0, 4).map(inv => (
                <div key={inv.num} className="flex items-center justify-between py-3 border-b border-[#f8f0f4] last:border-b-0">
                  <div>
                    <div className="font-bold text-sm">{inv.num} · {inv.client}</div>
                    <div className="text-xs text-gray-400">Due {inv.due}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">RWF {inv.amount.toLocaleString()}</span>
                    <span className={`badge ${inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : inv.status === 'Sent' ? 'warning' : 'info'}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════ INVOICES LIST ═══════════════ */}
        {view === 'invoices' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap items-center">
              {['all', 'Draft', 'Sent', 'Paid', 'Overdue'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                    filterStatus === s ? 'bg-[#C1027D] text-white border-[#C1027D]' : 'bg-white text-gray-500 border-[#f0e4ec] hover:border-[#D93F9E]'
                  }`}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices…" className="input max-w-[200px] ml-auto" />
              <button className="btn btn-primary btn-sm" onClick={() => setView('new-invoice')}>+ New Invoice</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Status</th><th>EBM</th><th>Due</th><th></th></tr></thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.num} className="cursor-pointer hover:bg-gray-50" onClick={() => { setClientName(inv.client); setView('new-invoice'); }}>
                      <td className="font-mono font-bold">{inv.num}</td>
                      <td>{inv.client}</td>
                      <td className="font-mono">RWF {inv.amount.toLocaleString()}</td>
                      <td><span className={`badge ${inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'error' : inv.status === 'Sent' ? 'warning' : 'info'}`}>{inv.status}</span></td>
                      <td className="text-xs text-gray-400">{inv.ebm}</td>
                      <td className="text-xs">{inv.due}</td>
                      <td className="text-[#C1027D] font-bold">→</td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-gray-400 py-8">No invoices match this filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ═══════════════ NEW INVOICE ═══════════════ */}
        {view === 'new-invoice' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="card">
                <h3 className="font-bold mb-4">Bill to</h3>
                <div className="field-group"><label className="field-label">Client name</label><input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Golden Bakery Ltd" className="input" /></div>
                <div className="field-group"><label className="field-label">Client TIN</label><input type="text" value={clientTin} onChange={e => setClientTin(e.target.value)} placeholder="1XXXXXXXXX" className="input" /></div>
                <div className="field-group"><label className="field-label">Client contact (WhatsApp / Email / Phone)</label><input type="text" value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="+250 7XX XXX XXX or client@email.com" className="input" /></div>
              </div>
              <div className="card mt-4">
                <h3 className="font-bold mb-4">Line items</h3>
                <div>
                  {lineItems.map(li => (
                    <div key={li.id} className="iw-line-item-row">
                      <input type="text" placeholder="Description" value={li.desc} onChange={e => updateLineItem(li.id, 'desc', e.target.value)} />
                      <input type="number" placeholder="Qty" value={li.qty} onChange={e => updateLineItem(li.id, 'qty', parseFloat(e.target.value) || 0)} />
                      <input type="number" placeholder="Unit price" value={li.price} onChange={e => updateLineItem(li.id, 'price', parseFloat(e.target.value) || 0)} />
                      <input type="text" placeholder="Total" disabled value={li.qty * li.price ? (li.qty * li.price).toLocaleString() : ''} className="bg-gray-50 font-mono" />
                      <button className="iw-line-remove" onClick={() => removeLineItem(li.id)}>×</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm mt-2" onClick={addLineItem}>+ Add line item</button>
                <div className="mt-4"><label className="field-label">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, thank-you note, etc." className="textarea" /></div>
              </div>
            </div>
            <div className="lg:sticky lg:top-20 self-start">
              <div className="card">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice number</div>
                <div className="font-mono text-lg font-bold mb-4">{issuedNum || 'INV-2026-' + String(nextNumber).padStart(4, '0')}</div>
                <div className="flex justify-between py-1.5 text-sm"><span>Subtotal</span><span className="font-mono font-bold">RWF {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between py-1.5 text-sm"><span>VAT (18%)</span><span className="font-mono font-bold">RWF {vat.toLocaleString()}</span></div>
                <div className="flex justify-between py-2 text-base font-extrabold text-[#C1027D] border-t border-gray-200 mt-1"><span>Total due</span><span className="font-mono">RWF {total.toLocaleString()}</span></div>
                <div className={`iw-ebm-box ${ebmStatus !== 'Not yet issued' ? 'issued' : ''}`}>
                  <div className="iw-ebm-label">EBM status</div>
                  <div className="iw-ebm-status">{ebmStatus}</div>
                </div>
                <button className="btn btn-primary btn-full mt-4" onClick={issueInvoice}>Issue Invoice (RRA EBM) — 2 Ibiceri</button>
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted, #7A6270)', fontWeight: 600, marginTop: 8 }}>
                  Your balance: <span id="invcBalanceHint">{balance.toLocaleString()}</span> Ibiceri
                </div>
                <button className="btn btn-outline btn-full mt-2" onClick={openPreview}>🖨 Preview &amp; Print / Save as PDF</button>
                <h4 className="font-bold text-sm mt-6 mb-2">Send to client</h4>
                <div className="iw-send-row">
                  <button className="iw-send-btn wa" onClick={() => sendInvoice('WhatsApp')}>WhatsApp</button>
                  <button className="iw-send-btn em" onClick={() => sendInvoice('Email')}>Email</button>
                  <button className="iw-send-btn sm" onClick={() => sendInvoice('SMS link')}>SMS link</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ PREVIEW ═══════════════ */}
        {view === 'invoice-preview' && (
          <div>
            <div className="flex justify-between items-center mb-4 iw-no-print">
              <button className="btn btn-outline" onClick={() => setView('new-invoice')}>← Back to edit</button>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨 Print / Save as PDF</button>
            </div>
            <div className="iw-print-area">
              <div className="tpl-preview bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="iw-logo-preview">{logoData ? <img src={logoData} alt="Logo" /> : 'LOGO'}</div>
                  <div className="font-extrabold text-lg" id="invp-name">{tplName || 'Your Business Name'}</div>
                </div>
                <div className="iw-accent-line" style={{ background: tplSwatch }} />
                <div className="iw-doc-title">INVOICE</div>
                <div className="iw-meta-grid">
                  <div>
                    <div className="iw-meta-label">To</div>
                    <div className="iw-meta-strong">{clientName || 'Client Name'}</div>
                    <div className="iw-meta-sub">TIN: {clientTin || '—'}</div>
                  </div>
                  <div>
                    <div className="iw-meta-row"><span>Invoice Date</span><b>{issuedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</b></div>
                    <div className="iw-meta-row"><span>Invoice Number</span><b>{issuedNum || 'INV-2026-XXXX'}</b></div>
                    <div className="iw-meta-row"><span>EBM Status</span><b>{ebmStatus}</b></div>
                  </div>
                  <div className="text-right">
                    <div className="iw-meta-strong">{tplName || 'Your Business Name'}</div>
                    <div className="iw-meta-sub">TIN: {tplTin || '—'}</div>
                    <div className="iw-meta-sub">{tplAddress || 'Business address'}</div>
                  </div>
                </div>
                <table className="iw-doc-table">
                  <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                  <tbody>
                    {lineItems.filter(li => li.desc || li.qty || li.price).map(li => (
                      <tr key={li.id}><td>{li.desc || 'Item'}</td><td>{li.qty.toFixed(2)}</td><td>RWF {li.price.toLocaleString()}</td><td style={{ textAlign: 'right' }}>RWF {(li.qty * li.price).toLocaleString()}</td></tr>
                    ))}
                    {lineItems.filter(li => li.desc || li.qty || li.price).length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>No line items added</td></tr>
                    )}
                  </tbody>
                </table>
                <div className="iw-doc-totals">
                  <div className="iw-total-row"><span>Subtotal</span><span>RWF {subtotal.toLocaleString()}</span></div>
                  <div className="iw-total-row"><span>VAT (18%)</span><span>RWF {vat.toLocaleString()}</span></div>
                  <div className="iw-total-row grand"><span>Amount Due</span><span>RWF {total.toLocaleString()}</span></div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-6"><span>Please pay before Due Date: <b>{issuedDate || '—'}</b> </span></div>
                <div className="iw-sign-row">
                  <div className="iw-sign-block">
                    <div className="iw-sign-for">For and on behalf of</div>
                    <div className="iw-sign-company">{tplName || 'Your Business Name'}</div>
                    <div className="iw-signature">{signatureData ? <img src={signatureData} alt="Signature" className="h-10" /> : 'Signed'}</div>
                    <div className="iw-sign-line" />
                    <div className="iw-sign-label">Authorized Signature(s)</div>
                  </div>
                  <div className="iw-stamp" style={{ flexShrink: 0 }}>
                    <div className="iw-stamp-ring" style={{ borderColor: tplSwatch, color: tplSwatch }}>
                      {stampData ? <img src={stampData} alt="Stamp" className="w-full h-full rounded-full p-1.5" /> : <><span>{initials}</span><small>OFFICIAL · APPROVED</small></>}
                    </div>
                  </div>
                </div>
                <div className="iw-preview-footer">{tplFooter || 'Thank you for your business!'}</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TEMPLATES ═══════════════ */}
        {view === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="card">
                <h3 className="font-bold mb-4">Build your invoice template</h3>
                <div className="field-group">
                  <label className="field-label">Business logo</label>
                  <div className="dropzone" onClick={() => logoInputRef.current?.click()}>
                    {logoData ? <div className="flex items-center gap-2 justify-center"><img src={logoData} alt="Logo" className="h-8" /><span className="text-sm font-bold">Logo uploaded</span></div> : <div className="text-sm font-bold">Click to upload your logo (PNG/SVG)</div>}
                  </div>
                  <input type="file" accept="image/*" ref={logoInputRef} className="hidden" onChange={e => handleUpload('logo', e)} />
                </div>
                <div className="field-group"><label className="field-label">Business name</label><input type="text" value={tplName} onChange={e => setTplName(e.target.value)} placeholder="Edupoto Rwanda Ltd" className="input" /></div>
                <div className="field-group"><label className="field-label">Business TIN</label><input type="text" value={tplTin} onChange={e => setTplTin(e.target.value)} placeholder="1XXXXXXXXX" className="input" /></div>
                <div className="field-group"><label className="field-label">Address</label><input type="text" value={tplAddress} onChange={e => setTplAddress(e.target.value)} placeholder="KG 360 ST 6, Kigali, Rwanda" className="input" /></div>
                <div className="field-group">
                  <label className="field-label">Accent colour</label>
                  <div className="flex gap-2">
                    {['#C1027D', '#8A0260', '#1B7A4D', '#C98A1B', '#2C3E50'].map(c => (
                      <div key={c} className={`iw-swatch ${tplSwatch === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setTplSwatch(c)} />
                    ))}
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Company stamp</label>
                  <div className="dropzone" onClick={() => stampInputRef.current?.click()}>
                    {stampData ? <div className="flex items-center gap-2 justify-center"><img src={stampData} alt="Stamp" className="h-8" /><span className="text-sm font-bold">Stamp uploaded</span></div> : <div className="text-sm font-bold">Click to upload your company stamp (PNG)</div>}
                  </div>
                  <input type="file" accept="image/*" ref={stampInputRef} className="hidden" onChange={e => handleUpload('stamp', e)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Authorized signature</label>
                  <div className="dropzone" onClick={() => sigInputRef.current?.click()}>
                    {signatureData ? <div className="flex items-center gap-2 justify-center"><img src={signatureData} alt="Signature" className="h-8" /><span className="text-sm font-bold">Signature uploaded</span></div> : <div className="text-sm font-bold">Click to upload a signature image (PNG)</div>}
                  </div>
                  <input type="file" accept="image/*" ref={sigInputRef} className="hidden" onChange={e => handleUpload('signature', e)} />
                </div>
                <div className="field-group"><label className="field-label">Footer note</label><input type="text" value={tplFooter} onChange={e => setTplFooter(e.target.value)} placeholder="Thank you for your business!" className="input" /></div>
                <button className="btn btn-primary btn-full mt-4" onClick={() => showToast('Template saved')}>Save Template</button>
              </div>
            </div>
            <div className="lg:sticky lg:top-20 self-start">
              <div className="tpl-preview bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="iw-logo-preview">{logoData ? <img src={logoData} alt="Logo" /> : 'LOGO'}</div>
                  <div className="font-extrabold text-lg">{tplName || 'Your Business Name'}</div>
                </div>
                <div className="iw-accent-line" style={{ background: tplSwatch }} />
                <div className="iw-doc-title">INVOICE</div>
                <div className="iw-meta-grid">
                  <div><div className="iw-meta-label">To</div><div className="iw-meta-strong">Golden Bakery Ltd</div><div className="iw-meta-sub">Account Number: —</div></div>
                  <div><div className="iw-meta-row"><span>Invoice Date</span><b>28 Jul 2026</b></div><div className="iw-meta-row"><span>Invoice Number</span><b>INV-2026-0001</b></div><div className="iw-meta-row"><span>Reference</span><b>PO-4412</b></div></div>
                  <div className="text-right"><div className="iw-meta-strong">{tplName || 'Your Business Name'}</div><div className="iw-meta-sub">TIN: {tplTin || '—'}</div><div className="iw-meta-sub">{tplAddress || 'Business address will appear here'}</div></div>
                </div>
                <table className="iw-doc-table">
                  <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Tax</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
                  <tbody>
                    <tr><td>Consulting Services</td><td>1.00</td><td>RWF 400,000</td><td>18%</td><td style={{ textAlign: 'right' }}>RWF 400,000</td></tr>
                    <tr><td>Logistics &amp; Delivery</td><td>1.00</td><td>RWF 150,000</td><td>18%</td><td style={{ textAlign: 'right' }}>RWF 150,000</td></tr>
                    <tr><td>Documentation Fee</td><td>1.00</td><td>RWF 20,000</td><td>Exempt</td><td style={{ textAlign: 'right' }}>RWF 20,000</td></tr>
                  </tbody>
                </table>
                <div className="iw-doc-totals">
                  <div className="iw-total-row"><span>Subtotal</span><span>RWF 570,000</span></div>
                  <div className="iw-total-row"><span>VAT (18%)</span><span>RWF 99,000</span></div>
                  <div className="iw-total-row grand"><span>Amount Due</span><span>RWF 669,000</span></div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-6">Please pay before Due Date: <b>25 Aug 2026</b></div>
                <div className="iw-sign-row">
                  <div className="iw-sign-block"><div className="iw-sign-for">For and on behalf of</div><div className="iw-sign-company">{tplName || 'Your Business Name'}</div><div className="iw-signature">{signatureData ? <img src={signatureData} alt="Signature" className="h-10" /> : 'Signed'}</div><div className="iw-sign-line" /><div className="iw-sign-label">Authorized Signature(s)</div></div>
                  <div className="iw-stamp"><div className="iw-stamp-ring" style={{ borderColor: tplSwatch, color: tplSwatch }}>
                    {stampData ? <img src={stampData} alt="Stamp" className="w-full h-full rounded-full p-1.5" /> : <><span>{initials}</span><small>OFFICIAL · APPROVED</small></>}
                  </div></div>
                </div>
                <div className="iw-preview-footer">{tplFooter || 'Thank you for your business!'}</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ INTEGRATIONS ═══════════════ */}
        {view === 'integrations' && (
          <>
            <div className="card mb-5">
              <h3 className="font-bold mb-4">RRA EBM connection</h3>
              <div className="flex items-center justify-between">
                <div><div className="font-bold text-sm">EBM device registration</div><div className="text-xs text-gray-400">Connected · Auto-submitting invoices for tax registration</div></div>
                <span className="badge success">Active</span>
              </div>
            </div>
            <h3 className="font-bold mb-4">Accounting integrations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="card">
                <div className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center font-extrabold text-sm mb-3">QB</div>
                <div className="font-bold mb-1">QuickBooks</div>
                <div className="text-xs text-gray-400 mb-4">Sync every invoice, payment, and client automatically into your QuickBooks ledger.</div>
                <button className="btn btn-primary btn-sm" onClick={() => showToast('Redirecting to QuickBooks authorization…')}>Connect</button>
              </div>
              <div className="card">
                <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center font-extrabold text-sm mb-3">X</div>
                <div className="font-bold mb-1">Xero</div>
                <div className="text-xs text-gray-400 mb-4">Two-way sync of invoices and payment status with your Xero organisation.</div>
                <button className="btn btn-outline btn-sm" disabled>Coming soon</button>
              </div>
              <div className="card">
                <div className="w-9 h-9 rounded-lg bg-green-400 text-white flex items-center justify-center font-extrabold text-sm mb-3">S</div>
                <div className="font-bold mb-1">Sage</div>
                <div className="text-xs text-gray-400 mb-4">Export invoices and receipts directly into Sage Business Cloud Accounting.</div>
                <button className="btn btn-outline btn-sm" disabled>Coming soon</button>
              </div>
            </div>
            <div className="card mt-5">
              <h3 className="font-bold mb-4">API access</h3>
              <p className="text-sm text-gray-500 mb-4">Use the same API that powers Invoice Wizard to push invoices into any custom accounting system.</p>
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">cURL</span>
                  <button className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full hover:bg-white/20" onClick={() => { navigator.clipboard.writeText('curl https://api.yoinfo.africa/v1/invoices -H "Authorization: Bearer YOUR_API_KEY" -d client="Golden Bakery Ltd" -d amount=118000'); showToast('Copied'); }}>Copy</button>
                </div>
                <pre className="text-xs text-gray-200 p-4 overflow-x-auto font-mono">curl https://api.yoinfo.africa/v1/invoices \<br />  -H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />  -d client=&quot;Golden Bakery Ltd&quot; -d amount=118000</pre>
              </div>
            </div>
          </>
        )}

        {/* ── Toast ──────────────────────────────── */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3D0231] text-white font-bold px-5 py-3 rounded-xl shadow-lg z-50 animate-fade-in-up">
            {toast}
          </div>
        )}
      </ToolLayout>
    </ProtectedRoute>
  );
}

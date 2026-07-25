'use client';

import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ToolLayout from '@/components/tool-layout';
import ProtectedRoute from '@/components/protected-route';
import { sendMessage, fetchCampaigns } from '@/lib/api';

const TOOL_NAV = [
  { label: 'Dashboard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { label: 'Investments', href: '/investments', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' },
];

const CAMPAIGN_STEPS = ['Contacts', 'Channels', 'Message', 'Review'];

type View = 'dashboard' | 'new-campaign' | 'campaigns' | 'contacts' | 'templates' | 'settings';

export default function MessagingDashboard() {
  const [view, setView] = useState<View>('dashboard');
  const [step, setStep] = useState(0);

  // Contacts
  const [contacts, setContacts] = useState<{ name: string; phone: string; email: string }[]>([]);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Messages (channel-aware)
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');

  // Channels
  const [channels, setChannels] = useState({ whatsapp: false, email: true, sms: false });

  // Sending
  const [isSending, setIsSending] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Campaigns (fetched from backend)
  const [campaigns, setCampaigns] = useState<{ id: string; name: string; status: string; recipients: number; channels: string[]; date: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCampaigns(token)
        .then((data) => {
          const mapped = (data || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            status: c.status?.toLowerCase() || 'sent',
            recipients: c.recipients || 0,
            channels: Array.isArray(c.channels) ? c.channels : [],
            date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          }));
          setCampaigns(mapped);
        })
        .catch(() => {});
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (!rows.length) return;

        const findKey = (row: any, candidates: string[]) => {
          const keys = Object.keys(row);
          for (const c of candidates) {
            const hit = keys.find(k => k.toLowerCase().trim() === c);
            if (hit) return hit;
          }
          return null;
        };

        const nameKey = findKey(rows[0], ['name', 'full name', 'contact']);
        const phoneKey = findKey(rows[0], ['phone', 'telephone', 'mobile', 'whatsapp']);
        const emailKey = findKey(rows[0], ['email', 'e-mail']);

        const parsed = rows.map((r: any) => ({
          name: nameKey ? String(r[nameKey] || '').trim() : '',
          phone: phoneKey ? String(r[phoneKey] || '').trim() : '',
          email: emailKey ? String(r[emailKey] || '').trim() : '',
        }));
        setContacts(parsed);
      } catch {
        alert('Could not read file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualAdd = () => {
    if (!addName || (!addPhone && !addEmail)) return;
    setContacts(prev => [...prev, { name: addName, phone: addPhone, email: addEmail }]);
    setAddName(''); setAddPhone(''); setAddEmail('');
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to send campaigns.');
        return;
      }
      const activeChannels = Object.entries(channels).filter(([, v]) => v).map(([k]) => k.toUpperCase());
      await sendMessage(token, {
        name: campaignName,
        emailSubject,
        emailMessage,
        smsMessage,
        whatsappMessage,
        contacts,
        channels: activeChannels,
        cost: contacts.length * 20,
      });
      setShowPaymentModal(false);
      setSendSuccess(true);
      // Refresh campaigns list
      fetchCampaigns(token)
        .then((data) => {
          const mapped = (data || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            status: c.status?.toLowerCase() || 'sent',
            recipients: c.recipients || 0,
            channels: Array.isArray(c.channels) ? c.channels : [],
            date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
          }));
          setCampaigns(mapped);
        })
        .catch(() => {});
      setTimeout(() => { setSendSuccess(false); setView('dashboard'); resetForm(); }, 2000);
    } catch (err: any) {
      alert(err.message || 'Error sending campaign');
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setContacts([]); setEmailSubject(''); setEmailMessage(''); setSmsMessage(''); setWhatsappMessage(''); setCampaignName('');
    setChannels({ whatsapp: false, email: true, sms: false });
    setStep(0); setAgreedToTerms(false);
  };

  const cost = contacts.length * 20;

  return (
    <ProtectedRoute>
      <ToolLayout
        title="Blast Wizard"
        subtitle="Upload contacts, write once — send everywhere."
        navItems={TOOL_NAV}
      >
        {/* ── Sidebar Nav for Views ──────────────────────── */}
        <div className="flex gap-6">
          <div className="w-48 flex-shrink-0 hidden lg:block">
            <nav className="space-y-1">
              {([
                { id: 'dashboard' as View, label: 'Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z' },
                { id: 'new-campaign' as View, label: 'New Campaign', icon: 'M12 4.5v15m7.5-7.5h-15' },
                { id: 'campaigns' as View, label: 'Campaigns', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                { id: 'contacts' as View, label: 'Contacts', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                { id: 'templates' as View, label: 'Templates', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                { id: 'settings' as View, label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
              ]).map(item => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); if (item.id === 'new-campaign') { resetForm(); setStep(0); } }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    view === item.id
                      ? 'bg-[#C1027D]/10 text-[#C1027D]'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Main Content Area ─────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ═══ DASHBOARD ═══ */}
            {view === 'dashboard' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Messages', value: '12.5K', sub: '+2.1K this month', color: 'from-[#C1027D] to-[#8A0260]', icon: '✉️' },
                    { label: 'Channels', value: '3', sub: 'Email, SMS, WhatsApp', color: 'from-[#E97BC4] to-[#C1027D]', icon: '📡' },
                    { label: 'Active', value: '24', sub: 'Running campaigns', color: 'from-[#D93F9E] to-[#C1027D]', icon: '⚡' },
                    { label: 'Spend', value: '$480', sub: 'This month', color: 'from-[#8A0260] to-[#3D0231]', icon: '💰' },
                  ].map(stat => (
                    <div key={stat.label} className="stat-card">
                      <div className={`stat-icon bg-gradient-to-br ${stat.color} text-white text-base`}>{stat.icon}</div>
                      <div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Campaigns */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Recent Campaigns</h3>
                    <button onClick={() => setView('campaigns')} className="text-sm font-semibold text-[#C1027D] hover:text-[#8A0260]">View All</button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Campaign</th>
                          <th>Status</th>
                          <th>Recipients</th>
                          <th>Channels</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map(c => (
                          <tr key={c.id}>
                            <td className="font-semibold text-gray-900">{c.name}</td>
                            <td><span className={`badge ${c.status === 'sent' ? 'success' : 'info'}`}>{c.status}</span></td>
                            <td>{c.recipients.toLocaleString()}</td>
                            <td>{c.channels.join(', ') || '—'}</td>
                            <td className="text-gray-400">{c.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button onClick={() => { setView('new-campaign'); resetForm(); setStep(0); }} className="btn btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New Campaign
                </button>
              </div>
            )}

            {/* ═══ NEW CAMPAIGN ═══ */}
            {view === 'new-campaign' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Step Indicators */}
                <div className="flex items-center gap-2">
                  {CAMPAIGN_STEPS.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i < step ? 'bg-[#C1027D] text-white' : i === step ? 'bg-[#C1027D] text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className={`text-sm font-semibold ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                      {i < CAMPAIGN_STEPS.length - 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                    </div>
                  ))}
                </div>

                {/* Step: Contacts */}
                {step === 0 && (
                  <div className="card space-y-5">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Add Contacts</h3>
                      <p className="text-sm text-gray-400">Manually add contacts or upload a CSV/Excel file.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" placeholder="Name" value={addName} onChange={e => setAddName(e.target.value)} className="input" />
                      <input type="tel" placeholder="Phone" value={addPhone} onChange={e => setAddPhone(e.target.value)} className="input" />
                      <input type="email" placeholder="Email" value={addEmail} onChange={e => setAddEmail(e.target.value)} className="input" />
                    </div>
                    <button onClick={handleManualAdd} className="btn btn-outline text-sm">Add Contact</button>

                    <div className="text-center text-xs text-gray-400 font-bold">OR</div>

                    <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
                      <div className="font-semibold text-sm text-gray-600">Click to browse Excel/CSV</div>
                      <input type="file" ref={fileInputRef} hidden accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
                    </div>

                    {contacts.length > 0 && (
                      <div className="text-sm font-bold text-[#C1027D]">
                        Loaded {contacts.length} contacts
                        <div className="mt-2 max-h-32 overflow-y-auto">
                          {contacts.slice(0, 5).map((c, i) => (
                            <div key={i} className="text-xs text-gray-500 font-normal">{c.name} — {c.phone || c.email}</div>
                          ))}
                          {contacts.length > 5 && <div className="text-xs text-gray-400">...and {contacts.length - 5} more</div>}
                        </div>
                      </div>
                    )}

                    <button onClick={() => setStep(1)} disabled={contacts.length === 0} className="btn btn-primary w-full disabled:opacity-40">
                      Continue
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Step: Channels (step 1 — chosen before composing) */}
                {step === 1 && (
                  <div className="card space-y-5">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Select Channels</h3>
                      <p className="text-sm text-gray-400">Choose where to send your message. Each channel has different content limits.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(['email', 'sms', 'whatsapp'] as const).map(ch => (
                        <button
                          key={ch}
                          onClick={() => setChannels(prev => ({ ...prev, [ch]: !prev[ch] }))}
                          className={`chip ${channels[ch] ? 'active' : ''}`}
                        >
                          <span className="dot" />
                          {ch.charAt(0).toUpperCase() + ch.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Channel capability hints */}
                    <div className="space-y-2">
                      {channels.email && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <svg className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          <span><strong>Email:</strong> Supports long content, rich text, PDF letters, and document links. No character limit.</span>
                        </div>
                      )}
                      {channels.sms && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-3">
                          <svg className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                          </svg>
                          <span><strong>SMS:</strong> Limited to 160 characters per segment. Keep it short — use a link for full details. Longer messages cost more.</span>
                        </div>
                      )}
                      {channels.whatsapp && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-green-50 border border-green-100 rounded-lg p-3">
                          <svg className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                          </svg>
                          <span><strong>WhatsApp:</strong> Supports rich text, images, and documents up to ~1024 characters.</span>
                        </div>
                      )}
                      {!channels.email && !channels.sms && !channels.whatsapp && (
                        <p className="text-sm text-red-500">Select at least one channel to continue.</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(0)} className="btn btn-outline flex-1">Back</button>
                      <button
                        onClick={() => setStep(2)}
                        disabled={!channels.email && !channels.sms && !channels.whatsapp}
                        className="btn btn-primary flex-[2] disabled:opacity-40"
                      >
                        Compose Message
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step: Message (step 2 — channel-aware composition) */}
                {step === 2 && (
                  <div className="space-y-5">
                    {/* Campaign Name */}
                    <div className="card">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Name</label>
                      <input type="text" placeholder="e.g. July Newsletter" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="input" />
                    </div>

                    {/* Email composer */}
                    {channels.email && (
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">Email Message</h3>
                            <p className="text-xs text-gray-400">Long content, rich text, documents & PDFs supported</p>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Email subject line"
                          value={emailSubject}
                          onChange={e => setEmailSubject(e.target.value)}
                          className="input"
                        />
                        <textarea
                          placeholder="Hi {name}, here is our latest update...&#10;&#10;You can write a detailed message, include document links, or attach a PDF letter."
                          value={emailMessage}
                          onChange={e => setEmailMessage(e.target.value)}
                          className="textarea min-h-[180px]"
                        />
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{emailMessage.length.toLocaleString()} characters — no limit</span>
                          <span>Use {'{name}'} for personalization</span>
                        </div>
                      </div>
                    )}

                    {/* SMS composer */}
                    {channels.sms && (
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">SMS Message</h3>
                            <p className="text-xs text-gray-400">Short text — 160 chars per segment</p>
                          </div>
                        </div>
                        <textarea
                          placeholder="Hi {name}, check out our offer: https://yoinfo.com/go"
                          value={smsMessage}
                          onChange={e => setSmsMessage(e.target.value)}
                          className="textarea min-h-[100px]"
                          maxLength={480}
                        />
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${smsMessage.length > 160 ? 'text-red-500' : smsMessage.length > 140 ? 'text-amber-500' : 'text-gray-400'}`}>
                              {smsMessage.length} / 160 characters
                            </span>
                            {smsMessage.length > 160 && (
                              <span className="text-red-500 font-semibold">
                                Will be sent as {Math.ceil(smsMessage.length / 160)} SMS segments
                              </span>
                            )}
                          </div>
                          <div className="progress">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min((smsMessage.length / 160) * 100, 100)}%`,
                                background: smsMessage.length > 160
                                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                                  : undefined,
                              }}
                            />
                          </div>
                          {smsMessage.length > 140 && smsMessage.length <= 160 && (
                            <p className="text-xs text-amber-500">Approaching limit — consider adding a link instead</p>
                          )}
                          {smsMessage.length > 160 && (
                            <p className="text-xs text-red-500">Over limit — each 160 chars = 1 extra SMS segment (extra cost)</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* WhatsApp composer */}
                    {channels.whatsapp && (
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">WhatsApp Message</h3>
                            <p className="text-xs text-gray-400">Rich text, images, documents — up to ~1024 chars</p>
                          </div>
                        </div>
                        <textarea
                          placeholder="Hi {name}, here is our latest offer with details..."
                          value={whatsappMessage}
                          onChange={e => setWhatsappMessage(e.target.value)}
                          className="textarea min-h-[120px]"
                          maxLength={1024}
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${whatsappMessage.length > 1024 ? 'text-red-500' : whatsappMessage.length > 900 ? 'text-amber-500' : 'text-gray-400'}`}>
                            {whatsappMessage.length} / 1024 characters
                          </span>
                          <span className="text-gray-400">Use {'{name}'} for personalization</span>
                        </div>
                      </div>
                    )}

                    {/* Preview for email */}
                    {channels.email && emailMessage && (
                      <div className="card">
                        <div className="section-heading mb-3">Email Preview</div>
                        <div className="email-preview">
                          <div className="email-header">
                            <strong>From:</strong> yoInfo Campaign &lt;noreply@yoinfo.com&gt;
                            <br /><strong>Subject:</strong> {emailSubject || campaignName || 'Your Campaign'}
                          </div>
                          <div className="email-body">
                            {emailMessage.replace('{name}', contacts[0]?.name || 'John').replace('{phone}', contacts[0]?.phone || '+250 7XX XXX XXX')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview for SMS */}
                    {channels.sms && smsMessage && (
                      <div className="card">
                        <div className="section-heading mb-3">SMS Preview</div>
                        <div className="phone-preview">
                          <div className="phone-screen">
                            <div className="phone-header">yoInfo SMS</div>
                            <div className="phone-body">
                              {smsMessage.replace('{name}', contacts[0]?.name || 'John').replace('{phone}', contacts[0]?.phone || '+250 7XX XXX XXX')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn btn-outline flex-1">Back</button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={
                          (channels.email && !emailMessage.trim()) ||
                          (channels.sms && !smsMessage.trim()) ||
                          (channels.whatsapp && !whatsappMessage.trim()) ||
                          (!channels.email && !channels.sms && !channels.whatsapp)
                        }
                        className="btn btn-primary flex-[2] disabled:opacity-40"
                      >
                        Review & Send
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step: Review (step 3) */}
                {step === 3 && (
                  <div className="card space-y-5">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Review Campaign</h3>
                      <p className="text-sm text-gray-400">Everything look good? Hit send!</p>
                    </div>

                    <div className="bg-[#FDF4FA] rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Campaign Name</span>
                        <span className="font-semibold text-gray-900">{campaignName || 'Untitled'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Recipients</span>
                        <span className="font-semibold text-gray-900">{contacts.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Channels</span>
                        <span className="font-semibold text-gray-900">
                          {Object.entries(channels).filter(([, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Estimated Cost</span>
                        <span className="font-bold text-[#C1027D]">{cost.toLocaleString()} RWF</span>
                      </div>
                    </div>

                    {/* Per-channel content preview */}
                    {channels.email && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="section-heading text-blue-600">Email Content</div>
                        <div className="text-xs text-gray-500 mb-1">Subject: <span className="font-semibold text-gray-700">{emailSubject || campaignName || 'Untitled'}</span></div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{emailMessage}</p>
                      </div>
                    )}

                    {channels.sms && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="section-heading text-amber-600">SMS Content</div>
                        <div className="text-xs text-gray-500 mb-1">
                          {smsMessage.length} chars
                          {smsMessage.length > 160 && <span className="text-red-500"> — {Math.ceil(smsMessage.length / 160)} segments</span>}
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{smsMessage}</p>
                      </div>
                    )}

                    {channels.whatsapp && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="section-heading text-green-600">WhatsApp Content</div>
                        <div className="text-xs text-gray-500 mb-1">{whatsappMessage.length} chars</div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{whatsappMessage}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="btn btn-outline flex-1">Back</button>
                      <button onClick={() => setShowPaymentModal(true)} className="btn btn-primary flex-[2]">
                        Send Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ CAMPAIGNS LIST ═══ */}
            {view === 'campaigns' && (
              <div className="space-y-4 animate-fade-in-up">
                <h3 className="font-bold text-gray-900">All Campaigns</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Campaign</th><th>Status</th><th>Recipients</th><th>Channels</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {campaigns.map(c => (
                        <tr key={c.id}>
                          <td className="font-semibold text-gray-900">{c.name}</td>
                          <td><span className={`badge ${c.status === 'sent' ? 'success' : 'info'}`}>{c.status}</span></td>
                          <td>{c.recipients.toLocaleString()}</td>
                          <td>{c.channels.join(', ') || '—'}</td>
                          <td className="text-gray-400">{c.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══ CONTACTS ═══ */}
            {view === 'contacts' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Contact Lists</h3>
                  <button className="btn btn-primary text-sm py-2 px-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New List
                  </button>
                </div>
                <div className="card text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">No contact lists yet</h3>
                  <p className="text-sm text-gray-400">Create a new campaign to add contacts.</p>
                </div>
              </div>
            )}

            {/* ═══ TEMPLATES ═══ */}
            {view === 'templates' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Message Templates</h3>
                  <button className="btn btn-primary text-sm py-2 px-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Template
                  </button>
                </div>
                <div className="card text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">No templates yet</h3>
                  <p className="text-sm text-gray-400">Create reusable message templates for your campaigns.</p>
                </div>
              </div>
            )}

            {/* ═══ SETTINGS ═══ */}
            {view === 'settings' && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="font-bold text-gray-900">Blast Settings</h3>
                <div className="card space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sender Name</label>
                    <input type="text" placeholder="yoInfo Campaigns" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reply-to Email</label>
                    <input type="email" placeholder="reply@yoinfo.com" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Default Signature</label>
                    <textarea placeholder="Sent via yoInfo" className="textarea" rows={3} />
                  </div>
                  <button className="btn btn-primary">Save Settings</button>
                </div>

                <div className="card">
                  <h4 className="font-bold text-gray-900 mb-2">Credits</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">Available Credits</span>
                    <span className="text-lg font-bold text-[#C1027D]">5,240</span>
                  </div>
                  <button className="btn btn-outline w-full">Buy More Credits</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Payment Modal ──────────────────────────────── */}
        {showPaymentModal && (
          <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Confirm Payment</h3>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-[#FDF4FA] rounded-xl p-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Campaign</span>
                  <span className="font-semibold">{campaignName || 'Untitled'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Recipients</span>
                  <span className="font-semibold">{contacts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Channels</span>
                  <span className="font-semibold">
                    {Object.entries(channels).filter(([, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
                  </span>
                </div>
                <div className="border-t border-[#f0e4ec] pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-[#C1027D] text-lg">{cost.toLocaleString()} RWF</span>
                </div>
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-[#f0e4ec] text-[#C1027D] focus:ring-[#C1027D]" />
                <span className="text-sm text-gray-500">I confirm the message content and recipients are correct. I agree to the terms of service.</span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="btn btn-outline flex-1">Cancel</button>
                <button
                  onClick={handleSend}
                  disabled={!agreedToTerms || isSending}
                  className="btn btn-primary flex-[2] disabled:opacity-40"
                >
                  {isSending ? 'Sending...' : 'Pay & Send'}
                  {!isSending && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Success Toast ──────────────────────────────── */}
        {sendSuccess && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#C1027D] text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-sm animate-fade-in-up z-50">
            Campaign sent successfully!
          </div>
        )}
      </ToolLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import ProtectedRoute from '@/components/protected-route';
import { sendMessage, fetchCampaigns, fetchCampaign, resendCampaign, updateCampaignContacts, uploadAttachment } from '@/lib/api';
import { API_URL } from '@/lib/config';

const CAMPAIGN_STEPS = ['Contacts', 'Channels', 'Message', 'Review'];

type View = 'dashboard' | 'new-campaign' | 'campaigns' | 'contacts' | 'templates' | 'settings';

const CAMPAIGNS_PER_PAGE = 5;

function CampaignPagination({ totalPages, page, setPage }: { totalPages: number; page: number; setPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
      <div className="flex gap-1.5">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
              p === page ? 'bg-[#C1027D] text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

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
  const [resendCampaignId, setResendCampaignId] = useState<string | null>(null);

  // File link
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  // Campaigns (fetched from backend)
  const [campaigns, setCampaigns] = useState<{ id: string; name: string; status: string; recipients: number; channels: string[]; date: string }[]>([]);
  const [fullCampaigns, setFullCampaigns] = useState<any[]>([]);
  const [campaignsPage, setCampaignsPage] = useState(1);

  // Contacts tab
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<{ campaignId: string; index: number } | null>(null);
  const [editContactName, setEditContactName] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [addContactName, setAddContactName] = useState('');
  const [addContactPhone, setAddContactPhone] = useState('');
  const [addContactEmail, setAddContactEmail] = useState('');
  const [showAddContact, setShowAddContact] = useState<string | null>(null);
  const [isSavingContacts, setIsSavingContacts] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Derived stats from real campaign data
  const totalCampaigns = campaigns.length;
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'active' || c.status === 'running').length;
  const allChannels = [...new Set(campaigns.flatMap(c => c.channels))];

  const campaignsTotalPages = Math.max(1, Math.ceil(campaigns.length / CAMPAIGNS_PER_PAGE));
  const campaignsPageData = campaigns.slice((campaignsPage - 1) * CAMPAIGNS_PER_PAGE, campaignsPage * CAMPAIGNS_PER_PAGE);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCampaigns(token)
        .then((data) => {
          setFullCampaigns(data || []);
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
        showToast('Could not read file', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualAdd = () => {
    if (!addName || (!addPhone && !addEmail)) return;
    setContacts(prev => [...prev, { name: addName, phone: addPhone, email: addEmail }]);
    setAddName(''); setAddPhone(''); setAddEmail('');
  };

  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUploadForLink = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsUploadingFile(true);
    try {
      const result = await uploadAttachment(token, file);
      setFileUrl(result.url);
      setFileName(file.name);
      showToast('File uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload file', 'error');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const removeFileLink = () => {
    setFileUrl('');
    setFileName('');
    if (fileUploadRef.current) fileUploadRef.current.value = '';
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('You must be logged in to send campaigns.', 'error');
        return;
      }
      const activeChannels = Object.entries(channels).filter(([, v]) => v).map(([k]) => k.toUpperCase());
      const fileLink = fileUrl ? `\n\nDownload file: ${API_URL}${fileUrl}` : '';

      if (resendCampaignId) {
        await resendCampaign(token, resendCampaignId, {
          emailSubject,
          emailMessage: emailMessage + fileLink,
          smsMessage,
          whatsappMessage,
          channels: activeChannels,
          cost: contacts.length * 20,
        });
      } else {
        await sendMessage(token, {
          name: campaignName,
          emailSubject,
          emailMessage: emailMessage + fileLink,
          smsMessage,
          whatsappMessage,
          contacts,
          channels: activeChannels,
          cost: contacts.length * 20,
        });
      }
      setShowPaymentModal(false);
      setSendSuccess(true);
      fetchCampaigns(token)
        .then((data) => {
          setFullCampaigns(data || []);
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
      showToast(err.message || 'Error sending campaign', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setContacts([]); setEmailSubject(''); setEmailMessage(''); setSmsMessage(''); setWhatsappMessage(''); setCampaignName('');
    setChannels({ whatsapp: false, email: true, sms: false });
    setStep(0); setAgreedToTerms(false); removeFileLink(); setResendCampaignId(null);
  };

  const refreshCampaigns = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetchCampaigns(token)
      .then((data) => {
        setFullCampaigns(data || []);
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
  };

  const saveContacts = async (campaignId: string, updatedContacts: { name: string; phone: string; email: string }[]) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsSavingContacts(true);
    try {
      await updateCampaignContacts(token, campaignId, updatedContacts);
      refreshCampaigns();
      showToast('Contacts updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save contacts', 'error');
    } finally {
      setIsSavingContacts(false);
    }
  };

  const handleResend = async (campaignId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const campaign = await fetchCampaign(token, campaignId);
      const savedContacts = Array.isArray(campaign.contacts) ? campaign.contacts : [];
      setCampaignName(`${campaign.name} (resend)`);
      setContacts(savedContacts);
      setEmailSubject(campaign.emailSubject || '');
      setEmailMessage(campaign.emailMessage || '');
      setSmsMessage(campaign.smsMessage || '');
      setWhatsappMessage(campaign.whatsappMessage || '');
      setChannels({
        email: (campaign.channels || []).includes('EMAIL'),
        sms: (campaign.channels || []).includes('SMS'),
        whatsapp: (campaign.channels || []).includes('WHATSAPP'),
      });
      setResendCampaignId(campaignId);
      setStep(2);
      setView('new-campaign');
    } catch (err: any) {
      showToast(err.message || 'Failed to load campaign', 'error');
    }
  };

  const cost = contacts.length * 20;

  return (
    <ProtectedRoute>
      <div className="app">
        <aside className="sidebar">
          <div className="wizard-nav-row">
            <Link href="/" className="wizard-nav-btn">← Back</Link>
            <Link href="/" className="wizard-nav-btn">⌂ Home</Link>
          </div>
          <div className="brand">
            <div className="brand-mark">R</div>
            <div><div className="brand-name">Blast Wizard</div><div className="brand-sub">Email, SMS &amp; WhatsApp Marketing</div></div>
          </div>
          <nav>
            {(['dashboard','campaigns','contacts','templates','settings'] as View[]).map(id => (
              <div key={id} className={`nav-item${view === id ? ' active' : ''}`} onClick={() => { setView(id); if (id === 'new-campaign') { resetForm(); setStep(0); } if (id === 'campaigns') setCampaignsPage(1); }}>
                <span className="nav-dot" /> {id.charAt(0).toUpperCase() + id.slice(1)}
              </div>
            ))}
            <div className={`nav-item${view === 'new-campaign' ? ' active' : ''}`} onClick={() => { setView('new-campaign'); resetForm(); setStep(0); }}>
              <span className="nav-dot" /> New Campaign
            </div>
          </nav>
          <div className="sidebar-foot">Sends via WhatsApp, Email &amp; SMS from one list, one message. Pay as you go, in RWF.</div>
        </aside>

        <main>
          <div className="topbar">
            <div>
              <h1>{view === 'new-campaign' ? 'New campaign' : view === 'campaigns' ? 'Campaigns' : view === 'contacts' ? 'Contacts' : view === 'templates' ? 'Templates' : view === 'settings' ? 'Settings' : 'Dashboard'}</h1>
              <p>{view === 'new-campaign' ? 'Upload your contacts, pick your channels, write once — send everywhere.' : 'Email, SMS & WhatsApp Marketing'}</p>
            </div>
          </div>

          {/* ── Main Content Area ─────────────────────────── */}

            {/* ═══ DASHBOARD ═══ */}
            {view === 'dashboard' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C1027D] via-[#A0026E] to-[#6B0148] p-6 lg:p-8 text-white">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Blast Wizard</p>
                    <h2 className="text-xl lg:text-2xl font-bold mb-2">Send smarter, reach faster.</h2>
                    <p className="text-white/70 text-sm max-w-md mb-5">Upload contacts, compose once, and blast across Email, SMS & WhatsApp — all from one place.</p>
                    <button
                      onClick={() => { setView('new-campaign'); resetForm(); setStep(0); }}
                      className="inline-flex items-center gap-2 bg-white text-[#C1027D] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg shadow-black/10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      New Campaign
                    </button>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {[
                    { label: 'Campaigns', value: totalCampaigns.toLocaleString(), sub: `${activeCampaigns} active`, color: 'from-[#C1027D] to-[#8A0260]' },
                    { label: 'Channels', value: String(allChannels.length || 3), sub: allChannels.length ? allChannels.join(', ') : 'Email, SMS, WhatsApp', color: 'from-[#E97BC4] to-[#C1027D]' },
                    { label: 'Recipients', value: totalRecipients.toLocaleString(), sub: 'Total reached', color: 'from-[#D93F9E] to-[#C1027D]' },
                    { label: 'Est. Spend', value: `${(totalRecipients * 20).toLocaleString()}`, sub: 'RWF total', color: 'from-[#8A0260] to-[#3D0231]' },
                  ].map((stat, i) => (
                    <div key={stat.label} className="group relative bg-white border border-[#f0e4ec] rounded-2xl p-4 lg:p-5 hover:shadow-lg hover:shadow-[#C1027D]/5 hover:border-[#C1027D]/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shadow-[#C1027D]/15`}>
                          {i === 0 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>}
                          {i === 1 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
                          {i === 2 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                          {i === 3 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Campaigns */}
                <div className="bg-white border border-[#f0e4ec] rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e4ec]">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Recent Campaigns</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{campaigns.length} total</p>
                    </div>
                    <button onClick={() => { setView('campaigns'); setCampaignsPage(1); }} className="text-xs font-semibold text-[#C1027D] hover:text-[#8A0260] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#FDF4FA]">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#f0e4ec]">
                          <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Campaign</th>
                          <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                          <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Recipients</th>
                          <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Channels</th>
                          <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Date</th>
                          <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaignsPageData.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#FDF4FA] flex items-center justify-center">
                                  <svg className="w-6 h-6 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                                  </svg>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-semibold text-gray-700">No campaigns yet</p>
                                  <p className="text-xs text-gray-400 mt-0.5">Create your first campaign to get started</p>
                                </div>
                                <button onClick={() => { setView('new-campaign'); resetForm(); setStep(0); }} className="text-xs font-semibold text-[#C1027D] hover:text-[#8A0260] transition-colors mt-1">
                                  Create Campaign →
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          campaignsPageData.map((c, i) => (
                            <tr key={c.id} className={`hover:bg-[#FDF4FA]/50 transition-colors ${i < campaignsPageData.length - 1 ? 'border-b border-[#f0e4ec]/50' : ''}`}>
                              <td className="px-5 py-3.5">
                                <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${c.status === 'sent' ? 'bg-emerald-50 text-emerald-700' : c.status === 'active' || c.status === 'running' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'sent' ? 'bg-emerald-500' : c.status === 'active' || c.status === 'running' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                  {c.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-gray-600">{c.recipients.toLocaleString()}</td>
                              <td className="px-5 py-3.5">
                                <div className="flex gap-1">
                                  {c.channels.map(ch => (
                                    <span key={ch} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                      ch === 'EMAIL' ? 'bg-blue-50 text-blue-600' : ch === 'SMS' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                                    }`}>{ch}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-400">{c.date}</td>
                              <td className="px-5 py-3.5">
                                <button
                                  onClick={() => handleResend(c.id)}
                                  className="text-xs font-semibold text-[#C1027D] hover:text-[#8A0260] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#FDF4FA] border border-[#f0e4ec]"
                                >
                                  Resend
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <CampaignPagination totalPages={campaignsTotalPages} page={campaignsPage} setPage={setCampaignsPage} />
                </div>
              </div>
            )}

            {/* ═══ NEW CAMPAIGN ═══ */}
            {view === 'new-campaign' && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Step Indicators */}
                {/* <div className="flex items-center gap-2">
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
                </div> */}

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
                        <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                          {contacts.slice(0, 10).map((c, i) => (
                            <div key={i} className="flex items-center justify-between text-xs text-gray-500 font-normal py-1 px-2 rounded hover:bg-gray-50">
                              <span>{c.name || 'Unnamed'} — {c.phone || c.email}</span>
                              <button onClick={() => removeContact(i)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          {contacts.length > 10 && <div className="text-xs text-gray-400 pl-2">...and {contacts.length - 10} more</div>}
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

                    {/* File Link */}
                    {/* <div className="card space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">Attach a File (Optional)</h3>
                          <p className="text-xs text-gray-400">Upload a file and a download link will be included in the email</p>
                        </div>
                      </div>

                      {!fileUrl ? (
                        <div
                          className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-indigo-300 transition-colors cursor-pointer"
                          onClick={() => fileUploadRef.current?.click()}
                        >
                          <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                          </svg>
                          <p className="text-sm font-semibold text-gray-600">
                            {isUploadingFile ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Uploading...
                              </span>
                            ) : 'Click to upload a file'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, CSV, images — up to 25MB</p>
                          <input
                            type="file"
                            ref={fileUploadRef}
                            hidden
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileUploadForLink}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{fileName}</p>
                            <p className="text-xs text-indigo-600">Link generated and will be included in message</p>
                          </div>
                          <button onClick={removeFileLink} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div> */}

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
                      {fileUrl && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Attachment</span>
                          <span className="font-semibold text-[#C1027D] truncate ml-4 max-w-[200px]">{fileName} <span className="text-xs text-gray-400">(email only)</span></span>
                        </div>
                      )}
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
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{emailMessage}{fileUrl ? `\n\nDownload file: ${API_URL}${fileUrl}` : ''}</p>
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
                      <button onClick={handleSend} className="btn btn-primary flex-[2]" disabled={isSending}>
                        {isSending ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Sending...
                          </span>
                        ) : 'Send Now'}
                        {!isSending && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                        )}
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
                      <tr><th>Campaign</th><th>Status</th><th>Recipients</th><th>Channels</th><th>Date</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {campaignsPageData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No campaigns found.</td>
                        </tr>
                      ) : (
                        campaignsPageData.map(c => (
                          <tr key={c.id}>
                            <td className="font-semibold text-gray-900">{c.name}</td>
                            <td><span className={`badge ${c.status === 'sent' ? 'success' : 'info'}`}>{c.status}</span></td>
                            <td>{c.recipients.toLocaleString()}</td>
                            <td>{c.channels.join(', ') || '—'}</td>
                            <td className="text-gray-400">{c.date}</td>
                            <td>
                              <button
                                onClick={() => handleResend(c.id)}
                                className="text-xs font-semibold text-[#C1027D] hover:text-[#8A0260] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#FDF4FA] border border-[#f0e4ec]"
                              >
                                Resend
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <CampaignPagination totalPages={campaignsTotalPages} page={campaignsPage} setPage={setCampaignsPage} />
              </div>
            )}

            {/* ═══ CONTACTS ═══ */}
            {view === 'contacts' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">Saved Contacts</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Contacts saved from your campaigns. Click a campaign to view and edit.</p>
                  </div>
                </div>

                {fullCampaigns.filter(c => Array.isArray(c.contacts) && c.contacts.length > 0).length === 0 ? (
                  <div className="card text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">No saved contacts yet</h3>
                    <p className="text-sm text-gray-400">Send a campaign to automatically save its contacts here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fullCampaigns.filter(c => Array.isArray(c.contacts) && c.contacts.length > 0).map((campaign) => {
                      const isExpanded = expandedCampaignId === campaign.id;
                      const campaignContacts: any[] = Array.isArray(campaign.contacts) ? campaign.contacts : [];
                      return (
                        <div key={campaign.id} className="bg-white border border-[#f0e4ec] rounded-2xl overflow-hidden">
                          {/* Campaign header */}
                          <button
                            onClick={() => setExpandedCampaignId(isExpanded ? null : campaign.id)}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FDF4FA]/50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#C1027D] text-white' : 'bg-[#FDF4FA] text-[#C1027D]'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-sm font-bold text-gray-900">{campaign.name}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-400">{campaignContacts.length} contacts</span>
                                  <span className="text-xs text-gray-300">|</span>
                                  <span className="text-xs text-gray-400">{new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                              </div>
                            </div>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>

                          {/* Expanded contacts table */}
                          {isExpanded && (
                            <div className="border-t border-[#f0e4ec]">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-gray-50/50">
                                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Name</th>
                                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Phone</th>
                                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Email</th>
                                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-2.5">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {campaignContacts.map((contact: any, idx: number) => (
                                      <tr key={idx} className={`border-t border-[#f0e4ec]/50 ${editingContact?.campaignId === campaign.id && editingContact?.index === idx ? 'bg-[#FDF4FA]' : 'hover:bg-gray-50/50'}`}>
                                        <td className="px-5 py-2.5">
                                          {editingContact?.campaignId === campaign.id && editingContact?.index === idx ? (
                                            <input type="text" value={editContactName} onChange={e => setEditContactName(e.target.value)} className="input py-1.5 text-xs" />
                                          ) : (
                                            <span className="text-sm text-gray-900">{contact.name || '—'}</span>
                                          )}
                                        </td>
                                        <td className="px-5 py-2.5">
                                          {editingContact?.campaignId === campaign.id && editingContact?.index === idx ? (
                                            <input type="tel" value={editContactPhone} onChange={e => setEditContactPhone(e.target.value)} className="input py-1.5 text-xs" />
                                          ) : (
                                            <span className="text-sm text-gray-600">{contact.phone || '—'}</span>
                                          )}
                                        </td>
                                        <td className="px-5 py-2.5">
                                          {editingContact?.campaignId === campaign.id && editingContact?.index === idx ? (
                                            <input type="email" value={editContactEmail} onChange={e => setEditContactEmail(e.target.value)} className="input py-1.5 text-xs" />
                                          ) : (
                                            <span className="text-sm text-gray-600">{contact.email || '—'}</span>
                                          )}
                                        </td>
                                        <td className="px-5 py-2.5 text-right">
                                          {editingContact?.campaignId === campaign.id && editingContact?.index === idx ? (
                                            <div className="flex items-center justify-end gap-1.5">
                                              <button
                                                onClick={() => {
                                                  const updated = [...campaignContacts];
                                                  updated[idx] = { name: editContactName, phone: editContactPhone, email: editContactEmail };
                                                  saveContacts(campaign.id, updated);
                                                  setEditingContact(null);
                                                }}
                                                className="text-xs font-semibold text-white bg-[#C1027D] hover:bg-[#8A0260] px-2.5 py-1 rounded-lg transition-colors"
                                              >Save</button>
                                              <button
                                                onClick={() => setEditingContact(null)}
                                                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                                              >Cancel</button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center justify-end gap-1.5">
                                              <button
                                                onClick={() => {
                                                  setEditingContact({ campaignId: campaign.id, index: idx });
                                                  setEditContactName(contact.name || '');
                                                  setEditContactPhone(contact.phone || '');
                                                  setEditContactEmail(contact.email || '');
                                                }}
                                                className="text-xs font-semibold text-[#C1027D] hover:text-[#8A0260] px-2 py-1 rounded-lg hover:bg-[#FDF4FA] transition-colors"
                                              >Edit</button>
                                              <button
                                                onClick={() => {
                                                  if (confirm('Remove this contact from the campaign?')) {
                                                    const updated = campaignContacts.filter((_: any, i: number) => i !== idx);
                                                    saveContacts(campaign.id, updated);
                                                  }
                                                }}
                                                className="text-xs font-semibold text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                                              >Remove</button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Add new contact row */}
                              {showAddContact === campaign.id ? (
                                <div className="border-t border-[#f0e4ec] px-5 py-3 bg-[#FDF4FA]/30">
                                  <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input type="text" placeholder="Name" value={addContactName} onChange={e => setAddContactName(e.target.value)} className="input py-1.5 text-xs" />
                                    <input type="tel" placeholder="Phone" value={addContactPhone} onChange={e => setAddContactPhone(e.target.value)} className="input py-1.5 text-xs" />
                                    <input type="email" placeholder="Email" value={addContactEmail} onChange={e => setAddContactEmail(e.target.value)} className="input py-1.5 text-xs" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        if (!addContactName && !addContactPhone && !addContactEmail) return;
                                        const updated = [...campaignContacts, { name: addContactName, phone: addContactPhone, email: addContactEmail }];
                                        saveContacts(campaign.id, updated);
                                        setAddContactName(''); setAddContactPhone(''); setAddContactEmail('');
                                        setShowAddContact(null);
                                      }}
                                      className="text-xs font-semibold text-white bg-[#C1027D] hover:bg-[#8A0260] px-3 py-1.5 rounded-lg transition-colors"
                                    >Add Contact</button>
                                    <button
                                      onClick={() => { setShowAddContact(null); setAddContactName(''); setAddContactPhone(''); setAddContactEmail(''); }}
                                      className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    >Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="border-t border-[#f0e4ec] px-5 py-2.5">
                                  <button
                                    onClick={() => setShowAddContact(campaign.id)}
                                    className="text-xs font-semibold text-[#C1027D] hover:text-[#8A0260] transition-colors flex items-center gap-1"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add Contact
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
        </main>
      </div>

      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'success' : 'error'}`}>
          {toast.message}
        </div>
      )}

      {sendSuccess && (
        <div className="toast success">
          {resendCampaignId ? 'Campaign resent successfully!' : 'Campaign sent successfully!'}
        </div>
      )}
    </ProtectedRoute>
  );
}

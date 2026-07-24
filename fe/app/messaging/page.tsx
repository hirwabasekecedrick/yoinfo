'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import styles from './messaging.module.css';
import ProtectedRoute from '@/components/protected-route';

export default function MessagingDashboard() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [channels, setChannels] = useState({ whatsapp: false, email: true, sms: false });
  const [message, setMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');

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
        
        if (!rows.length) {
          alert('File is empty');
          return;
        }

        const findKey = (row: any, candidates: string[]) => {
          const keys = Object.keys(row);
          for (const c of candidates) {
            const hit = keys.find(k => k.toLowerCase().trim() === c);
            if (hit) return hit;
          }
          for (const c of candidates) {
            const hit = keys.find(k => k.toLowerCase().includes(c));
            if (hit) return hit;
          }
          return null;
        };

        const nameKey = findKey(rows[0], ['name', 'full name', 'contact']);
        const phoneKey = findKey(rows[0], ['phone', 'telephone', 'mobile', 'whatsapp']);
        const emailKey = findKey(rows[0], ['email', 'e-mail']);

        const parsedContacts = rows.map((r: any) => ({
          name: nameKey ? String(r[nameKey] || '').trim() : '',
          phone: phoneKey ? String(r[phoneKey] || '').trim() : '',
          email: emailKey ? String(r[emailKey] || '').trim() : '',
        }));

        setContacts(parsedContacts);
      } catch (err) {
        alert('Could not read file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualAdd = () => {
    if (!addName || (!addPhone && !addEmail)) {
      alert('Add a name and a phone or email');
      return;
    }
    setContacts(prev => [...prev, { name: addName, phone: addPhone, email: addEmail }]);
    setAddName('');
    setAddPhone('');
    setAddEmail('');
  };

  const toggleChannel = (ch: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const handleSend = async () => {
    if (!contacts.length) return alert('Please upload contacts first');
    if (!message.trim()) return alert('Message is empty');
    
    const activeChannels = Object.entries(channels)
      .filter(([_, isActive]) => isActive)
      .map(([ch]) => ch.toUpperCase());

    if (!activeChannels.length) return alert('Select at least one channel');

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messaging/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: campaignName,
          message,
          contacts,
          channels: activeChannels,
          cost: contacts.length * 20 // Dummy cost
        })
      });

      if (!response.ok) throw new Error('Failed to send');
      
      alert('Campaign sent successfully!');
      setContacts([]);
      setMessage('');
      setCampaignName('');
    } catch (err) {
      alert('Error sending campaign');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.app}>
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Relay</h2>
            <div style={{ fontSize: '12px', color: '#9FC2AB' }}>Bulk messaging</div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/" onClick={() => setSidebarOpen(false)} style={{ color: '#BFDCC8', fontSize: '14px', textDecoration: 'none' }}>← Back to Home</Link>
            <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontWeight: 'bold' }}>Dashboard</div>
          </nav>
        </aside>

        <main className={styles.main}>
          <button className={styles.hamburger} onClick={() => setSidebarOpen(prev => !prev)} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>

          <div style={{ marginBottom: '22px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px' }}>New Campaign</h1>
            <p style={{ color: '#63786C', margin: 0 }}>Upload contacts, write once — send everywhere.</p>
          </div>

          <div className={styles.contentGrid}>
            <div>
              <div className={styles.card}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Contact list</h2>
                
                <div className={styles.contactFormGrid}>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={addName} 
                    onChange={e => setAddName(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DCE8DE' }} 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    value={addPhone} 
                    onChange={e => setAddPhone(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DCE8DE' }} 
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={addEmail} 
                    onChange={e => setAddEmail(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DCE8DE' }} 
                  />
                  <button 
                    onClick={handleManualAdd} 
                    className={styles.btnSolid}
                  >
                    Add Contact
                  </button>
                </div>

                <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '12px', color: '#63786C', fontWeight: 'bold' }}>OR</div>

                <div 
                  className={styles.dropzone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ fontWeight: 'bold' }}>Click to browse Excel/CSV</div>
                  <input type="file" ref={fileInputRef} hidden accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
                </div>
                {contacts.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '14px', color: '#1B7A4D', fontWeight: 'bold' }}>
                    Loaded {contacts.length} contacts
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Channels</h2>
                <div className={styles.channelsWrap}>
                  <div className={`${styles.chip} ${channels.email ? styles.active : ''}`} onClick={() => toggleChannel('email')}>
                    <span className={styles.dot}></span> Email
                  </div>
                  <div className={`${styles.chip} ${channels.sms ? styles.active : ''}`} onClick={() => toggleChannel('sms')}>
                    <span className={styles.dot}></span> SMS
                  </div>
                  <div className={`${styles.chip} ${channels.whatsapp ? styles.active : ''}`} onClick={() => toggleChannel('whatsapp')}>
                    <span className={styles.dot}></span> WhatsApp
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Message</h2>
                <textarea 
                  className={styles.textarea}
                  placeholder="Hi {name}, your order is on its way!"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className={styles.card}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Campaign Details</h2>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Campaign Name</label>
                  <input 
                    type="text" 
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                    placeholder="July Newsletter"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DCE8DE' }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Recipients</span>
                  <span style={{ fontWeight: 'bold' }}>{contacts.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <span>Estimated Cost</span>
                  <span style={{ fontWeight: 'bold' }}>{contacts.length * 20} RWF</span>
                </div>

                <button 
                  className={styles.sendBtn} 
                  onClick={handleSend}
                  disabled={isSending || contacts.length === 0 || !message}
                >
                  {isSending ? 'Sending...' : 'Review & Send'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

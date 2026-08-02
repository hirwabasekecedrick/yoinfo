'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface IbiceriTx {
  label: string;
  amount: number;
  type: 'credit' | 'debit';
  when: string;
}

interface IbiceriContextValue {
  balance: number;
  transactions: IbiceriTx[];
  shortfall: number | null;
  spend: (amount: number, label?: string) => boolean;
  clearShortfall: () => void;
  openPayment: (amount: number, price: number) => void;
}

const IbiceriContext = createContext<IbiceriContextValue | null>(null);

export function useIbiceri() {
  const ctx = useContext(IbiceriContext);
  if (!ctx) throw new Error('useIbiceri must be used within <IbiceriProvider>');
  return ctx;
}

const STORAGE_KEY = 'yoinfo_ibiceri_v1';

const DEFAULT_TX: IbiceriTx[] = [
  { label: 'Welcome bonus', amount: 240, type: 'credit', when: 'Account created' },
];

const PACKS = [100, 500, 1000, 2500];

export default function IbiceriProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [balance, setBalance] = useState(240);
  const [transactions, setTransactions] = useState<IbiceriTx[]>(DEFAULT_TX);
  const [shortfall, setShortfall] = useState<number | null>(null);

  // Payment modal state
  const [payOpen, setPayOpen] = useState(false);
  const [payStep, setPayStep] = useState<'form' | 'processing' | 'success'>('form');
  const [payAmount, setPayAmount] = useState(100);
  const [payPrice, setPayPrice] = useState(1000);
  const [payMethod, setPayMethod] = useState<'momo' | 'card'>('momo');
  const [payNumber, setPayNumber] = useState('');
  const [payCardNumber, setPayCardNumber] = useState('');
  const [payCardExpiry, setPayCardExpiry] = useState('');
  const [payCardCvv, setPayCardCvv] = useState('');
  const [payNewBalance, setPayNewBalance] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.balance === 'number') setBalance(data.balance);
        if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const persist = (b: number, t: IbiceriTx[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance: b, transactions: t }));
    } catch {
      // ignore quota / private mode errors
    }
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const updWalletShortfall = useCallback((missing: number) => {
    setShortfall(missing);
  }, []);

  const spend = useCallback((amount: number, label?: string): boolean => {
    if (balance < amount) {
      const missing = amount - balance;
      showToast(`Not enough Ibiceri for that — you're short by ${missing}. Taking you to top up now.`);
      router.push('/wallet');
      updWalletShortfall(missing);
      return false;
    }
    setBalance((prev) => prev - amount);
    const when = new Date().toLocaleString();
    const tx = { label: label || 'Spent on yoInfo', amount, type: 'debit' as const, when };
    setTransactions((prev) => {
      const next = [...prev, tx];
      persist(balance - amount, next);
      return next;
    });
    return true;
  }, [balance, router, showToast, updWalletShortfall]);

  const clearShortfall = useCallback(() => setShortfall(null), []);

  const openPayment = useCallback((amount: number, price: number) => {
    setPayAmount(amount);
    setPayPrice(price);
    setPayStep('form');
    setPayMethod('momo');
    setPayNumber('');
    setPayCardNumber('');
    setPayCardExpiry('');
    setPayCardCvv('');
    setPayOpen(true);
  }, []);

  const closePayment = useCallback(() => {
    setPayOpen(false);
    setPayStep('form');
  }, []);

  const setPaymentMethod = useCallback((method: 'momo' | 'card') => {
    setPayMethod(method);
  }, []);

  const submitPayment = useCallback(() => {
    let payLabel = '';
    if (payMethod === 'momo') {
      if (!payNumber.trim()) {
        showToast('Enter your Mobile Money number');
        return;
      }
      payLabel = payNumber.trim();
    } else {
      if (!payCardNumber.trim() || !payCardExpiry.trim() || !payCardCvv.trim()) {
        showToast('Fill in your card details');
        return;
      }
      const last4 = payCardNumber.replace(/\s/g, '').slice(-4);
      payLabel = 'Card ending ' + last4;
    }
    setPayStep('processing');

    setTimeout(() => {
      setBalance((prev) => {
        const next = prev + payAmount;
        setPayNewBalance(next);
        const srcLabel = payMethod === 'momo' ? 'Mobile Money' : 'Card';
        const when = new Date().toLocaleString();
        const tx = { label: `${srcLabel} top-up (${payLabel})`, amount: payAmount, type: 'credit' as const, when };
        setTransactions((prevTx) => {
          const all = [...prevTx, tx];
          persist(next, all);
          return all;
        });
        return next;
      });
      setShortfall(null);
      setPayStep('success');
    }, 2200);
  }, [payMethod, payNumber, payCardNumber, payCardExpiry, payCardCvv, payAmount, showToast]);

  const value: IbiceriContextValue = {
    balance,
    transactions,
    shortfall,
    spend,
    clearShortfall,
    openPayment,
  };

  return (
    <IbiceriContext.Provider value={value}>
      {children}

      {/* ── Ibiceri payment modal ── */}
      {payOpen && (
        <div className="modal-overlay" onClick={closePayment}>
          <div className="modal-content" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            {payStep === 'form' && (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-extrabold text-gray-900">Buy Ibiceri</h2>
                </div>
                <div className="flex items-center justify-between bg-[#FFF7E8] border border-[#F0D9A6] rounded-xl px-4 py-3 font-extrabold">
                  <span className="text-sm text-[#8A5A00]">{payAmount.toLocaleString()} Ibiceri</span>
                  <span className="text-[13px] text-gray-900">RWF {payPrice.toLocaleString()}</span>
                </div>
                <div className="mb-3.5 mt-4">
                  <label className="block text-xs font-bold text-[#7A6270] mb-1.5">Pay with</label>
                  <div className="flex gap-2">
                    <div
                      className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        payMethod === 'momo'
                          ? 'bg-[#C1027D] text-white border-[1.5px] border-[#C1027D]'
                          : 'bg-white border-[1.5px] border-[#f0e4ec] text-[#7A6270] hover:border-[#D93F9E]'
                      }`}
                      onClick={() => setPaymentMethod('momo')}
                    >
                      📱 Mobile Money
                    </div>
                    <div
                      className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        payMethod === 'card'
                          ? 'bg-[#C1027D] text-white border-[1.5px] border-[#C1027D]'
                          : 'bg-white border-[1.5px] border-[#f0e4ec] text-[#7A6270] hover:border-[#D93F9E]'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      💳 Card
                    </div>
                  </div>
                </div>

                {payMethod === 'momo' ? (
                  <div className="mb-3.5 mt-3.5">
                    <label className="block text-xs font-bold text-[#7A6270] mb-1.5">Mobile Money number</label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="+250 7XX XXX XXX"
                      value={payNumber}
                      onChange={(e) => setPayNumber(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="mb-3.5 mt-3.5">
                      <label className="block text-xs font-bold text-[#7A6270] mb-1.5">Card number</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        value={payCardNumber}
                        onChange={(e) => setPayCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2.5 mt-3">
                      <div className="mb-3.5 flex-1">
                        <label className="block text-xs font-bold text-[#7A6270] mb-1.5">Expiry</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="MM/YY"
                          value={payCardExpiry}
                          onChange={(e) => setPayCardExpiry(e.target.value)}
                        />
                      </div>
                      <div className="mb-3.5 flex-1">
                        <label className="block text-xs font-bold text-[#7A6270] mb-1.5">CVV</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="123"
                          inputMode="numeric"
                          value={payCardCvv}
                          onChange={(e) => setPayCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button className="btn btn-primary btn-full mt-4" onClick={submitPayment}>
                  Send Payment Request
                </button>
                <button className="btn btn-ghost btn-full mt-2" onClick={closePayment}>
                  Cancel
                </button>
              </>
            )}

            {payStep === 'processing' && (
              <div className="text-center py-5">
                <div className="w-10 h-10 rounded-full border-[3px] border-[#F0D9A6] border-t-[#E8B04B] mx-auto animate-spin" />
                <div className="font-extrabold text-sm text-gray-900 mt-4">
                  {payMethod === 'momo' ? 'Check your phone' : 'Processing your card'}
                </div>
                <p className="text-[12.5px] text-[#7A6270] font-medium mt-1.5">
                  {payMethod === 'momo'
                    ? `Approve the Mobile Money prompt sent to ${payNumber} to complete your purchase of ${payAmount.toLocaleString()} Ibiceri.`
                    : `Confirming your card payment for ${payAmount.toLocaleString()} Ibiceri. Please don't close this window.`}
                </p>
              </div>
            )}

            {payStep === 'success' && (
              <div className="text-center py-2.5">
                <div className="w-14 h-14 rounded-full bg-[#EFFAF0] text-green-600 text-2xl font-extrabold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <div className="font-extrabold text-base text-gray-900 mt-3.5">Payment successful</div>
                <p className="text-[12.5px] text-[#7A6270] font-medium mt-1.5">
                  {payAmount.toLocaleString()} Ibiceri added to your wallet.
                </p>
                <div className="text-[22px] font-extrabold text-[#8A5A00] mt-2.5">
                  New balance: {payNewBalance.toLocaleString()} Ibiceri
                </div>
                <button className="btn btn-primary btn-full mt-5" onClick={closePayment}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 font-bold px-5 py-3 rounded-xl shadow-lg z-[300]"
          style={{ background: '#3D0231', color: '#fff', fontSize: 13, animation: 'fadeInUp 0.2s ease-out' }}
        >
          {toast}
        </div>
      )}
    </IbiceriContext.Provider>
  );
}

export { PACKS };

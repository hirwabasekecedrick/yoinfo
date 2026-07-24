'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, fetchPosts, fetchTags, fetchEvents, createEvent } from '@/lib/api';
import { API_URL } from '@/lib/config';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/protected-route';

const MAX_WORDS = 250;
const MAX_HEADER_CHARS = 200;

const CTA_ACTIONS = [
  'Book Now',
  'Schedule a Visit',
  'Request a Quote',
  'Get a Consultation',
  'Reserve Your Spot',
  'Order Now',
  'Browse Catalogue',
  'Add to Cart',
  'Explore Opportunity',
  'View Full Profile',
  'Start a Conversation',
  'Register Now',
  'Sign Up Today',
  'Get Started',
  'Join Now',
  'Claim Your Listing',
  'Discover More',
  'Go for It',
  'Don\'t Miss Out',
  'Grab This Offer',
  'Take Action Today',
];

const STEPS = [
  { id: 'content', label: 'Content', required: true, icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125' },
  { id: 'image', label: 'Image', required: false, icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z' },
  { id: 'tags', label: 'Tags', required: false, icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z' },
  { id: 'links', label: 'Links', required: false, icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' },
  { id: 'event', label: 'Event', required: false, icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { id: 'action', label: 'CTA Action', required: true, icon: 'M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59' },
];

type CompletedSteps = Record<string, boolean>;

export default function PosterDashboard() {
  const [currentStep, setCurrentStep] = useState('content');
  const [completedSteps, setCompletedSteps] = useState<CompletedSteps>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [tags, setTags] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [links, setLinks] = useState<{ url: string; title?: string }[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '' });
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showActionPicker, setShowActionPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      router.push('/auth');
    } else {
      setUser(JSON.parse(storedUser));
      fetchPosts()
        .then(setPosts)
        .catch(console.error)
        .finally(() => setLoadingPosts(false));
    }
  }, [router]);

  useEffect(() => {
    fetchTags().then(setTags).catch(console.error);
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  const handleImageSelect = (file: File | null) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageSelect(e.target.files?.[0] || null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageSelect(e.dataTransfer.files?.[0] || null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > MAX_WORDS;

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
  };

  const canPublish = content.trim().length > 0 && !isOverWordLimit && selectedAction;

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    try { new URL(newLinkUrl); } catch { return; }
    setLinks(prev => [...prev, { url: newLinkUrl, title: newLinkTitle || undefined }]);
    setNewLinkUrl('');
    setNewLinkTitle('');
  };

  const handleRemoveLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateEvent = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newEvent.title || !newEvent.date) return;
    try {
      const event = await createEvent(token, newEvent);
      setEvents(prev => [event, ...prev]);
      setSelectedEventId(event.id);
      setShowCreateEvent(false);
      setNewEvent({ title: '', description: '', date: '', location: '' });
    } catch (err: any) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    removeImage();
    setSelectedTags([]);
    setLinks([]);
    setSelectedEventId(null);
    setSelectedAction(null);
    setCompletedSteps({});
    setCurrentStep('content');
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const enrichedContent = selectedAction ? `${content}\n\n[${selectedAction}]` : content;
      const newPost = await createPost(enrichedContent, token!, title, imageUrl, selectedTags, links, selectedEventId || undefined);

      resetForm();
      setPosts(prev => [newPost, ...prev]);
      setMessage({ type: 'success', text: 'Update published successfully!' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to publish update.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStepIndex = (stepId: string) => STEPS.findIndex(s => s.id === stepId);

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-green-100 bg-white hidden lg:flex flex-col">
        <div className="px-5 py-5 border-b border-green-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 overflow-hidden">
              <Image src="/logoo.png" alt="InfoPulse Logo" width={100} height={32} className="object-contain" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: 'Dashboard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z', active: true },
            { label: 'Bulk Messaging', href: '/messaging', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25', active: false },
            { label: 'Investments', href: '/investments', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941', active: false },
            { label: 'Businesses', href: '/business', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21', active: false },
            { label: 'All Posts', href: '/', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-green-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</div>
              <div className="text-xs text-gray-400 capitalize">{user.role?.toLowerCase()}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-green-100 bg-white/80 backdrop-blur-lg px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </Link>
            <div>
              <h1 className="font-bold text-base text-gray-900">Create Update</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Build your post step by step</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
            >
              View Feed
            </Link>
            <button
              onClick={handleLogout}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Form Column */}
              <div className="lg:col-span-3 space-y-5">
                {message && (
                  <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium animate-scale-in ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {message.type === 'success'
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      }
                    </svg>
                    {message.text}
                  </div>
                )}

                {/* Step Navigation Pills */}
                {/* <div className="bg-white border border-green-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Steps</h3>
                    <span className="text-xs text-gray-400">
                      {Object.keys(completedSteps).length}/{STEPS.length} done
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STEPS.map((step) => {
                      const isActive = currentStep === step.id;
                      const isComplete = completedSteps[step.id];
                      return (
                        <button
                          key={step.id}
                          onClick={() => setCurrentStep(step.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-green-600 text-white shadow-md shadow-green-200'
                              : isComplete
                              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          {isComplete && !isActive ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                            </svg>
                          )}
                          {step.label}
                          {!step.required && (
                            <span className={`text-[10px] ${isActive ? 'text-green-200' : 'text-gray-400'}`}>(opt)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div> */}

                {/* Step Content */}
                <div className="bg-white border border-green-100 rounded-2xl p-6 animate-fade-in-up">
                  {currentStep === 'content' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">What offer do you have today? </h3>
                        {/* <p className="text-sm text-gray-400">Write the core content of your post</p> */}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title (optional)</label>
                        <input
                          type="text"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          maxLength={MAX_HEADER_CHARS}
                          placeholder="Give your post a catchy headline..."
                          className="w-full h-12 px-4 text-base font-medium bg-gray-50 border border-green-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                        <textarea
                          value={content}
                          onChange={e => setContent(e.target.value)}
                          className="w-full h-44 bg-gray-50 border border-green-200 rounded-xl p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all leading-relaxed"
                          placeholder="Share your update, announcement, or news..."
                          autoFocus
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-32 rounded-full overflow-hidden bg-gray-200">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  wordCount === 0
                                    ? 'w-0 bg-gray-300'
                                    : isOverWordLimit
                                    ? 'w-full bg-red-500'
                                    : wordCount > MAX_WORDS * 0.8
                                    ? 'w-5/6 bg-amber-500'
                                    : 'w-1/2 bg-green-500'
                                }`}
                              />
                            </div>
                            <span className={`text-xs font-semibold tabular-nums ${
                              isOverWordLimit ? 'text-red-500' : wordCount > MAX_WORDS * 0.8 ? 'text-amber-500' : 'text-gray-400'
                            }`}>
                              {wordCount}/{MAX_WORDS}
                            </span>
                          </div>
                          {isOverWordLimit && <span className="text-xs text-red-500 font-semibold">Over limit</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => { markStepComplete('content'); setCurrentStep('image'); }}
                        disabled={content.trim().length === 0 || isOverWordLimit}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-green-200"
                      >
                        Continue
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {currentStep === 'image' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Add an image</h3>
                        <p className="text-sm text-gray-400">Visuals make your post stand out (optional)</p>
                      </div>

                      {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border-2 border-green-200 group">
                          <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeImage}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-white rounded-lg text-sm font-semibold text-gray-900 shadow-lg"
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
                            isDragOver
                              ? 'border-green-500 bg-green-50'
                              : 'border-green-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50'
                          }`}
                        >
                          <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">
                            {isDragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG, GIF, WebP — max 5MB</p>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep('content')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          onClick={() => { markStepComplete('image'); setCurrentStep('tags'); }}
                          className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200"
                        >
                          Continue
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'tags' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Add tags</h3>
                        <p className="text-sm text-gray-400">Help people find your post (optional)</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {tags.length === 0 && (
                          <p className="text-sm text-gray-400">Loading tags...</p>
                        )}
                        {tags.map((tag: any) => {
                          const isSelected = selectedTags.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => setSelectedTags(prev =>
                                isSelected ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                              )}
                              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                                isSelected
                                  ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200'
                                  : 'bg-white text-gray-600 border-green-200 hover:border-green-400 hover:bg-green-50'
                              }`}
                            >
                              {tag.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep('image')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          onClick={() => { markStepComplete('tags'); setCurrentStep('links'); }}
                          className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200"
                        >
                          {selectedTags.length > 0 ? `Continue` : 'Skip'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'links' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Add links</h3>
                        <p className="text-sm text-gray-400">Reference relevant URLs (optional)</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newLinkUrl}
                            onChange={e => setNewLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newLinkTitle}
                            onChange={e => setNewLinkTitle(e.target.value)}
                            placeholder="Link title (optional)"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
                          />
                          <button
                            onClick={handleAddLink}
                            disabled={!newLinkUrl.trim()}
                            className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {links.length > 0 && (
                        <div className="space-y-2">
                          {links.map((link, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                              </svg>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">{link.title || link.url}</div>
                                <div className="text-xs text-gray-400 truncate">{link.url}</div>
                              </div>
                              <button onClick={() => handleRemoveLink(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep('tags')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          onClick={() => { markStepComplete('links'); setCurrentStep('event'); }}
                          className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200"
                        >
                          {links.length > 0 ? `Continue` : 'Skip'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'event' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Link an event</h3>
                        <p className="text-sm text-gray-400">Connect this post to an event (optional)</p>
                      </div>

                      {showCreateEvent ? (
                        <div className="space-y-3 p-4 rounded-xl border border-green-200 bg-green-50/50">
                          <input
                            type="text"
                            value={newEvent.title}
                            onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Event title *"
                            className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <textarea
                            value={newEvent.description}
                            onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description (optional)"
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                          />
                          <input
                            type="datetime-local"
                            value={newEvent.date}
                            onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            value={newEvent.location}
                            onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Location (optional)"
                            className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowCreateEvent(false)}
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleCreateEvent}
                              disabled={!newEvent.title || !newEvent.date}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40"
                            >
                              Create Event
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="max-h-48 overflow-y-auto space-y-2">
                            <button
                              onClick={() => setSelectedEventId(null)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                                selectedEventId === null
                                  ? 'bg-green-600 text-white border-green-600'
                                  : 'bg-white text-gray-600 border-green-200 hover:border-green-400'
                              }`}
                            >
                              No event
                            </button>
                            {events.length === 0 && (
                              <p className="text-sm text-gray-400 text-center py-4">No events yet</p>
                            )}
                            {events.map((event: any) => (
                              <button
                                key={event.id}
                                onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                                  selectedEventId === event.id
                                    ? 'bg-green-600 text-white border-green-600 font-semibold'
                                    : 'bg-white text-gray-600 border-green-200 hover:border-green-400'
                                }`}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className={`text-xs mt-0.5 ${selectedEventId === event.id ? 'text-green-100' : 'text-gray-400'}`}>
                                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  {event.location && ` · ${event.location}`}
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowCreateEvent(true)}
                            className="text-sm text-green-600 font-semibold hover:text-green-700"
                          >
                            + Create new event
                          </button>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep('links')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          onClick={() => { markStepComplete('event'); setCurrentStep('action'); }}
                          className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200"
                        >
                          {selectedEventId ? 'Continue' : 'Skip — no event'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'action' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Choose your call-to-action</h3>
                        <p className="text-sm text-gray-400">What should readers do next? *</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CTA_ACTIONS.map((action) => (
                          <button
                            key={action}
                            onClick={() => setSelectedAction(action)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all text-left ${
                              selectedAction === action
                                ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200'
                                : 'bg-white text-gray-600 border-green-200 hover:border-green-400 hover:bg-green-50'
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep('event')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          onClick={() => { markStepComplete('action'); setCurrentStep('review'); }}
                          disabled={!selectedAction}
                          className="flex-[2] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-green-200"
                        >
                          Review & Publish
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'review' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">Review & publish</h3>
                        <p className="text-sm text-gray-400">Everything looks good? Hit publish!</p>
                      </div>

                      <div className="bg-gray-50 border border-green-200 rounded-xl overflow-hidden">
                        {imagePreview && (
                          <img src={imagePreview} alt="Post image" className="w-full max-h-48 object-cover" />
                        )}
                        <div className="p-4 space-y-2">
                          {title && <h4 className="font-bold text-base text-gray-900">{title}</h4>}
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
                          <div className="flex items-center gap-3 pt-2">
                            {selectedTags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {selectedTags.map(tagId => {
                                  const tag = tags.find((t: any) => t.id === tagId);
                                  return tag ? (
                                    <span key={tagId} className="px-2 py-0.5 rounded-full bg-green-100 text-xs font-semibold text-green-700">
                                      {tag.label}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                            {selectedAction && (
                              <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
                                {selectedAction}
                              </span>
                            )}
                          </div>
                          {links.length > 0 && (
                            <div className="space-y-1 pt-1">
                              {links.map((link, i) => (
                                <div key={i} className="text-xs text-green-600 font-medium">{link.title || link.url}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setCurrentStep('action')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          onClick={handlePublish}
                          disabled={isSubmitting || !canPublish}
                          className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-200"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Publishing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                              </svg>
                              Publish Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Column */}
              <div className="lg:col-span-2">
                <div className="sticky top-20 space-y-5">
                  <h3 className="text-sm font-bold text-gray-900">Live Preview</h3>
                  <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover" />
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{user.name || 'User'}</div>
                          <div className="text-xs text-gray-400">Just now</div>
                        </div>
                      </div>
                      {title && <h4 className="font-bold text-base text-gray-900 mb-1">{title}</h4>}
                      {content ? (
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
                      ) : (
                        <p className="text-sm text-gray-300 italic">Your post content will appear here...</p>
                      )}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {selectedTags.map(tagId => {
                            const tag = tags.find((t: any) => t.id === tagId);
                            return tag ? (
                              <span key={tagId} className="px-2.5 py-0.5 rounded-full bg-green-50 text-xs font-semibold text-green-700 border border-green-200">
                                {tag.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                      {links.length > 0 && (
                        <div className="space-y-1 mt-3">
                          {links.map((link, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                              </svg>
                              {link.title || link.url}
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedAction && (
                        <div className="mt-4 pt-3 border-t border-green-100">
                          <button className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors shadow-sm shadow-green-200">
                            {selectedAction}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-green-800 mb-2">Tips for a great post</h4>
                    <ul className="space-y-1.5 text-xs text-green-700">
                      <li className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Use a clear, attention-grabbing title
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Add images to increase engagement
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Choose a CTA that matches your goal
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Tags help users discover your content
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="mt-10">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Recent Updates</h2>
              {loadingPosts ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-green-100 rounded-2xl p-5 flex gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-1/3 rounded bg-green-100 animate-pulse" />
                        <div className="h-3 w-full rounded bg-green-100 animate-pulse" />
                        <div className="h-3 w-3/4 rounded bg-green-100 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white border border-green-100 rounded-2xl text-sm text-gray-400 font-medium">
                  No updates yet. Be the first to publish!
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="bg-white border border-green-100 rounded-2xl overflow-hidden transition-shadow hover:shadow-md hover:shadow-green-50">
                      <div className="p-5">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {post.author?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-900">
                                  {post.author?.name || 'Unknown'}
                                </span>
                                {post.author?.email === user.email && (
                                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">You</span>
                                )}
                              </div>
                              <time className="text-xs text-gray-400 flex-shrink-0">
                                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </time>
                            </div>
                            {post.title && (
                              <h3 className="font-bold text-base text-gray-900 mb-1">{post.title}</h3>
                            )}
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            {post.imageUrl && (
                              <div className="mt-3 rounded-xl overflow-hidden">
                                <img src={post.imageUrl} alt="Post" className="w-full max-h-80 object-cover" loading="lazy" />
                              </div>
                            )}
                            {post.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {post.tags.map((pt: any) => (
                                  <span key={pt.tag.id} className="px-2.5 py-0.5 rounded-full bg-green-50 text-xs font-semibold text-green-700 border border-green-200">
                                    {pt.tag.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { fetchTags, fetchEvents, createEvent } from '@/lib/api';

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (data: {
    tags: string[];
    links: { url: string; title?: string }[];
    eventId: string | null;
  }) => void;
  isSubmitting: boolean;
}

export default function PublishModal({ open, onClose, onPublish, isSubmitting }: PublishModalProps) {
  const [step, setStep] = useState<'options' | 'tags' | 'links' | 'events'>('options');
  const [tags, setTags] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [links, setLinks] = useState<{ url: string; title?: string }[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '' });

  useEffect(() => {
    if (open) {
      fetchTags().then(setTags).catch(console.error);
      fetchEvents().then(setEvents).catch(console.error);
      setStep('options');
    }
  }, [open]);

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

  const handlePublish = () => {
    onPublish({ tags: selectedTags, links, eventId: selectedEventId });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
            {step === 'options' && 'Publishing Options'}
            {step === 'tags' && 'Add Tags'}
            {step === 'links' && 'Add Links'}
            {step === 'events' && 'Link to Event'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 'options' && (
            <>
              <button
                onClick={() => setStep('tags')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Add Tags</div>
                  <div className="text-xs text-neutral-500">{selectedTags.length > 0 ? `${selectedTags.length} tags selected` : 'No tags selected'}</div>
                </div>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setStep('links')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Add Links</div>
                  <div className="text-xs text-neutral-500">{links.length > 0 ? `${links.length} link(s) added` : 'No links added'}</div>
                </div>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setStep('events')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Link to Event</div>
                  <div className="text-xs text-neutral-500">{selectedEventId ? 'Event selected' : 'No event linked'}</div>
                </div>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <button
                  disabled
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 opacity-50 cursor-not-allowed text-left"
                  title="Coming Soon"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Automate to Social Medias</div>
                    <div className="text-xs text-amber-500 font-medium">Coming Soon</div>
                  </div>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>
            </>
          )}

          {step === 'tags' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">Select tags for your post</p>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {tags.map((tag: any) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTags(prev =>
                        isSelected ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                      )}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                          : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setStep('options')}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                &larr; Back
              </button>
            </div>
          )}

          {step === 'links' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">Add URLs to reference in your post</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </div>
              <input
                type="text"
                value={newLinkTitle}
                onChange={e => setNewLinkTitle(e.target.value)}
                placeholder="Link title (optional)"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
              />
              <button
                onClick={handleAddLink}
                disabled={!newLinkUrl.trim()}
                className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline disabled:opacity-50 disabled:no-underline"
              >
                + Add link
              </button>

              {links.length > 0 && (
                <div className="space-y-2 mt-2">
                  {links.map((link, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700">
                      <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">{link.title || link.url}</div>
                        <div className="text-xs text-neutral-400 truncate">{link.url}</div>
                      </div>
                      <button onClick={() => handleRemoveLink(i)} className="text-neutral-400 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStep('options')}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                &larr; Back
              </button>
            </div>
          )}

          {step === 'events' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">Link this post to an event or create a new one</p>

              {showCreateEvent ? (
                <div className="space-y-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950">
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Event title *"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                  <textarea
                    value={newEvent.description}
                    onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white resize-none"
                  />
                  <input
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location (optional)"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCreateEvent(false)}
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateEvent}
                      disabled={!newEvent.title || !newEvent.date}
                      className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                      Create Event
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {events.length === 0 && (
                      <p className="text-sm text-neutral-400 text-center py-4">No events yet</p>
                    )}
                    {events.map((event: any) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedEventId === event.id
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                            : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
                        }`}
                      >
                        <div className="text-sm font-medium">{event.title}</div>
                        <div className={`text-xs mt-0.5 ${selectedEventId === event.id ? 'text-white/70 dark:text-neutral-700' : 'text-neutral-500'}`}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {event.location && ` · ${event.location}`}
                          {event._count?.registrations !== undefined && ` · ${event._count.registrations} registered`}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCreateEvent(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    + Create new event
                  </button>
                </>
              )}

              <button
                onClick={() => setStep('options')}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                &larr; Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

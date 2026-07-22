'use client';

import { useState } from 'react';

const BUSINESS_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Hospitality',
  'Manufacturing',
  'Agriculture',
  'Construction',
  'Professional Services',
];

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
  "Don't Miss Out",
  'Grab This Offer',
  'Take Action Today',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FORM_STEPS = [
  { id: 'basic', label: 'Basic Info', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { id: 'contact', label: 'Contact', icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
  { id: 'details', label: 'Details', icon: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z' },
  { id: 'services', label: 'Services', icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z' },
  { id: 'hours', label: 'Hours', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'cta', label: 'CTA', icon: 'M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59' },
  { id: 'team', label: 'Team', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
];

interface BusinessProfileFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function BusinessProfileForm({ onSave, onCancel }: BusinessProfileFormProps) {
  const [currentStep, setCurrentStep] = useState('basic');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Basic Info
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Contact
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // Details
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [certifications, setCertifications] = useState('');

  // Services
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');

  // Hours
  const [hours, setHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>(
    Object.fromEntries(DAYS.map(day => [day, { open: '09:00', close: '17:00', closed: false }]))
  );

  // CTA
  const [primaryCTA, setPrimaryCTA] = useState('');

  // Team
  const [teamMembers, setTeamMembers] = useState<{ name: string; role: string }[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const markComplete = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
  };

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices(prev => [...prev, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (service: string) => {
    setServices(prev => prev.filter(s => s !== service));
  };

  const handleAddTeamMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      setTeamMembers(prev => [...prev, { name: newMemberName.trim(), role: newMemberRole.trim() }]);
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDayClosed = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed },
    }));
  };

  const updateHours = (day: string, field: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = () => {
    onSave({
      name, tagline, category, description, logo, coverImage,
      phone, email, website, address, city, country,
      registrationNumber, taxId, certifications,
      services, hours, primaryCTA, teamMembers,
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <div className="bg-white border border-green-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">Profile Sections</h3>
          <span className="text-xs text-gray-400">{Object.keys(completedSteps).length}/{FORM_STEPS.length} done</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FORM_STEPS.map((step) => {
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
                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white border border-green-100 rounded-2xl p-6">
        {currentStep === 'basic' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Basic Information</h3>
              <p className="text-sm text-gray-400">Tell us about your business</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your business name"
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="A short catchy phrase about your business"
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a category</option>
                {BUSINESS_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what your business does, its mission, and what makes it unique..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Logo URL</label>
                <input
                  type="url"
                  value={logo}
                  onChange={e => setLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'contact' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Contact Information</h3>
              <p className="text-sm text-gray-400">How can customers reach you?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+250 788 000 000" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@business.com" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
              <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourbusiness.com" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Legal & Certifications</h3>
              <p className="text-sm text-gray-400">Optional legal information to build trust</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Number</label>
              <input type="text" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} placeholder="Business registration number" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tax ID</label>
              <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="Tax identification number" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Certifications</label>
              <textarea value={certifications} onChange={e => setCertifications(e.target.value)} placeholder="List any relevant certifications, licenses, or awards..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
          </div>
        )}

        {currentStep === 'services' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Services & Products</h3>
              <p className="text-sm text-gray-400">What does your business offer?</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newService}
                onChange={e => setNewService(e.target.value)}
                placeholder="Add a service or product"
                className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddService(); } }}
              />
              <button
                onClick={handleAddService}
                disabled={!newService.trim()}
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <span key={service} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-sm font-medium text-green-700 border border-green-200">
                    {service}
                    <button onClick={() => handleRemoveService(service)} className="text-green-400 hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {services.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No services added yet. Add your first service above.</p>
            )}
          </div>
        )}

        {currentStep === 'hours' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Operating Hours</h3>
              <p className="text-sm text-gray-400">When is your business open?</p>
            </div>

            <div className="space-y-3">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-green-100">
                  <span className="w-24 text-sm font-semibold text-gray-700">{day}</span>
                  {hours[day].closed ? (
                    <span className="text-sm text-gray-400 italic">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours[day].open}
                        onChange={e => updateHours(day, 'open', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-green-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-gray-400 text-sm">to</span>
                      <input
                        type="time"
                        value={hours[day].close}
                        onChange={e => updateHours(day, 'close', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-green-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => toggleDayClosed(day)}
                    className={`ml-auto px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      hours[day].closed
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {hours[day].closed ? 'Mark Open' : 'Mark Closed'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'cta' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Primary Call-to-Action</h3>
              <p className="text-sm text-gray-400">What should visitors do when they find your profile?</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CTA_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => setPrimaryCTA(action)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all text-left ${
                    primaryCTA === action
                      ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200'
                      : 'bg-white text-gray-600 border-green-200 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'team' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Team Members</h3>
              <p className="text-sm text-gray-400">Showcase the people behind your business (optional)</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                placeholder="Name"
                className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={newMemberRole}
                onChange={e => setNewMemberRole(e.target.value)}
                placeholder="Role"
                className="flex-1 px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleAddTeamMember}
                disabled={!newMemberName.trim() || !newMemberRole.trim()}
                className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {teamMembers.length > 0 && (
              <div className="space-y-2">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {member.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                    <button onClick={() => handleRemoveTeamMember(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {teamMembers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No team members added yet.</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-green-100">
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            {FORM_STEPS.findIndex(s => s.id === currentStep) > 0 && (
              <button
                onClick={() => {
                  const idx = FORM_STEPS.findIndex(s => s.id === currentStep);
                  setCurrentStep(FORM_STEPS[idx - 1].id);
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            {FORM_STEPS.findIndex(s => s.id === currentStep) < FORM_STEPS.length - 1 ? (
              <button
                onClick={() => {
                  markComplete(currentStep);
                  const idx = FORM_STEPS.findIndex(s => s.id === currentStep);
                  setCurrentStep(FORM_STEPS[idx + 1].id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200"
              >
                Next Section
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => { markComplete(currentStep); handleSave(); }}
                disabled={!name.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-40 shadow-lg shadow-green-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Save Business Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Calendar, MapPin, Phone, ExternalLink, Check, ChevronDown, ChevronUp, Navigation, Send, CheckCircle } from 'lucide-react';
import { Provider, getSpecialtyDisplayName } from '../../services/providerService';
import DirectionsComponent from '../../components/DirectionsComponent';
import ProviderMap from './ProviderMap';

interface ProviderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: Provider[];
  patientAddress?: string; // Add patient address prop
}

interface AppointmentDetails {
  provider: Provider;
  date: string;
  time: string;
}

const ProviderListModal: React.FC<ProviderListModalProps> = ({ 
  isOpen, 
  onClose, 
  providers,
  patientAddress = '' // Default to empty string
}) => {
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState<AppointmentDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState<string | null>(null); // Track which provider's directions are shown
  
  // Initialize all state variables at the top level
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  
  // For email functionality
  const emailSubjectRef = useRef<HTMLInputElement>(null);
  const emailToRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen && !isTransitioning) return null;
  
  // Toggle provider selection for comparison
  const toggleProviderSelection = (provider: Provider) => {
    if (selectedProviders.some(p => p.id === provider.id)) {
      setSelectedProviders(selectedProviders.filter(p => p.id !== provider.id));
    } else {
      // Limit to 2 providers for side-by-side comparison
      if (selectedProviders.length < 2) {
        setSelectedProviders([...selectedProviders, provider]);
      }
    }
  };
  
  // Handle appointment booking
  const handleBookAppointment = (provider: Provider) => {
    setCurrentProvider(provider);
    setShowAppointmentModal(true);
  };
  
  // Handle appointment confirmation
  const handleConfirmAppointment = () => {
    if (currentProvider && selectedDate && selectedTime) {
      setAppointmentConfirmed({
        provider: currentProvider,
        date: selectedDate,
        time: selectedTime
      });
      setShowAppointmentModal(false);
    }
  };
  
  // Handle email list
  const handleEmailList = () => {
    const subject = emailSubjectRef.current?.value || 'Provider List';
    const emailTo = emailToRef.current?.value || '';
    
    // Format the provider list as text
    const providersToEmail = selectedProviders.length > 0 ? selectedProviders : providers;
    const body = providersToEmail.map(provider => {
      return `
Name: ${provider.name}
Specialty: ${getSpecialtyDisplayName(provider.specialty)}
Address: ${provider.address}
Phone: ${provider.phone}
Network: ${provider.network === 'in-network' ? 'In-Network' : 'Out-of-Network'}
Accepting New Patients: ${provider.accepting ? 'Yes' : 'No'}
      `.trim();
    }).join('\n\n---\n\n');
    
    // Create mailto link
    const mailtoLink = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the email client
    window.open(mailtoLink, '_blank');
  };
  
  // Handle sending provider list
  const handleSendProviderList = () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      
      // Reset success message after a few seconds
      setTimeout(() => setSentSuccess(false), 3000);
    }, 1500);
  };
  
  // Generate dates for the next 14 days
  const generateDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  // Generate time slots (9am to 5pm, 30 min intervals)
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const start = 9; // 9am
    const end = 17; // 5pm
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    
    return slots;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format time for display
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    
    return `${hourNum % 12 || 12}:${minute} ${hourNum >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Handle showing directions
  const handleShowDirections = (providerId: string) => {
    setShowDirections(providerId === showDirections ? null : providerId);
  };
  
  const dates = generateDates();
  const timeSlots = generateTimeSlots();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-6xl max-h-[90vh] bg-gradient-to-b from-gray-900/95 to-gray-800/95 rounded-lg border border-indigo-500/30 shadow-xl shadow-black/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between relative">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
          <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_5px_rgba(79,70,229,0.5)]">
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Provider List</h2>
              <p className="text-xs text-indigo-300/80">Compare and book appointments</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors relative group"
              title="Close provider list"
              aria-label="Close"
            >
              <X size={18} />
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Email Form */}
          <div className="mb-6 bg-gray-800/40 border border-indigo-500/20 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Provider List Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="email-to" className="block text-xs font-medium text-gray-400 mb-1">
                  Email To
                </label>
                <input
                  type="email"
                  id="email-to"
                  ref={emailToRef}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                />
              </div>
              <div>
                <label htmlFor="email-subject" className="block text-xs font-medium text-gray-400 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="email-subject"
                  ref={emailSubjectRef}
                  defaultValue="Provider List"
                  className="w-full px-3 py-2 bg-gray-900/90 border border-indigo-500/30 rounded-md text-white text-sm 
                  focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50
                  shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200
                  hover:border-indigo-400/50 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto">
                {patientAddress && (
                  <button
                    onClick={handleSendProviderList}
                    disabled={isSending || providers.length === 0}
                    className={`w-full md:w-auto py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                      isSending ? 'bg-gray-700 cursor-not-allowed' : 
                      sentSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white transition-colors`}
                  >
                    {isSending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : sentSuccess ? (
                      <>
                        <CheckCircle size={16} />
                        <span>Provider List Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send to Patient</span>
                      </>
                    )}
                  </button>
                )}
                {patientAddress && (
                  <p className="text-xs text-gray-400 mt-2">
                    Send to: {patientAddress}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleEmailList}
                className="flex items-center justify-center gap-1 py-2 px-4 w-full md:w-auto rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Mail size={16} />
                <span>Send Email</span>
              </button>
            </div>
          </div>
          
          {/* Map View */}
          <div className="mb-6 bg-gray-800/40 border border-indigo-500/20 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Provider Locations</h3>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <ProviderMap 
                providers={providers}
                selectedProviderId={selectedLocationId || undefined}
                onProviderSelect={(id) => {
                  setSelectedLocationId(id);
                  // Find provider in the list
                  const selectedProvider = providers.find(p => p.id === id);
                  if (selectedProvider) {
                    // Scroll to the provider in the list
                    document.getElementById(`provider-${id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                }}
                patientAddress={patientAddress}
              />
            </div>
          </div>
          
          {/* Provider Comparison */}
          {selectedProviders.length > 0 && (
            <div className="mb-6 bg-gray-800/40 border border-indigo-500/20 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Provider Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProviders.map(provider => (
                  <div 
                    key={provider.id}
                    className="bg-gray-900/90 border border-indigo-500/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">{provider.name}</h4>
                      <button
                        onClick={() => toggleProviderSelection(provider)}
                        className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        title="Remove provider from comparison"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="text-sm text-teal-400 mb-1">{getSpecialtyDisplayName(provider.specialty)}</div>
                    
                    <div className="text-gray-400 text-sm mb-2">
                      <MapPin size={14} className="inline mr-1" />
                      {provider.address}
                    </div>
                    
                    <div className="text-gray-400 text-sm mb-3">
                      <Phone size={14} className="inline mr-1" />
                      {provider.phone}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        provider.network === 'in-network' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {provider.network === 'in-network' ? 'In-Network' : 'Out-of-Network'}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        provider.accepting
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {provider.accepting ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                      </span>
                    </div>
                    
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShowDirections(provider.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm font-medium ${
                        showDirections === provider.id
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_8px_rgba(79,70,229,0.6)]'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      } transition-all duration-200`}
                      title={showDirections === provider.id ? "Hide directions" : "Show directions"}
                    >
                      <Navigation size={14} className={showDirections === provider.id ? "text-indigo-200" : ""} />
                      <span>{showDirections === provider.id ? 'Hide Directions' : 'Directions'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleBookAppointment(provider)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <Calendar size={14} />
                      <span>Book</span>
                    </button>
                  </div>
                  
                    {/* Directions */}
                    {showDirections === provider.id && (
                      <div className="mt-4">
                        <DirectionsComponent 
                          origin={patientAddress} 
                          destination={provider.address}
                          onClose={() => setShowDirections(null)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Provider List */}
          <div className="bg-gray-800/40 border border-indigo-500/20 rounded-lg">
            <h3 className="text-white font-medium p-4 border-b border-indigo-500/20">Provider List</h3>
            <div className="divide-y divide-indigo-500/20">
              {providers.map(provider => (
                <div 
                  key={provider.id}
                  id={`provider-${provider.id}`}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{provider.name}</h4>
                    <div>
                      <button
                        onClick={() => toggleProviderSelection(provider)}
                        className={`p-1.5 rounded-md ${
                          selectedProviders.some(p => p.id === provider.id)
                            ? 'bg-indigo-500/20 text-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        } transition-colors mr-1`}
                        title={selectedProviders.some(p => p.id === provider.id) ? "Remove from comparison" : "Add to comparison"}
                      >
                        {selectedProviders.some(p => p.id === provider.id) ? <Check size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-teal-400 mb-1">{getSpecialtyDisplayName(provider.specialty)}</div>
                  
                  <div className="text-gray-400 text-sm mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    {provider.address}
                  </div>
                  
                  <div className="text-gray-400 text-sm mb-3">
                    <Phone size={14} className="inline mr-1" />
                    {provider.phone}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.network === 'in-network' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {provider.network === 'in-network' ? 'In-Network' : 'Out-of-Network'}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.accepting
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {provider.accepting ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShowDirections(provider.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm font-medium ${
                        showDirections === provider.id
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_8px_rgba(79,70,229,0.6)]'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      } transition-all duration-200`}
                      title={showDirections === provider.id ? "Hide directions" : "Show directions"}
                    >
                      <Navigation size={14} className={showDirections === provider.id ? "text-indigo-200" : ""} />
                      <span>{showDirections === provider.id ? 'Hide Directions' : 'Directions'}</span>
                    </button>
                    
                    <button
                      onClick={() => handleBookAppointment(provider)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_8px_rgba(79,70,229,0.6)] transition-all duration-200"
                      title="Book appointment"
                    >
                      <Calendar size={14} />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment Modal */}
      {showAppointmentModal && currentProvider && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg overflow-hidden backdrop-blur-md bg-gradient-to-b from-gray-900/95 to-gray-800/95 border border-indigo-500/30 shadow-xl shadow-black/30">
            {/* Header */}
            <div className="p-4 border-b border-indigo-500/30 bg-gray-800/50 flex items-center justify-between relative">
              {/* Decorative elements */}
              <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-indigo-500/80 to-transparent"></div>
              <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-teal-500/80 to-transparent"></div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_5px_rgba(79,70,229,0.5)]">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white">Schedule Appointment</h2>
                  <p className="text-xs text-indigo-300/80">with {currentProvider.name}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors relative group"
                title="Close appointment modal"
              >
                <X size={18} />
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {/* Date selection */}
              {!selectedDate && (
                <div>
                  <h3 className="text-white font-medium mb-4">Select a date</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {dates.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(formatDate(date))}
                        className="p-3 rounded-md text-center bg-gray-800/70 border border-gray-700/50 hover:border-indigo-500/30 hover:bg-gray-800/90 transition-colors"
                      >
                        <div className="text-xs text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-lg font-medium text-white mt-1">{date.getDate()}</div>
                        <div className="text-xs text-gray-400">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Time selection */}
              {selectedDate && !selectedTime && (
                <div>
                  <h3 className="text-white font-medium mb-2">Select a time</h3>
                  <p className="text-gray-400 text-sm mb-4">{selectedDate}</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(formatTime(time))}
                        className="py-2 px-3 rounded-md text-center bg-gray-800/70 border border-gray-700/50 hover:border-indigo-500/30 hover:bg-gray-800/90 transition-colors"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-white">{formatTime(time)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Confirmation */}
              {selectedDate && selectedTime && (
                <div>
                  <h3 className="text-white font-medium mb-4">Confirm your appointment</h3>
                  
                  <div className="bg-gray-800/50 border border-indigo-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Calendar size={18} className="text-indigo-400 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">{selectedDate}</div>
                        <div className="text-gray-400 text-sm">{selectedTime}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="relative group mt-0.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-white bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md">
                          {currentProvider.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-medium">{currentProvider.name}</div>
                        <div className="text-gray-400 text-sm">{getSpecialtyDisplayName(currentProvider.specialty)}</div>
                        <div className="text-gray-400 text-sm mt-1">{currentProvider.address}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-sm mb-4">
                    <p>This is a simulated appointment booking. No actual appointment will be scheduled.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
              {selectedDate && selectedTime ? (
                <button
                  onClick={handleConfirmAppointment}
                  className="w-full py-2 px-4 rounded-md font-medium text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_15px_rgba(79,70,229,0.7)] transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Confirm Appointment
                </button>
              ) : (
                <div className="text-center text-gray-400 text-sm">
                  {!selectedDate ? 'Select a date to continue' : 'Select a time to continue'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Appointment Confirmation */}
      {appointmentConfirmed && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg overflow-hidden backdrop-blur-md bg-gradient-to-b from-gray-900/95 to-gray-800/95 border border-emerald-500/30 shadow-xl shadow-black/30">
            <div className="px-4 py-3 bg-emerald-900/20 border-b border-emerald-500/20">
              <div className="flex items-center">
                <div className="p-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mr-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-emerald-300">Appointment Confirmed</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar size={18} className="text-emerald-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">{appointmentConfirmed.date}</div>
                    <div className="text-gray-400 text-sm">{appointmentConfirmed.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="relative group mt-0.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                      {appointmentConfirmed.provider.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{appointmentConfirmed.provider.name}</div>
                    <div className="text-gray-400 text-sm">{getSpecialtyDisplayName(appointmentConfirmed.provider.specialty)}</div>
                    <div className="text-gray-400 text-sm mt-1">{appointmentConfirmed.provider.address}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-400 text-center">
                This is a simulated appointment. No actual appointment has been scheduled.
              </div>
            </div>
            <div className="p-4 border-t border-gray-700/50 bg-gray-800/30">
              <button
                onClick={() => {
                  setAppointmentConfirmed(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="w-full py-2 px-4 rounded-md font-medium text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_15px_rgba(16,185,129,0.7)] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderListModal;

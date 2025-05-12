import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, PhoneIncoming, PhoneOutgoing, Mic, MicOff, Volume2, VolumeX, Clock, User, Plus, Search, Star, Settings, MoreVertical, MessageSquare, Calendar, Star as StarIcon, RefreshCw, Voicemail } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  isFavorite: boolean;
  avatarColor?: string;
}

interface CallLog {
  id: string;
  contactId: string;
  contactName: string;
  time: string;
  timestamp: number;
  duration: string;
  durationSeconds: number;
  type: 'incoming' | 'outgoing';
  status: 'success' | 'missed' | 'ongoing' | 'scheduled';
  notes?: string;
}

const PhoneTab: React.FC = () => {
  // States
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [showDialpad, setShowDialpad] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'contacts' | 'favorites' | 'voicemail'>('recent');

  // Timer for call duration
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isCalling && callStatus === 'connected') {
      intervalId = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isCalling, callStatus]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Call logs sorted by time (most recent first)
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: 'call1',
      contactId: 'contact1',
      contactName: 'Sarah Johnson',
      time: 'Today, 09:30 AM',
      timestamp: Date.now() - 3600000, // 1 hour ago
      duration: '15 mins',
      durationSeconds: 15 * 60,
      type: 'outgoing',
      status: 'success',
      notes: 'Discussed patient care plan and medication changes'
    },
    {
      id: 'call2',
      contactId: 'contact2',
      contactName: 'Mark Davis',
      time: 'Yesterday, 04:15 PM',
      timestamp: Date.now() - 86400000, // 1 day ago
      duration: '10 mins',
      durationSeconds: 10 * 60,
      type: 'incoming',
      status: 'success'
    },
    {
      id: 'call3',
      contactId: 'contact3',
      contactName: 'Dr. Emily Smith',
      time: 'Yesterday, 02:30 PM',
      timestamp: Date.now() - 86400000 - 7200000, // 1 day + 2 hours ago
      duration: '-',
      durationSeconds: 0,
      type: 'incoming',
      status: 'missed'
    },
    {
      id: 'call4',
      contactId: 'contact4',
      contactName: 'James Wilson',
      time: 'Tomorrow, 10:00 AM',
      timestamp: Date.now() + 86400000, // 1 day in future
      duration: '-',
      durationSeconds: 0,
      type: 'outgoing',
      status: 'scheduled'
    },
    {
      id: 'call5',
      contactId: 'contact5',
      contactName: 'Lisa Brown',
      time: '2 days ago',
      timestamp: Date.now() - 172800000, // 2 days ago
      duration: '5 mins',
      durationSeconds: 5 * 60,
      type: 'outgoing',
      status: 'success'
    },
  ]);

  // Contacts list
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact1',
      name: 'Sarah Johnson',
      role: 'Case Manager',
      phone: '(555) 123-4567',
      email: 'sarah.j@healthcare.org',
      isFavorite: true,
      avatarColor: 'indigo'
    },
    {
      id: 'contact2',
      name: 'Mark Davis',
      role: 'Insurance Rep',
      phone: '(555) 234-5678',
      email: 'mark.d@insurance.com',
      isFavorite: false,
      avatarColor: 'emerald'
    },
    {
      id: 'contact3',
      name: 'Dr. Emily Smith',
      role: 'Orthopedic Surgeon',
      phone: '(555) 345-6789',
      email: 'dr.smith@medical.org',
      isFavorite: true,
      avatarColor: 'amber'
    },
    {
      id: 'contact4',
      name: 'James Wilson',
      role: 'Patient',
      phone: '(555) 456-7890',
      isFavorite: false,
      avatarColor: 'rose'
    },
    {
      id: 'contact5',
      name: 'Lisa Brown',
      role: 'Nurse Practitioner',
      phone: '(555) 567-8901',
      email: 'lisa.b@healthcare.org',
      isFavorite: false,
      avatarColor: 'blue'
    },
  ]);

  // Call Handling Functions
  const startCall = (contact?: Contact) => {
    if (contact) {
      setSelectedContact(contact);
    }
    setIsCalling(true);
    setCallStatus('dialing');
    setCallDuration(0);

    // Simulate connecting after a delay
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% chance of connecting
        setCallStatus('connected');
      } else {
        endCall('missed');
      }
    }, 3000);
  };

  const endCall = (status: 'success' | 'missed' = 'success') => {
    if (isCalling) {
      // Add to call logs
      if (selectedContact) {
        const newLog: CallLog = {
          id: `call${Date.now()}`,
          contactId: selectedContact.id,
          contactName: selectedContact.name,
          time: 'Just now',
          timestamp: Date.now(),
          duration: formatTime(callDuration),
          durationSeconds: callDuration,
          type: 'outgoing',
          status: status,
          notes: callNotes
        };
        setCallLogs([newLog, ...callLogs]);
      }

      setIsCalling(false);
      setCallStatus('ended');
      setIsMuted(false);
      setIsSpeakerOn(false);
      setShowNotes(false);
      setCallNotes('');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real app, this would interact with the Web Audio API
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real app, this would interact with the Web Audio API
  };

  // Contact Management
  const toggleFavorite = (contactId: string) => {
    setContacts(contacts.map(contact =>
      contact.id === contactId
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };

  const addContact = () => {
    alert('Add contact functionality would open a form here');
  };

  // Call Log Management
  const deleteCallLog = (logId: string) => {
    setCallLogs(callLogs.filter(log => log.id !== logId));
  };

  const scheduleCallback = (contactId: string) => {
    alert(`Callback scheduled with ${contacts.find(c => c.id === contactId)?.name}`);
  };

  // Phone Keypad
  const handleKeypadPress = (key: string) => {
    setPhoneNumber(prev => prev + key);
    // In a real app, this would also play DTMF tones
  };

  // Filtered contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const favoriteContacts = contacts.filter(contact => contact.isFavorite);

  // Filtered call logs
  const filteredLogs = callLogs.filter(log =>
    log.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulated voicemails
  const voicemails = [
    { id: 'vm1', name: 'Dr. Emily Smith', time: 'Yesterday, 3:15 PM', duration: '0:45', isNew: true },
    { id: 'vm2', name: 'Insurance Verification', time: '3 days ago', duration: '1:20', isNew: false },
  ];

  // Render Functions
  const renderActiveCallUI = () => {
    if (!selectedContact) return null;

    return (
      <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-gray-900/90 via-gray-800/90 to-gray-900/90">
        <div className="mb-8 text-center">
          <div className="text-xs text-gray-400 mb-2">
            {callStatus === 'dialing' ? 'Calling...' : `Call in progress: ${formatTime(callDuration)}`}
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping opacity-30"></div>
            <div className="absolute inset-3 rounded-full bg-indigo-500/20 animate-ping opacity-50 animation-delay-300"></div>
            <div className="relative w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <span className="text-4xl text-indigo-300 font-semibold">{selectedContact.name.charAt(0)}</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-1">
            {selectedContact.name}
          </h2>
          <p className="text-indigo-300/80 mb-3">{selectedContact.role}</p>
          <p className="text-sm text-gray-400">{selectedContact.phone}</p>
        </div>

        {/* Call Actions */}
        <div className="w-full max-w-md">
          {/* Call Controls */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-xl flex flex-col items-center justify-center ${isMuted ? 'bg-indigo-600/30 text-indigo-300' : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              {isMuted ? <MicOff className="mb-2" size={24} /> : <Mic className="mb-2" size={24} />}
              <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={toggleSpeaker}
              className={`p-4 rounded-xl flex flex-col items-center justify-center ${isSpeakerOn ? 'bg-indigo-600/30 text-indigo-300' : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              {isSpeakerOn ? <Volume2 className="mb-2" size={24} /> : <VolumeX className="mb-2" size={24} />}
              <span className="text-xs">{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
            </button>

            <button
              onClick={() => setShowDialpad(!showDialpad)}
              className={`p-4 rounded-xl flex flex-col items-center justify-center ${showDialpad ? 'bg-indigo-600/30 text-indigo-300' : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              <Keypad className="mb-2" size={24} />
              <span className="text-xs">Keypad</span>
            </button>
          </div>

          {showDialpad && (
            <div className="mb-8 bg-gray-800/30 rounded-xl p-4">
              <div className="p-2 bg-gray-900/50 rounded-lg mb-4 text-center">
                <span className="text-xl text-white tracking-wider">{phoneNumber || '000-000-0000'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(key => (
                  <button
                    key={key}
                    onClick={() => handleKeypadPress(key.toString())}
                    className="p-4 rounded-lg bg-gray-800/50 text-white hover:bg-indigo-600/30 transition-colors"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showDialpad && callStatus === 'connected' && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="w-full mb-8 p-3 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-indigo-600/20 hover:text-white flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              {showNotes ? 'Hide Notes' : 'Add Call Notes'}
            </button>
          )}

          {showNotes && (
            <div className="mb-8 bg-gray-800/30 rounded-xl p-4">
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Enter call notes here..."
                className="w-full h-24 p-3 bg-gray-900/50 border border-indigo-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* End Call Button */}
          <button
            onClick={() => endCall()}
            className="w-full py-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center gap-2"
          >
            <PhoneOff size={20} />
            End Call
          </button>
        </div>
      </div>
    );
  };

  const renderDialpad = () => {
    return (
      <div className="p-6 bg-gray-800/30 rounded-xl">
        {/* Display */}
        <div className="mb-6 text-center">
          <div className="p-4 bg-gray-900/50 rounded-lg mb-2">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-transparent text-center text-2xl text-white focus:outline-none"
              placeholder="Enter phone number"
            />
          </div>
          {phoneNumber && (
            <button
              onClick={() => setPhoneNumber('')}
              className="text-xs text-gray-400 hover:text-indigo-400"
            >
              Clear
            </button>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(key => (
            <button
              key={key}
              onClick={() => handleKeypadPress(key.toString())}
              className="p-6 rounded-lg bg-gray-800/50 text-white text-2xl hover:bg-indigo-600/30 transition-colors"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Call Button */}
        <button
          onClick={() => startCall()}
          disabled={!phoneNumber.trim()}
          className={`w-full mt-6 py-4 rounded-full flex items-center justify-center gap-2 ${phoneNumber.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
        >
          <Phone size={20} />
          Call
        </button>
      </div>
    );
  };

  const renderCallLogs = () => {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {selectedLogId ? (
            renderCallDetails()
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Phone size={48} className="opacity-30 mb-4" />
              <p>No call history found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLogId(log.id)}
                className="p-3 rounded-lg cursor-pointer bg-gray-800/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200 flex items-start justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {log.contactName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {log.contactName}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      {log.type === 'incoming' ? (
                        <PhoneIncoming size={12} className={log.status === 'missed' ? 'text-rose-400' : 'text-indigo-400'} />
                      ) : (
                        <PhoneOutgoing size={12} className="text-indigo-400" />
                      )}
                      <span className={log.status === 'missed' ? 'text-rose-400' : 'text-gray-400'}>
                        {log.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {log.status === 'scheduled' ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-400 flex items-center gap-1">
                      <Calendar size={10} />
                      Scheduled
                    </span>
                  ) : log.status === 'missed' ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500/20 text-rose-400">
                      Missed
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {log.duration}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderCallDetails = () => {
    const log = callLogs.find(l => l.id === selectedLogId);
    if (!log) return null;

    const contact = contacts.find(c => c.id === log.contactId);

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedLogId(null)}
            className="p-2 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="text-lg font-medium text-white">Call Details</h3>
          <div></div> {/* Placeholder for alignment */}
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <span className="text-3xl font-medium">{log.contactName.charAt(0)}</span>
          </div>
          <h2 className="text-xl font-medium text-white mb-1">{log.contactName}</h2>
          <p className="text-gray-400 text-sm mb-2">{contact?.role || 'Contact'}</p>
          <p className="text-indigo-400">{contact?.phone || ''}</p>

          <div className="flex items-center gap-8 mt-6">
            <button className="flex flex-col items-center text-indigo-400 hover:text-indigo-300" onClick={() => startCall(contact || undefined)}>
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-1">
                <Phone size={20} />
              </div>
              <span className="text-xs">Call</span>
            </button>

            <button className="flex flex-col items-center text-indigo-400 hover:text-indigo-300">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-1">
                <MessageSquare size={20} />
              </div>
              <span className="text-xs">Message</span>
            </button>

            <button
              className="flex flex-col items-center text-indigo-400 hover:text-indigo-300"
              onClick={() => contact && toggleFavorite(contact.id)}
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-1">
                <Star size={20} className={contact?.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
              </div>
              <span className="text-xs">Favorite</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-white font-medium">Call Information</h4>
            <button
              onClick={() => deleteCallLog(log.id)}
              className="text-gray-400 hover:text-rose-400 p-1 hover:bg-gray-700/50 rounded-md"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white flex items-center gap-1">
                {log.type === 'incoming' ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />}
                {log.type === 'incoming' ? 'Incoming' : 'Outgoing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-white">
                {log.status === 'success' ? 'Completed' :
                 log.status === 'missed' ? 'Missed' :
                 log.status === 'scheduled' ? 'Scheduled' : 'Ongoing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date & Time:</span>
              <span className="text-white">{log.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">{log.status === 'missed' || log.status === 'scheduled' ? '-' : log.duration}</span>
            </div>
          </div>
        </div>

        {log.notes && (
          <div className="bg-gray-800/30 rounded-xl p-4 mb-4">
            <h4 className="text-white font-medium mb-2">Notes</h4>
            <p className="text-gray-300 text-sm">{log.notes}</p>
          </div>
        )}

        {log.status === 'missed' && (
          <button
            onClick={() => scheduleCallback(log.contactId)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Schedule Callback
          </button>
        )}
      </div>
    );
  };

  const renderContacts = () => {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {activeTab === 'favorites' && favoriteContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Star size={48} className="opacity-30 mb-4" />
              <p>No favorite contacts</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <User size={48} className="opacity-30 mb-4" />
              <p>No contacts found</p>
            </div>
          ) : (
            (activeTab === 'favorites' ? favoriteContacts : filteredContacts).map((contact) => (
              <div
                key={contact.id}
                className="p-3 rounded-lg cursor-pointer bg-gray-800/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${contact.avatarColor || 'indigo'}-500/20 text-${contact.avatarColor || 'indigo'}-400 border border-${contact.avatarColor || 'indigo'}-500/30`}>
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-400">{contact.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startCall(contact)}
                      className="p-2 rounded-md text-indigo-400 hover:text-white hover:bg-indigo-500/20"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(contact.id);
                      }}
                      className="p-2 rounded-md hover:bg-gray-700/50"
                    >
                      <Star
                        size={16}
                        className={contact.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-2 pl-13 ml-3">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 w-12">Phone:</span>
                    <span className="text-sm text-indigo-300">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 w-12">Email:</span>
                      <span className="text-sm text-indigo-300">{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderVoicemail = () => {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {voicemails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Voicemail size={48} className="opacity-30 mb-4" />
              <p>No voicemails</p>
            </div>
          ) : (
            voicemails.map((vm) => (
              <div
                key={vm.id}
                className="p-3 rounded-lg cursor-pointer bg-gray-800/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Voicemail size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {vm.name}
                        </p>
                        {vm.isNew && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-400">New</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={10} />
                        <span>{vm.time}</span>
                        <span>•</span>
                        <span>{vm.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50">
                      <Play size={16} />
                    </button>
                    <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (isCalling) {
    return renderActiveCallUI();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and tabs */}
      <div className="p-3 border-b border-indigo-500/20">
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'recent' ? "Search call history..." : "Search contacts..."}
            className="w-full bg-gray-800/50 border border-indigo-500/20 text-white text-sm rounded-lg focus:border-indigo-500 block pl-10 p-2.5"
          />
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'recent' ? 'bg-indigo-600/30 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'contacts' ? 'bg-indigo-600/30 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'favorites' ? 'bg-indigo-600/30 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('voicemail')}
              className={`px-3 py-1.5 rounded-md text-sm ${activeTab === 'voicemail' ? 'bg-indigo-600/30 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Voicemail
            </button>
          </div>

          {activeTab === 'contacts' && (
            <button
              onClick={addContact}
              className="p-1.5 rounded-md text-indigo-400 hover:text-white hover:bg-indigo-600/30"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      {activeTab === 'recent' && renderCallLogs()}
      {(activeTab === 'contacts' || activeTab === 'favorites') && renderContacts()}
      {activeTab === 'voicemail' && renderVoicemail()}

      {/* Dialer button */}
      {!selectedLogId && (
        <div className="p-4 border-t border-indigo-500/20 flex justify-center">
          <button
            onClick={() => startCall(favoriteContacts[0])}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Make a Call
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneTab;

// Helper components
const Play = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Keypad = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="5.5" r="2.5"></circle>
    <circle cx="12" cy="5.5" r="2.5"></circle>
    <circle cx="18.5" cy="5.5" r="2.5"></circle>
    <circle cx="5.5" cy="12" r="2.5"></circle>
    <circle cx="12" cy="12" r="2.5"></circle>
    <circle cx="18.5" cy="12" r="2.5"></circle>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="12" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const ArrowLeft = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

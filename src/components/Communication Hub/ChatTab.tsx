import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Smile,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  User,
  Bot,
  Paperclip,
  Mic,
  MicOff,
  Phone,
  Video,
  MoreHorizontal,
  Clock,
  Star,
  Flag,
  Search,
  Users,
  PlusCircle,
  ChevronDown,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Forward,
  Edit as EditIcon,
  Trash,
  Volume2,
  Play,
  Pause,
  Circle,
  Download
} from 'lucide-react';

interface MessageAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'pdf' | 'voice' | 'video';
  size: string;
  url?: string;
  thumbnail?: string;
  duration?: string;
}

interface MessageReaction {
  type: 'like' | 'heart' | 'thumbsUp' | 'thumbsDown';
  user: string;
  timestamp: number;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  role: string;
  specialty?: string;
  isStarred?: boolean;
}

interface ChatGroup {
  id: string;
  name: string;
  participants: Contact[];
  unreadCount?: number;
  lastMessage?: {
    sender: string;
    preview: string;
    time: string;
  };
  isActive?: boolean;
}

interface Message {
  id: string;
  sender: string;
  senderRole?: string;
  senderAvatar?: string;
  time: string;
  timestamp: number;
  message: string;
  status?: 'approved' | 'denied' | 'pending';
  isAI?: boolean;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  isEdited?: boolean;
  isStarred?: boolean;
  isFlagged?: boolean;
  isRead?: boolean;
  replyTo?: {
    id: string;
    sender: string;
    message: string;
  };
  isDeleted?: boolean;
  isVoiceMessage?: boolean;
  voiceDuration?: string;
}

const ChatTab: React.FC = () => {
  // Mock data for contacts and chat groups
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Dr. Smith', status: 'online', role: 'Orthopedic Surgeon', isStarred: true },
    { id: '2', name: 'Dr. Johnson', status: 'away', role: 'Primary Care', lastSeen: '10 min ago' },
    { id: '3', name: 'Nurse Rodriguez', status: 'online', role: 'RN, Surgical Team' },
    { id: '4', name: 'Dr. Williams', status: 'busy', role: 'Cardiologist' },
    { id: '5', name: 'Dr. Chen', status: 'offline', role: 'Neurologist', lastSeen: '2 hours ago' },
  ]);

  const [groups, setGroups] = useState<ChatGroup[]>([
    {
      id: 'g1',
      name: 'ACL Surgery Team',
      participants: [contacts[0], contacts[2]],
      isActive: true,
      unreadCount: 0
    },
    {
      id: 'g2',
      name: 'Cardiology Consult',
      participants: [contacts[1], contacts[3], contacts[4]],
      unreadCount: 3,
      lastMessage: {
        sender: 'Dr. Williams',
        preview: "The patient's cardiovascular status is stable...",
        time: 'Yesterday'
      }
    },
  ]);

  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(groups[0]);
  const [showContacts, setShowContacts] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with enhanced message format
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: '1',
      sender: 'Ron AI',
      senderRole: 'AI Assistant',
      time: '10:00 AM',
      timestamp: Date.now() - 3600000,
      message: 'Your prior authorization request for ACL surgery has been approved based on the clinical documentation provided. The approval is valid for 60 days.',
      status: 'approved',
      isAI: true,
      attachments: [
        {
          id: 'a1',
          name: 'Authorization-Document.pdf',
          type: 'pdf',
          size: '1.2 MB',
          url: '#'
        }
      ],
      isRead: true
    },
    {
      id: '2',
      sender: 'Dr. Smith',
      senderRole: 'Orthopedic Surgeon',
      time: '10:02 AM',
      timestamp: Date.now() - 3500000,
      message: 'Thank you for the update. When can we schedule the procedure?',
      isRead: true
    },
    {
      id: '3',
      sender: 'Ron AI',
      senderRole: 'AI Assistant',
      time: '10:03 AM',
      timestamp: Date.now() - 3400000,
      message: 'The procedure can be scheduled anytime within the 60-day approval window. Would you like me to coordinate with the surgical scheduling team?',
      isAI: true,
      isRead: true,
      reactions: [
        { type: 'thumbsUp', user: 'Dr. Smith', timestamp: Date.now() - 3300000 }
      ]
    },
    {
      id: '4',
      sender: 'Nurse Rodriguez',
      senderRole: 'RN, Surgical Team',
      time: '10:05 AM',
      timestamp: Date.now() - 3200000,
      message: "I've checked the OR availability. We have openings next Tuesday and Thursday morning.",
      isRead: true
    },
    {
      id: '5',
      sender: 'Dr. Smith',
      senderRole: 'Orthopedic Surgeon',
      time: '10:07 AM',
      timestamp: Date.now() - 3100000,
      message: "Thursday works better for me. Let's book the OR for 8 AM.",
      isRead: true,
      replyTo: {
        id: '4',
        sender: 'Nurse Rodriguez',
        message: "I've checked the OR availability. We have openings next Tuesday and Thursday morning."
      }
    },
  ]);

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Simulate typing indicators
  useEffect(() => {
    if (input.trim() !== '') {
      const typingTimeout = setTimeout(() => {
        // Simulate someone typing from the active conversation
        const typingContact = activeGroup?.participants.find(p => p.id !== '1' && Math.random() > 0.7);
        if (typingContact && !isTyping) {
          setIsTyping(true);
          // Clear typing indicator after random time
          setTimeout(() => setIsTyping(false), Math.random() * 3000 + 1000);
        }
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [input, activeGroup]);

  // Handle voice recording timer
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval) clearInterval(recordingInterval);
    };
  }, [isRecording]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSend = () => {
    if (input.trim() !== '') {
      const timestamp = Date.now();
      const newMessage: Message = {
        id: `msg-${timestamp}`,
        sender: 'You',
        senderRole: 'Care Coordinator',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: timestamp,
        message: input,
        isRead: true,
        ...(replyingTo ? {
          replyTo: {
            id: replyingTo.id,
            sender: replyingTo.sender,
            message: replyingTo.message,
          }
        } : {})
      };

      setConversation([...conversation, newMessage]);
      setInput('');
      setReplyingTo(null);

      // Simulate AI response after a short delay
      setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          const aiResponse: Message = {
            id: `msg-${Date.now()}`,
            sender: 'Ron AI',
            senderRole: 'AI Assistant',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            message: 'I understand your concern. Let me check the latest guidelines for this procedure and get back to you shortly.',
            isAI: true,
            isRead: true
          };
          setConversation(prev => [...prev, aiResponse]);
        }, 2000);
      }, 1000);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleReaction = (messageId: string, reactionType: MessageReaction['type']) => {
    setConversation(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReactionIndex = msg.reactions?.findIndex(
            r => r.type === reactionType && r.user === 'You'
          );

          if (existingReactionIndex !== undefined && existingReactionIndex >= 0 && msg.reactions) {
            // Remove reaction if already exists
            return {
              ...msg,
              reactions: [
                ...msg.reactions.slice(0, existingReactionIndex),
                ...msg.reactions.slice(existingReactionIndex + 1)
              ]
            };
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { type: reactionType, user: 'You', timestamp: Date.now() }
              ]
            };
          }
        }
        return msg;
      })
    );
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      // Stop recording and send voice message
      setIsRecording(false);

      if (recordingTime > 0) {
        const voiceMessage: Message = {
          id: `msg-${Date.now()}`,
          sender: 'You',
          senderRole: 'Care Coordinator',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          message: '',
          isVoiceMessage: true,
          voiceDuration: formatRecordingTime(recordingTime),
          attachments: [
            {
              id: `voice-${Date.now()}`,
              name: `Voice message (${formatRecordingTime(recordingTime)})`,
              type: 'voice',
              size: '0.8 MB',
              duration: formatRecordingTime(recordingTime)
            }
          ],
          isRead: true
        };

        setConversation([...conversation, voiceMessage]);
      }
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleAttachment = (type: MessageAttachment['type']) => {
    setShowAttachmentOptions(false);

    // Simulate attachment upload
    const attachmentTypes = {
      'image': { name: 'Patient-Xray.jpg', size: '2.4 MB' },
      'document': { name: 'Treatment-Plan.docx', size: '1.1 MB' },
      'pdf': { name: 'Lab-Results.pdf', size: '3.2 MB' },
      'video': { name: 'Procedure-Demo.mp4', size: '8.7 MB', duration: '1:24' }
    };

    const attachment = attachmentTypes[type as keyof typeof attachmentTypes];

    if (attachment) {
      const attachmentSpecificProps: { duration?: string } = {};
      if (type === 'video' && 'duration' in attachment) {
        attachmentSpecificProps.duration = (attachment as { name: string; size: string; duration: string; }).duration;
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'You',
        senderRole: 'Care Coordinator',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        message: type === 'image' ? '' : `Sharing ${attachment.name}`,
        attachments: [{
          id: `att-${Date.now()}`,
          name: attachment.name,
          type: type,
          size: attachment.size,
          ...attachmentSpecificProps
        }],
        isRead: true
      };

      setConversation([...conversation, newMessage]);
    }
  };

  const toggleStarMessage = (messageId: string) => {
    setConversation(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isStarred: !msg.isStarred };
        }
        return msg;
      })
    );
  };

  const toggleFlagMessage = (messageId: string) => {
    setConversation(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isFlagged: !msg.isFlagged };
        }
        return msg;
      })
    );
  };

  const StatusBadge: React.FC<{ status: Message['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1";

    switch (status) {
      case 'approved':
        return (
          <span className={`${baseClasses} bg-emerald-500/20 text-emerald-400`}>
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className={`${baseClasses} bg-rose-500/20 text-rose-400`}>
            <XCircle size={12} />
            Denied
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-amber-500/20 text-amber-400`}>
            <AlertTriangle size={12} />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const ActionButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> =
    ({ icon, label, active = false, onClick }) => (
      <button
        className={`p-2 rounded-lg transition-colors ${active
          ? 'text-indigo-400 bg-indigo-500/20'
          : 'text-gray-400 hover:text-white hover:bg-indigo-500/20'}`}
        aria-label={label}
        title={label}
        onClick={onClick}
      >
        {icon}
      </button>
    );

  return (
    <div className="flex flex-col h-full">
      {/* Chat header with active conversation info */}
      <div className="flex-shrink-0 p-3 border-b border-indigo-500/30 bg-gray-900/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeGroup ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Users size={18} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-100">{activeGroup.name}</h3>
                <p className="text-xs text-gray-400">
                  {activeGroup.participants.length} participants • {activeGroup.participants.filter(p => p.status === 'online').length} online
                </p>
              </div>
            </>
          ) : activeContact ? (
            <>
              <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br
                from-indigo-600/20 to-emerald-600/20 border border-indigo-500/30
                flex items-center justify-center`}>
                <User size={18} className="text-indigo-400" />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900
                  ${activeContact.status === 'online' ? 'bg-emerald-500' :
                    activeContact.status === 'away' ? 'bg-amber-500' :
                      activeContact.status === 'busy' ? 'bg-rose-500' : 'bg-gray-500'}`}
                />
              </div>
              <div>
                <h3 className="font-medium text-indigo-100">{activeContact.name}</h3>
                <p className="text-xs text-gray-400">
                  {activeContact.role} • {activeContact.status === 'online' ? 'Online' :
                    activeContact.status === 'away' ? 'Away' :
                      activeContact.status === 'busy' ? 'Busy' :
                        `Last seen ${activeContact.lastSeen}`}
                </p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-medium text-indigo-100">Team Chat</h3>
              <p className="text-xs text-gray-400">3 participants</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20"
            onClick={() => setShowContacts(!showContacts)}
            title="Show Contacts"
            aria-label="Show Contacts"
          >
            <Users size={18} />
          </button>
          <button
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-indigo-500/20"
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            title="Show Info Panel"
            aria-label="Show Info Panel"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Main chat container - flexible layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts/Groups panel - conditionally shown */}
        {showContacts && (
          <div className="w-72 border-r border-indigo-500/30 bg-gray-900/50 flex-shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-indigo-500/20">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full bg-gray-800/80 border border-indigo-500/30 rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Chat groups */}
            <div className="px-2 pt-3">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Groups</h4>
              <div className="space-y-1">
                {groups.map(group => (
                  <button
                    key={group.id}
                    className={`w-full px-2 py-2 flex items-center gap-3 rounded-lg transition-colors
                      ${group.id === activeGroup?.id
                        ? 'bg-indigo-500/20 border border-indigo-500/30'
                        : 'hover:bg-gray-800/70'}`}
                    onClick={() => {
                      setActiveGroup(group);
                      setActiveContact(null);
                      setShowContacts(false);
                    }}
                    title={`Select group ${group.name}`}
                    aria-label={`Select group ${group.name}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center">
                      <Users size={16} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-indigo-100">{group.name}</span>
                        {group.lastMessage && (
                          <span className="text-xs text-gray-500">{group.lastMessage.time}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {group.lastMessage ? (
                          <span className="text-xs text-gray-400 truncate max-w-[180px]">
                            {group.lastMessage.sender}: {group.lastMessage.preview}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">No messages yet</span>
                        )}
                        {group.unreadCount && group.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-xs font-medium text-white">
                            {group.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  className="w-full px-2 py-2 flex items-center gap-2 text-indigo-400 hover:bg-gray-800/50 rounded-lg"
                  onClick={() => {
                    // Would open a dialog to create new group
                    const newId = `g${groups.length + 1}`;
                    const newGroup: ChatGroup = {
                      id: newId,
                      name: `New Care Team ${groups.length + 1}`,
                      participants: [contacts[0]],
                      isActive: true,
                      unreadCount: 0
                    };
                    setGroups([...groups, newGroup]);
                  }}
                  title="Create New Group"
                  aria-label="Create New Group"
                >
                  <PlusCircle size={16} />
                  <span className="text-sm">Create New Group</span>
                </button>
              </div>
            </div>

            {/* Direct contacts */}
            <div className="px-2 pt-4">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Contacts</h4>
              <div className="space-y-1">
                {contacts
                  .filter(contact =>
                    !searchQuery ||
                    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(contact => (
                    <button
                      key={contact.id}
                      className={`w-full px-2 py-2 flex items-center gap-3 rounded-lg transition-colors
                        ${contact.id === activeContact?.id
                          ? 'bg-indigo-500/20 border border-indigo-500/30'
                          : 'hover:bg-gray-800/70'}`}
                      onClick={() => {
                        setActiveContact(contact);
                        setActiveGroup(null);
                        setShowContacts(false);
                      }}
                      title={`Select contact ${contact.name}`}
                      aria-label={`Select contact ${contact.name}`}
                    >
                      <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-600/50 flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900
                          ${contact.status === 'online' ? 'bg-emerald-500' :
                            contact.status === 'away' ? 'bg-amber-500' :
                              contact.status === 'busy' ? 'bg-rose-500' : 'bg-gray-500'}`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-indigo-100">{contact.name}</span>
                          {contact.isStarred && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </div>
                        <span className="text-xs text-gray-400">{contact.role}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full
                        ${contact.status === 'online' ? 'bg-emerald-500' :
                          contact.status === 'away' ? 'bg-amber-500' :
                            contact.status === 'busy' ? 'bg-rose-500' : 'bg-gray-500'}`}
                      />
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* Messages area - Center panel, scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Show reply-to interface */}
            {replyingTo && (
              <div className="mx-2 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-indigo-300 mb-1">
                    <Reply size={14} />
                    <span>Replying to {replyingTo.sender}</span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{replyingTo.message}</p>
                </div>
                <button className="text-gray-400 hover:text-white p-1" onClick={() => setReplyingTo(null)} title="Close reply" aria-label="Close reply">
                  <XCircle size={16} />
                </button>
              </div>
            )}

            {conversation.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 group ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`relative w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                  ${msg.isAI
                    ? 'bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30'
                    : 'bg-gradient-to-br from-gray-700/30 to-gray-600/30 border border-gray-600/30'}`}>
                  {msg.isAI
                    ? <Bot size={16} className="text-indigo-400" />
                    : <User size={16} className="text-gray-400" />}
                </div>

                {/* Message Content */}
                <div className={`relative max-w-md rounded-xl px-4 py-3 group
                  ${msg.isFlagged ? 'ring-1 ring-rose-500/50' : ''}
                  ${msg.isStarred ? 'ring-1 ring-amber-500/50' : ''}
                  ${msg.sender === 'You'
                    ? 'bg-indigo-500/10 border border-indigo-500/20'
                    : msg.isAI
                      ? 'bg-gray-800/70 border border-gray-700/50'
                      : 'bg-gray-800/50 border border-gray-700/30'
                  }`}>
                  {/* Message Header */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      {msg.isAI ? <Bot size={12} /> : <User size={12} />}
                      <span>{msg.sender}</span>
                      {msg.senderRole && (
                        <span className="text-gray-500">• {msg.senderRole}</span>
                      )}
                      {msg.isEdited && (
                        <span className="text-gray-500 italic">(edited)</span>
                      )}
                    </div>
                    <span>{msg.time}</span>
                  </div>

                  {/* Reply reference */}
                  {msg.replyTo && (
                    <div className="mb-2 pb-2 pl-2 border-l-2 border-indigo-500/40">
                      <div className="flex items-center gap-1 text-xs text-indigo-400 mb-1">
                        <Reply size={10} />
                        <span>Reply to {msg.replyTo.sender}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{msg.replyTo.message}</p>
                    </div>
                  )}

                  {/* Voice message */}
                  {msg.isVoiceMessage ? (
                    <div className="flex items-center gap-3 text-white py-1">
                      <button className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/30" title="Play Voice Message" aria-label="Play Voice Message">
                        <Play size={16} />
                      </button>
                      <div className="flex-1">
                        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full w-[30%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{msg.voiceDuration}</span>
                    </div>
                  ) : (
                    <p className="text-white leading-relaxed">
                      {msg.message}
                    </p>
                  )}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.attachments.map(attachment => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/40 transition-colors"
                        >
                          {attachment.type === 'image' ? (
                            <ImageIcon size={20} className="text-blue-400" />
                          ) : attachment.type === 'document' ? (
                            <FileText size={20} className="text-indigo-400" />
                          ) : attachment.type === 'pdf' ? (
                            <FileText size={20} className="text-rose-400" />
                          ) : attachment.type === 'voice' ? (
                            <Volume2 size={20} className="text-emerald-400" />
                          ) : (
                            <Video size={20} className="text-amber-400" />
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{attachment.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{attachment.size}</span>
                              {attachment.duration && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {attachment.duration}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50" title="Download Attachment" aria-label="Download Attachment">
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message status */}
                  {msg.status && (
                    <div className="mt-2 flex justify-end">
                      <StatusBadge status={msg.status} />
                    </div>
                  )}

                  {/* Message reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-800/70 border border-gray-700/50"
                        >
                          {reaction.type === 'like' && <Heart size={12} className="text-rose-400" />}
                          {reaction.type === 'heart' && <Heart size={12} className="text-rose-400 fill-rose-400" />}
                          {reaction.type === 'thumbsUp' && <ThumbsUp size={12} className="text-indigo-400" />}
                          {reaction.type === 'thumbsDown' && <ThumbsDown size={12} className="text-amber-400" />}
                          <span className="text-gray-400">{reaction.user}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message actions - visible on hover */}
                  <div className={`absolute ${msg.sender === 'You' ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'} top-1/2 -translate-y-1/2
                    opacity-0 group-hover:opacity-100 transition-opacity flex flex-col bg-gray-800/90
                    border border-gray-700/50 rounded-lg backdrop-blur-sm shadow-lg p-1`}>
                    <button
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
                      onClick={() => handleReply(msg)}
                      title="Reply"
                      aria-label="Reply"
                    >
                      <Reply size={14} />
                    </button>
                    <button
                      className={`p-1.5 ${msg.isStarred ? 'text-amber-400' : 'text-gray-400'} hover:text-amber-400 hover:bg-gray-700/50 rounded-md transition-colors`}
                      onClick={() => toggleStarMessage(msg.id)}
                      title={msg.isStarred ? "Unstar" : "Star message"}
                      aria-label={msg.isStarred ? "Unstar" : "Star message"}
                    >
                      <Star size={14} className={msg.isStarred ? "fill-amber-400" : ""} />
                    </button>
                    <button
                      className={`p-1.5 ${msg.isFlagged ? 'text-rose-400' : 'text-gray-400'} hover:text-rose-400 hover:bg-gray-700/50 rounded-md transition-colors`}
                      onClick={() => toggleFlagMessage(msg.id)}
                      title={msg.isFlagged ? "Remove flag" : "Flag message"}
                      aria-label={msg.isFlagged ? "Remove flag" : "Flag message"}
                    >
                      <Flag size={14} />
                    </button>
                    <div className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md relative group/reactions">
                      <Smile size={14} />
                      <div className="absolute top-0 left-full ml-1 p-1 hidden group-hover/reactions:flex rounded-lg gap-1 bg-gray-800 border border-gray-700">
                        <button
                          className="p-1 hover:bg-gray-700 rounded"
                          onClick={() => handleReaction(msg.id, 'like')}
                          title="React: Like"
                          aria-label="React: Like"
                        >
                          <Heart size={14} className="text-rose-400" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-700 rounded"
                          onClick={() => handleReaction(msg.id, 'heart')}
                          title="React: Heart"
                          aria-label="React: Heart"
                        >
                          <Heart size={14} className="text-rose-400 fill-rose-400" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-700 rounded"
                          onClick={() => handleReaction(msg.id, 'thumbsUp')}
                          title="React: Thumbs Up"
                          aria-label="React: Thumbs Up"
                        >
                          <ThumbsUp size={14} className="text-indigo-400" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-700 rounded"
                          onClick={() => handleReaction(msg.id, 'thumbsDown')}
                          title="React: Thumbs Down"
                          aria-label="React: Thumbs Down"
                        >
                          <ThumbsDown size={14} className="text-amber-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                  bg-gradient-to-br from-gray-700/30 to-gray-600/30 border border-gray-600/30">
                  <User size={16} className="text-gray-400" />
                </div>
                <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input area - Fixed at bottom */}
          <div className="flex-shrink-0 p-3 border-t border-indigo-500/20 bg-gray-900/70">
            {/* Recording UI */}
            {isRecording && (
              <div className="mb-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Circle size={8} className="text-rose-500 animate-pulse" />
                  <span className="text-sm text-gray-200">Recording audio • {formatRecordingTime(recordingTime)}</span>
                </div>
                <button
                  className="text-gray-400 hover:text-white p-1"
                  onClick={() => setIsRecording(false)}
                >
                  <XCircle size={16} />
                </button>
              </div>
            )}

            <div className="bg-gray-900/90 border border-indigo-500/30 rounded-xl transition-all duration-200
              focus-within:border-indigo-400/50 focus-within:shadow-[0_0_10px_rgba(79,70,229,0.4)]
              backdrop-blur-sm">
              <div className="flex items-center gap-2 p-2 relative">
                {/* Attachment options popup */}
                {showAttachmentOptions && (
                  <div className="absolute bottom-full mb-2 left-0 p-2 bg-gray-800 border border-gray-700/70 rounded-lg flex gap-1 shadow-lg">
                    <button
                      className="p-2 text-blue-400 hover:bg-gray-700/60 rounded-md flex flex-col items-center gap-1"
                      onClick={() => handleAttachment('image')}
                    >
                      <ImageIcon size={18} />
                      <span className="text-xs">Image</span>
                    </button>
                    <button
                      className="p-2 text-indigo-400 hover:bg-gray-700/60 rounded-md flex flex-col items-center gap-1"
                      onClick={() => handleAttachment('document')}
                    >
                      <FileText size={18} />
                      <span className="text-xs">Document</span>
                    </button>
                    <button
                      className="p-2 text-rose-400 hover:bg-gray-700/60 rounded-md flex flex-col items-center gap-1"
                      onClick={() => handleAttachment('pdf')}
                    >
                      <FileText size={18} />
                      <span className="text-xs">PDF</span>
                    </button>
                    <button
                      className="p-2 text-amber-400 hover:bg-gray-700/60 rounded-md flex flex-col items-center gap-1"
                      onClick={() => handleAttachment('video')}
                    >
                      <Video size={18} />
                      <span className="text-xs">Video</span>
                    </button>
                  </div>
                )}

                <ActionButton
                  icon={<Paperclip className="w-[18px] h-[18px]" />}
                  label="Attach file"
                  active={showAttachmentOptions}
                  onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                />

                <ActionButton
                  icon={<Smile className="w-[18px] h-[18px]" />}
                  label="Emoji"
                  active={showEmojiPicker}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />

                <input
                  type="text"
                  placeholder={isRecording ? "Recording..." : "Type your message..."}
                  className="flex-1 bg-transparent border-none p-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={isRecording}
                />

                {isRecording ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-indigo-300">{formatRecordingTime(recordingTime)}</span>
                  </div>
                ) : null}

                <ActionButton
                  icon={isRecording ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
                  label={isRecording ? "Stop recording" : "Voice message"}
                  active={isRecording}
                  onClick={handleVoiceMessage}
                />

                <button
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    (input.trim() !== '' || isRecording)
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:brightness-110'
                      : 'bg-gray-800/70 text-gray-500 cursor-not-allowed'}`}
                  onClick={isRecording ? handleVoiceMessage : handleSend}
                  disabled={!input.trim() && !isRecording}
                  aria-label={isRecording ? "Send voice message" : "Send message"}
                >
                  <Send className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel - conditionally shown */}
        {showInfoPanel && (
          <div className="w-72 border-l border-indigo-500/30 bg-gray-900/50 flex-shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-indigo-500/20 flex justify-between items-center">
              <h3 className="font-medium text-indigo-100">Chat Info</h3>
              <button
                className="p-1 text-gray-400 hover:text-white"
                onClick={() => setShowInfoPanel(false)}
              >
                <XCircle size={18} />
              </button>
            </div>

            {activeGroup && (
              <div className="p-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center">
                    <Users size={24} className="text-indigo-400" />
                  </div>
                  <h4 className="mt-2 font-medium text-white text-lg">{activeGroup.name}</h4>
                  <p className="text-sm text-gray-400">Created on May 10, 2025</p>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-medium text-indigo-200 mb-2">Participants ({activeGroup.participants.length})</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {activeGroup.participants.map(contact => (
                      <div key={contact.id} className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-600/50 flex items-center justify-center">
                          <User size={14} className="text-gray-400" />
                          <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-gray-900
                            ${contact.status === 'online' ? 'bg-emerald-500' :
                              contact.status === 'away' ? 'bg-amber-500' :
                                contact.status === 'busy' ? 'bg-rose-500' : 'bg-gray-500'}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-white">{contact.name}</p>
                          <p className="text-xs text-gray-400">{contact.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-indigo-200 mb-2">Shared Files</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {conversation
                      .filter(msg => msg.attachments && msg.attachments.length > 0)
                      .flatMap(msg => msg.attachments || [])
                      .slice(0, 5)
                      .map(attachment => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/40 transition-colors">
                          {attachment.type === 'image' ? (
                            <ImageIcon size={16} className="text-blue-400" />
                          ) : attachment.type === 'document' ? (
                            <FileText size={16} className="text-indigo-400" />
                          ) : attachment.type === 'pdf' ? (
                            <FileText size={16} className="text-rose-400" />
                          ) : attachment.type === 'voice' ? (
                            <Volume2 size={16} className="text-emerald-400" />
                          ) : (
                            <Video size={16} className="text-amber-400" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                        </div>
                      ))
                    }
                    {conversation.some(msg => msg.attachments && msg.attachments.length > 0) && (
                      <button className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 py-1">
                        View all files
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeContact && (
              <div className="p-4">
                <div className="text-center mb-6">
                  <div className="relative w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-600/20 to-emerald-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <User size={32} className="text-indigo-400" />
                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900
                      ${activeContact.status === 'online' ? 'bg-emerald-500' :
                        activeContact.status === 'away' ? 'bg-amber-500' :
                          activeContact.status === 'busy' ? 'bg-rose-500' : 'bg-gray-500'}`}
                    />
                  </div>
                  <h4 className="mt-2 font-medium text-white text-lg">{activeContact.name}</h4>
                  <p className="text-sm text-gray-400">{activeContact.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeContact.status === 'online' ? 'Online now' :
                      activeContact.status === 'away' ? 'Away' :
                        activeContact.status === 'busy' ? 'Busy' :
                          `Last active ${activeContact.lastSeen}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button className="flex items-center justify-center gap-2 p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-colors">
                    <Phone size={16} />
                    <span className="text-sm">Call</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-colors">
                    <Video size={16} />
                    <span className="text-sm">Video</span>
                  </button>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-medium text-indigo-200 mb-2">Contact Info</h5>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm text-white">{activeContact.name.split(' ')[0].toLowerCase()}@healthcare.org</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm text-white">(555) 123-4567</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Department</p>
                      <p className="text-sm text-white">
                        {activeContact.role.includes('Surgeon') ? 'Surgery' :
                          activeContact.role.includes('Nurse') ? 'Nursing' :
                            activeContact.role.includes('Cardiologist') ? 'Cardiology' :
                              'Healthcare Provider'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-indigo-200 mb-2">Shared Files</h5>
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">No shared files yet</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;

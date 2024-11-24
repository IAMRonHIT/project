import React from 'react';
import { MessageSquare, Phone, Video, Calendar, Send } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  role: string;
  message: string;
  time: string;
  type: 'clinical' | 'coordination' | 'alert';
}

const messages: Message[] = [
  {
    id: 1,
    sender: 'Dr. Sarah Chen',
    role: 'Primary Care Physician',
    message: "Patient blood pressure has been well-controlled. Continuing current medication regimen.",
    time: '2h ago',
    type: 'clinical',
  },
  {
    id: 2,
    sender: 'Emily Parker',
    role: 'Care Coordinator',
    message: 'Scheduled follow-up appointment for next week. Patient confirmed attendance.',
    time: '4h ago',
    type: 'coordination',
  },
  {
    id: 3,
    sender: 'System Alert',
    role: 'AI Assistant',
    message: 'Lab results indicate HbA1c levels require review. Scheduling recommendation generated.',
    time: '6h ago',
    type: 'alert',
  },
];

export function CommunicationHub() {
  const [isDark] = React.useState(document.documentElement.classList.contains('dark'));
  const [newMessage, setNewMessage] = React.useState('');

  const getMessageStyles = (type: Message['type']) => {
    switch (type) {
      case 'clinical':
        return isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100';
      case 'coordination':
        return isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100';
      case 'alert':
        return isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100';
      default:
        return '';
    }
  };

  return (
    <div className={`${
      isDark
        ? 'bg-white/5 backdrop-blur-lg border-white/10'
        : 'bg-white border-ron-divider'
    } rounded-xl shadow-soft h-[600px] flex flex-col`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-medium ${
            isDark ? 'text-white' : 'text-ron-dark-navy'
          }`}>Communication Hub</h3>
          <div className="flex gap-2">
            <button className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
            }`}>
              <Phone className={`w-5 h-5 ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`} />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
            }`}>
              <Video className={`w-5 h-5 ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`} />
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
            }`}>
              <Calendar className={`w-5 h-5 ${
                isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border ${getMessageStyles(message.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className={`font-medium ${
                  isDark ? 'text-white' : 'text-ron-dark-navy'
                }`}>{message.sender}</h4>
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-ron-dark-navy/60'
                }`}>{message.role}</p>
              </div>
              <span className={`text-sm ${
                isDark ? 'text-white/40' : 'text-ron-dark-navy/40'
              }`}>{message.time}</span>
            </div>
            <p className={isDark ? 'text-white/80' : 'text-ron-dark-navy/80'}>
              {message.message}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className={`w-full px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-white/5 text-white placeholder-white/40 border-white/10'
                  : 'bg-ron-primary/5 text-ron-dark-navy placeholder-ron-dark-navy/40 border-ron-divider'
              } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
            />
          </div>
          <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isDark
              ? 'bg-ron-accent text-white hover:bg-ron-accent/90'
              : 'bg-ron-primary text-white hover:bg-ron-primary/90'
          } transition-colors`}>
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
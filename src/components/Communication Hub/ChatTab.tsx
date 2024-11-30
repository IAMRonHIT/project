import React, { useState } from 'react';
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
  Bot
} from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface Message {
  sender: string;
  time: string;
  message: string;
  status?: 'approved' | 'denied' | 'pending';
  isAI?: boolean;
}

const ChatTab: React.FC = () => {
  const [conversation, setConversation] = useState<Message[]>([
    {
      sender: 'Ron AI',
      time: '10:00 AM',
      message: 'Your prior authorization request for ACL surgery has been approved.',
      status: 'approved',
      isAI: true
    },
    {
      sender: 'Dr. Smith',
      time: '10:02 AM',
      message: 'Thank you for the update.',
    },
  ]);
  const [input, setInput] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSend = () => {
    if (input.trim() !== '') {
      const newMessage = {
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: input,
      };
      setConversation([...conversation, newMessage]);
      setInput('');
    }
  };

  const renderStatus = (status: Message['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" size="sm" glow icon={<CheckCircle size={12} />}>
            Approved
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="error" size="sm" glow icon={<XCircle size={12} />}>
            Denied
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" size="sm" icon={<AlertTriangle size={12} />}>
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const ActionButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <button className={`
      p-2 rounded-lg
      ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-white/50'}
      text-gray-400 hover:text-ron-teal-400
      transition-all duration-200
      hover:shadow-glow-teal
    `}>
      {icon}
    </button>
  );

  return (
    <div className={`
      flex flex-col h-full
      ${isDark ? 'bg-gray-900/50' : 'bg-white/80'}
      backdrop-blur-xl
    `}>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`
              w-8 h-8 rounded-lg flex-shrink-0
              ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
              backdrop-blur-sm
              border border-ron-teal-400/20
              flex items-center justify-center
              ${msg.isAI ? 'text-ron-teal-400' : 'text-gray-400'}
            `}>
              {msg.isAI ? <Bot size={16} /> : <User size={16} />}
            </div>

            {/* Message Content */}
            <div className={`
              max-w-md px-4 py-3 rounded-lg
              ${msg.sender === 'You'
                ? isDark 
                  ? 'bg-ron-teal-400/10 border-ron-teal-400/20'
                  : 'bg-ron-teal-50/80 border-ron-teal-200/50'
                : isDark
                  ? 'bg-gray-800/50 border-gray-700/50'
                  : 'bg-white/50 border-gray-200/50'
              }
              backdrop-blur-sm border
              transition-all duration-200
              hover:shadow-glow-teal
              group
            `}>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {msg.sender}
                </span>
                <span>{msg.time}</span>
              </div>
              <p className={isDark ? 'text-white' : 'text-gray-900'}>
                {msg.message}
              </p>
              {msg.status && (
                <div className="mt-2 flex justify-end">
                  {renderStatus(msg.status)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={`
        p-4 border-t border-ron-teal-400/20
        ${isDark ? 'bg-gray-900/50' : 'bg-white/80'}
        backdrop-blur-xl
      `}>
        <div className={`
          flex items-center
          ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
          rounded-lg border
          ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
          shadow-inner
          focus-within:shadow-glow-teal
          transition-all duration-200
        `}>
          <div className="flex gap-1 p-2 border-r border-gray-700/50">
            <ActionButton icon={<Smile size={20} />} />
            <ActionButton icon={<FileText size={20} />} />
            <ActionButton icon={<ImageIcon size={20} />} />
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            className={`
              flex-1 p-3 bg-transparent
              ${isDark ? 'text-white' : 'text-gray-900'}
              placeholder:text-gray-400
              focus:outline-none
            `}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className={`
              p-3 mx-2 rounded-lg
              transition-all duration-200
              ${input.trim() 
                ? 'bg-ron-teal-400 text-white hover:shadow-glow-teal' 
                : `${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'} text-gray-400`
              }
            `}
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;

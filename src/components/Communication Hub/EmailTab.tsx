import React from 'react';
import { Reply, ReplyAll, Forward, Paperclip, Send, Mail, Clock } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface Email {
  sender: string;
  time: string;
  subject: string;
  snippet: string;
  isRead: boolean;
  priority?: 'high' | 'medium' | 'low';
  hasAttachments?: boolean;
}

const EmailTab: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const emails: Email[] = [
    {
      sender: 'Dr. Emily Smith',
      time: 'Yesterday',
      subject: 'Re: Patient John Doe - ACL Surgery',
      snippet: 'Thank you for your prompt response. I have attached the required documents...',
      isRead: false,
      priority: 'high',
      hasAttachments: true,
    },
    {
      sender: 'Mark Davis',
      time: '2 days ago',
      subject: 'Authorization Confirmation',
      snippet: 'We are pleased to inform you that the prior authorization has been approved...',
      isRead: true,
      priority: 'medium',
    },
  ];

  const ActionButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className={`
      flex items-center gap-2 p-2 rounded-lg
      ${isDark ? 'bg-ron-teal-400/5 hover:bg-ron-teal-400/10' : 'bg-ron-teal-50/50 hover:bg-ron-teal-50'}
      text-white/80 hover:text-white
      transition-all duration-200
      backdrop-blur-sm
      hover:shadow-glow-teal
      border border-transparent
      ${isDark ? 'hover:border-ron-teal-400/20' : 'hover:border-ron-teal-200/50'}
    `}>
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-0">
      {/* Email list - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2 p-4">
          {emails.map((email, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg cursor-pointer
                ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                transition-all duration-200
                hover:shadow-glow-teal
                ${!email.isRead ? 'border-l-4 border-l-ron-teal-400' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    bg-ron-teal-400/10 text-ron-teal-400
                    border border-ron-teal-400/20
                  `}>
                    {email.sender.charAt(0)}
                  </div>
                  <div>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {email.sender}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">{email.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {email.priority && (
                    <Badge
                      variant={
                        email.priority === 'high' ? 'error' :
                        email.priority === 'medium' ? 'warning' : 'info'
                      }
                      size="sm"
                      glow={email.priority === 'high'}
                    >
                      {email.priority}
                    </Badge>
                  )}
                  {email.hasAttachments && (
                    <Badge variant="info" size="sm">
                      <Paperclip size={12} className="mr-1" />
                      Attachment
                    </Badge>
                  )}
                </div>
              </div>
              <div className="ml-10">
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {email.subject}
                </p>
                <p className="text-sm text-gray-400">{email.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Section - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-ron-teal-400/20">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <ActionButton icon={<Reply size={16} />} label="Reply" />
            <ActionButton icon={<ReplyAll size={16} />} label="Reply All" />
            <ActionButton icon={<Forward size={16} />} label="Forward" />
            <ActionButton icon={<Paperclip size={16} />} label="Attach" />
          </div>
          <div className="flex gap-2">
            <div className={`
              flex-1 relative rounded-lg overflow-hidden
              ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
              backdrop-blur-sm
              border
              ${isDark 
                ? 'border-ron-teal-400/20 focus-within:border-ron-teal-400/40' 
                : 'border-ron-teal-200/50 focus-within:border-ron-teal-400/60'
              }
              transition-all duration-200
              focus-within:shadow-glow-teal
            `}>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Compose your email..."
                className={`
                  block w-full pl-10 pr-3 py-2
                  bg-transparent text-sm
                  ${isDark ? 'text-white' : 'text-gray-900'}
                  placeholder:text-gray-400
                  focus:outline-none
                `}
              />
            </div>
            <button className={`
              p-2 rounded-lg
              bg-ron-teal-400
              text-white
              transition-all duration-200
              hover:shadow-glow-teal
              border border-transparent
            `}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTab;

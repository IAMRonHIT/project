import React, { useState } from 'react';
import { Reply, ReplyAll, Forward, Paperclip, Send, Mail, Clock, Trash2, Bookmark, Star, Filter, Search, AlertCircle, ChevronDown, X, Check, Tag, CornerUpRight, Calendar, Loader, Menu } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  email: string;
  time: string;
  subject: string;
  snippet: string;
  isRead: boolean;
  priority?: 'high' | 'medium' | 'low';
  hasAttachments?: boolean;
  attachments?: Array<{
    name: string;
    type: string;
    size: string;
  }>;
  isStarred?: boolean;
  labels?: string[];
  folder?: 'inbox' | 'sent' | 'draft' | 'archive' | 'trash';
}

interface EmailFolder {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
}

const EmailTab: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [showFolders, setShowFolders] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState('all');

  const [emails, setEmails] = useState<Email[]>([
    {
      id: 'email1',
      sender: 'Dr. Emily Smith',
      email: 'emily.smith@healthcare.org',
      time: 'Yesterday',
      subject: 'Re: Patient John Doe - ACL Surgery',
      snippet: 'Thank you for your prompt response. I have attached the required documents including the MRI results and clinical notes from our last evaluation. I believe these should support our case for authorization.',
      isRead: false,
      priority: 'high',
      hasAttachments: true,
      attachments: [
        { name: 'MRI_Results.pdf', type: 'PDF', size: '2.3 MB' },
        { name: 'Clinical_Notes.docx', type: 'DOCX', size: '1.1 MB' }
      ],
      isStarred: true,
      labels: ['urgent', 'clinical'],
      folder: 'inbox'
    },
    {
      id: 'email2',
      sender: 'Mark Davis',
      email: 'mark.davis@insurance.com',
      time: '2 days ago',
      subject: 'Authorization Confirmation',
      snippet: 'We are pleased to inform you that the prior authorization has been approved for the requested procedure. The authorization number is PA-2023456 and is valid for 60 days from today.',
      isRead: true,
      priority: 'medium',
      isStarred: false,
      labels: ['authorization'],
      folder: 'inbox'
    },
    {
      id: 'email3',
      sender: 'Sarah Johnson',
      email: 'sarah.johnson@healthcare.org',
      time: '3 days ago',
      subject: 'Updated Clinical Guidelines for Orthopedic Procedures',
      snippet: 'Please review the attached updated clinical guidelines for orthopedic procedures. These changes will be effective starting next month and contain important updates to authorization requirements.',
      isRead: true,
      priority: 'medium',
      hasAttachments: true,
      attachments: [
        { name: 'Ortho_Guidelines_2023.pdf', type: 'PDF', size: '4.7 MB' }
      ],
      isStarred: false,
      labels: ['guidelines'],
      folder: 'inbox'
    },
    {
      id: 'email4',
      sender: 'Appeals Team',
      email: 'appeals@healthcare.org',
      time: '5 days ago',
      subject: 'Appeal Status Update - Patient James Wilson',
      snippet: 'This is to inform you that the level 1 appeal for patient James Wilson has been escalated to level 2 review. We will need additional clinical documentation within 48 hours.',
      isRead: true,
      priority: 'high',
      isStarred: false,
      labels: ['appeal'],
      folder: 'inbox'
    },
    {
      id: 'draft1',
      sender: 'You',
      email: 'you@healthcare.org',
      time: '1 hour ago',
      subject: 'Request for Peer-to-Peer Review',
      snippet: 'I would like to request a peer-to-peer review for the recently denied authorization for patient...',
      isRead: true,
      priority: 'medium',
      isStarred: false,
      folder: 'draft'
    }
  ]);

  const folders: EmailFolder[] = [
    { id: 'inbox', name: 'Inbox', count: emails.filter(e => e.folder === 'inbox').length, icon: <Mail size={16} /> },
    { id: 'sent', name: 'Sent', count: 5, icon: <CornerUpRight size={16} /> },
    { id: 'draft', name: 'Drafts', count: emails.filter(e => e.folder === 'draft').length, icon: <File size={16} /> },
    { id: 'starred', name: 'Starred', count: emails.filter(e => e.isStarred).length, icon: <Star size={16} /> },
    { id: 'archive', name: 'Archive', count: 12, icon: <Archive size={16} /> },
    { id: 'trash', name: 'Trash', count: 3, icon: <Trash2 size={16} /> }
  ];

  // Email features here
  const markAsRead = (emailId: string) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const deleteEmail = (emailId: string) => {
    // Simulated deletion - move to trash folder
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, folder: 'trash' } : email
    ));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const archiveEmail = (emailId: string) => {
    // Simulated archiving
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, folder: 'archive' } : email
    ));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const sendEmail = () => {
    setIsLoading(true);
    // Simulate email sending
    setTimeout(() => {
      setIsLoading(false);
      setIsComposing(false);
      setEmailContent('');
      setSubject('');
      setRecipient('');
      // Add a sent confirmation message
      alert('Email sent successfully');
    }, 1500);
  };

  const searchEmails = () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const scheduleEmail = () => {
    // Simulate scheduling an email
    alert('Email scheduled for later delivery');
  };

  const addLabel = (emailId: string, label: string) => {
    setEmails(emails.map(email => {
      if (email.id === emailId) {
        const labels = email.labels || [];
        if (!labels.includes(label)) {
          return { ...email, labels: [...labels, label] };
        }
      }
      return email;
    }));
  };

  const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean }> = ({ icon, label, onClick, disabled = false }) => (
    <button
      className={`flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:text-white transition-all duration-200 hover:bg-indigo-500/20 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );

  const renderEmailList = () => {
    const filteredEmails = emails.filter(email => {
      // Filter by folder
      if (activeFolder === 'starred') {
        return email.isStarred;
      }
      if (activeFolder !== 'all' && email.folder !== activeFolder) {
        return false;
      }

      // Filter by search if any
      if (searchQuery) {
        return email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.snippet.toLowerCase().includes(searchQuery.toLowerCase());
      }

      // Filter by type
      if (emailFilter === 'unread' && email.isRead) {
        return false;
      }
      if (emailFilter === 'attachments' && !email.hasAttachments) {
        return false;
      }
      if (emailFilter === 'high-priority' && email.priority !== 'high') {
        return false;
      }

      return true;
    });

    return (
      <div className="space-y-2 p-3">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Mail size={48} className="opacity-30 mb-4" />
            <p>No emails found</p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                if (!email.isRead) markAsRead(email.id);
              }}
              className={`p-3 rounded-lg cursor-pointer bg-gray-800/50 backdrop-blur-sm border-l-4 transition-all duration-200 hover:bg-indigo-600/10 flex items-start ${!email.isRead ? 'border-l-indigo-500' : 'border-l-transparent'}`}
            >
              <div className="flex-shrink-0 mr-3 flex flex-col items-center space-y-1">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(email.id); }}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Star size={16} className={email.isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
                </button>
                {!email.isRead && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {email.sender.charAt(0)}
                    </div>
                    <span className={`font-medium truncate ${!email.isRead ? 'text-white' : 'text-gray-300'}`}>
                      {email.sender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{email.time}</span>
                    {email.priority && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${email.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : email.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {email.priority}
                      </span>
                    )}
                    {email.hasAttachments && (
                      <span className="text-gray-400">
                        <Paperclip size={14} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-10">
                  <p className={`text-sm font-medium mb-1 truncate ${!email.isRead ? 'text-white' : 'text-gray-300'}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">{email.snippet}</p>

                  {/* Labels */}
                  {email.labels && email.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {email.labels.map((label, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-400">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderEmailDetail = () => {
    if (!selectedEmail) return null;

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-indigo-500/20 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">{selectedEmail.subject}</h3>
          <div className="flex gap-1">
            <button onClick={() => setSelectedEmail(null)} className="p-1 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {selectedEmail.sender.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{selectedEmail.sender}</span>
                  <span className="text-xs text-gray-400">&lt;{selectedEmail.email}&gt;</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>To: You</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs">{selectedEmail.time}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button onClick={() => toggleStar(selectedEmail.id)} className="p-1 rounded-md hover:bg-gray-700/50">
                <Star size={18} className={selectedEmail.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
              </button>
              <button onClick={() => archiveEmail(selectedEmail.id)} className="p-1 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white">
                <Archive size={18} />
              </button>
              <button onClick={() => deleteEmail(selectedEmail.id)} className="p-1 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Priority banner */}
          {selectedEmail.priority === 'high' && (
            <div className="mb-4 p-2 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400" />
              <span className="text-sm text-rose-400">This message has high priority</span>
            </div>
          )}

          {/* Email content */}
          <div className="mb-6 text-white space-y-4">
            <p>Dear Team,</p>
            <p>{selectedEmail.snippet}</p>
            <p>Please let me know if you need any additional information.</p>
            <p>Regards,<br/>{selectedEmail.sender}</p>
          </div>

          {/* Attachments */}
          {selectedEmail.hasAttachments && selectedEmail.attachments && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Paperclip size={16} />
                Attachments ({selectedEmail.attachments.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedEmail.attachments.map((attachment, idx) => (
                  <div key={idx} className="p-3 border border-indigo-500/20 rounded-lg bg-gray-800/50 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-md flex items-center justify-center text-indigo-400">
                      {attachment.type === 'PDF' ? 'PDF' : attachment.type === 'DOCX' ? 'W' : 'F'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-400">{attachment.size}</p>
                    </div>
                    <button className="p-1 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400">
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reply area */}
        <div className="p-4 border-t border-indigo-500/20">
          <div className="bg-gray-800/50 rounded-lg p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-0.5 rounded-md hover:bg-indigo-500/20 text-indigo-400">
                <Reply size={18} />
              </div>
              <span className="text-sm text-gray-300">Reply to {selectedEmail.sender}</span>
            </div>
            <textarea
              placeholder="Type your reply here..."
              className="w-full bg-transparent border-none p-2 text-white placeholder-gray-500 focus:outline-none resize-none text-sm"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-white">
                  <Paperclip size={16} />
                </button>
                <button className="p-1.5 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-white">
                  <Calendar size={16} />
                </button>
              </div>
              <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors flex items-center gap-1">
                <Send size={14} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComposer = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-indigo-500/20 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">New Message</h3>
          <button onClick={() => setIsComposing(false)} className="p-1 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center">
            <label className="w-20 text-sm text-gray-400">To:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="flex-1 bg-transparent border-b border-gray-700 p-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex items-center">
            <label className="w-20 text-sm text-gray-400">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent border-b border-gray-700 p-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="Enter subject"
            />
          </div>

          <div className="flex flex-col flex-1">
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="w-full flex-1 bg-transparent p-2 text-white focus:outline-none resize-none text-sm min-h-[200px]"
              placeholder="Compose your email..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-indigo-500/20 flex justify-between">
          <div className="flex gap-2">
            <button className="p-2 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-white" title="Attach file">
              <Paperclip size={18} />
            </button>
            <button className="p-2 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-white" title="Schedule send">
              <Calendar size={18} />
            </button>
            <button className="p-2 rounded-md hover:bg-indigo-500/20 text-gray-400 hover:text-white" title="Add label">
              <Tag size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-indigo-500/30 text-white text-sm rounded-md hover:bg-indigo-500/20 transition-colors">
              Save as Draft
            </button>
            <button
              onClick={sendEmail}
              disabled={isLoading || !recipient || !subject}
              className={`px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md transition-colors flex items-center gap-1 ${isLoading || !recipient || !subject ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            >
              {isLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Email Sidebar */}
      <div className="w-56 border-r border-indigo-500/20 flex flex-col">
        <div className="p-3">
          <button
            onClick={() => setIsComposing(true)}
            className="w-full py-2 px-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Edit size={16} />
            Compose
          </button>
        </div>

        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between p-2 rounded-md text-sm ${activeFolder === folder.id ? 'bg-indigo-500/20 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
            >
              <div className="flex items-center gap-2">
                <span className={activeFolder === folder.id ? 'text-indigo-400' : ''}>{folder.icon}</span>
                <span>{folder.name}</span>
              </div>
              <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded-full">{folder.count}</span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-indigo-500/20">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
            <span>Labels</span>
            <button className="p-1 rounded-md hover:bg-gray-700/50 hover:text-white">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {['urgent', 'clinical', 'authorization', 'appeal', 'guidelines'].map(label => (
              <div key={label} className="flex items-center gap-2 p-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Search and Filter Bar */}
        <div className="p-3 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && searchEmails()}
              placeholder="Search emails..."
              className="w-full bg-gray-800/50 border border-indigo-500/20 text-white text-sm rounded-lg focus:border-indigo-500 block pl-10 p-2.5"
            />
          </div>

          <div className="flex items-center gap-3 ml-3">
            <div className="relative">
              <button
                onClick={() => setShowFolders(!showFolders)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 flex items-center gap-1"
              >
                <Filter size={16} />
                <span className="text-sm">{emailFilter === 'all' ? 'All' : emailFilter === 'unread' ? 'Unread' : emailFilter === 'attachments' ? 'Attachments' : 'High Priority'}</span>
                <ChevronDown size={14} />
              </button>

              {showFolders && (
                <div className="absolute right-0 mt-1 w-40 bg-gray-800 rounded-md shadow-lg border border-indigo-500/20 z-10">
                  <div className="p-1 space-y-0.5">
                    {['all', 'unread', 'attachments', 'high-priority'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => {
                          setEmailFilter(filter);
                          setShowFolders(false);
                        }}
                        className={`flex items-center w-full p-2 text-sm rounded-md ${emailFilter === filter ? 'bg-indigo-500/20 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
                      >
                        {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : filter === 'attachments' ? 'With Attachments' : 'High Priority'}
                        {emailFilter === filter && <Check size={14} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Email Content Area */}
        <div className="flex-1 overflow-hidden">
          {isComposing ? (
            renderComposer()
          ) : selectedEmail ? (
            renderEmailDetail()
          ) : (
            <div className="h-full overflow-y-auto">
              {renderEmailList()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTab;

// Helper components
const Edit = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Plus = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Archive = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"></polyline>
    <rect x="1" y="3" width="22" height="5"></rect>
    <line x1="10" y1="12" x2="14" y2="12"></line>
  </svg>
);

const File = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const Download = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

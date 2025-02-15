import React from 'react';
import { MessageSquare, Video, Calendar, Send, File, Paperclip } from 'lucide-react';
import { AccordionGroup } from './AccordionGroup';

interface Ticket {
  id: string;
  authorizationId: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  type: 'authorization' | 'appeal' | 'grievance';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
}

interface Document {
  id: string;
  name: string;
  type: 'clinical' | 'letter' | 'authorization' | 'appeal';
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
}

interface Message {
  id: number;
  ticketId: string;
  sender: string;
  role: string;
  message: string;
  time: string;
  type: 'clinical' | 'coordination' | 'alert';
  attachments?: Document[];
}

// Mock data
const tickets: Ticket[] = [
  {
    id: 'T-001',
    authorizationId: 'AUTH-123',
    status: 'open',
    priority: 'high',
    type: 'authorization',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T11:30:00Z',
    assignedTo: 'Emily Parker'
  }
];

const documents: Document[] = [
  {
    id: 'D-001',
    name: 'MRI Report.pdf',
    type: 'clinical',
    uploadedBy: 'Dr. Sarah Chen',
    uploadedAt: '2024-02-20T09:00:00Z',
    status: 'approved',
    url: '/documents/mri-report.pdf'
  }
];

const messages: Message[] = [
  {
    id: 1,
    ticketId: 'T-001',
    sender: 'Dr. Sarah Chen',
    role: 'Primary Care Physician',
    message: "Patient blood pressure has been well-controlled. Continuing current medication regimen.",
    time: '2h ago',
    type: 'clinical',
  },
  {
    id: 2,
    ticketId: 'T-001',
    sender: 'Emily Parker',
    role: 'Care Coordinator',
    message: 'Scheduled follow-up appointment for next week. Patient confirmed attendance.',
    time: '4h ago',
    type: 'coordination',
  },
  {
    id: 3,
    ticketId: 'T-001',
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
  const [activeTicket] = React.useState<Ticket>(tickets[0]);

  const leftSidebarAccordions = [
    {
      title: "Clinical Information",
      content: (
        <div className="space-y-2 text-sm">
          <div>Primary Diagnosis: Rotator Cuff Injury</div>
          <div>Secondary Conditions: None</div>
          <div>Last Updated: 2024-02-20</div>
        </div>
      ),
      defaultOpen: true
    },
    {
      title: "Care Team",
      content: (
        <div className="space-y-2 text-sm">
          <div>PCP: Dr. Sarah Chen</div>
          <div>Specialist: Dr. James Wilson</div>
          <div>Care Coordinator: Emily Parker</div>
        </div>
      )
    },
    {
      title: "Timeline",
      content: (
        <div className="space-y-2 text-sm">
          <div>02/20: Initial Assessment</div>
          <div>02/22: MRI Scheduled</div>
          <div>02/25: Follow-up</div>
        </div>
      )
    }
  ];

  const rightSidebarAccordions = [
    {
      title: "Documents",
      content: (
        <div className="space-y-2">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center gap-2 text-sm">
              <File className="w-4 h-4" />
              <span>{doc.name}</span>
            </div>
          ))}
        </div>
      ),
      defaultOpen: true
    },
    {
      title: "Authorizations",
      content: (
        <div className="space-y-2 text-sm">
          <div>MRI Authorization - Pending</div>
          <div>Physical Therapy - Approved</div>
          <div>Follow-up Visit - Approved</div>
        </div>
      )
    },
    {
      title: "Care Plan",
      content: (
        <div className="space-y-2 text-sm">
          <div>Current Phase: Diagnostic</div>
          <div>Next Steps: MRI Evaluation</div>
          <div>Goals: Pain Management</div>
        </div>
      )
    }
  ];

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
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className={`w-80 border-r ${isDark ? 'border-white/10 bg-white/5' : 'border-ron-divider bg-white'}`}>
        {/* Request Details - Outside Accordion */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <h3 className="font-medium mb-2">Request Details</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500 dark:text-white/60">ID:</span>
              <span className="ml-2 text-sm">{activeTicket.id}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-white/60">Status:</span>
              <span className="ml-2 text-sm">{activeTicket.status}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-white/60">Type:</span>
              <span className="ml-2 text-sm">{activeTicket.type}</span>
            </div>
          </div>
        </div>
        
        {/* Accordions */}
        <AccordionGroup accordions={leftSidebarAccordions} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-ron-divider'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-medium ${
                isDark ? 'text-white' : 'text-dark-gun-metal'
              }`}>Communication Hub</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${isDark ? 'text-white/60' : 'text-dark-gun-metal/60'}`}>
                  Ticket #{activeTicket.id}
                </span>
                <span className={`text-sm ${
                  activeTicket.priority === 'high' 
                    ? 'text-red-500' 
                    : activeTicket.priority === 'medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}>
                  • {activeTicket.priority} priority
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
              }`}>
                <Video className={`w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`} />
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
              }`}>
                <Calendar className={`w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
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
                    isDark ? 'text-white' : 'text-dark-gun-metal'
                  }`}>{message.sender}</h4>
                  <p className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                  }`}>{message.role}</p>
                </div>
                <span className={`text-sm ${
                  isDark ? 'text-white/40' : 'text-dark-gun-metal/40'
                }`}>{message.time}</span>
              </div>
              <p className={isDark ? 'text-white/80' : 'text-dark-gun-metal/80'}>
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
                    : 'bg-ron-primary/5 text-dark-gun-metal placeholder-dark-gun-metal/40 border-ron-divider'
                } border focus:outline-none focus:ring-2 focus:ring-ron-primary/20`}
              />
              <button 
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-ron-primary/10'
                }`}
              >
                <Paperclip className={`w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-dark-gun-metal/60'
                }`} />
              </button>
            </div>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-ron-accent text-white hover:bg-ron-accent/90'
                  : 'bg-ron-primary text-white hover:bg-ron-primary/90'
              } transition-colors`}
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`w-80 border-l ${isDark ? 'border-white/10 bg-white/5' : 'border-ron-divider bg-white'}`}>
        <AccordionGroup accordions={rightSidebarAccordions} />
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Bot, ChevronDown, ChevronRight, User, ClipboardIcon, CheckIcon } from 'lucide-react';
import type { Task } from '../types/task';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
}

interface TaskAIChatProps {
  task: Task;
  isVisible: boolean;
  childTasks?: Task[];
  parentTask?: Task | null;
  linkedTasks?: Task[];
  stakeholders?: Array<{
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }>;
}

// Component for copying code blocks
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      className="absolute top-2 right-2 p-1 rounded-md bg-gray-700 text-white opacity-70 hover:opacity-100 transition-opacity"
      onClick={copyToClipboard}
    >
      {copied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
    </button>
  );
};

// Custom renderer for code blocks to add copy button and syntax highlighting
const CodeBlock = (props: any) => {
  const { node, inline, className, children, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  
  if (inline) {
    return <code className={className} {...rest}>{children}</code>;
  }

  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  return (
    <div className="relative">
      <pre className={`${className || ''} p-4 rounded overflow-auto`}>
        <code className={language ? `language-${language}` : ''} {...rest}>
          {code}
        </code>
      </pre>
      {!inline && <CopyButton text={code} />}
    </div>
  );
};

export function TaskAIChat({ task, isVisible, childTasks = [], parentTask = null, linkedTasks = [], stakeholders = [] }: TaskAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<{[key: string]: boolean}>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulated AI response function
  const simulateAIResponse = async (userMessage: string) => {
    setIsThinking(true);
    
    // Create a temporary message to show streaming
    const tempMessageId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { 
      id: tempMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date()
    }]);
    
    // In a real implementation, this would be replaced with actual AI API calls
    let aiResponse = '';
    
    // Add task context to the AI's knowledge
    const taskContext = `
<thought>
I'm analyzing task #${task.ticketNumber} for patient ${task.patientName} (DOB: ${task.patientDOB}).
The task description is: "${task.description}"
It's currently ${task.status} with ${task.priority} priority and due on ${task.dueDate}.

${childTasks.length > 0 ? `This task has ${childTasks.length} subtasks.` : ''}
${parentTask ? `This is a subtask of another task related to ${parentTask.patientName}.` : ''}
${linkedTasks.length > 0 ? `This task is linked to ${linkedTasks.length} other tasks.` : ''}
${stakeholders.length > 0 ? `This task involves ${stakeholders.length} stakeholders including ${stakeholders.map(s => s.name).join(', ')}.` : ''}

The user message is: "${userMessage}"
Let me think about how to respond in a helpful way...
</thought>
`;
    
    // Simulate different responses based on keywords in user message
    if (userMessage.toLowerCase().includes('summarize') || userMessage.toLowerCase().includes('summary')) {
      aiResponse = `${taskContext}Here's a summary of this task:

**Patient**: ${task.patientName} (DOB: ${task.patientDOB})
**Task ID**: ${task.ticketNumber}
**Status**: ${task.status}
**Priority**: ${task.priority}
**Due Date**: ${new Date(task.dueDate).toLocaleDateString()}

**Description**:
${task.description}

${childTasks.length > 0 ? `**Subtasks**: This task has ${childTasks.length} subtasks that need to be completed.` : ''}
${parentTask ? `**Parent Task**: This is a subtask of a larger task related to ${parentTask.patientName}.` : ''}
${linkedTasks.length > 0 ? `**Linked Tasks**: This task is linked to ${linkedTasks.length} other tasks.` : ''}

**What would you like to know next about this task?**`;
    }
    else if (userMessage.toLowerCase().includes('next step') || userMessage.toLowerCase().includes('what should i do')) {
      aiResponse = `${taskContext}Based on the current state of this task, here are the recommended next steps:

1. ${task.status === 'TODO' ? '**Start working on this task** by changing its status to "In Progress"' : 
   task.status === 'IN_PROGRESS' ? '**Continue working** and update stakeholders on progress' : 
   '**Confirm completion** with all stakeholders and ensure proper documentation'}

2. ${stakeholders.length > 0 ? `**Contact key stakeholders**: Reach out to ${stakeholders[0].name} (${stakeholders[0].role}) to align on expectations` : 
   'Identify and add any missing stakeholders to this task'}

3. ${childTasks.length > 0 ? `**Track subtasks**: Ensure all ${childTasks.length} subtasks are progressing appropriately` : 
   'Consider breaking this down into smaller subtasks for better tracking'}

4. **Review due date**: ${new Date(task.dueDate) < new Date() ? 'This task is overdue. Escalate or adjust timeline if needed.' : 
   'Ensure the current timeline is still realistic.'}

Would you like me to elaborate on any of these steps?`;
    }
    else if (userMessage.toLowerCase().includes('stakeholder') || userMessage.toLowerCase().includes('contact')) {
      aiResponse = `${taskContext}Here are the stakeholders involved in this task:

${stakeholders.length > 0 ? 
  stakeholders.map((s, i) => `**${i+1}. ${s.name}** (${s.role})
   ${s.email ? `Email: ${s.email}` : ''}
   ${s.phone ? `Phone: ${s.phone}` : ''}
  `).join('\n') : 
  'There are no stakeholders explicitly assigned to this task. Consider adding key contacts who should be informed about progress.'}

Recommended communication approach:
- Send regular updates on task progress
- Highlight any blockers or issues early
- Document all communications for future reference

Would you like me to draft a communication template for any of these stakeholders?`;
    }
    else {
      aiResponse = `${taskContext}I'm here to help with task #${task.ticketNumber} for patient ${task.patientName}.

This is a ${task.priority.toLowerCase()} priority task that's currently ${task.status.toLowerCase() === 'todo' ? 'not started' : task.status.toLowerCase() === 'in_progress' ? 'in progress' : 'completed'}.

I can help you with:
- Summarizing task details
- Suggesting next steps
- Managing stakeholder communications
- Analyzing related tasks and dependencies
- Drafting notes or communications
- Tracking progress and deadlines

What specific assistance do you need for this task?`;
    }
    
    // Simulate streaming by adding characters one by one
    let currentResponse = '';
    for (let i = 0; i < aiResponse.length; i++) {
      currentResponse += aiResponse[i];
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId ? { ...msg, content: currentResponse } : msg
      ));
      // Add random delay between 1-5ms to simulate typing speed variations
      await new Promise(resolve => setTimeout(resolve, Math.random() * 4 + 1));
    }
    
    // Update message to final state when done streaming
    setMessages(prev => prev.map(msg => 
      msg.id === tempMessageId ? { ...msg, isStreaming: false } : msg
    ));
    
    setIsThinking(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Generate AI response
    simulateAIResponse(inputValue);
  };
  
  // Add welcome message when chat becomes visible
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Add initial welcome message
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant' as const,
        content: `Hi there! I'm your AI assistant for task #${task.ticketNumber}. I have full context about this task for patient ${task.patientName}.

How can I help you today? You can ask me to:
- Summarize this task
- Suggest next steps
- Help manage stakeholders
- Analyze related tasks
- Draft communications
- Track progress and deadlines`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [isVisible, task, messages.length]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Toggle expanded thoughts
  const toggleThoughts = (messageId: string) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  
  // Extract thought process from message
  const extractThoughtProcess = (content: string) => {
    const thoughtMatch = content.match(/<thought>([\s\S]*?)<\/thought>/);
    return thoughtMatch ? thoughtMatch[1] : null;
  };
  
  // Get content without thought process
  const getCleanContent = (content: string) => {
    return content.replace(/<thought>[\s\S]*?<\/thought>/, '').trim();
  };
  
  // Render message
  const renderMessage = (message: Message) => {
    const thoughtProcess = message.role === 'assistant' ? extractThoughtProcess(message.content) : null;
    const hasThoughts = !!thoughtProcess;
    const isExpanded = expandedMessages[message.id] || false;
    const cleanContent = message.role === 'assistant' ? getCleanContent(message.content) : message.content;
    
    return (
      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div 
          className={`max-w-[80%] rounded-lg p-4 ${
            message.role === 'user' 
              ? 'bg-indigo-600/20 text-gray-100 ml-auto border border-indigo-500/30' 
              : 'bg-gray-900/90 border border-indigo-500/30 text-gray-100 mr-auto'
          }`}
        >
          {message.role === 'assistant' && hasThoughts && (
            <div className="mb-2 text-indigo-400 text-sm flex items-center justify-between">
              <span>AI Assistant</span>
              {!message.isStreaming && (
                <button 
                  className="p-1 rounded hover:bg-indigo-500/20 transition-colors text-indigo-400 text-xs flex items-center gap-1"
                  onClick={() => toggleThoughts(message.id)}
                >
                  <span>Thought Process</span>
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          )}
          
          {message.role === 'assistant' && hasThoughts && isExpanded && (
            <div className="border-l-2 border-indigo-500 pl-3 mb-3 text-indigo-300/80 text-xs italic">
              <ReactMarkdown>{thoughtProcess}</ReactMarkdown>
            </div>
          )}
          
          <ReactMarkdown 
            className="prose prose-sm max-w-none prose-invert"
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock }}
          >
            {cleanContent}
          </ReactMarkdown>
          
          {message.isStreaming && (
            <div className="flex justify-center mt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div>
                </div>
                <span className="text-xs text-indigo-300">Thinking...</span>
              </div>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-500/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600/70 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-100" />
          </div>
          <div>
            <h3 className="font-medium text-gray-100">Task AI Assistant</h3>
            <p className="text-xs text-gray-400">Ask me anything about this task</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="flex items-center gap-2 bg-[#1A2333] rounded-lg border border-indigo-500/30 p-2">
          <textarea
            placeholder="Ask a question about this task..."
            className="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:outline-none min-h-[44px] max-h-24 py-2 px-3 resize-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isThinking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
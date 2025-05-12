import React, { useState } from 'react';
import { X, User, Clock, Calendar, Edit3, Paperclip, MessageSquare, FileText, Users, Link as LinkIcon, ChevronRight, ChevronDown, ArrowUpRight, CheckCircle2, HelpCircle, Flag, Tag, Layers, AlertCircle } from 'lucide-react';
import type { Task, TaskStatus, Stakeholder } from '../types';
import { format } from 'date-fns';
import { taskTypeConfig } from '../utils/taskTypeConfig';

interface TaskDetailsPanelProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
  onAddComment?: (taskId: string, comment: string) => void;
  onAttachFile?: (taskId: string, file: File) => void;
  onLinkTask?: (taskId: string, linkedTaskId: string) => void;
  onChangeStatus?: (taskId: string, newStatus: TaskStatus) => void;
  linkedTasks?: Task[];
  childTasks?: Task[];
  parentTask?: Task | null;
  comments?: Array<{
    id: string;
    author: string;
    authorAvatar?: string;
    content: string;
    timestamp: Date;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: string;
  }>;
}

export function TaskDetailsPanel({
  task,
  onClose,
  onEdit,
  onAddComment,
  onAttachFile,
  onLinkTask,
  onChangeStatus,
  linkedTasks = [],
  childTasks = [],
  parentTask = null,
  comments = [],
  attachments = []
}: TaskDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'attachments' | 'ai'>('details');
  const [commentText, setCommentText] = useState('');
  const [showLinkedTasks, setShowLinkedTasks] = useState(false);
  const [showChildTasks, setShowChildTasks] = useState(false);
  const [showStakeholders, setShowStakeholders] = useState(false);

  if (!task) return null;

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'IN_PROGRESS':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'DONE':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'LOW':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'HIGH':
        return <Flag className="w-4 h-4 text-red-400" />;
      case 'MEDIUM':
        return <Flag className="w-4 h-4 text-amber-400" />;
      case 'LOW':
        return <Flag className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return <HelpCircle className="w-4 h-4 text-blue-400" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'DONE':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const typeConfig = taskTypeConfig[task.issueType] || taskTypeConfig.ADMINISTRATIVE;

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onAddComment) return;
    onAddComment(task.id, commentText);
    setCommentText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onAttachFile) return;
    onAttachFile(task.id, e.target.files[0]);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#121C2E] shadow-2xl text-gray-100 h-full flex flex-col animate-slideInRight border-l border-indigo-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/30 bg-[#1A2333]">
          <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600/60">
              {task.profilePicture ? (
                <img src={task.profilePicture} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-indigo-100" />
              )}
            </div>
            <span>Task #{task.ticketNumber}</span>
          </h2>
          <button 
            className="p-2 rounded-full hover:bg-indigo-500/20 transition-colors text-gray-400 hover:text-gray-100"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-500/30 bg-[#1A2333]/70">
          <button 
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'details' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <FileText className="w-4 h-4" />
            <span>Details</span>
          </button>
          <button 
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'comments' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('comments')}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments {comments.length > 0 && `(${comments.length})`}</span>
          </button>
          <button 
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'attachments' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('attachments')}
          >
            <Paperclip className="w-4 h-4" />
            <span>Attachments {attachments.length > 0 && `(${attachments.length})`}</span>
          </button>
          <button 
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'ai' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              <div className="absolute -right-1 -top-1 w-2 h-2 bg-indigo-500 rounded-full"></div>
            </div>
            <span>AI Chat</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-indigo-600/30 bg-indigo-900/20">
                  {task.profilePicture ? (
                    <img 
                      src={task.profilePicture} 
                      alt={task.patientName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-indigo-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-100">{task.patientName}</h2>
                  <p className="text-gray-400 mb-2">DOB: {task.patientDOB}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span>
                        {task.status === 'TODO' ? 'To Do' : 
                         task.status === 'IN_PROGRESS' ? 'In Progress' : 
                         task.status === 'DONE' ? 'Complete' : task.status}
                      </span>
                    </div>
                    
                    {/* Priority Badge */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon()}
                      <span>{task.priority} Priority</span>
                    </div>
                    
                    {/* Type Badge */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${typeConfig.bgColor} ${typeConfig.color}`}>
                      <typeConfig.icon className="w-3 h-3" />
                      <span>{typeConfig.label}</span>
                    </div>
                    
                    {/* Parent/Child Indicators */}
                    {parentTask && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        <Layers className="w-3 h-3" />
                        <span>Subtask</span>
                      </div>
                    )}
                    
                    {childTasks && childTasks.length > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        <Layers className="w-3 h-3" />
                        <span>{childTasks.length} Subtasks</span>
                      </div>
                    )}
                    
                    {/* Linked Tasks Indicator */}
                    {linkedTasks && linkedTasks.length > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <LinkIcon className="w-3 h-3" />
                        <span>{linkedTasks.length} Linked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Task Info */}
              <div className="space-y-4">
                {/* Task Description */}
                <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Task Description</span>
                  </h3>
                  <p className="text-gray-200 leading-relaxed">{task.description}</p>
                </div>
                
                {/* Task Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>Due Date</span>
                    </h3>
                    <p className="text-gray-200">{format(new Date(task.dueDate), 'MMMM d, yyyy')}</p>
                  </div>
                  
                  <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>Created</span>
                    </h3>
                    <p className="text-gray-200">{format(new Date(task.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                
                {/* Status Selector */}
                <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-indigo-400" />
                    <span>Change Status</span>
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      className={`flex-1 p-2 rounded-md border text-center text-sm font-medium transition-colors ${
                        task.status === 'TODO' ? 'bg-blue-600/30 border-blue-500/50 text-blue-200' : 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20'
                      }`}
                      onClick={() => onChangeStatus && onChangeStatus(task.id, 'TODO')}
                    >
                      To Do
                    </button>
                    <button 
                      className={`flex-1 p-2 rounded-md border text-center text-sm font-medium transition-colors ${
                        task.status === 'IN_PROGRESS' ? 'bg-amber-600/30 border-amber-500/50 text-amber-200' : 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
                      }`}
                      onClick={() => onChangeStatus && onChangeStatus(task.id, 'IN_PROGRESS')}
                    >
                      In Progress
                    </button>
                    <button 
                      className={`flex-1 p-2 rounded-md border text-center text-sm font-medium transition-colors ${
                        task.status === 'DONE' ? 'bg-green-600/30 border-green-500/50 text-green-200' : 'bg-green-500/10 border-green-500/20 text-green-300 hover:bg-green-500/20'
                      }`}
                      onClick={() => onChangeStatus && onChangeStatus(task.id, 'DONE')}
                    >
                      Complete
                    </button>
                  </div>
                </div>
                
                {/* Parent Task Reference */}
                {parentTask && (
                  <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Parent Task</span>
                    </h3>
                    <div className="p-3 bg-[#121C2E] rounded border border-indigo-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <getStatusIcon status={parentTask.status} />
                        <span className="text-gray-300 text-sm">{parentTask.description.substring(0, 50)}...</span>
                      </div>
                      <button className="p-1 rounded hover:bg-indigo-500/20 transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Child Tasks */}
                {childTasks && childTasks.length > 0 && (
                  <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                    <button 
                      className="w-full text-sm font-semibold text-gray-400 mb-2 flex items-center justify-between"
                      onClick={() => setShowChildTasks(!showChildTasks)}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>Subtasks ({childTasks.length})</span>
                      </div>
                      {showChildTasks ? 
                        <ChevronDown className="w-4 h-4 text-indigo-400" /> : 
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      }
                    </button>
                    
                    {showChildTasks && (
                      <div className="space-y-2 mt-3">
                        {childTasks.map((childTask) => (
                          <div key={childTask.id} className="p-3 bg-[#121C2E] rounded border border-indigo-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(childTask.status)}
                              <span className={`text-gray-300 text-sm ${childTask.status === 'DONE' ? 'line-through opacity-70' : ''}`}>
                                {childTask.description.substring(0, 50)}...
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(childTask.status)}`}>
                                {childTask.status === 'TODO' ? 'To Do' : 
                                 childTask.status === 'IN_PROGRESS' ? 'In Progress' : 
                                 'Complete'}
                              </span>
                              <button className="p-1 rounded hover:bg-indigo-500/20 transition-colors">
                                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button className="w-full p-2 mt-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 
                          text-cyan-300 hover:bg-cyan-500/20 transition-colors text-sm font-medium"
                        >
                          + Add Subtask
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Linked Tasks */}
                {linkedTasks && linkedTasks.length > 0 && (
                  <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                    <button 
                      className="w-full text-sm font-semibold text-gray-400 mb-2 flex items-center justify-between"
                      onClick={() => setShowLinkedTasks(!showLinkedTasks)}
                    >
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-purple-400" />
                        <span>Linked Tasks ({linkedTasks.length})</span>
                      </div>
                      {showLinkedTasks ? 
                        <ChevronDown className="w-4 h-4 text-indigo-400" /> : 
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      }
                    </button>
                    
                    {showLinkedTasks && (
                      <div className="space-y-2 mt-3">
                        {linkedTasks.map((linkedTask) => (
                          <div key={linkedTask.id} className="p-3 bg-[#121C2E] rounded border border-indigo-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-purple-400" />
                              <span className="text-gray-300 text-sm">
                                {linkedTask.patientName}: {linkedTask.description.substring(0, 40)}...
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(linkedTask.status)}`}>
                                {linkedTask.status === 'TODO' ? 'To Do' : 
                                 linkedTask.status === 'IN_PROGRESS' ? 'In Progress' : 
                                 'Complete'}
                              </span>
                              <button className="p-1 rounded hover:bg-indigo-500/20 transition-colors">
                                <ArrowUpRight className="w-4 h-4 text-purple-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button className="w-full p-2 mt-2 rounded-md bg-purple-500/10 border border-purple-500/30 
                          text-purple-300 hover:bg-purple-500/20 transition-colors text-sm font-medium"
                        >
                          + Link Task
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Stakeholders */}
                {task.stakeholders && task.stakeholders.length > 0 && (
                  <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                    <button 
                      className="w-full text-sm font-semibold text-gray-400 mb-2 flex items-center justify-between"
                      onClick={() => setShowStakeholders(!showStakeholders)}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span>Stakeholders ({task.stakeholders.length})</span>
                      </div>
                      {showStakeholders ? 
                        <ChevronDown className="w-4 h-4 text-indigo-400" /> : 
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      }
                    </button>
                    
                    {showStakeholders && (
                      <div className="space-y-3 mt-3">
                        {task.stakeholders.map((stakeholder) => (
                          <div key={stakeholder.id} className="p-3 bg-[#121C2E] rounded border border-indigo-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-800/70 flex items-center justify-center">
                                <User className="w-4 h-4 text-indigo-200" />
                              </div>
                              <div>
                                <p className="text-gray-200 text-sm font-medium">{stakeholder.name}</p>
                                {stakeholder.email && (
                                  <p className="text-gray-400 text-xs">{stakeholder.email}</p>
                                )}
                              </div>
                            </div>
                            <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                              {stakeholder.role}
                            </span>
                          </div>
                        ))}
                        
                        <button className="w-full p-2 mt-2 rounded-md bg-indigo-500/10 border border-indigo-500/30 
                          text-indigo-300 hover:bg-indigo-500/20 transition-colors text-sm font-medium"
                        >
                          + Add Stakeholder
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <MessageSquare className="w-12 h-12 text-indigo-500/30 mb-4" />
                    <h3 className="text-gray-300 font-medium mb-2">No comments yet</h3>
                    <p className="text-gray-500 text-sm">Be the first to add a comment to this task.</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1A2333] rounded-lg border border-indigo-500/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            {comment.authorAvatar ? (
                              <img src={comment.authorAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">{comment.author}</p>
                            <p className="text-xs text-gray-500">{format(comment.timestamp, 'MMM d, yyyy h:mm a')}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="bg-[#1A2333] rounded-lg border border-indigo-500/30 p-4">
                <form onSubmit={handleSubmitComment}>
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full bg-[#121C2E] border border-indigo-500/20 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 resize-none mb-3"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'attachments' && (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                {attachments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <Paperclip className="w-12 h-12 text-indigo-500/30 mb-4" />
                    <h3 className="text-gray-300 font-medium mb-2">No attachments yet</h3>
                    <p className="text-gray-500 text-sm">Add files to this task by using the button below.</p>
                  </div>
                ) : (
                  attachments.map((attachment) => (
                    <div key={attachment.id} className="bg-[#1A2333] rounded-lg border border-indigo-500/30 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-200">{attachment.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)} • Uploaded {format(attachment.uploadedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  ))
                )}
              </div>
              
              <div className="bg-[#1A2333] rounded-lg border border-indigo-500/30 p-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/30 rounded-lg p-6 cursor-pointer hover:border-indigo-500/50 transition-colors">
                  <Paperclip className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-gray-300 font-medium">Drag and drop a file or click to browse</p>
                  <p className="text-gray-500 text-sm mt-1">Support for documents, images, and PDFs</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'ai' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-lg mb-6">
                  <h3 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                    <div className="p-1 bg-indigo-600/20 rounded-full">
                      <MessageSquare className="w-3 h-3 text-indigo-400" />
                    </div>
                    <span>AI Assistant</span>
                  </h3>
                  <p className="text-sm text-gray-300">
                    I'm your AI task assistant. I can help you analyze this task, suggest next steps, or answer any questions about the patient or clinical context.
                  </p>
                </div>
                
                {/* This would be replaced with actual AI chat interface component, similar to RonExperience */}
                <div className="bg-gray-900/50 p-4 rounded-lg border border-indigo-500/20 text-center">
                  <p className="text-gray-400 text-sm">
                    AI chat interface will be implemented here, connecting to the same backend as RonExperience but with full context about this specific task.
                  </p>
                </div>
              </div>
              
              <div className="sticky bottom-0">
                <div className="p-4 bg-[#1A2333] rounded-lg border border-indigo-500/30">
                  <form className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Ask AI about this task..."
                      className="flex-1 bg-[#121C2E] border border-indigo-500/20 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                    />
                    <button
                      type="submit"
                      className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { format, isPast, isToday as isTodayFn } from 'date-fns';
import { Search, Filter, ArrowUpDown, Clock, Calendar, User, AlertCircle, CheckCircle2, X, Users, FileText, Link as LinkIcon, Plus, Layers, ChevronDown, ChevronRight, ArrowUpRight, Columns } from 'lucide-react';
import { useKanban, useFilteredTasks } from '../../context/KanbanContext';
import { useTaskHierarchy, getRelatedTasks } from '../../context/TaskHierarchyContext';
import type { KanbanTheme, Task } from '../../types';
import { taskTypeConfig } from '../../utils/taskTypeConfig';

interface EnhancedListViewProps {
  theme: KanbanTheme;
  onViewTaskDetails?: (taskId: string) => void;
}

type SortOption = 'dueDate' | 'priority' | 'status' | 'patientName';
type SortDirection = 'asc' | 'desc';
type GroupBy = 'none' | 'status' | 'priority' | 'issueType';

export function EnhancedListView({ theme, onViewTaskDetails }: EnhancedListViewProps) {
  const { state } = useKanban();
  const tasks = useFilteredTasks();
  const { state: hierarchyState } = useTaskHierarchy();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [groupBy, setGroupBy] = useState<GroupBy>('status');
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({
    'TODO': true,
    'IN_PROGRESS': true,
    'DONE': true,
    'HIGH': true,
    'MEDIUM': true,
    'LOW': true,
    'MEDICAL': true,
    'ADMINISTRATIVE': true,
    'FOLLOW_UP': true
  });
  
  // Apply filters
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !task.patientName.toLowerCase().includes(query) &&
        !task.description.toLowerCase().includes(query) &&
        !task.ticketNumber.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    // Priority filter
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
      return false;
    }
    
    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(task.status)) {
      return false;
    }
    
    // Type filter
    if (typeFilter.length > 0 && !typeFilter.includes(task.issueType)) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority': {
        const priorityValues = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        comparison = (priorityValues[a.priority as keyof typeof priorityValues] || 0) - 
                    (priorityValues[b.priority as keyof typeof priorityValues] || 0);
        break;
      }
      case 'status': {
        const statusValues = { 'TODO': 1, 'IN_PROGRESS': 2, 'DONE': 3 };
        comparison = (statusValues[a.status as keyof typeof statusValues] || 0) - 
                    (statusValues[b.status as keyof typeof statusValues] || 0);
        break;
      }
      case 'patientName':
        comparison = a.patientName.localeCompare(b.patientName);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Group tasks
  const groupedTasks: Record<string, Task[]> = {};
  
  if (groupBy === 'none') {
    groupedTasks['All Tasks'] = sortedTasks;
  } else {
    sortedTasks.forEach(task => {
      const groupKey = task[groupBy];
      if (!groupedTasks[groupKey]) {
        groupedTasks[groupKey] = [];
      }
      groupedTasks[groupKey].push(task);
    });
  }
  
  const getGroupTitle = (key: string) => {
    if (groupBy === 'status') {
      return key === 'TODO' ? 'To Do' : 
             key === 'IN_PROGRESS' ? 'In Progress' : 
             key === 'DONE' ? 'Complete' : key;
    }
    
    if (groupBy === 'priority') {
      return `${key} Priority`;
    }
    
    if (groupBy === 'issueType') {
      return key === 'MEDICAL' ? 'Medical' : 
             key === 'ADMINISTRATIVE' ? 'Administrative' : 
             key === 'FOLLOW_UP' ? 'Follow-up' : key;
    }
    
    return key;
  };
  
  const getGroupIcon = (key: string) => {
    if (groupBy === 'status') {
      return key === 'TODO' ? <Clock className="w-4 h-4 text-blue-400" /> : 
             key === 'IN_PROGRESS' ? <AlertCircle className="w-4 h-4 text-amber-400" /> : 
             key === 'DONE' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : null;
    }
    
    if (groupBy === 'priority') {
      return key === 'HIGH' ? <AlertCircle className="w-4 h-4 text-red-400" /> : 
             key === 'MEDIUM' ? <AlertCircle className="w-4 h-4 text-amber-400" /> : 
             key === 'LOW' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : null;
    }
    
    if (groupBy === 'issueType') {
      const typeConfig = taskTypeConfig[key as keyof typeof taskTypeConfig];
      if (typeConfig && typeConfig.icon) {
        const Icon = typeConfig.icon;
        return <Icon className="w-4 h-4 text-indigo-400" />;
      }
    }
    
    return null;
  };
  
  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };
  
  const togglePriorityFilter = (priority: string) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };
  
  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  const toggleTypeFilter = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  const setGroupByOption = (option: GroupBy) => {
    setGroupBy(option);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter([]);
    setStatusFilter([]);
    setTypeFilter([]);
  };
  
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    
    switch (status) {
      case 'TODO':
        bgColor = 'bg-blue-900/30';
        textColor = 'text-blue-300';
        icon = <Clock className="w-3 h-3" />;
        break;
      case 'IN_PROGRESS':
        bgColor = 'bg-amber-900/30';
        textColor = 'text-amber-300';
        icon = <AlertCircle className="w-3 h-3" />;
        break;
      case 'DONE':
        bgColor = 'bg-green-900/30';
        textColor = 'text-green-300';
        icon = <CheckCircle2 className="w-3 h-3" />;
        break;
      default:
        bgColor = 'bg-gray-900/30';
        textColor = 'text-gray-300';
        icon = <Clock className="w-3 h-3" />;
    }
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs border border-${textColor.split('-')[1]}-500/30`}>
        {icon}
        <span>
          {status === 'TODO' ? 'To Do' : 
           status === 'IN_PROGRESS' ? 'In Progress' : 
           status === 'DONE' ? 'Complete' : status}
        </span>
      </div>
    );
  };
  
  const PriorityBadge = ({ priority }: { priority: string }) => {
    let bgColor = '';
    let textColor = '';
    
    switch (priority) {
      case 'HIGH':
        bgColor = 'bg-red-900/30';
        textColor = 'text-red-300';
        break;
      case 'MEDIUM':
        bgColor = 'bg-amber-900/30';
        textColor = 'text-amber-300';
        break;
      case 'LOW':
        bgColor = 'bg-green-900/30';
        textColor = 'text-green-300';
        break;
      default:
        bgColor = 'bg-gray-900/30';
        textColor = 'text-gray-300';
    }
    
    return (
      <div className={`px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs border border-${textColor.split('-')[1]}-500/30`}>
        {priority}
      </div>
    );
  };
  
  const TypeBadge = ({ type }: { type: string }) => {
    const typeConfig = taskTypeConfig[type as keyof typeof taskTypeConfig] || taskTypeConfig.ADMINISTRATIVE;
    const Icon = typeConfig.icon;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${typeConfig.bgColor} ${typeConfig.color} text-xs`}>
        <Icon className="w-3 h-3" />
        <span>{typeConfig.label}</span>
      </div>
    );
  };
  
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-gradient-to-b from-gray-900/50 to-gray-900/30 rounded-xl p-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks by name, description, or ticket #..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-indigo-500/20 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupByOption(e.target.value as GroupBy)}
              className="bg-gray-800/50 border border-indigo-500/20 rounded-lg text-gray-200 text-sm p-2 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="none">None</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="issueType">Type</option>
            </select>
          </div>
          
          <button
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-indigo-600/10'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-indigo-500/30">
          <div className="flex flex-wrap gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Priority</h3>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priorityFilter.includes('HIGH')
                      ? 'bg-red-900/50 text-red-300 border border-red-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => togglePriorityFilter('HIGH')}
                >
                  High
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priorityFilter.includes('MEDIUM')
                      ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => togglePriorityFilter('MEDIUM')}
                >
                  Medium
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    priorityFilter.includes('LOW')
                      ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => togglePriorityFilter('LOW')}
                >
                  Low
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Status</h3>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusFilter.includes('TODO')
                      ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleStatusFilter('TODO')}
                >
                  To Do
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusFilter.includes('IN_PROGRESS')
                      ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleStatusFilter('IN_PROGRESS')}
                >
                  In Progress
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusFilter.includes('DONE')
                      ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleStatusFilter('DONE')}
                >
                  Complete
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Type</h3>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeFilter.includes('MEDICAL')
                      ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleTypeFilter('MEDICAL')}
                >
                  Medical
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeFilter.includes('ADMINISTRATIVE')
                      ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleTypeFilter('ADMINISTRATIVE')}
                >
                  Administrative
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeFilter.includes('FOLLOW_UP')
                      ? 'bg-teal-900/50 text-teal-300 border border-teal-500/30'
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700'
                  }`}
                  onClick={() => toggleTypeFilter('FOLLOW_UP')}
                >
                  Follow-up
                </button>
              </div>
            </div>
            
            <div className="ml-auto flex items-center">
              <button
                className="px-3 py-1 rounded-lg text-gray-300 bg-indigo-600/20 border border-indigo-500/30 text-xs font-medium hover:bg-indigo-600/30 transition-colors"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Header and Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-800/90 text-gray-300 font-medium text-sm border-b border-indigo-500/20">
          <div className="col-span-4 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('patientName')}>
            <span>Patient</span>
            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'patientName' ? 'text-indigo-400' : 'text-gray-500'}`} />
          </div>
          <div className="col-span-3 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('dueDate')}>
            <span>Due Date</span>
            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'dueDate' ? 'text-indigo-400' : 'text-gray-500'}`} />
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <span>Type</span>
          </div>
          <div className="col-span-1 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('priority')}>
            <span>Priority</span>
            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'priority' ? 'text-indigo-400' : 'text-gray-500'}`} />
          </div>
          <div className="col-span-1 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('status')}>
            <span>Status</span>
            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'status' ? 'text-indigo-400' : 'text-gray-500'}`} />
          </div>
          <div className="col-span-1 flex items-center gap-1">
            <span>Actions</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-800/30">
          {Object.keys(groupedTasks).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Columns className="w-16 h-16 text-indigo-500/30 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or adding a new task</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Add New Task</span>
              </button>
            </div>
          ) : (
            Object.entries(groupedTasks).map(([groupKey, groupTasks]) => (
              <div key={groupKey} className="border-b border-indigo-500/10 last:border-b-0">
                {/* Group header */}
                {groupBy !== 'none' && (
                  <div 
                    className="flex items-center justify-between px-4 py-3 bg-gray-800/60 cursor-pointer"
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedGroups[groupKey] ? 
                        <ChevronDown className="w-4 h-4 text-indigo-400" /> : 
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      }
                      
                      {getGroupIcon(groupKey)}
                      
                      <span className="font-medium text-gray-200">
                        {getGroupTitle(groupKey)}
                      </span>
                      
                      <span className="text-sm text-gray-400 ml-2">
                        ({groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'})
                      </span>
                    </div>
                    
                    <button className="p-1 rounded-lg text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Group content */}
                {(groupBy === 'none' || expandedGroups[groupKey]) && (
                  <div className="divide-y divide-gray-700/30">
                    {groupTasks.map((task) => {
                      const { childTasks, parentTask, linkedTasks } = getRelatedTasks(task.id, allTasks, hierarchyState);
                      
                      const dueDate = new Date(task.dueDate);
                      const isOverdue = isPast(dueDate) && !isTodayFn(dueDate);
                      
                      return (
                        <div 
                          key={task.id}
                          className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-700/20 cursor-pointer transition-colors text-sm"
                          onClick={() => onViewTaskDetails && onViewTaskDetails(task.id)}
                        >
                          {/* Patient info */}
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-indigo-500/30">
                              {task.profilePicture ? (
                                <img src={task.profilePicture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-600/30">
                                  <User className="w-5 h-5 text-indigo-300" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-200">{task.patientName}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-2">
                                <span>#{task.ticketNumber}</span>
                                
                                <div className="flex gap-1">
                                  {childTasks.length > 0 && (
                                    <span className="flex items-center gap-0.5 text-cyan-400">
                                      <Layers className="w-3 h-3" />
                                      <span>{childTasks.length}</span>
                                    </span>
                                  )}
                                  
                                  {parentTask && (
                                    <span className="flex items-center gap-0.5 text-indigo-400">
                                      <Layers className="w-3 h-3" />
                                      <span>Sub</span>
                                    </span>
                                  )}
                                  
                                  {linkedTasks.length > 0 && (
                                    <span className="flex items-center gap-0.5 text-purple-400">
                                      <LinkIcon className="w-3 h-3" />
                                      <span>{linkedTasks.length}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Due date */}
                          <div className="col-span-3 flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`} />
                            <span className={isOverdue ? 'text-red-400' : 'text-gray-300'}>
                              {isOverdue ? 'Overdue: ' : ''}
                              {format(dueDate, 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          {/* Task type */}
                          <div className="col-span-2 flex items-center">
                            <TypeBadge type={task.issueType} />
                          </div>
                          
                          {/* Priority */}
                          <div className="col-span-1 flex items-center">
                            <PriorityBadge priority={task.priority} />
                          </div>
                          
                          {/* Status */}
                          <div className="col-span-1 flex items-center">
                            <StatusBadge status={task.status} />
                          </div>
                          
                          {/* Actions */}
                          <div className="col-span-1 flex items-center justify-end gap-1">
                            <button 
                              className="p-1 rounded-full hover:bg-indigo-500/20 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewTaskDetails && onViewTaskDetails(task.id);
                              }}
                              title="View details"
                            >
                              <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                            </button>
                            <button 
                              className="p-1 rounded-full hover:bg-indigo-500/20 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Edit task', task.id);
                              }}
                              title="Edit task"
                            >
                              <FileText className="w-4 h-4 text-indigo-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { format, addMonths, addWeeks, addDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth, parseISO, isWithinInterval, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, CalendarDays, LayoutGrid, ListFilter, Filter, CheckCircle2, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { useKanban, useFilteredTasks } from '../../context/KanbanContext';
import type { KanbanTheme, Task } from '../../types';
import { taskTypeConfig } from '../../utils/taskTypeConfig';
import { useTaskHierarchy, getRelatedTasks } from '../../context/TaskHierarchyContext';
import { isPast, isToday as isTodayFn } from 'date-fns';

interface EnhancedCalendarViewProps {
  theme: KanbanTheme;
  onViewTaskDetails?: (taskId: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function EnhancedCalendarView({ theme, onViewTaskDetails }: EnhancedCalendarViewProps) {
  const { state, dispatch } = useKanban();
  const { calendarViewMode, currentDate } = state;
  const allTasks = useFilteredTasks();
  const { state: hierarchyState } = useTaskHierarchy();
  
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  
  const filteredTasks = allTasks.filter(task => {
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
      return false;
    }
    if (typeFilter.length > 0 && !typeFilter.includes(task.issueType)) {
      return false;
    }
    return true;
  });

  const viewModes = [
    { value: 'month' as const, label: 'Month', icon: CalendarDays },
    { value: 'week' as const, label: 'Week', icon: Calendar },
    { value: 'day' as const, label: 'Day', icon: Clock },
  ];

  const handleSetViewMode = (mode: typeof calendarViewMode) => {
    dispatch({ type: 'SET_CALENDAR_MODE', payload: mode });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate;
    switch (calendarViewMode) {
      case 'month':
        newDate = addMonths(currentDate, direction === 'next' ? 1 : -1);
        break;
      case 'week':
        newDate = addWeeks(currentDate, direction === 'next' ? 1 : -1);
        break;
      case 'day':
        newDate = addDays(currentDate, direction === 'next' ? 1 : -1);
        break;
      default:
        newDate = currentDate;
    }
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const todayHandler = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  };
  
  const getDateRangeText = () => {
    switch (calendarViewMode) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week': {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      }
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  };
  
  const getTasksForDate = (date: Date) => {
    return filteredTasks.filter(task => {
      try {
        const taskDate = parseISO(task.dueDate);
        if (calendarViewMode === 'month') {
          return isSameMonth(taskDate, date) && taskDate.getDate() === date.getDate();
        } else if (calendarViewMode === 'week') {
          const dayStart = startOfDay(date);
          const dayEnd = endOfDay(date);
          return isWithinInterval(taskDate, { start: dayStart, end: dayEnd });
        } else {
          return isWithinInterval(taskDate, { start: startOfDay(date), end: endOfDay(date) });
        }
      } catch (e) {
        return false;
      }
    });
  };
  
  const getTaskCardClasses = (task: Task) => {
    let baseClasses = 'flex flex-col rounded-lg p-2 mb-1 border shadow-sm cursor-pointer hover:scale-[1.02] transition-transform text-xs ';
    
    if (theme.name === 'dark') {
      switch (task.priority) {
        case 'HIGH':
          return baseClasses + 'bg-red-900/30 border-red-500/30 hover:bg-red-900/40 hover:border-red-500/50';
        case 'MEDIUM': 
          return baseClasses + 'bg-amber-900/30 border-amber-500/30 hover:bg-amber-900/40 hover:border-amber-500/50';
        default:
          return baseClasses + 'bg-green-900/30 border-green-500/30 hover:bg-green-900/40 hover:border-green-500/50';
      }
    } else {
      switch (task.priority) {
        case 'HIGH':
          return baseClasses + 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300';
        case 'MEDIUM': 
          return baseClasses + 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300';
        default:
          return baseClasses + 'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300';
      }
    }
  };
  
  const TaskCard = ({ task, minimal = false }: { task: Task, minimal?: boolean }) => {
    const { childTasks, parentTask, linkedTasks } = getRelatedTasks(task.id, allTasks, hierarchyState);
    const typeConfig = taskTypeConfig[task.issueType] || taskTypeConfig.ADMINISTRATIVE;
    const TaskIcon = typeConfig?.icon || User;
    
    const dueDate = new Date(task.dueDate);
    const isOverdue = isPast(dueDate) && !isTodayFn(dueDate);
    
    return (
      <div 
        className={getTaskCardClasses(task)}
        onClick={() => onViewTaskDetails && onViewTaskDetails(task.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded-full overflow-hidden flex items-center justify-center ${typeConfig.bgColor}`}>
              <TaskIcon className="w-2 h-2 text-white" />
            </div>
            <span className={`font-medium truncate ${isOverdue ? 'text-red-400' : theme.text}`}>
              {minimal ? task.ticketNumber : task.patientName}
            </span>
          </div>
          
          {!minimal && (
            <div className="flex items-center gap-1">
              {task.status === 'TODO' && <Clock className="w-3 h-3 text-blue-400" />}
              {task.status === 'IN_PROGRESS' && <AlertCircle className="w-3 h-3 text-amber-400" />}
              {task.status === 'DONE' && <CheckCircle2 className="w-3 h-3 text-green-400" />}
            </div>
          )}
        </div>
        
        {!minimal && (
          <>
            <p className="truncate text-xs text-gray-500 mt-1">
              {task.description.substring(0, 40)}...
            </p>
            <div className="flex justify-between items-center mt-1 text-[10px] text-gray-500">
              <span>{task.ticketNumber}</span>
              
              <div className="flex gap-1">
                {childTasks.length > 0 && <span className="text-cyan-400">{childTasks.length} subtasks</span>}
                {parentTask && <span className="text-indigo-400">Subtask</span>}
                {linkedTasks.length > 0 && <span className="text-purple-400">{linkedTasks.length} linked</span>}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  const renderMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="grid grid-cols-7 h-full">
        {/* Weekday labels */}
        {WEEKDAYS.map((day) => (
          <div key={day} className={`p-2 text-center font-medium ${theme.textSecondary} border-b ${theme.border}`}>
            {day}
          </div>
        ))}
        
        {/* Calendar grid */}
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);
          return (
            <div
              key={day.toString()}
              className={`
                border ${theme.border} p-1 h-[120px] overflow-hidden
                ${!isSameMonth(day, currentDate) ? (theme.name === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100/50') : ''}
                ${isToday(day) ? (theme.name === 'dark' ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200') : ''}
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`
                  flex items-center justify-center w-6 h-6 rounded-full text-sm
                  ${isToday(day) ? 'bg-indigo-500 text-white' : (theme.name === 'dark' ? 'text-gray-400' : 'text-gray-600')}
                  ${!isSameMonth(day, currentDate) ? 'opacity-40' : ''}
                `}>
                  {format(day, 'd')}
                </span>
                
                {dayTasks.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${theme.name === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                    {dayTasks.length}
                  </span>
                )}
              </div>
              
              <div className="overflow-y-auto max-h-[80px] pr-1 space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <TaskCard key={task.id} task={task} minimal={true} />
                ))}
                
                {dayTasks.length > 3 && (
                  <div className={`text-xs px-2 py-1 flex items-center justify-center ${theme.textSecondary}`}>
                    + {dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderWeek = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <div className="flex flex-col h-full">
        {/* Day header */}
        <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
          {/* Empty cell for the time column */}
          <div className={`p-2 ${theme.textSecondary} text-xs font-medium border-r ${theme.border}`}></div>
          
          {/* Day column headers */}
          {days.map((day) => (
            <div 
              key={day.toString()}
              className={`p-2 text-center ${
                isToday(day) 
                  ? 'bg-indigo-600/20 text-indigo-300 font-medium' 
                  : `${theme.textSecondary}`
              }`}
            >
              <div>{format(day, 'EEE')}</div>
              <div className={`text-lg ${isToday(day) ? 'text-indigo-100 font-bold' : theme.text}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 h-[96rem]"> {/* 24 hours * 4rem per hour */}
            {/* Time column */}
            <div className="col-span-1 border-r border-gray-200 dark:border-gray-700">
              {HOURS.map((hour) => (
                <div 
                  key={hour}
                  className="h-16 border-b border-gray-200 dark:border-gray-700 px-2 py-1"
                >
                  <div className={`text-xs ${theme.textSecondary}`}>
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Day columns */}
            {days.map((day) => {
              const dayTasks = getTasksForDate(day);
              return (
                <div 
                  key={day.toString()}
                  className={`col-span-1 border-r border-gray-200 dark:border-gray-700 relative ${
                    isToday(day) ? 'bg-indigo-600/5' : ''
                  }`}
                >
                  {/* Hour cells */}
                  {HOURS.map((hour) => (
                    <div 
                      key={hour}
                      className="h-16 border-b border-gray-200 dark:border-gray-700"
                    ></div>
                  ))}
                  
                  {/* Tasks */}
                  <div className="absolute inset-0 p-1 overflow-hidden pointer-events-none">
                    <div className="overflow-y-auto max-h-full pointer-events-auto">
                      {dayTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const renderDay = () => {
    const dayTasks = getTasksForDate(currentDate);
    
    return (
      <div className="flex flex-col h-full">
        {/* All day tasks */}
        {dayTasks.length > 0 && (
          <div className={`p-3 border-b ${theme.border}`}>
            <h3 className={`text-sm font-medium mb-2 ${theme.textSecondary}`}>Tasks</h3>
            <div className="space-y-2">
              {dayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
        
        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 h-[96rem]"> {/* 24 hours * 4rem per hour */}
            {HOURS.map((hour) => (
              <div 
                key={hour}
                className={`h-16 border-b ${theme.border} px-3 py-1 flex items-center gap-2`}
              >
                <div className={`text-sm font-medium w-16 ${theme.textSecondary}`}>
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                
                <div className={`h-12 w-0.5 ${hour % 3 === 0 ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`}></div>
                
                <div className="flex-1 h-full flex items-center">
                  <div 
                    className="w-full h-10 rounded-lg border border-dashed border-indigo-500/20 flex items-center justify-center cursor-pointer"
                    onClick={() => console.log(`Add task at ${hour}:00`)}
                  >
                    <Plus className="w-4 h-4 text-indigo-500/50" />
                    <span className="text-xs text-indigo-500/50 ml-1">Add task</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const togglePriorityFilter = (priority: string) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };
  
  const toggleTypeFilter = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-gradient-to-b from-gray-900/50 to-gray-900/30 rounded-xl p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {viewModes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                calendarViewMode === value 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-indigo-600/10'
              }`}
              onClick={() => handleSetViewMode(value)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
          
          <button
            className="px-3 py-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-indigo-600/10 flex items-center gap-2 transition-colors"
            onClick={todayHandler}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Today</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-indigo-600/10 transition-colors"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className={`text-lg font-medium ${theme.text}`}>
            {getDateRangeText()}
          </span>
          <button
            className="p-2 rounded-lg text-gray-400 hover:text-gray-300 hover:bg-indigo-600/10 transition-colors"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
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
          <div className="flex gap-6">
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
                onClick={() => {
                  setPriorityFilter([]);
                  setTypeFilter([]);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`flex-1 bg-gray-800/30 border border-indigo-500/20 rounded-lg overflow-hidden shadow-lg`}>
        {calendarViewMode === 'month' && renderMonth()}
        {calendarViewMode === 'week' && renderWeek()}
        {calendarViewMode === 'day' && renderDay()}
      </div>
    </div>
  );
}
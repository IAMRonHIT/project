import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle2, Clock as ClockIcon, BarChart2, PieChart, Calendar, AlertCircle, Users, Activity, Star } from 'lucide-react';
import type { Task } from '../types';
import { isPast, isToday, addDays, formatDistance, format, isWithinInterval, startOfWeek, endOfWeek, isFuture } from 'date-fns';

interface AnalyticsProps {
  tasks: Task[];
  theme: 'light' | 'dark';
}

export function DashboardAnalytics({ tasks, theme }: AnalyticsProps) {
  // Calculate key metrics
  const metrics = useMemo(() => {
    const today = new Date();
    const totalTasks = tasks.length;
    
    // Status counts
    const todoCount = tasks.filter(task => task.status === 'TODO').length;
    const inProgressCount = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter(task => task.status === 'DONE').length;
    
    // Due date metrics
    const overdueTasks = tasks.filter(task => 
      task.status !== 'DONE' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
    );
    
    const dueTodayTasks = tasks.filter(task => 
      task.status !== 'DONE' && isToday(new Date(task.dueDate))
    );
    
    const upcomingTasks = tasks.filter(task => 
      task.status !== 'DONE' && isFuture(new Date(task.dueDate))
    );
    
    // Priority breakdown
    const highPriorityCount = tasks.filter(task => task.priority === 'HIGH').length;
    const mediumPriorityCount = tasks.filter(task => task.priority === 'MEDIUM').length;
    const lowPriorityCount = tasks.filter(task => task.priority === 'LOW').length;
    
    // Type breakdown
    const medicalCount = tasks.filter(task => task.issueType === 'MEDICAL').length;
    const administrativeCount = tasks.filter(task => task.issueType === 'ADMINISTRATIVE').length;
    const followUpCount = tasks.filter(task => task.issueType === 'FOLLOW_UP').length;
    
    // Current week tasks
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const tasksThisWeek = tasks.filter(task => 
      isWithinInterval(new Date(task.dueDate), { start: weekStart, end: weekEnd })
    );
    
    // Completion rate
    const completionRate = totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0;
    
    // Stakeholders
    const stakeholdersCount = new Set(
      tasks.flatMap(task => task.stakeholders?.map(s => s.id) || [])
    ).size;
    
    return {
      totalTasks,
      todoCount,
      inProgressCount,
      doneCount,
      overdueCount: overdueTasks.length,
      dueTodayCount: dueTodayTasks.length,
      upcomingCount: upcomingTasks.length,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
      medicalCount,
      administrativeCount,
      followUpCount,
      tasksThisWeekCount: tasksThisWeek.length,
      completionRate,
      stakeholdersCount
    };
  }, [tasks]);
  
  // Task progress percentage
  const progressPercentage = Math.round((metrics.doneCount / (metrics.totalTasks || 1)) * 100);
  
  // Next upcoming task
  const nextUpcomingTask = useMemo(() => {
    const incompleteTasks = tasks.filter(task => task.status !== 'DONE');
    if (incompleteTasks.length === 0) return null;
    
    return incompleteTasks.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )[0];
  }, [tasks]);
  
  // Task type distribution for chart
  const taskTypeData = [
    { label: 'Medical', value: metrics.medicalCount, color: 'rgb(59, 130, 246)' },
    { label: 'Administrative', value: metrics.administrativeCount, color: 'rgb(139, 92, 246)' },
    { label: 'Follow-up', value: metrics.followUpCount, color: 'rgb(20, 184, 166)' }
  ];
  
  // Priority distribution for chart
  const priorityData = [
    { label: 'High', value: metrics.highPriorityCount, color: 'rgb(239, 68, 68)' },
    { label: 'Medium', value: metrics.mediumPriorityCount, color: 'rgb(245, 158, 11)' },
    { label: 'Low', value: metrics.lowPriorityCount, color: 'rgb(34, 197, 94)' }
  ];
  
  return (
    <div className="bg-[#121C2E] border border-indigo-500/30 rounded-lg p-4">
      <h2 className="text-lg font-medium text-indigo-300 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        <span>Task Analytics Dashboard</span>
      </h2>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1A2333] rounded-lg p-4 border border-indigo-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Tasks</h3>
            <div className="p-2 rounded-full bg-indigo-600/20">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-200">{metrics.totalTasks}</p>
          <div className="text-xs text-green-400 mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>{progressPercentage}% Complete</span>
          </div>
        </div>
        
        <div className="bg-[#1A2333] rounded-lg p-4 border border-indigo-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Overdue Tasks</h3>
            <div className="p-2 rounded-full bg-red-600/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-200">{metrics.overdueCount}</p>
          <div className={`text-xs mt-2 flex items-center ${
            metrics.overdueCount > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {metrics.overdueCount > 0 ? (
              <>
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Requires attention</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                <span>No overdue tasks</span>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-[#1A2333] rounded-lg p-4 border border-indigo-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Due Today</h3>
            <div className="p-2 rounded-full bg-amber-600/20">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-200">{metrics.dueTodayCount}</p>
          <div className="text-xs text-amber-400 mt-2 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Due in 24 hours</span>
          </div>
        </div>
        
        <div className="bg-[#1A2333] rounded-lg p-4 border border-indigo-500/20 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Stakeholders</h3>
            <div className="p-2 rounded-full bg-teal-600/20">
              <Users className="w-4 h-4 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-200">{metrics.stakeholdersCount}</p>
          <div className="text-xs text-teal-400 mt-2 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>Active participants</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-4">
        {/* Task Progress Panel */}
        <div className="col-span-8 bg-[#1A2333] rounded-lg p-4 border border-indigo-500/20">
          <h3 className="text-md font-medium text-gray-300 mb-3">Task Progress</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#121C2E] rounded-lg p-3 border border-indigo-500/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600/20 mb-2">
                <ClockIcon className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-gray-200">{metrics.todoCount}</p>
              <p className="text-xs text-gray-400">To Do</p>
            </div>
            
            <div className="bg-[#121C2E] rounded-lg p-3 border border-indigo-500/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-600/20 mb-2">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-lg font-bold text-gray-200">{metrics.inProgressCount}</p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
            
            <div className="bg-[#121C2E] rounded-lg p-3 border border-indigo-500/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-600/20 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-lg font-bold text-gray-200">{metrics.doneCount}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
          
          <div className="mb-2 flex justify-between items-center">
            <h4 className="text-sm text-gray-400">Overall Progress</h4>
            <span className="text-sm font-medium text-gray-300">{progressPercentage}%</span>
          </div>
          
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Priority Distribution */}
          <div className="mt-6">
            <h4 className="text-sm text-gray-400 mb-3">Priority Distribution</h4>
            <div className="flex gap-4">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="text-xs text-gray-400">High</div>
                <div className="text-xs font-medium text-gray-300 ml-auto">{metrics.highPriorityCount}</div>
              </div>
              
              <div className="flex-1 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="text-xs text-gray-400">Medium</div>
                <div className="text-xs font-medium text-gray-300 ml-auto">{metrics.mediumPriorityCount}</div>
              </div>
              
              <div className="flex-1 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="text-xs text-gray-400">Low</div>
                <div className="text-xs font-medium text-gray-300 ml-auto">{metrics.lowPriorityCount}</div>
              </div>
            </div>
          </div>
          
          {/* Simplified priority chart */}
          <div className="mt-3 w-full h-6 rounded-lg overflow-hidden flex">
            {metrics.totalTasks > 0 && (
              <>
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${(metrics.highPriorityCount / metrics.totalTasks) * 100}%` }}
                ></div>
                <div 
                  className="h-full bg-amber-500" 
                  style={{ width: `${(metrics.mediumPriorityCount / metrics.totalTasks) * 100}%` }}
                ></div>
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(metrics.lowPriorityCount / metrics.totalTasks) * 100}%` }}
                ></div>
              </>
            )}
          </div>
        </div>
        
        {/* Upcoming Tasks Panel */}
        <div className="col-span-4 bg-[#1A2333] rounded-lg p-4 border border-indigo-500/20">
          <h3 className="text-md font-medium text-gray-300 mb-3">Upcoming</h3>
          
          {nextUpcomingTask ? (
            <div className="bg-[#121C2E] rounded-lg p-3 border border-indigo-500/10 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-medium text-gray-300">Next Task Due</h4>
              </div>
              
              <p className="text-sm text-gray-300 mb-2">{nextUpcomingTask.patientName}</p>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{nextUpcomingTask.description}</p>
              
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-xs gap-1 px-2 py-1 rounded-full ${
                  isPast(new Date(nextUpcomingTask.dueDate)) && !isToday(new Date(nextUpcomingTask.dueDate))
                    ? 'bg-red-900/30 text-red-300'
                    : isToday(new Date(nextUpcomingTask.dueDate))
                      ? 'bg-amber-900/30 text-amber-300'
                      : 'bg-blue-900/30 text-blue-300'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {isPast(new Date(nextUpcomingTask.dueDate)) && !isToday(new Date(nextUpcomingTask.dueDate))
                      ? 'Overdue'
                      : isToday(new Date(nextUpcomingTask.dueDate))
                        ? 'Due Today'
                        : format(new Date(nextUpcomingTask.dueDate), 'MMM d')}
                  </span>
                </div>
                
                <div className={`flex items-center text-xs gap-1 px-2 py-1 rounded-full ${
                  nextUpcomingTask.priority === 'HIGH'
                    ? 'bg-red-900/30 text-red-300'
                    : nextUpcomingTask.priority === 'MEDIUM'
                      ? 'bg-amber-900/30 text-amber-300'
                      : 'bg-green-900/30 text-green-300'
                }`}>
                  {nextUpcomingTask.priority}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-green-500/30 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No upcoming tasks</p>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="text-sm text-gray-400 mb-3">Task Distribution</h4>
            
            <div className="flex flex-col gap-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Medical</span>
                  <span className="text-gray-300">{metrics.medicalCount} tasks</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${metrics.totalTasks > 0 ? (metrics.medicalCount / metrics.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Administrative</span>
                  <span className="text-gray-300">{metrics.administrativeCount} tasks</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${metrics.totalTasks > 0 ? (metrics.administrativeCount / metrics.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Follow-up</span>
                  <span className="text-gray-300">{metrics.followUpCount} tasks</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${metrics.totalTasks > 0 ? (metrics.followUpCount / metrics.totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
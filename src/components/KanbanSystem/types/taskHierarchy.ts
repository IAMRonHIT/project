import { Task } from './task';

/**
 * TaskHierarchy helps manage parent-child relationships between tasks
 */
export interface TaskHierarchy {
  // Maps task ids to their parent task id
  parentMap: Record<string, string>;
  
  // Maps task ids to their child task ids
  childrenMap: Record<string, string[]>;
}

/**
 * TaskRelationship helps manage linked tasks
 */
export interface TaskRelationship {
  // Maps task ids to linked task ids
  linkedTasksMap: Record<string, string[]>;
}

/**
 * Interface for a tree-like structure of tasks with parent-child relationships
 */
export interface TaskTree {
  // The root task in this branch
  task: Task;
  
  // Child tasks nested under this task
  children: TaskTree[];
  
  // Depth level in the hierarchy (0 for root tasks)
  level: number;
}

/**
 * TasksWithRelationships provides combined task data with relationships
 */
export interface TasksWithRelationships {
  task: Task;
  childTasks: Task[];
  parentTask: Task | null;
  linkedTasks: Task[];
}
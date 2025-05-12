import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { Task } from '../types/task';
import type { TaskHierarchy, TaskRelationship, TaskTree } from '../types/taskHierarchy';

interface TaskHierarchyState {
  hierarchy: TaskHierarchy;
  relationships: TaskRelationship;
}

export type TaskHierarchyAction =
  | { type: 'ADD_CHILD_TASK'; payload: { childId: string; parentId: string } }
  | { type: 'REMOVE_CHILD_TASK'; payload: { childId: string; parentId: string } }
  | { type: 'REMOVE_PARENT'; payload: { childId: string } }
  | { type: 'LINK_TASKS'; payload: { sourceId: string; targetId: string } }
  | { type: 'UNLINK_TASKS'; payload: { sourceId: string; targetId: string } }
  | { type: 'INITIALIZE'; payload: { hierarchy: TaskHierarchy; relationships: TaskRelationship } }
  | { type: 'REMOVE_TASK'; payload: { taskId: string } };

const initialState: TaskHierarchyState = {
  hierarchy: {
    parentMap: {},
    childrenMap: {}
  },
  relationships: {
    linkedTasksMap: {}
  }
};

function taskHierarchyReducer(state: TaskHierarchyState, action: TaskHierarchyAction): TaskHierarchyState {
  switch (action.type) {
    case 'ADD_CHILD_TASK': {
      const { childId, parentId } = action.payload;
      
      // Update parentMap
      const newParentMap = { ...state.hierarchy.parentMap, [childId]: parentId };
      
      // Update childrenMap
      const newChildrenMap = { ...state.hierarchy.childrenMap };
      if (!newChildrenMap[parentId]) {
        newChildrenMap[parentId] = [];
      }
      
      // Only add child if it doesn't already exist
      if (!newChildrenMap[parentId].includes(childId)) {
        newChildrenMap[parentId] = [...newChildrenMap[parentId], childId];
      }
      
      return {
        ...state,
        hierarchy: {
          parentMap: newParentMap,
          childrenMap: newChildrenMap
        }
      };
    }
    
    case 'REMOVE_CHILD_TASK': {
      const { childId, parentId } = action.payload;
      
      // Update parentMap by removing the relationship
      const newParentMap = { ...state.hierarchy.parentMap };
      delete newParentMap[childId];
      
      // Update childrenMap by removing the child from the parent's children array
      const newChildrenMap = { ...state.hierarchy.childrenMap };
      if (newChildrenMap[parentId]) {
        newChildrenMap[parentId] = newChildrenMap[parentId].filter(id => id !== childId);
        
        // Clean up empty arrays
        if (newChildrenMap[parentId].length === 0) {
          delete newChildrenMap[parentId];
        }
      }
      
      return {
        ...state,
        hierarchy: {
          parentMap: newParentMap,
          childrenMap: newChildrenMap
        }
      };
    }
    
    case 'REMOVE_PARENT': {
      const { childId } = action.payload;
      const parentId = state.hierarchy.parentMap[childId];
      
      if (!parentId) {
        return state;
      }
      
      // Update parentMap by removing the relationship
      const newParentMap = { ...state.hierarchy.parentMap };
      delete newParentMap[childId];
      
      // Update childrenMap by removing the child from the parent's children array
      const newChildrenMap = { ...state.hierarchy.childrenMap };
      if (newChildrenMap[parentId]) {
        newChildrenMap[parentId] = newChildrenMap[parentId].filter(id => id !== childId);
        
        // Clean up empty arrays
        if (newChildrenMap[parentId].length === 0) {
          delete newChildrenMap[parentId];
        }
      }
      
      return {
        ...state,
        hierarchy: {
          parentMap: newParentMap,
          childrenMap: newChildrenMap
        }
      };
    }
    
    case 'LINK_TASKS': {
      const { sourceId, targetId } = action.payload;
      
      // Create a new linkedTasksMap
      const newLinkedTasksMap = { ...state.relationships.linkedTasksMap };
      
      // Add target to source's linked tasks
      if (!newLinkedTasksMap[sourceId]) {
        newLinkedTasksMap[sourceId] = [];
      }
      if (!newLinkedTasksMap[sourceId].includes(targetId)) {
        newLinkedTasksMap[sourceId] = [...newLinkedTasksMap[sourceId], targetId];
      }
      
      // Add source to target's linked tasks
      if (!newLinkedTasksMap[targetId]) {
        newLinkedTasksMap[targetId] = [];
      }
      if (!newLinkedTasksMap[targetId].includes(sourceId)) {
        newLinkedTasksMap[targetId] = [...newLinkedTasksMap[targetId], sourceId];
      }
      
      return {
        ...state,
        relationships: {
          linkedTasksMap: newLinkedTasksMap
        }
      };
    }
    
    case 'UNLINK_TASKS': {
      const { sourceId, targetId } = action.payload;
      
      // Create a new linkedTasksMap
      const newLinkedTasksMap = { ...state.relationships.linkedTasksMap };
      
      // Remove target from source's linked tasks
      if (newLinkedTasksMap[sourceId]) {
        newLinkedTasksMap[sourceId] = newLinkedTasksMap[sourceId].filter(id => id !== targetId);
        if (newLinkedTasksMap[sourceId].length === 0) {
          delete newLinkedTasksMap[sourceId];
        }
      }
      
      // Remove source from target's linked tasks
      if (newLinkedTasksMap[targetId]) {
        newLinkedTasksMap[targetId] = newLinkedTasksMap[targetId].filter(id => id !== sourceId);
        if (newLinkedTasksMap[targetId].length === 0) {
          delete newLinkedTasksMap[targetId];
        }
      }
      
      return {
        ...state,
        relationships: {
          linkedTasksMap: newLinkedTasksMap
        }
      };
    }
    
    case 'INITIALIZE': {
      return {
        ...state,
        hierarchy: action.payload.hierarchy,
        relationships: action.payload.relationships
      };
    }
    
    case 'REMOVE_TASK': {
      const { taskId } = action.payload;
      
      // Create new state objects
      const newParentMap = { ...state.hierarchy.parentMap };
      const newChildrenMap = { ...state.hierarchy.childrenMap };
      const newLinkedTasksMap = { ...state.relationships.linkedTasksMap };
      
      // Remove task from parentMap
      delete newParentMap[taskId];
      
      // Remove task from childrenMap
      delete newChildrenMap[taskId];
      
      // Remove task references from other children in childrenMap
      Object.keys(newChildrenMap).forEach(parentId => {
        newChildrenMap[parentId] = newChildrenMap[parentId].filter(id => id !== taskId);
        if (newChildrenMap[parentId].length === 0) {
          delete newChildrenMap[parentId];
        }
      });
      
      // Remove task from linkedTasksMap
      delete newLinkedTasksMap[taskId];
      
      // Remove task references from other tasks in linkedTasksMap
      Object.keys(newLinkedTasksMap).forEach(linkedId => {
        newLinkedTasksMap[linkedId] = newLinkedTasksMap[linkedId].filter(id => id !== taskId);
        if (newLinkedTasksMap[linkedId].length === 0) {
          delete newLinkedTasksMap[linkedId];
        }
      });
      
      return {
        hierarchy: {
          parentMap: newParentMap,
          childrenMap: newChildrenMap
        },
        relationships: {
          linkedTasksMap: newLinkedTasksMap
        }
      };
    }
    
    default:
      return state;
  }
}

interface TaskHierarchyContextProps {
  state: TaskHierarchyState;
  dispatch: Dispatch<TaskHierarchyAction>;
}

const TaskHierarchyContext = createContext<TaskHierarchyContextProps | undefined>(undefined);

interface TaskHierarchyProviderProps {
  children: ReactNode;
  initialHierarchy?: TaskHierarchy;
  initialRelationships?: TaskRelationship;
}

export function TaskHierarchyProvider({ 
  children, 
  initialHierarchy, 
  initialRelationships 
}: TaskHierarchyProviderProps) {
  const [state, dispatch] = useReducer(taskHierarchyReducer, {
    hierarchy: initialHierarchy || initialState.hierarchy,
    relationships: initialRelationships || initialState.relationships
  });

  return (
    <TaskHierarchyContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskHierarchyContext.Provider>
  );
}

export function useTaskHierarchy() {
  const context = useContext(TaskHierarchyContext);
  if (context === undefined) {
    throw new Error('useTaskHierarchy must be used within a TaskHierarchyProvider');
  }
  return context;
}

// Helper functions to work with task hierarchies
export function buildTaskTree(tasks: Task[], hierarchyState: TaskHierarchyState): TaskTree[] {
  const { parentMap, childrenMap } = hierarchyState.hierarchy;
  const tasksMap = new Map<string, Task>();
  
  // Create a map of tasks by id for quick access
  tasks.forEach(task => {
    tasksMap.set(task.id, task);
  });
  
  // Function to recursively build a tree branch
  const buildBranch = (taskId: string, level: number = 0): TaskTree | null => {
    const task = tasksMap.get(taskId);
    if (!task) return null;
    
    const children: TaskTree[] = [];
    const childIds = childrenMap[taskId] || [];
    
    childIds.forEach(childId => {
      const childBranch = buildBranch(childId, level + 1);
      if (childBranch) {
        children.push(childBranch);
      }
    });
    
    return {
      task,
      children,
      level
    };
  };
  
  // Find all root tasks (tasks without parents)
  const rootTasks: TaskTree[] = [];
  tasks.forEach(task => {
    if (!parentMap[task.id]) {
      const tree = buildBranch(task.id);
      if (tree) {
        rootTasks.push(tree);
      }
    }
  });
  
  return rootTasks;
}

export function getRelatedTasks(taskId: string, tasks: Task[], hierarchyState: TaskHierarchyState) {
  const { parentMap, childrenMap } = hierarchyState.hierarchy;
  const { linkedTasksMap } = hierarchyState.relationships;
  const tasksMap = new Map<string, Task>();
  
  // Create a map of tasks by id for quick access
  tasks.forEach(task => {
    tasksMap.set(task.id, task);
  });
  
  // Get parent task
  const parentTaskId = parentMap[taskId];
  const parentTask = parentTaskId ? tasksMap.get(parentTaskId) || null : null;
  
  // Get child tasks
  const childTaskIds = childrenMap[taskId] || [];
  const childTasks = childTaskIds
    .map(id => tasksMap.get(id))
    .filter((task): task is Task => task !== undefined);
  
  // Get linked tasks
  const linkedTaskIds = linkedTasksMap[taskId] || [];
  const linkedTasks = linkedTaskIds
    .map(id => tasksMap.get(id))
    .filter((task): task is Task => task !== undefined);
  
  return {
    task: tasksMap.get(taskId),
    parentTask,
    childTasks,
    linkedTasks
  };
}
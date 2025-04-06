import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types for note attachments
export type EntityType = 'Ticket' | 'CareJourney' | 'Auth' | 'Appeal' | 'Claim' | 'CarePlan' | 'Task';

export interface Attachment {
  type: EntityType;
  id: string;
  name: string;
}

export interface Screenshot {
  id: string;
  data: string; // Base64 encoded image data
  timestamp: Date;
  caption?: string;
}

export interface Highlight {
  id: string;
  text: string;
  source?: string;
  timestamp: Date;
}

export interface Macro {
  id: string;
  name: string;
  content: string;
}

// Define the state shape
export interface NoteState {
  id: string | null;
  content: string;
  highlights: Highlight[];
  screenshots: Screenshot[];
  attachedTo: Attachment | null;
  macros: Macro[];
  isOpen: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
}

// Define action types
type ActionType = 
  | { type: 'SET_CONTENT'; content: string }
  | { type: 'ADD_HIGHLIGHT'; highlight: Highlight }
  | { type: 'REMOVE_HIGHLIGHT'; id: string }
  | { type: 'ADD_SCREENSHOT'; screenshot: Screenshot }
  | { type: 'REMOVE_SCREENSHOT'; id: string }
  | { type: 'UPDATE_SCREENSHOT_CAPTION'; id: string; caption: string }
  | { type: 'ATTACH_TO_ENTITY'; attachment: Attachment }
  | { type: 'DETACH_FROM_ENTITY' }
  | { type: 'ADD_MACRO'; macro: Macro }
  | { type: 'REMOVE_MACRO'; id: string }
  | { type: 'APPLY_MACRO'; id: string }
  | { type: 'OPEN_NOTE' }
  | { type: 'CLOSE_NOTE' }
  | { type: 'SAVE_NOTE' }
  | { type: 'RESET_NOTE' }
  | { type: 'LOAD_NOTE'; note: NoteState };

// Initial state
const initialState: NoteState = {
  id: null,
  content: '',
  highlights: [],
  screenshots: [],
  attachedTo: null,
  macros: [],
  isOpen: false,
  isDirty: false,
  lastSaved: null
};

// Create reducer function
const noteReducer = (state: NoteState, action: ActionType): NoteState => {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.content, isDirty: true };
    
    case 'ADD_HIGHLIGHT':
      return { 
        ...state, 
        highlights: [...state.highlights, action.highlight],
        isDirty: true
      };
    
    case 'REMOVE_HIGHLIGHT':
      return { 
        ...state, 
        highlights: state.highlights.filter(h => h.id !== action.id),
        isDirty: true
      };
    
    case 'ADD_SCREENSHOT':
      return { 
        ...state, 
        screenshots: [...state.screenshots, action.screenshot],
        isDirty: true
      };
    
    case 'REMOVE_SCREENSHOT':
      return { 
        ...state, 
        screenshots: state.screenshots.filter(s => s.id !== action.id),
        isDirty: true
      };
    
    case 'UPDATE_SCREENSHOT_CAPTION':
      return {
        ...state,
        screenshots: state.screenshots.map(s => 
          s.id === action.id ? { ...s, caption: action.caption } : s
        ),
        isDirty: true
      };
    
    case 'ATTACH_TO_ENTITY':
      return { ...state, attachedTo: action.attachment, isDirty: true };
    
    case 'DETACH_FROM_ENTITY':
      return { ...state, attachedTo: null, isDirty: true };
    
    case 'ADD_MACRO':
      return { 
        ...state, 
        macros: [...state.macros, action.macro],
        isDirty: true
      };
    
    case 'REMOVE_MACRO':
      return { 
        ...state, 
        macros: state.macros.filter(m => m.id !== action.id),
        isDirty: true
      };
    
    case 'APPLY_MACRO': {
      const macro = state.macros.find(m => m.id === action.id);
      if (!macro) return state;
      return { 
        ...state, 
        content: state.content + macro.content,
        isDirty: true
      };
    }
    
    case 'OPEN_NOTE':
      return { ...state, isOpen: true };
    
    case 'CLOSE_NOTE':
      return { ...state, isOpen: false };
    
    case 'SAVE_NOTE':
      return { 
        ...state, 
        isDirty: false, 
        lastSaved: new Date() 
      };
    
    case 'RESET_NOTE':
      return initialState;
    
    case 'LOAD_NOTE':
      return { ...action.note, isOpen: true };
    
    default:
      return state;
  }
};

// Create context
interface NoteContextType {
  state: NoteState;
  dispatch: React.Dispatch<ActionType>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Create provider component
interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);
  
  return (
    <NoteContext.Provider value={{ state, dispatch }}>
      {children}
    </NoteContext.Provider>
  );
};

// Create custom hook for using the context
export const useNote = (): NoteContextType => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNote must be used within a NoteProvider');
  }
  return context;
};

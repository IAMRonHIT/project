// Export all Note components and types
export { default as NoteComponent } from './NoteComponent';
export { default as NoteIntegration } from './NoteIntegration';
export { default as TextHighlighter } from './TextHighlighter';
export { default as ScreenshotCapture } from './ScreenshotCapture';
export { default as NoteMacros } from './NoteMacros';
export { default as SpeechToText } from './SpeechToText';
export { default as NoteAttachment } from './NoteAttachment';
export { default as DraggableNotePanel } from './DraggableNotePanel';

// Re-export types from NoteContext
export {
  NoteProvider,
  useNote,
  type EntityType,
  type Attachment,
  type Screenshot,
  type Highlight,
  type Macro
} from '../contexts/NoteContext';

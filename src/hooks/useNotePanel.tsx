import { useCallback } from 'react';
import { useNote } from '../components/Note';

/**
 * Hook to interact with the global note panel
 * @returns Functions to control the note panel
 */
export const useNotePanel = () => {
  const { state, dispatch } = useNote();

  /**
   * Open the note panel with optional content
   */
  const openNote = useCallback((content?: string) => {
    if (content) {
      dispatch({ type: 'SET_CONTENT', content });
    }
    dispatch({ type: 'OPEN_NOTE' });
  }, [dispatch]);

  /**
   * Close the note panel
   */
  const closeNote = useCallback(() => {
    dispatch({ type: 'CLOSE_NOTE' });
  }, [dispatch]);

  /**
   * Add text to the current note
   */
  const addToNote = useCallback((text: string) => {
    // Get current content from state and append the new text
    const newContent = state.content 
      ? `${state.content}\n\n${text}` 
      : text;
    
    dispatch({
      type: 'SET_CONTENT',
      content: newContent
    });
  }, [dispatch, state.content]);

  /**
   * Save the current note
   */
  const saveNote = useCallback(() => {
    dispatch({ type: 'SAVE_NOTE' });
  }, [dispatch]);

  return {
    openNote,
    closeNote,
    addToNote,
    saveNote
  };
};

export default useNotePanel; 
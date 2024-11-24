import { useEffect } from 'react';
import { initializeKeyboardShortcuts } from '@/services/keyboardShortcuts';

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    initializeKeyboardShortcuts(handlers);
  }, [handlers]);
}
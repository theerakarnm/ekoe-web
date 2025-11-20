import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: (event: KeyboardEvent) => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlOrMeta = shortcut.ctrlKey || shortcut.metaKey;
        const matchesCtrlOrMeta = ctrlOrMeta
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;

        const matchesShift = shortcut.shiftKey
          ? event.shiftKey
          : !event.shiftKey;

        const matchesAlt = shortcut.altKey ? event.altKey : !event.altKey;

        const matchesKey =
          event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (matchesKey && matchesCtrlOrMeta && matchesShift && matchesAlt) {
          event.preventDefault();
          shortcut.handler(event);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

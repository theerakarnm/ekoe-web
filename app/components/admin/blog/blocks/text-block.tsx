import { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';

interface TextBlockProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextBlock({ value, onChange }: TextBlockProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const savedSelectionRef = useRef<Range | null>(null);

  // Only set initial value once on mount
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = value || '';
      isInitializedRef.current = true;
    }
  }, []);

  // Handle external value changes (e.g., undo/redo or reset)
  useEffect(() => {
    if (editorRef.current && isInitializedRef.current) {
      // Only update if the value differs significantly (not from user typing)
      const currentContent = editorRef.current.innerHTML;
      if (value !== currentContent && value === '') {
        editorRef.current.innerHTML = '';
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleOpenLinkDialog = () => {
    // Save current selection before opening dialog
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
      if (selection.toString().trim()) {
        setLinkText(selection.toString());
      } else {
        setLinkText('');
      }
    } else {
      savedSelectionRef.current = null;
      setLinkText('');
    }
    setLinkUrl('');
    setLinkDialogOpen(true);
  };

  const handleLinkInsert = () => {
    if (linkUrl && editorRef.current) {
      // Focus back on the editor
      editorRef.current.focus();

      // Restore the saved selection
      if (savedSelectionRef.current) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelectionRef.current);
        }
      }

      // Insert the link HTML
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${linkText || linkUrl}</a>`;
      document.execCommand('insertHTML', false, html);

      // Update the value
      onChange(editorRef.current.innerHTML);

      // Clear state
      setLinkUrl('');
      setLinkText('');
      savedSelectionRef.current = null;
      setLinkDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <span className="font-medium">Text Block</span>
      </div>

      {/* Mini Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold className="size-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <Italic className="size-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand('underline')}
          title="Underline"
        >
          <Underline className="size-3" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="size-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="size-3" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleOpenLinkDialog}
          title="Insert Link"
        >
          <LinkIcon className="size-3" />
        </Button>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Add a hyperlink to your content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleLinkInsert} disabled={!linkUrl}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editable Content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={cn(
          'min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'prose prose-sm max-w-none',
          '[&_p]:my-1 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6'
        )}
        suppressContentEditableWarning
      />
    </div>
  );
}

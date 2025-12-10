import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface TextBlockProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextBlock({ value, onChange }: TextBlockProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
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
      </div>

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
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />
    </div>
  );
}

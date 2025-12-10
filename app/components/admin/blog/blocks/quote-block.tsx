import { Quote } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';

interface QuoteBlockProps {
  content: string;
  author: string;
  onChange: (updates: { content?: string; author?: string }) => void;
}

export function QuoteBlock({ content, author, onChange }: QuoteBlockProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <Quote className="size-3" />
        <span className="font-medium">Quote Block</span>
      </div>

      <div className="pl-4 border-l-4 border-primary/50 space-y-3">
        {/* Quote Content */}
        <div className="space-y-1">
          <Label htmlFor="quote-content" className="text-xs">Quote</Label>
          <Textarea
            id="quote-content"
            value={content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Enter the quote text..."
            className="italic"
            rows={3}
          />
        </div>

        {/* Author */}
        <div className="space-y-1">
          <Label htmlFor="quote-author" className="text-xs">Author (optional)</Label>
          <Input
            id="quote-author"
            value={author}
            onChange={(e) => onChange({ author: e.target.value })}
            placeholder="Quote attribution"
          />
        </div>
      </div>
    </div>
  );
}

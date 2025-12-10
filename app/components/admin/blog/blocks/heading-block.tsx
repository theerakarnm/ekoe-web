import { Heading } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface HeadingBlockProps {
  level: 1 | 2 | 3;
  content: string;
  onChange: (updates: { level?: 1 | 2 | 3; content?: string }) => void;
}

export function HeadingBlock({ level, content, onChange }: HeadingBlockProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <Heading className="size-3" />
        <span className="font-medium">Heading Block</span>
        <span className="text-[10px] bg-muted px-1.5 rounded">Used in Table of Contents</span>
      </div>

      <div className="flex gap-3">
        {/* Heading Level Select */}
        <div className="w-24">
          <Label className="text-xs sr-only">Level</Label>
          <Select
            value={level.toString()}
            onValueChange={(v) => onChange({ level: parseInt(v) as 1 | 2 | 3 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1</SelectItem>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Heading Text Input */}
        <div className="flex-1">
          <Label className="text-xs sr-only">Heading Text</Label>
          <Input
            value={content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Enter heading text..."
            className={
              level === 1
                ? 'text-2xl font-bold'
                : level === 2
                  ? 'text-xl font-semibold'
                  : 'text-lg font-medium'
            }
          />
        </div>
      </div>
    </div>
  );
}

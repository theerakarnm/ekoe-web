import { useState, useEffect, useRef } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { X, Plus, Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { getTags, type Tag } from '~/lib/services/admin/product-admin.service';

interface TagManagerProps {
  selectedTags: string[]; // This will store tag names
  onChange: (tags: string[]) => void;
}

export function TagManager({ selectedTags, onChange }: TagManagerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const tags = await getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      onChange([...selectedTags, tagName]);
    }
    setOpen(false);
    setInputValue('');
  };

  const handleCreateTag = () => {
    if (inputValue.trim() && !selectedTags.includes(inputValue.trim())) {
      onChange([...selectedTags, inputValue.trim()]);
    }
    setOpen(false);
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Filter tags that are not already selected
  const filteredTags = availableTags.filter(
    (tag) => !selectedTags.includes(tag.name)
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-muted rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        {selectedTags.length === 0 && (
          <p className="text-sm text-muted-foreground italic">No tags selected</p>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Tag
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search or create tag..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateTag();
                }
              }}
            />
            <CommandGroup className="max-h-[200px] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading tags...
                </div>
              ) : (
                <>
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => handleSelectTag(tag.name)}
                    >
                      {tag.name}
                    </CommandItem>
                  ))}
                  {filteredTags.length === 0 && (
                    <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                      No existing tags found. Type to create new.
                    </div>
                  )}
                </>
              )}
            </CommandGroup>
            {inputValue.trim() && !availableTags.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()) && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  onClick={handleCreateTag}
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Create "{inputValue}"
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">
        Select from existing tags or type to create a new one.
      </p>
    </div>
  );
}

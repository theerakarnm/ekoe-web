import { Link } from 'react-router';
import type { TableOfContentsItem } from '~/interface/blog.interface';
import { cn } from '~/lib/utils';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-20% 0px -35% 0px'
    });

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="space-y-4">
      <h3 className="font-semibold text-lg">Table of Contents</h3>
      <ul className="space-y-2 text-sm border-l border-border/40 pl-4 py-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "transition-colors hover:text-foreground",
              item.level === 3 && "pl-4",
              activeId === item.id ? "text-primary font-medium border-l-2 border-primary -ml-[17px] pl-[15px]" : "text-muted-foreground"
            )}
          >
            <Link
              to={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', `#${item.id}`);
                }
              }}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

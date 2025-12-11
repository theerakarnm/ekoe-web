import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

// Preset date ranges
function getPresetRanges(): DateRange[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);

  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const last90Days = new Date(today);
  last90Days.setDate(last90Days.getDate() - 90);

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  return [
    {
      label: 'Last 7 days',
      startDate: last7Days.toISOString(),
      endDate: now.toISOString(),
    },
    {
      label: 'Last 30 days',
      startDate: last30Days.toISOString(),
      endDate: now.toISOString(),
    },
    {
      label: 'Last 90 days',
      startDate: last90Days.toISOString(),
      endDate: now.toISOString(),
    },
    {
      label: 'This month',
      startDate: thisMonthStart.toISOString(),
      endDate: now.toISOString(),
    },
    {
      label: 'Last month',
      startDate: lastMonthStart.toISOString(),
      endDate: lastMonthEnd.toISOString(),
    },
  ];
}

export function getDefaultDateRange(): DateRange {
  const now = new Date();
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  return {
    label: 'Last 30 days',
    startDate: last30Days.toISOString(),
    endDate: now.toISOString(),
  };
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const presetRanges = getPresetRanges();

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="min-w-[180px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{value.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-lg border bg-popover shadow-lg">
            <div className="p-2">
              <p className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                Select date range
              </p>
              <div className="mt-1 space-y-1">
                {presetRanges.map((range) => (
                  <button
                    key={range.label}
                    className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${value.label === range.label ? 'bg-accent' : ''
                      }`}
                    onClick={() => {
                      onChange(range);
                      setIsOpen(false);
                    }}
                  >
                    <span>{range.label}</span>
                    {value.label === range.label && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

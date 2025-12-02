import { Clock, User, Bot } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface StatusHistoryEntry {
  id: string;
  status: OrderStatus;
  note?: string | null;
  changedBy?: string | null;
  changedByName?: string;
  createdAt: Date | string;
}

interface OrderStatusTimelineProps {
  history: StatusHistoryEntry[];
  showNotes?: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export function OrderStatusTimeline({ history, showNotes = true }: OrderStatusTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No status history available</p>
      </div>
    );
  }

  // Sort history by date, most recent first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Status History</h3>

      <div className="space-y-6">
        {sortedHistory.map((entry, index) => {
          const isLatest = index === 0;
          const isSystem = !entry.changedBy || entry.changedBy === 'system';

          return (
            <div key={entry.id} className="relative">
              {/* Timeline Line */}
              {index < sortedHistory.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="flex gap-4">
                {/* Timeline Dot */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0',
                    isLatest
                      ? 'bg-green-600 border-green-600'
                      : 'bg-white border-gray-300'
                  )}
                >
                  <Clock
                    className={cn(
                      'w-4 h-4',
                      isLatest ? 'text-white' : 'text-gray-400'
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  {/* Status Badge and Date */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={cn(
                          'border',
                          statusColors[entry.status as OrderStatus]
                        )}
                      >
                        {statusLabels[entry.status as OrderStatus]}
                      </Badge>
                      {isLatest && (
                        <span className="text-xs text-green-600 font-medium">
                          Current Status
                        </span>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                      <div>{formatDate(entry.createdAt)}</div>
                      <div className="text-xs">{formatTime(entry.createdAt)}</div>
                    </div>
                  </div>

                  {/* Changed By */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                    {isSystem ? (
                      <>
                        <Bot className="w-3.5 h-3.5" />
                        <span>Updated automatically by system</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        <span>
                          Updated by{' '}
                          <span className="font-medium">
                            {entry.changedByName || 'Administrator'}
                          </span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Note */}
                  {showNotes && entry.note && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-700">{entry.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

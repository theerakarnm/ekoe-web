import { Check, Package, Truck, Home, XCircle, DollarSign } from 'lucide-react';
import { cn } from '~/lib/utils';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  estimatedDelivery?: Date | string | null;
  cancelledReason?: string | null;
  refundedReason?: string | null;
}

interface StatusStep {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const normalFlowSteps: StatusStep[] = [
  {
    status: 'pending',
    label: 'Order Placed',
    icon: Package,
    description: 'Your order has been received',
  },
  {
    status: 'processing',
    label: 'Processing',
    icon: Package,
    description: 'We are preparing your order',
  },
  {
    status: 'shipped',
    label: 'Shipped',
    icon: Truck,
    description: 'Your order is on the way',
  },
  {
    status: 'delivered',
    label: 'Delivered',
    icon: Home,
    description: 'Your order has been delivered',
  },
];

const statusOrder: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
  refunded: -1,
};

export function OrderStatusTracker({
  currentStatus,
  estimatedDelivery,
  cancelledReason,
  refundedReason,
}: OrderStatusTrackerProps) {
  // Handle cancelled or refunded orders
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Order Cancelled</h3>
            <p className="text-sm text-red-700">This order has been cancelled</p>
          </div>
        </div>
        {cancelledReason && (
          <div className="mt-4 p-3 bg-white rounded border border-red-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Reason:</span> {cancelledReason}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (currentStatus === 'refunded') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <DollarSign className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Refunded</h3>
            <p className="text-sm text-gray-700">This order has been refunded</p>
          </div>
        </div>
        {refundedReason && (
          <div className="mt-4 p-3 bg-white rounded border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Reason:</span> {refundedReason}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Normal flow progress
  const currentStepIndex = statusOrder[currentStatus];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
          <div
            className="h-full bg-green-600 transition-all duration-500"
            style={{
              width: `${(currentStepIndex / (normalFlowSteps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {normalFlowSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center flex-1">
                {/* Icon Circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 bg-white',
                    isCompleted
                      ? 'border-green-600 bg-green-600'
                      : 'border-gray-300 bg-white'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        isCurrent ? 'text-green-600' : 'text-gray-400'
                      )}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {currentStatus === 'shipped' && estimatedDelivery && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-medium">Estimated Delivery:</span>{' '}
            {new Date(estimatedDelivery).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

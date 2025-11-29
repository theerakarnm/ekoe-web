/**
 * Payment Detail Modal Component
 * Displays full payment transaction information including provider response data
 */

import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import type { Payment } from '~/lib/services/payment.service';

interface PaymentDetailModalProps {
  payment: Payment;
  open: boolean;
  onClose: () => void;
}

export function PaymentDetailModal({ payment, open, onClose }: PaymentDetailModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'promptpay':
        return 'PromptPay';
      case 'credit_card':
        return 'Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payment Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="text-sm font-mono">{payment.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-sm font-mono">{payment.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="text-sm">{getPaymentMethodLabel(payment.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(payment.status)}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="text-sm">{payment.currency.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {payment.transactionId && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="text-sm font-mono break-all">{payment.transactionId}</p>
                </div>
              )}
              {payment.paymentProvider && (
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="text-sm">{payment.paymentProvider}</p>
                </div>
              )}
              {payment.cardLast4 && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Card Last 4</p>
                    <p className="text-sm font-mono">•••• {payment.cardLast4}</p>
                  </div>
                  {payment.cardBrand && (
                    <div>
                      <p className="text-sm text-muted-foreground">Card Brand</p>
                      <p className="text-sm">{payment.cardBrand}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Timeline</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="text-sm">{formatDate(payment.createdAt)}</p>
              </div>
              {payment.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="text-sm text-green-600">{formatDate(payment.completedAt)}</p>
                </div>
              )}
              {payment.failedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Failed At</p>
                  <p className="text-sm text-red-600">{formatDate(payment.failedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Provider Response */}
          {payment.providerResponse && Object.keys(payment.providerResponse).length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Provider Response</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap wrap-break-word">
                    {JSON.stringify(payment.providerResponse, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

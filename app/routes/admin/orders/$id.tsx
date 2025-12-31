import { useLoaderData, useNavigate, useActionData, Form, useRevalidator } from 'react-router';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, Receipt, CheckCircle } from 'lucide-react';
import type { Route } from '../orders/+types/$id'
import { getOrder, updateOrderStatus, getValidNextStatuses, type OrderDetail } from '~/lib/services/admin/order-admin.service';
import { getPaymentsByOrderId, manuallyVerifyPayment, type Payment } from '~/lib/services/payment.service';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { showSuccess, showError } from '~/lib/admin/toast';
import { useEffect, useState } from 'react';
import { PaymentDetailModal } from '~/components/admin/payments/payment-detail-modal';

export async function loader({ params, request }: Route.LoaderArgs) {
  if (!params.id) {
    throw new Error('Invalid order ID');
  }
  const order = await getOrder(params.id, request.headers);
  const payments = await getPaymentsByOrderId(params.id, request.headers);
  const validStatuses = await getValidNextStatuses(params.id, request.headers);
  return { order, payments, validStatuses };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const status = formData.get('status') as string;
  const note = formData.get('note') as string | null;

  if (!params.id) {
    throw new Error('Invalid order ID');
  }

  try {
    await updateOrderStatus(params.id, status, note || undefined, request.headers);
    return { success: true, message: 'Order status updated successfully' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}

export default function OrderDetailPage() {
  const { order, payments, validStatuses } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState<Payment | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(order.status);

  useEffect(() => {
    if (actionData?.success && actionData.message) {
      showSuccess(actionData.message);
      revalidator.revalidate();
    } else if (actionData?.error) {
      showError(actionData.error);
    }
  }, [actionData, revalidator]);

  const handleVerifyPayment = async () => {
    if (!verifyingPayment) return;

    setIsVerifying(true);
    try {
      await manuallyVerifyPayment(verifyingPayment.id, verificationNote || undefined);
      showSuccess('Payment marked as paid successfully');
      setVerifyingPayment(null);
      setVerificationNote('');
      revalidator.revalidate();
    } catch (error: any) {
      showError(error.message || 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/orders')}
          aria-label="Back to orders"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Order {order.orderNumber}
          </h1>
          <p className="text-muted-foreground mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
          {getPaymentStatusBadge(order.paymentStatus)}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.variantName}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.addressLine1}
                </p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">
                  {order.billingAddress.firstName} {order.billingAddress.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.billingAddress.addressLine1}
                </p>
                {order.billingAddress.addressLine2 && (
                  <p className="text-sm text-muted-foreground">
                    {order.billingAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order.billingAddress.city}, {order.billingAddress.province}{' '}
                  {order.billingAddress.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.billingAddress.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: {order.billingAddress.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="size-5" />
                Payment Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment transactions</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getPaymentMethodLabel(payment.paymentMethod)}
                            </span>
                            {getPaymentStatusBadge(payment.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Amount: {formatCurrency(payment.amount)}
                          </p>
                          {payment.transactionId && (
                            <p className="text-sm text-muted-foreground">
                              Transaction ID: {payment.transactionId}
                            </p>
                          )}
                          {payment.cardLast4 && (
                            <p className="text-sm text-muted-foreground">
                              Card: {payment.cardBrand} •••• {payment.cardLast4}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Created: {formatDate(payment.createdAt)}</p>
                        {payment.completedAt && (
                          <p>Completed: {formatDate(payment.completedAt)}</p>
                        )}
                        {payment.failedAt && (
                          <p>Failed: {formatDate(payment.failedAt)}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPayment(payment)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                        {payment.status === 'pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setVerifyingPayment(payment)}
                            className="flex-1"
                          >
                            <CheckCircle className="size-4 mr-1" />
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                {order.customerNote && (
                  <div>
                    <p className="text-sm text-muted-foreground">Note</p>
                    <p className="text-sm">{order.customerNote}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select
                    name="status"
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Current status */}
                      <SelectItem value={order.status}>
                        {formatStatusLabel(order.status)} (Current)
                      </SelectItem>
                      {/* Valid next statuses */}
                      {validStatuses.validNextStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validStatuses.validNextStatuses.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No valid status transitions available from {order.status}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    name="note"
                    placeholder="Add a note about this status change..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={selectedStatus === order.status}
                >
                  Update Status
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5" />
                Status History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory && order.statusHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No status history</p>
                ) : order.statusHistory ? (
                  order.statusHistory.map((history) => (
                    <div key={history.id} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {getStatusBadge(history.status)}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(history.createdAt)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Changed by: <span className="font-medium">{history.changedByName || 'System'}</span>
                        </p>
                        {history.note && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md italic">
                            "{history.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Loading status history...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* Manual Verification Dialog */}
      <AlertDialog open={!!verifyingPayment} onOpenChange={(open) => !open && setVerifyingPayment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Payment as Paid</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to manually mark this payment as paid? This action will update the order status and send a confirmation email to the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="verification-note">Note (Optional)</Label>
            <Textarea
              id="verification-note"
              placeholder="Add a note explaining the manual verification..."
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isVerifying}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerifyPayment} disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

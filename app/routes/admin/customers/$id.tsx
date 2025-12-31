import { useLoaderData, useNavigate } from 'react-router';
import { ArrowLeft, User, Mail, Phone, Calendar, ShoppingBag, DollarSign, MapPin } from 'lucide-react';
import type { Route } from './+types/$id';
import { getCustomer } from '~/lib/services/admin/customer-admin.service';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

export async function loader({ params, request }: Route.LoaderArgs) {
  const customer = await getCustomer(params.id, request.headers);
  return { customer };
}

export default function CustomerDetailPage() {
  const { customer } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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

  const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
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
          onClick={() => navigate('/admin/customers')}
          aria-label="Back to customers"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground mt-1">
            Customer since {formatDate(customer.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getAccountStatusBadge(customer.accountStatus)}
          {customer.emailVerified && (
            <Badge variant="outline" className="gap-1">
              <Mail className="size-3" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="size-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <span className="font-mono font-medium">{order.orderNumber}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          {customer.addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.addresses.map((address) => (
                    <div key={address.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {address.firstName} {address.lastName}
                        </p>
                        {address.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.addressLine1}
                      </p>
                      {address.addressLine2 && (
                        <p className="text-sm text-muted-foreground">
                          {address.addressLine2}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.province} {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.country}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Phone: {address.phone}
                      </p>
                      {customer.addresses.length > 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                </div>
                <p className="font-medium">{customer.email}</p>
              </div>

              {customer.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                  </div>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Registered:</span>
                </div>
                <p className="font-medium">{formatDateTime(customer.createdAt)}</p>
              </div>

              {customer.lastOrderAt && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Order:</span>
                  </div>
                  <p className="font-medium">{formatDateTime(customer.lastOrderAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{customer.orderCount}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</p>
              </div>

              {customer.orderCount > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Order Value</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(customer.totalSpent / customer.orderCount)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '~/store/customer-auth';
import { CustomerAuthGuard } from '~/components/auth/customer-auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Button } from '~/components/ui/button';
import { LogOut, User, Package, MapPin, ArrowLeft } from 'lucide-react';
import { ProfileInfoForm } from '~/components/profile/profile-info-form';
import { OrderHistoryList } from '~/components/profile/order-history-list';
import { AddressManager } from '~/components/profile/address-manager';
import { Link } from 'react-router';

export default function AccountPage() {
  const { user, signOut } = useCustomerAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CustomerAuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link className='flex items-center gap-2 mb-4' to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileInfoForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderHistoryList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>
                    Manage your shipping and billing addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddressManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CustomerAuthGuard>
  );
}

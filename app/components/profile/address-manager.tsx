import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '~/store/auth-store';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
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
import { Badge } from '~/components/ui/badge';
import { showSuccess, showError } from '~/lib/toast';
import { Loader2, Plus, Edit, Trash2, MapPin } from 'lucide-react';

interface CustomerAddress {
  id: string;
  userId: string;
  label: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  isActive: boolean;
}

const addressSchema = z.object({
  label: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone is required'),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export function AddressManager() {
  const { addresses, loadAddresses } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<CustomerAddress | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      firstName: '',
      lastName: '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Thailand',
      phone: '',
      isDefault: false,
    },
  });

  const isDefault = watch('isDefault');

  useEffect(() => {
    loadAddressesData();
  }, []);

  const loadAddressesData = async () => {
    setIsLoading(true);
    try {
      await loadAddresses();
    } catch (error) {
      console.error('Load addresses error:', error);
      showError('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    reset({
      label: '',
      firstName: '',
      lastName: '',
      company: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Thailand',
      phone: '',
      isDefault: addresses.length === 0, // Set as default if it's the first address
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address);
    reset({
      label: address.label || '',
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      const url = editingAddress
        ? `${import.meta.env.VITE_API_URL}/api/customers/me/addresses/${editingAddress.id}`
        : `${import.meta.env.VITE_API_URL}/api/customers/me/addresses`;

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      showSuccess(
        editingAddress ? 'Address updated successfully' : 'Address added successfully'
      );
      setIsDialogOpen(false);
      await loadAddressesData();
    } catch (error) {
      console.error('Save address error:', error);
      showError('Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAddress) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers/me/addresses/${deletingAddress.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      showSuccess('Address deleted successfully');
      setDeletingAddress(null);
      await loadAddressesData();
    } catch (error) {
      console.error('Delete address error:', error);
      showError('Failed to delete address');
    }
  };

  const handleSetDefault = async (address: CustomerAddress) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/customers/me/addresses/${address.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isDefault: true }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      showSuccess('Default address updated');
      await loadAddressesData();
    } catch (error) {
      console.error('Set default address error:', error);
      showError('Failed to set default address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add New Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? 'Update your address information'
                  : 'Add a new shipping or billing address'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Label */}
              <div className="space-y-2">
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  {...register('label')}
                  placeholder="e.g., Home, Office"
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" {...register('company')} />
              </div>

              {/* Address Lines */}
              <div className="space-y-2">
                <Label htmlFor="addressLine1">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input id="addressLine1" {...register('addressLine1')} />
                {errors.addressLine1 && (
                  <p className="text-sm text-red-500">{errors.addressLine1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input id="addressLine2" {...register('addressLine2')} />
              </div>

              {/* City, Province, Postal Code */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">
                    Province <span className="text-red-500">*</span>
                  </Label>
                  <Input id="province" {...register('province')} />
                  {errors.province && (
                    <p className="text-sm text-red-500">{errors.province.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    Postal Code <span className="text-red-500">*</span>
                  </Label>
                  <Input id="postalCode" {...register('postalCode')} />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input id="country" {...register('country')} />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input id="phone" type="tel" {...register('phone')} />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Default Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(checked) =>
                    setValue('isDefault', checked as boolean)
                  }
                />
                <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                  Set as default address
                </Label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Address'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
          <p className="text-gray-600 mb-6">
            Add an address to make checkout faster
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 relative hover:shadow-md transition-shadow"
            >
              {address.isDefault && (
                <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                  Default
                </Badge>
              )}

              {address.label && (
                <h4 className="font-semibold text-lg mb-2">{address.label}</h4>
              )}

              <div className="text-sm space-y-1 mb-4">
                <p className="font-medium">
                  {address.firstName} {address.lastName}
                </p>
                {address.company && <p className="text-gray-600">{address.company}</p>}
                <p className="text-gray-600">{address.addressLine1}</p>
                {address.addressLine2 && (
                  <p className="text-gray-600">{address.addressLine2}</p>
                )}
                <p className="text-gray-600">
                  {address.city}, {address.province} {address.postalCode}
                </p>
                <p className="text-gray-600">{address.country}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingAddress(address)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingAddress}
        onOpenChange={(open) => !open && setDeletingAddress(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

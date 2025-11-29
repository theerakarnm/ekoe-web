import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomerAuthStore } from '~/store/customer-auth';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';
import { showSuccess, showError } from '~/lib/toast';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
  newsletterSubscribed: z.boolean(),
  smsSubscribed: z.boolean(),
  language: z.string().min(1),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileInfoForm() {
  const { user, profile, loadProfile, updateProfile } = useCustomerAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      newsletterSubscribed: false,
      smsSubscribed: false,
      language: 'en',
    },
  });

  const newsletterSubscribed = watch('newsletterSubscribed');
  const smsSubscribed = watch('smsSubscribed');

  // Load profile on mount
  useEffect(() => {
    if (!profile) {
      loadProfile();
    }
  }, [profile, loadProfile]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        newsletterSubscribed: profile.newsletterSubscribed,
        smsSubscribed: profile.smsSubscribed,
        language: profile.language || 'en',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      showSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        newsletterSubscribed: profile.newsletterSubscribed,
        smsSubscribed: profile.smsSubscribed,
        language: profile.language || 'en',
      });
    }
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email (read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user?.email || ''}
          disabled
          className="bg-gray-50"
        />
        <p className="text-sm text-gray-500">
          Email cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">
          First Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="firstName"
          {...register('firstName')}
          disabled={!isEditing}
          className={!isEditing ? 'bg-gray-50' : ''}
        />
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">
          Last Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="lastName"
          {...register('lastName')}
          disabled={!isEditing}
          className={!isEditing ? 'bg-gray-50' : ''}
        />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          disabled={!isEditing}
          className={!isEditing ? 'bg-gray-50' : ''}
          placeholder="+66 XX XXX XXXX"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label htmlFor="language">Preferred Language</Label>
        <select
          id="language"
          {...register('language')}
          disabled={!isEditing}
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            !isEditing ? 'bg-gray-50' : ''
          }`}
        >
          <option value="en">English</option>
          <option value="th">ไทย (Thai)</option>
        </select>
      </div>

      {/* Preferences */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Communication Preferences</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletterSubscribed"
            checked={newsletterSubscribed}
            onCheckedChange={(checked) =>
              setValue('newsletterSubscribed', checked as boolean, { shouldDirty: true })
            }
            disabled={!isEditing}
          />
          <Label
            htmlFor="newsletterSubscribed"
            className="text-sm font-normal cursor-pointer"
          >
            Subscribe to newsletter and promotional emails
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="smsSubscribed"
            checked={smsSubscribed}
            onCheckedChange={(checked) =>
              setValue('smsSubscribed', checked as boolean, { shouldDirty: true })
            }
            disabled={!isEditing}
          />
          <Label
            htmlFor="smsSubscribed"
            className="text-sm font-normal cursor-pointer"
          >
            Receive SMS notifications about orders
          </Label>
        </div>
      </div>

      {/* Account Stats */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Account Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{profile.totalOrders}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold">
              ฿{profile.totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Customer Tier</p>
            <p className="text-lg font-semibold capitalize">{profile.customerTier}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Loyalty Points</p>
            <p className="text-2xl font-bold">{profile.loyaltyPoints}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <>
            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

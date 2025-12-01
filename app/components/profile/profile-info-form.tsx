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
import { formatCurrencyFromCents } from '~/lib/formatter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
  newsletterSubscribed: z.boolean().optional(),
  smsSubscribed: z.boolean().optional(),
  language: z.string().min(1),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileInfoForm() {
  const { user, profile, loadProfile, updateProfile } = useCustomerAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      newsletterSubscribed: profile?.newsletterSubscribed || false,
      smsSubscribed: profile?.smsSubscribed || false,
      language: profile?.language || 'en',
    },
  });

  const { isDirty, isLoading: isFormLoading, errors } = form.formState;

  // Load profile on mount
  useEffect(() => {
    console.log(profile);

    if (!profile) {
      loadProfile();
    }
  }, [profile, loadProfile]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        newsletterSubscribed: profile.newsletterSubscribed,
        smsSubscribed: profile.smsSubscribed,
        language: profile.language || 'en',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...data,
        phone: data.phone ? data.phone?.trim() : undefined,
      });
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
      form.reset({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (e) => console.error('Form errors:', e))} className="space-y-6">
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
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                  placeholder="+66 XX XXX XXXX"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Language</FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={!isEditing}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${!isEditing ? 'bg-gray-50' : ''
                    }`}
                >
                  <option value="en">English</option>
                  <option value="th">ไทย (Thai)</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preferences */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Communication Preferences</h3>

          <FormField
            control={form.control}
            name="newsletterSubscribed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditing}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Subscribe to newsletter and promotional emails
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smsSubscribed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isEditing}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Receive SMS notifications about orders
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Account Stats */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{profile.totalOrders || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">
                {formatCurrencyFromCents(profile.totalSpent || 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Customer Tier</p>
              <p className="text-lg font-semibold capitalize">{profile.customerTier || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-bold">{profile.loyaltyPoints || 0}</p>
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
    </Form>
  );
}

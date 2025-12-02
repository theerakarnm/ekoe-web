import { useNavigate, useLoaderData, useNavigation } from 'react-router';
import type { Route } from './+types/$id';
import { getDiscountCode, updateDiscountCode } from '~/lib/services/admin/coupon-admin.service';
import { CouponForm } from '~/components/admin/coupons/coupon-form';
import { FormSkeleton } from '~/components/admin/layout/form-skeleton';
import { showSuccess, showError } from '~/lib/admin/toast';

export async function loader({ params, request }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) {
    throw new Response('Invalid coupon ID', { status: 400 });
  }

  const coupon = await getDiscountCode(id, request.headers);
  return { coupon };
}

export default function EditCouponPage() {
  const { coupon } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const handleSubmit = async (data: any) => {
    try {
      await updateDiscountCode(coupon.id, data);
      showSuccess('Coupon updated successfully');
      navigate('/admin/coupons');
    } catch (error: any) {
      console.error('Failed to update coupon:', error);

      // Handle duplicate code error
      if (error.statusCode === 422 && error.field === 'code') {
        showError('This coupon code already exists', 'Please use a different code');
      } else if (error.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.errors).flat();
        showError(errorMessages[0] as string || 'Validation failed', 'Please check your inputs');
      } else {
        showError(error.message || 'Failed to update coupon');
      }
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/admin/coupons');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Coupon</h1>
        <p className="text-muted-foreground mt-2">
          Update discount code details and settings
        </p>
      </div>

      {isLoading ? (
        <FormSkeleton />
      ) : (
        <CouponForm
          initialData={coupon}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

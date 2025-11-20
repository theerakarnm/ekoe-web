import { useNavigate, useLoaderData } from 'react-router';
import type { Route } from './+types/$id.edit';
import { getDiscountCode, updateDiscountCode } from '~/lib/admin/api-client';
import { CouponForm } from '~/components/admin/coupons/coupon-form';
import { toast } from 'sonner';

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    throw new Response('Invalid coupon ID', { status: 400 });
  }
  
  const coupon = await getDiscountCode(id);
  return { coupon };
}

export default function EditCouponPage() {
  const { coupon } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await updateDiscountCode(coupon.id, data);
      toast.success('Coupon updated successfully');
      navigate('/admin/coupons');
    } catch (error: any) {
      console.error('Failed to update coupon:', error);
      
      // Handle duplicate code error
      if (error.statusCode === 422 && error.field === 'code') {
        toast.error('This coupon code already exists. Please use a different code.');
      } else if (error.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.errors).flat();
        toast.error(errorMessages[0] || 'Validation failed. Please check your inputs.');
      } else {
        toast.error(error.message || 'Failed to update coupon. Please try again.');
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

      <CouponForm 
        initialData={coupon} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
}

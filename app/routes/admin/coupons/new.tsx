import { useNavigate } from 'react-router';
import type { Route } from './+types/new';
import { createDiscountCode } from '~/lib/admin/api-client';
import { CouponForm } from '~/components/admin/coupons/coupon-form';
import { toast } from 'sonner';

export default function NewCouponPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      await createDiscountCode(data);
      toast.success('Coupon created successfully');
      navigate('/admin/coupons');
    } catch (error: any) {
      console.error('Failed to create coupon:', error);
      
      // Handle duplicate code error
      if (error.statusCode === 422 && error.field === 'code') {
        toast.error('This coupon code already exists. Please use a different code.');
      } else if (error.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.errors).flat();
        toast.error(errorMessages[0] || 'Validation failed. Please check your inputs.');
      } else {
        toast.error(error.message || 'Failed to create coupon. Please try again.');
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
        <h1 className="text-3xl font-bold tracking-tight">Create Coupon</h1>
        <p className="text-muted-foreground mt-2">
          Add a new discount code or promotional offer
        </p>
      </div>

      <CouponForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}

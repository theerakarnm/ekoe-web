import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { PromotionForm } from '~/components/admin/promotions';

export default function NewPromotion() {
  const navigate = useNavigate();

  const handleSuccess = (promotion: any) => {
    navigate(`/admin/promotions/${promotion.id}`);
  };

  const handleCancel = () => {
    navigate('/admin/promotions');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/promotions')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Promotions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Promotion</CardTitle>
          <CardDescription>
            Set up a new promotional campaign with conditions and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromotionForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
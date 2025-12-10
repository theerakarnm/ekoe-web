import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { PromotionForm } from '~/components/admin/promotions';
import { getPromotion, type PromotionDetail } from '~/lib/services/admin/promotion-admin.service';
import { useState, useEffect } from 'react';

export default function EditPromotion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPromotion();
    }
  }, [id]);

  const loadPromotion = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const promotionData = await getPromotion(id);
      setPromotion(promotionData);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (updatedPromotion: any) => {
    navigate(`/admin/promotions/${updatedPromotion.id}`);
  };

  const handleCancel = () => {
    navigate(`/admin/promotions/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
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
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
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
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load promotion: {error}</p>
              <Button onClick={loadPromotion}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="space-y-6">
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
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Promotion not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/promotions/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Promotion
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Promotion: {promotion.name}</CardTitle>
          <CardDescription>
            Update the promotion settings, conditions, and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromotionForm
            promotion={promotion}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}

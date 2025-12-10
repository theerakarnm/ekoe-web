import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { toast } from '~/lib/admin/toast';
import { PromotionAnalyticsDashboard } from '~/components/admin/promotions';
import { getPromotion, type PromotionDetail } from '~/lib/services/admin/promotion-admin.service';

export default function PromotionAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPromotion();
    }
  }, [id]);

  const loadPromotion = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const promotionData = await getPromotion(id);
      setPromotion(promotionData);
    } catch (error) {
      toast.error(`Failed to load promotion: ${(error as Error).message}`);
      navigate('/admin/promotions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Promotion not found</p>
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

      <PromotionAnalyticsDashboard
        promotionId={promotion.id}
        promotionName={promotion.name}
      />
    </div>
  );
}
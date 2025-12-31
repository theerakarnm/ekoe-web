import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  Edit,
  BarChart3,
  Play,
  Pause,
  Square,
  Copy,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { toast } from '~/lib/admin/toast';
import {
  getPromotion,
  getPromotionStats,
  getPromotionConflicts,
  activatePromotion,
  deactivatePromotion,
  pausePromotion,
  resumePromotion,
  duplicatePromotion,
  type PromotionDetail,
  type PromotionUsageStats
} from '~/lib/services/admin/promotion-admin.service';

export default function PromotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
  const [stats, setStats] = useState<PromotionUsageStats | null>(null);
  const [conflicts, setConflicts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPromotion();
      loadStats();
      loadConflicts();
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

  const loadStats = async () => {
    if (!id) return;

    try {
      const statsData = await getPromotionStats(id);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadConflicts = async () => {
    if (!id) return;

    try {
      const conflictsData = await getPromotionConflicts(id);
      setConflicts(conflictsData);
    } catch (error) {
      console.error('Failed to load conflicts:', error);
    }
  };

  const handleStatusChange = async (action: string) => {
    if (!id) return;

    setActionLoading(action);
    try {
      switch (action) {
        case 'activate':
          await activatePromotion(id);
          toast.success('Promotion activated successfully');
          break;
        case 'deactivate':
          await deactivatePromotion(id);
          toast.success('Promotion deactivated successfully');
          break;
        case 'pause':
          await pausePromotion(id);
          toast.success('Promotion paused successfully');
          break;
        case 'resume':
          await resumePromotion(id);
          toast.success('Promotion resumed successfully');
          break;
      }
      loadPromotion();
    } catch (error) {
      toast.error(`Failed to ${action} promotion: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async () => {
    if (!id) return;

    setActionLoading('duplicate');
    try {
      const newPromotion = await duplicatePromotion(id);
      toast.success('Promotion duplicated successfully');
      navigate(`/admin/promotions/${newPromotion.id}`);
    } catch (error) {
      toast.error(`Failed to duplicate promotion: ${(error as Error).message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200',
      draft: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {getStatusIcon(status)}
        <span className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      percentage_discount: 'bg-purple-100 text-purple-800 border-purple-200',
      fixed_discount: 'bg-orange-100 text-orange-800 border-orange-200',
      free_gift: 'bg-pink-100 text-pink-800 border-pink-200'
    };

    const labels = {
      percentage_discount: 'Percentage Discount',
      fixed_discount: 'Fixed Amount Discount',
      free_gift: 'Free Gift'
    };

    return (
      <Badge className={variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const isPromotionExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const canActivate = (promotion: PromotionDetail) => {
    return ['draft', 'scheduled', 'paused'].includes(promotion.status) && !isPromotionExpired(promotion.endsAt);
  };

  const canPause = (promotion: PromotionDetail) => {
    return promotion.status === 'active';
  };

  const canResume = (promotion: PromotionDetail) => {
    return promotion.status === 'paused' && !isPromotionExpired(promotion.endsAt);
  };

  const canDeactivate = (promotion: PromotionDetail) => {
    return ['active', 'paused'].includes(promotion.status);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/promotions')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Promotions
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{promotion.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(promotion.status)}
              {getTypeBadge(promotion.type)}
              {isPromotionExpired(promotion.endsAt) && promotion.status !== 'expired' && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expired
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleDuplicate}
            disabled={actionLoading === 'duplicate'}
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/admin/promotions/${promotion.id}/analytics`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/admin/promotions/${promotion.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>

          {/* Status Actions */}
          {canActivate(promotion) && (
            <Button
              onClick={() => handleStatusChange('activate')}
              disabled={actionLoading === 'activate'}
            >
              <Play className="h-4 w-4 mr-2" />
              Activate
            </Button>
          )}
          {canPause(promotion) && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('pause')}
              disabled={actionLoading === 'pause'}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {canResume(promotion) && (
            <Button
              onClick={() => handleStatusChange('resume')}
              disabled={actionLoading === 'resume'}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          {canDeactivate(promotion) && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange('deactivate')}
              disabled={actionLoading === 'deactivate'}
            >
              <Square className="h-4 w-4 mr-2" />
              Deactivate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {promotion.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{promotion.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Start Date</h4>
                  <p className="text-muted-foreground">{formatDate(promotion.startsAt)}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">End Date</h4>
                  <p className="text-muted-foreground">{formatDate(promotion.endsAt)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Priority</h4>
                  <Badge variant="outline">{promotion.priority}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Usage Limit</h4>
                  <p className="text-muted-foreground">
                    {promotion.usageLimit ? promotion.usageLimit.toLocaleString() : 'Unlimited'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Per Customer</h4>
                  <p className="text-muted-foreground">{promotion.usageLimitPerCustomer}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Rules</CardTitle>
              <CardDescription>
                Conditions and benefits for this promotion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {promotion.rules && promotion.rules.length > 0 ? (
                <div className="space-y-6">
                  {/* Conditions */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">📋</span>
                      Conditions
                    </h4>
                    <div className="space-y-3">
                      {promotion.rules
                        .filter(rule => rule.ruleType === 'condition')
                        .map((rule, index) => {
                          const conditionLabels: Record<string, string> = {
                            cart_value: 'ยอดรวมตะกร้า (บาท)',
                            product_quantity: 'จำนวนสินค้า (ชิ้น)',
                            specific_products: 'สินค้าเฉพาะ',
                            category_products: 'หมวดหมู่สินค้า'
                          };
                          const operatorLabels: Record<string, string> = {
                            gte: '≥',
                            lte: '≤',
                            eq: '=',
                            in: 'อยู่ใน',
                            not_in: 'ไม่อยู่ใน'
                          };
                          return (
                            <div key={index} className="p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    {conditionLabels[rule.conditionType || ''] || rule.conditionType}
                                  </Badge>
                                  <span className="text-lg font-semibold text-slate-600">
                                    {operatorLabels[rule.operator || ''] || rule.operator}
                                  </span>
                                  <span className="text-lg font-bold text-slate-900">
                                    {rule.numericValue?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {promotion.rules.filter(rule => rule.ruleType === 'condition').length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No conditions defined</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Benefits */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">🎁</span>
                      Benefits
                    </h4>
                    <div className="space-y-3">
                      {promotion.rules
                        .filter(rule => rule.ruleType === 'benefit')
                        .map((rule, index) => {
                          const benefitLabels: Record<string, string> = {
                            percentage_discount: 'ส่วนลดเปอร์เซ็นต์',
                            fixed_discount: 'ส่วนลดจำนวนเงิน',
                            free_gift: 'ของแถม'
                          };
                          const benefitColors: Record<string, string> = {
                            percentage_discount: 'bg-purple-100 text-purple-800 border-purple-200',
                            fixed_discount: 'bg-orange-100 text-orange-800 border-orange-200',
                            free_gift: 'bg-pink-100 text-pink-800 border-pink-200'
                          };

                          return (
                            <div key={index} className="p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                              <div className="flex items-start gap-4">
                                {/* Gift Image */}
                                {rule.benefitType === 'free_gift' && rule.giftImageUrl && (
                                  <div className="shrink-0">
                                    <img
                                      src={rule.giftImageUrl}
                                      alt={rule.giftName || 'Gift'}
                                      className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                                    />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={benefitColors[rule.benefitType || ''] || 'bg-gray-100 text-gray-800'}>
                                      {benefitLabels[rule.benefitType || ''] || rule.benefitType}
                                    </Badge>
                                  </div>

                                  {/* Discount Benefits */}
                                  {(rule.benefitType === 'percentage_discount' || rule.benefitType === 'fixed_discount') && (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">ส่วนลด:</span>
                                        <span className="text-xl font-bold text-green-600">
                                          {rule.benefitType === 'percentage_discount'
                                            ? `${rule.benefitValue}%`
                                            : `฿${rule.benefitValue?.toLocaleString()}`
                                          }
                                        </span>
                                      </div>
                                      {rule.maxDiscountAmount && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-muted-foreground">ลดสูงสุด:</span>
                                          <span className="text-sm font-medium text-amber-600">
                                            ฿{rule.maxDiscountAmount.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Free Gift Benefits */}
                                  {rule.benefitType === 'free_gift' && (
                                    <div className="space-y-2">
                                      {/* Multiple Gift Options Mode */}
                                      {rule.giftSelectionType === 'options' && rule.giftOptions && rule.giftOptions.length > 0 ? (
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">รูปแบบ:</span>
                                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                              ให้ลูกค้าเลือก ({rule.maxGiftSelections || 1} จาก {rule.giftOptions.length})
                                            </Badge>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            {rule.giftOptions.map((option: any, optIndex: number) => (
                                              <div key={option.id || optIndex} className="flex items-center gap-2 p-2 bg-white border rounded-lg">
                                                {option.imageUrl && (
                                                  <img
                                                    src={option.imageUrl}
                                                    alt={option.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                  />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium truncate">{option.name}</p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {option.quantity} ชิ้น
                                                    {option.price ? ` • ฿${option.price.toLocaleString()}` : ''}
                                                  </p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        /* Single Gift Mode */
                                        <>
                                          {rule.giftName && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-muted-foreground">ชื่อของแถม:</span>
                                              <span className="font-semibold text-slate-900">{rule.giftName}</span>
                                            </div>
                                          )}
                                          {rule.giftQuantity && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-muted-foreground">จำนวน:</span>
                                              <span className="font-medium">{rule.giftQuantity} ชิ้น</span>
                                            </div>
                                          )}
                                          {rule.giftPrice !== undefined && rule.giftPrice !== null && (
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-muted-foreground">มูลค่า:</span>
                                              <span className="font-medium text-green-600">
                                                ฿{rule.giftPrice.toLocaleString()}
                                              </span>
                                            </div>
                                          )}
                                          {!rule.giftName && !rule.giftImageUrl && (
                                            <p className="text-sm text-muted-foreground italic">
                                              ไม่มีรายละเอียดของแถม
                                            </p>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {promotion.rules.filter(rule => rule.ruleType === 'benefit').length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No benefits defined</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No rules defined for this promotion.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Uses</span>
                    <span className="font-medium">{stats.totalUsage.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Discount</span>
                    <span className="font-medium">{formatCurrency(stats.totalDiscount)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Order Value</span>
                    <span className="font-medium">{formatCurrency(stats.averageOrderValue)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="font-medium">{stats.conversionRate.toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conflicts */}
          {conflicts && conflicts.hasConflicts && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Conflicts Detected
                </CardTitle>
                <CardDescription>
                  This promotion conflicts with other active promotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conflicts.conflicts.slice(0, 3).map((conflict: any, index: number) => (
                    <div key={index} className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                      <p className="font-medium">{conflict.promotion.name}</p>
                      <p className="text-muted-foreground">
                        {conflict.conflictTypes.timeOverlap && 'Time overlap'}
                        {conflict.conflictTypes.exclusivity && ', Exclusivity conflict'}
                        {conflict.conflictTypes.samePriority && ', Same priority'}
                      </p>
                    </div>
                  ))}
                  {conflicts.conflicts.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{conflicts.conflicts.length - 3} more conflicts
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(promotion.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(promotion.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{promotion.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
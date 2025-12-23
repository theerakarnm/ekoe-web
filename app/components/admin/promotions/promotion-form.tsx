import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Plus, Trash2, Gift, Layers } from 'lucide-react';
import { SingleImageUploader } from '~/components/admin/products/single-image-uploader';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Calendar } from '~/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { toast } from '~/lib/admin/toast';
import { cn } from '~/lib/utils';
import type {
  CreatePromotionDto,
  PromotionDetail,
  PromotionType
} from '~/lib/services/admin/promotion-admin.service';
import {
  createPromotion,
  updatePromotion,
  addPromotionRules
} from '~/lib/services/admin/promotion-admin.service';

const promotionSchema = z.object({
  name: z.string().min(1, 'Promotion name is required').max(255),
  description: z.string().optional(),
  type: z.enum(['percentage_discount', 'fixed_discount', 'free_gift']),
  priority: z.number().int().min(0),
  startsAt: z.date(),
  endsAt: z.date(),
  usageLimit: z.number().int().positive().optional(),
  usageLimitPerCustomer: z.number().int().positive(),
  exclusiveWith: z.array(z.string()).optional(),
}).refine((data) => data.endsAt > data.startsAt, {
  message: "End date must be after start date",
  path: ["endsAt"],
});

const ruleSchema = z.object({
  ruleType: z.enum(['condition', 'benefit']),
  conditionType: z.enum(['cart_value', 'product_quantity', 'specific_products', 'category_products']).optional(),
  operator: z.enum(['gte', 'lte', 'eq', 'in', 'not_in']).optional(),
  numericValue: z.number().optional(),
  textValue: z.string().optional(),
  benefitType: z.enum(['percentage_discount', 'fixed_discount', 'free_gift']).optional(),
  benefitValue: z.number().optional(),
  maxDiscountAmount: z.number().int().positive().optional(),
  giftProductIds: z.array(z.string()).optional(),
  giftQuantities: z.array(z.number().int().positive()).optional(),
  giftName: z.string().optional(),
  giftPrice: z.number().optional(),
  giftImageUrl: z.string().optional(),
});

// Tier interface: groups a condition with its benefit
interface PromotionTier {
  condition: {
    conditionType: 'cart_value' | 'product_quantity' | 'specific_products' | 'category_products';
    operator: 'gte' | 'lte' | 'eq' | 'in' | 'not_in';
    numericValue?: number;
    textValue?: string;
  };
  benefit: {
    benefitType: 'percentage_discount' | 'fixed_discount' | 'free_gift';
    benefitValue?: number;
    maxDiscountAmount?: number;
    giftName?: string;
    giftPrice?: number;
    giftImageUrl?: string;
  };
}

type PromotionFormData = z.infer<typeof promotionSchema>;
type RuleFormData = z.infer<typeof ruleSchema>;

interface PromotionFormProps {
  promotion?: PromotionDetail;
  onSuccess: (promotion: any) => void;
  onCancel: () => void;
}

// Helper function to convert existing rules to tiers
const rulesToTiers = (rules: RuleFormData[]): PromotionTier[] => {
  const conditions = rules.filter(r => r.ruleType === 'condition');
  const benefits = rules.filter(r => r.ruleType === 'benefit');

  const tiers: PromotionTier[] = [];
  const maxLength = Math.max(conditions.length, benefits.length);

  for (let i = 0; i < maxLength; i++) {
    const condition = conditions[i];
    const benefit = benefits[i];

    tiers.push({
      condition: {
        conditionType: condition?.conditionType || 'product_quantity',
        operator: condition?.operator || 'gte',
        numericValue: condition?.numericValue,
        textValue: condition?.textValue,
      },
      benefit: {
        benefitType: benefit?.benefitType || 'fixed_discount',
        benefitValue: benefit?.benefitValue,
        maxDiscountAmount: benefit?.maxDiscountAmount,
        giftName: benefit?.giftName,
        giftPrice: benefit?.giftPrice,
        giftImageUrl: benefit?.giftImageUrl,
      },
    });
  }

  return tiers;
};

// Helper function to convert tiers back to rules for API
const tiersToRules = (tiers: PromotionTier[]): RuleFormData[] => {
  const rules: RuleFormData[] = [];

  for (const tier of tiers) {
    // Add condition rule
    rules.push({
      ruleType: 'condition',
      conditionType: tier.condition.conditionType,
      operator: tier.condition.operator,
      numericValue: tier.condition.numericValue,
      textValue: tier.condition.textValue,
    });

    // Add benefit rule
    rules.push({
      ruleType: 'benefit',
      benefitType: tier.benefit.benefitType,
      benefitValue: tier.benefit.benefitValue,
      maxDiscountAmount: tier.benefit.maxDiscountAmount,
      giftName: tier.benefit.giftName,
      giftPrice: tier.benefit.giftPrice,
      giftImageUrl: tier.benefit.giftImageUrl,
    });
  }

  return rules;
};

export function PromotionForm({ promotion, onSuccess, onCancel }: PromotionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('information');

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: promotion?.name || '',
      description: promotion?.description || '',
      type: promotion?.type || 'percentage_discount',
      priority: promotion?.priority || 0,
      startsAt: promotion ? new Date(promotion.startsAt) : new Date(),
      endsAt: promotion ? new Date(promotion.endsAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      usageLimit: promotion?.usageLimit || undefined,
      usageLimitPerCustomer: promotion?.usageLimitPerCustomer || 1,
      exclusiveWith: promotion?.exclusiveWith || [],
    },
  });

  // Convert existing rules to tiers format
  const initialRules: RuleFormData[] = promotion?.rules?.map(rule => ({
    ruleType: rule.ruleType,
    conditionType: rule.conditionType,
    operator: rule.operator,
    numericValue: rule.numericValue,
    textValue: rule.textValue,
    benefitType: rule.benefitType,
    benefitValue: rule.benefitValue,
    maxDiscountAmount: rule.maxDiscountAmount,
    giftProductIds: rule.giftProductIds || [],
    giftQuantities: rule.giftQuantities || [],
    giftName: rule.giftName,
    giftPrice: rule.giftPrice,
    giftImageUrl: rule.giftImageUrl,
  })) || [];

  const [tiers, setTiers] = useState<PromotionTier[]>(
    initialRules.length > 0 ? rulesToTiers(initialRules) : []
  );

  const promotionType = form.watch('type');

  const handleSubmit = async (data: PromotionFormData) => {
    setIsLoading(true);
    try {
      const promotionData: CreatePromotionDto = {
        ...data,
        startsAt: data.startsAt.toISOString(),
        endsAt: data.endsAt.toISOString(),
      };

      let result;
      if (promotion) {
        result = await updatePromotion(promotion.id, promotionData);
      } else {
        result = await createPromotion(promotionData);
      }

      // Convert tiers to rules and add them
      const rules = tiersToRules(tiers);
      if (rules.length > 0) {
        await addPromotionRules(result.id, rules);
      }

      toast.success(`Promotion ${promotion ? 'updated' : 'created'} successfully`);
      onSuccess(result);
    } catch (error) {
      toast.error(`Failed to ${promotion ? 'update' : 'create'} promotion: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addTier = () => {
    const newTier: PromotionTier = {
      condition: {
        conditionType: 'product_quantity',
        operator: 'gte',
        numericValue: 1,
      },
      benefit: {
        benefitType: promotionType,
        benefitValue: undefined,
      },
    };
    setTiers([...tiers, newTier]);
  };

  const updateTier = (index: number, updates: Partial<PromotionTier>) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      condition: { ...updatedTiers[index].condition, ...updates.condition },
      benefit: { ...updatedTiers[index].benefit, ...updates.benefit },
    };
    setTiers(updatedTiers);
  };

  const updateTierCondition = (index: number, updates: Partial<PromotionTier['condition']>) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      condition: { ...updatedTiers[index].condition, ...updates },
    };
    setTiers(updatedTiers);
  };

  const updateTierBenefit = (index: number, updates: Partial<PromotionTier['benefit']>) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      benefit: { ...updatedTiers[index].benefit, ...updates },
    };
    setTiers(updatedTiers);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="information">ข้อมูลทั่วไป</TabsTrigger>
            <TabsTrigger value="rules">กฎเงื่อนไข</TabsTrigger>
          </TabsList>

          {/* Information Tab */}
          <TabsContent value="information" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อโปรโมชั่น</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกชื่อโปรโมชั่น" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ประเภทโปรโมชั่น</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage_discount">ลดเป็นเปอร์เซ็นต์ (%)</SelectItem>
                          <SelectItem value="fixed_discount">ลดเป็นจำนวนเงิน (บาท)</SelectItem>
                          <SelectItem value="free_gift">ของแถม</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รายละเอียด</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="กรอกรายละเอียดโปรโมชั่น"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      รายละเอียดสำหรับใช้อ้างอิงภายใน
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>วันที่เริ่มต้น</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>เลือกวันที่</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>วันที่สิ้นสุด</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value)
                              ) : (
                                <span>เลือกวันที่</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.getValues('startsAt')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ลำดับความสำคัญ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        ตัวเลขยิ่งสูง = สำคัญยิ่งมาก
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จำกัดการใช้งานทั้งหมด</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="ไม่จำกัด"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        เว้นว่างไว้สำหรับไม่จำกัด
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usageLimitPerCustomer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จำกัดต่อลูกค้า</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        ใช้ได้ต่อลูกค้า
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Rules Tab - Tiered Structure */}
          <TabsContent value="rules" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    ระดับโปรโมชั่น (Tiers)
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTier}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มระดับ
                  </Button>
                </CardTitle>
                <CardDescription>
                  กำหนดเงื่อนไขและสิทธิประโยชน์แบบเป็นระดับ เช่น ซื้อ 1 ชิ้น ลด 100 บาท, ซื้อ 2 ชิ้น ลด 500 บาท
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tiers.map((tier, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">ระดับที่ {index + 1}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTier(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Condition Section */}
                    <div className="mb-4">
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                        เงื่อนไข (Condition)
                      </Label>
                      <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg bg-background">
                        <div>
                          <Label className="text-xs">ประเภท</Label>
                          <Select
                            value={tier.condition.conditionType}
                            onValueChange={(value) => updateTierCondition(index, { conditionType: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cart_value">ยอดรวมตะกร้า (บาท)</SelectItem>
                              <SelectItem value="product_quantity">จำนวนสินค้า (ชิ้น)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">ตัวดำเนินการ</Label>
                          <Select
                            value={tier.condition.operator}
                            onValueChange={(value) => updateTierCondition(index, { operator: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gte">มากกว่าหรือเท่ากับ (≥)</SelectItem>
                              <SelectItem value="lte">น้อยกว่าหรือเท่ากับ (≤)</SelectItem>
                              <SelectItem value="eq">เท่ากับ (=)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">
                            {tier.condition.conditionType === 'cart_value' ? 'ยอด (บาท)' : 'จำนวน (ชิ้น)'}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={tier.condition.numericValue || ''}
                            onChange={(e) => updateTierCondition(index, { numericValue: parseFloat(e.target.value) || undefined })}
                            placeholder={tier.condition.conditionType === 'cart_value' ? 'เช่น 1000' : 'เช่น 2'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Benefit Section */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                        สิทธิประโยชน์ (Benefit)
                      </Label>
                      <div className="p-3 border rounded-lg bg-background">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs">ประเภท</Label>
                            <Select
                              value={tier.benefit.benefitType}
                              onValueChange={(value) => updateTierBenefit(index, { benefitType: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage_discount">ลดเป็นเปอร์เซ็นต์ (%)</SelectItem>
                                <SelectItem value="fixed_discount">ลดเป็นจำนวนเงิน (บาท)</SelectItem>
                                <SelectItem value="free_gift">ของแถม (Free Gift)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {tier.benefit.benefitType !== 'free_gift' && (
                            <div>
                              <Label className="text-xs">
                                {tier.benefit.benefitType === 'percentage_discount' ? 'เปอร์เซ็นต์ (%)' : 'จำนวนเงิน (บาท)'}
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={tier.benefit.benefitValue || ''}
                                onChange={(e) => updateTierBenefit(index, { benefitValue: parseFloat(e.target.value) || undefined })}
                                placeholder={tier.benefit.benefitType === 'percentage_discount' ? 'เช่น 10' : 'เช่น 100'}
                              />
                            </div>
                          )}
                          {tier.benefit.benefitType === 'percentage_discount' && (
                            <div>
                              <Label className="text-xs">ลดสูงสุด (บาท)</Label>
                              <Input
                                type="number"
                                min="0"
                                value={tier.benefit.maxDiscountAmount || ''}
                                onChange={(e) => updateTierBenefit(index, { maxDiscountAmount: parseInt(e.target.value) || undefined })}
                                placeholder="เช่น 500"
                              />
                            </div>
                          )}
                        </div>

                        {/* Free Gift Fields */}
                        {tier.benefit.benefitType === 'free_gift' && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm font-medium mb-3">
                              <Gift className="h-4 w-4" />
                              <span>รายละเอียดของแถม</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-4">
                                <div>
                                  <Label className="flex items-center gap-1 text-xs">
                                    ชื่อของแถม <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    type="text"
                                    value={tier.benefit.giftName || ''}
                                    onChange={(e) => updateTierBenefit(index, { giftName: e.target.value })}
                                    placeholder="กรอกชื่อของแถม (จำเป็น)"
                                    required
                                  />
                                  {!tier.benefit.giftName && (
                                    <p className="text-xs text-red-500 mt-1">กรุณากรอกชื่อของแถม</p>
                                  )}
                                </div>
                                <div>
                                  <Label className="text-xs">ราคาของแถม (บาท)</Label>
                                  <Input
                                    type="number"
                                    value={tier.benefit.giftPrice || ''}
                                    onChange={(e) => updateTierBenefit(index, { giftPrice: parseFloat(e.target.value) || undefined })}
                                    placeholder="ระบุราคา (ไม่จำเป็น)"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">ราคาสำหรับแสดงมูลค่าของแถม (ไม่บังคับ)</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">รูปภาพของแถม</Label>
                                <div className="mt-1">
                                  <SingleImageUploader
                                    value={tier.benefit.giftImageUrl}
                                    onChange={(url) => updateTierBenefit(index, { giftImageUrl: url })}
                                    placeholder="อัปโหลดรูปของแถม"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {tiers.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Layers className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">ยังไม่มีระดับโปรโมชั่น</p>
                    <p className="text-sm mt-1">คลิก "เพิ่มระดับ" เพื่อกำหนดเงื่อนไขและสิทธิประโยชน์</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTier}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มระดับแรก
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons - Always visible */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังบันทึก...' : promotion ? 'อัปเดตโปรโมชั่น' : 'สร้างโปรโมชั่น'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Plus, Trash2, Info } from 'lucide-react';
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
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import { toast } from '~/lib/admin/toast';
import { cn } from '~/lib/utils';
import type { 
  CreatePromotionDto, 
  CreatePromotionRuleDto,
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
});

type PromotionFormData = z.infer<typeof promotionSchema>;
type RuleFormData = z.infer<typeof ruleSchema>;

interface PromotionFormProps {
  promotion?: PromotionDetail;
  onSuccess: (promotion: any) => void;
  onCancel: () => void;
}

export function PromotionForm({ promotion, onSuccess, onCancel }: PromotionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdPromotion, setCreatedPromotion] = useState<any>(null);

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

  const [rules, setRules] = useState<RuleFormData[]>(
    promotion?.rules?.map(rule => ({
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
    })) || []
  );

  const promotionType = form.watch('type');

  const handlePromotionSubmit = async (data: PromotionFormData) => {
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
        toast.success('Promotion updated successfully');
      } else {
        result = await createPromotion(promotionData);
        toast.success('Promotion created successfully');
      }

      setCreatedPromotion(result);
      
      if (rules.length > 0) {
        setCurrentStep(2);
      } else {
        onSuccess(result);
      }
    } catch (error) {
      toast.error(`Failed to ${promotion ? 'update' : 'create'} promotion: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRulesSubmit = async () => {
    if (!createdPromotion || rules.length === 0) {
      onSuccess(createdPromotion);
      return;
    }

    setIsLoading(true);
    try {
      await addPromotionRules(createdPromotion.id, rules);
      toast.success('Promotion rules added successfully');
      onSuccess(createdPromotion);
    } catch (error) {
      toast.error(`Failed to add promotion rules: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addRule = (type: 'condition' | 'benefit') => {
    const newRule: RuleFormData = {
      ruleType: type,
    };

    if (type === 'condition') {
      newRule.conditionType = 'cart_value';
      newRule.operator = 'gte';
    } else {
      newRule.benefitType = promotionType;
    }

    setRules([...rules, newRule]);
  };

  const updateRule = (index: number, updates: Partial<RuleFormData>) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], ...updates };
    setRules(updatedRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Promotion Rules</h3>
          <p className="text-sm text-muted-foreground">
            Define conditions and benefits for your promotion
          </p>
        </div>

        <div className="grid gap-6">
          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Conditions
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addRule('condition')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </CardTitle>
              <CardDescription>
                Define when this promotion should be applied
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.filter(rule => rule.ruleType === 'condition').map((rule, index) => (
                <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label>Condition Type</Label>
                      <Select
                        value={rule.conditionType}
                        onValueChange={(value) => updateRule(index, { conditionType: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cart_value">Cart Value</SelectItem>
                          <SelectItem value="product_quantity">Product Quantity</SelectItem>
                          <SelectItem value="specific_products">Specific Products</SelectItem>
                          <SelectItem value="category_products">Category Products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Operator</Label>
                      <Select
                        value={rule.operator}
                        onValueChange={(value) => updateRule(index, { operator: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gte">Greater than or equal</SelectItem>
                          <SelectItem value="lte">Less than or equal</SelectItem>
                          <SelectItem value="eq">Equal to</SelectItem>
                          <SelectItem value="in">In list</SelectItem>
                          <SelectItem value="not_in">Not in list</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={rule.numericValue || ''}
                        onChange={(e) => updateRule(index, { numericValue: parseFloat(e.target.value) || undefined })}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {rules.filter(rule => rule.ruleType === 'condition').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No conditions defined. Add at least one condition.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Benefits
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addRule('benefit')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </CardTitle>
              <CardDescription>
                Define what benefits customers receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.filter(rule => rule.ruleType === 'benefit').map((rule, index) => (
                <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label>Benefit Type</Label>
                      <Select
                        value={rule.benefitType}
                        onValueChange={(value) => updateRule(index, { benefitType: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage_discount">Percentage Discount</SelectItem>
                          <SelectItem value="fixed_discount">Fixed Discount</SelectItem>
                          <SelectItem value="free_gift">Free Gift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {rule.benefitType !== 'free_gift' && (
                      <div>
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={rule.benefitValue || ''}
                          onChange={(e) => updateRule(index, { benefitValue: parseFloat(e.target.value) || undefined })}
                          placeholder={rule.benefitType === 'percentage_discount' ? 'Percentage' : 'Amount'}
                        />
                      </div>
                    )}
                    {rule.benefitType === 'percentage_discount' && (
                      <div>
                        <Label>Max Discount</Label>
                        <Input
                          type="number"
                          value={rule.maxDiscountAmount || ''}
                          onChange={(e) => updateRule(index, { maxDiscountAmount: parseInt(e.target.value) || undefined })}
                          placeholder="Maximum amount"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {rules.filter(rule => rule.ruleType === 'benefit').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No benefits defined. Add at least one benefit.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </Button>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRulesSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Promotion'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePromotionSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">
            {promotion ? 'Edit Promotion' : 'Create New Promotion'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Set up the basic details for your promotion
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter promotion name" {...field} />
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
                  <FormLabel>Promotion Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select promotion type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage_discount">Percentage Discount</SelectItem>
                      <SelectItem value="fixed_discount">Fixed Amount Discount</SelectItem>
                      <SelectItem value="free_gift">Free Gift</SelectItem>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter promotion description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional description for internal reference
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
                  <FormLabel>Start Date</FormLabel>
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
                            <span>Pick a date</span>
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
                  <FormLabel>End Date</FormLabel>
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
                            <span>Pick a date</span>
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
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Higher numbers = higher priority
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
                  <FormLabel>Total Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for unlimited
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
                  <FormLabel>Per Customer Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    Uses per customer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : promotion ? 'Update Promotion' : 'Create Promotion'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
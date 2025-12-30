import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Loader2, Info, Search, Plus, Trash2, Package } from 'lucide-react';
import { Checkbox } from '~/components/ui/checkbox';
import { Badge } from '~/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { getProducts, getProduct, type Product } from '~/lib/services/admin/product-admin.service';
import { useDebounce } from '~/hooks/use-debounce';
import { discountCodeSchema, type DiscountCodeFormData } from '~/lib/admin/validation';
import type { DiscountCode } from '~/lib/services/admin/coupon-admin.service';
import { useKeyboardShortcuts } from '~/lib/admin/use-keyboard-shortcuts';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { DateTimePicker } from '~/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface CouponFormProps {
  initialData?: DiscountCode;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function CouponForm({ initialData, onSubmit, onCancel }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      handler: (e) => {
        e.preventDefault();
        handleSubmit(onFormSubmit)();
      },
      description: 'Save coupon',
    },
    {
      key: 'Escape',
      handler: () => {
        onCancel();
      },
      description: 'Cancel and return to coupons list',
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: initialData
      ? {
        code: initialData.code,
        title: initialData.title,
        description: initialData.description || '',
        discountType: initialData.discountType,
        // Convert cents to dollars for fixed_amount discounts
        discountValue: initialData.discountType === 'fixed_amount'
          ? initialData.discountValue / 100
          : initialData.discountValue,
        // Convert cents to dollars for monetary fields
        minPurchaseAmount: initialData.minPurchaseAmount
          ? initialData.minPurchaseAmount / 100
          : undefined,
        maxDiscountAmount: initialData.maxDiscountAmount
          ? initialData.maxDiscountAmount / 100
          : undefined,
        usageLimit: initialData.usageLimit,
        usageLimitPerCustomer: initialData.usageLimitPerCustomer,
        isActive: initialData.isActive,
        isFeatured: initialData.isFeatured || false,
        linkedProductIds: initialData.linkedProductIds || [],
        startsAt: initialData.startsAt ? new Date(initialData.startsAt) : undefined,
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt) : undefined,
      }
      : {
        code: '',
        title: '',
        description: '',
        discountType: 'percentage' as const,
        discountValue: 0,
        minPurchaseAmount: undefined,
        maxDiscountAmount: undefined,
        usageLimit: undefined,
        usageLimitPerCustomer: 1,
        isActive: true,
        isFeatured: false,
        linkedProductIds: [],
        startsAt: undefined,
        expiresAt: undefined,
      },
  });

  const discountType = watch('discountType');
  const discountValue = watch('discountValue');
  const isActive = watch('isActive');

  // Product Search & Linking State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [linkedProductsDetail, setLinkedProductsDetail] = useState<Product[]>([]);

  useEffect(() => {
    async function loadDetails() {
      if (initialData?.linkedProductIds?.length) {
        try {
          const promises = initialData.linkedProductIds.map(id => getProduct(id));
          const products = await Promise.all(promises);
          setLinkedProductsDetail(products);
        } catch (error) {
          console.error('Failed to load linked product details', error);
        }
      }
    }
    loadDetails();
  }, [initialData]);

  useEffect(() => {
    async function performSearch() {
      if (debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const result = await getProducts({ search: debouncedSearch, limit: 5, status: 'active' });
        const currentIds = new Set(watch('linkedProductIds') || []);
        const filtered = (result.data || []).filter(p => !currentIds.has(p.id));
        setSearchResults(filtered);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setIsSearching(false);
      }
    }
    performSearch();
  }, [debouncedSearch, watch]);

  const handleAddProduct = (product: Product) => {
    const currentIds = watch('linkedProductIds') || [];
    setValue('linkedProductIds', [...currentIds, product.id]);
    setLinkedProductsDetail(prev => [...prev, product]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveProduct = (productId: string) => {
    const currentIds = watch('linkedProductIds') || [];
    setValue('linkedProductIds', currentIds.filter((id: string) => id !== productId));
    setLinkedProductsDetail(prev => prev.filter(p => p.id !== productId));
  };

  // Auto-uppercase code
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setValue('code', value);
  };

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Convert Date objects to ISO strings
      // Convert dollar amounts to cents for monetary fields
      const submitData = {
        ...data,
        // Convert fixed_amount discount from dollars to cents
        discountValue: data.discountType === 'fixed_amount'
          ? Math.round(data.discountValue * 100)
          : data.discountValue,
        // Convert min/max amounts from dollars to cents
        minPurchaseAmount: data.minPurchaseAmount
          ? Math.round(data.minPurchaseAmount * 100)
          : undefined,
        maxDiscountAmount: data.maxDiscountAmount
          ? Math.round(data.maxDiscountAmount * 100)
          : undefined,
        startsAt: data.startsAt instanceof Date ? data.startsAt.toISOString() : undefined,
        expiresAt: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : undefined,
      };
      await onSubmit(submitData);
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Enter the coupon code and basic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">
                Coupon Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                {...register('code')}
                onChange={handleCodeChange}
                placeholder="SUMMER2024"
                disabled={isSubmitting}
                className="uppercase"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Uppercase letters, numbers, hyphens, and underscores only
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Summer Sale 2024"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Internal description or notes about this coupon"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Discount Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Settings</CardTitle>
          <CardDescription>
            Configure the discount type and value
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discountType">
              Discount Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={discountType}
              onValueChange={(value) => {
                setValue('discountType', value as 'percentage' | 'fixed_amount' | 'free_shipping');
                // Reset discount value when changing type
                if (value === 'free_shipping') {
                  setValue('discountValue', 0);
                }
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger id="discountType">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                <SelectItem value="free_shipping">Free Shipping</SelectItem>
              </SelectContent>
            </Select>
            {errors.discountType && (
              <p className="text-sm text-destructive">{errors.discountType.message}</p>
            )}
          </div>

          {discountType !== 'free_shipping' && (
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                {discountType === 'percentage' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                )}
                {discountType === 'fixed_amount' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                )}
                <Input
                  id="discountValue"
                  type="number"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  {...register('discountValue', { valueAsNumber: true })}
                  placeholder={discountType === 'percentage' ? '10' : '5.00'}
                  disabled={isSubmitting}
                  className={discountType === 'fixed_amount' ? 'pl-8' : 'pr-8'}
                />
              </div>
              {errors.discountValue && (
                <p className="text-sm text-destructive">{errors.discountValue.message}</p>
              )}
              {discountType === 'percentage' && (
                <p className="text-xs text-muted-foreground">
                  Enter a value between 0 and 100
                </p>
              )}
              {discountType === 'fixed_amount' && (
                <p className="text-xs text-muted-foreground">
                  Enter amount in dollars (will be converted to cents)
                </p>
              )}
            </div>
          )}

          {discountType === 'free_shipping' && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <div className="flex gap-2">
                <Info className="size-4 shrink-0 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Free shipping coupons don't require a discount value. Shipping costs will be waived at checkout.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
          <CardDescription>
            Set minimum purchase requirements and discount limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minPurchaseAmount">Minimum Purchase Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="minPurchaseAmount"
                  type="number"
                  step="0.01"
                  {...register('minPurchaseAmount', {
                    valueAsNumber: true,
                    setValueAs: (v) => v === '' || v === undefined ? undefined : Number(v)
                  })}
                  placeholder="0.00"
                  disabled={isSubmitting}
                  className="pl-8"
                />
              </div>
              {errors.minPurchaseAmount && (
                <p className="text-sm text-destructive">{errors.minPurchaseAmount.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum cart value required to use this coupon
              </p>
            </div>

            {discountType === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">Maximum Discount Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    step="0.01"
                    {...register('maxDiscountAmount', {
                      valueAsNumber: true,
                      setValueAs: (v) => v === '' || v === undefined ? undefined : Number(v)
                    })}
                    placeholder="0.00"
                    disabled={isSubmitting}
                    className="pl-8"
                  />
                </div>
                {errors.maxDiscountAmount && (
                  <p className="text-sm text-destructive">{errors.maxDiscountAmount.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Cap the maximum discount for percentage-based coupons
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
          <CardDescription>
            Control how many times this coupon can be used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Total Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                {...register('usageLimit', {
                  valueAsNumber: true,
                  setValueAs: (v) => v === '' || v === undefined ? undefined : Number(v)
                })}
                placeholder="Unlimited"
                disabled={isSubmitting}
              />
              {errors.usageLimit && (
                <p className="text-sm text-destructive">{errors.usageLimit.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Total number of times this coupon can be used (leave empty for unlimited)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimitPerCustomer">
                Usage Limit Per Customer <span className="text-destructive">*</span>
              </Label>
              <Input
                id="usageLimitPerCustomer"
                type="number"
                {...register('usageLimitPerCustomer', { valueAsNumber: true })}
                placeholder="1"
                disabled={isSubmitting}
              />
              {errors.usageLimitPerCustomer && (
                <p className="text-sm text-destructive">{errors.usageLimitPerCustomer.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                How many times each customer can use this coupon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validity Period */}
      <Card>
        <CardHeader>
          <CardTitle>Validity Period</CardTitle>
          <CardDescription>
            Set when this coupon is active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Start Date & Time</Label>
              <Controller
                name="startsAt"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    date={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                    onDateChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.startsAt && (
                <p className="text-sm text-destructive">{errors.startsAt.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                When the coupon becomes active (leave empty for immediate)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date & Time</Label>
              <Controller
                name="expiresAt"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    date={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                    onDateChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.expiresAt && (
                <p className="text-sm text-destructive">{errors.expiresAt.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                When the coupon expires (leave empty for no expiry)
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Product Linking */}
      <Card>
        <CardHeader>
          <CardTitle>Linked Products</CardTitle>
          <CardDescription>
            Select products to display this coupon on their detail pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 relative">
            <Label>Search & Add Products</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                disabled={isSubmitting}
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-md shadow-md bg-popover max-h-[200px] overflow-y-auto mt-2 absolute z-10 w-full">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleAddProduct(product)}
                  >
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {product.basePrice ? `$${(product.basePrice / 100).toFixed(2)}` : 'No price'}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Selected Products ({linkedProductsDetail.length})</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedProductsDetail.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                        No products linked. Search above to add.
                      </TableCell>
                    </TableRow>
                  ) : (
                    linkedProductsDetail.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">
              The coupon will be displayed on the product detail page for these products.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>
            Control whether this coupon is currently active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="isActive">
              Active Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={isActive ? 'true' : 'false'}
              onValueChange={(value) => setValue('isActive', value === 'true')}
              disabled={isSubmitting}
            >
              <SelectTrigger id="isActive">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.isActive && (
              <p className="text-sm text-destructive">{errors.isActive.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Inactive coupons cannot be used by customers
            </p>
          </div>

          <div className="flex items-start space-x-3 pt-4 border-t">
            <Checkbox
              id="isFeatured"
              checked={watch('isFeatured')}
              onCheckedChange={(checked) => setValue('isFeatured', checked as boolean)}
              disabled={isSubmitting}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="isFeatured" className="cursor-pointer font-medium">
                Feature Coupon (Welcome Popup)
              </Label>
              <p className="text-sm text-muted-foreground">
                If checked, this coupon will be displayed in the Welcome Popup for new visitors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {initialData ? 'Update' : 'Create'} Coupon
        </Button>
      </div>
    </form>
  );
}

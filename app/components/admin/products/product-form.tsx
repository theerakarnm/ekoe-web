import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useKeyboardShortcuts } from '~/lib/admin/use-keyboard-shortcuts';
import { showSuccess, showError } from '~/lib/admin/toast';
import {
  productSchema,
  type ProductFormData,
  generateSlug,
  formatPrice,
  parsePrice,
} from '~/lib/admin/validation';
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  updateProductImage,
  deleteProductImage,
  type Product,
  type ProductImage,
} from '~/lib/services/admin/product-admin.service';
import { PriceInput } from './price-input';
import { ImageUploader } from './image-uploader';
import { VariantManager } from './variant-manager';
import { IngredientsManager } from './ingredients-manager';
import { HowToUseManager } from './how-to-use-manager';
import { ComplimentaryGiftForm } from './complimentary-gift-form';
import { RealUserReviewsForm } from './real-user-reviews-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Card } from '~/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const isEditing = !!product;

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      handler: (e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      },
      description: 'Save product',
    },
    {
      key: 'Escape',
      handler: () => {
        navigate('/admin/products');
      },
      description: 'Cancel and return to products list',
    },
  ]);

  // Initialize form with default values or existing product data
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      subtitle: product?.subtitle || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      basePrice: product?.basePrice,
      compareAtPrice: product?.compareAtPrice,
      productType: product?.productType ?? 'single',
      status: product?.status ?? 'draft',
      featured: product?.featured ?? false,
      metaTitle: product?.metaTitle || '',
      metaDescription: product?.metaDescription || '',
      trackInventory: product?.trackInventory ?? true,
      variants: product?.variants?.map(v => ({
        name: v.name,
        value: v.value,
        sku: v.sku,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        stockQuantity: v.stockQuantity,
        lowStockThreshold: v.lowStockThreshold,
        isActive: v.isActive,
      })) || [],
      categoryIds: product?.categories?.map((c) => c.id) || [],
      tagIds: product?.tags?.map((t) => t.id) || [],
      ingredients: {
        keyIngredients: product?.ingredients?.keyIngredients || [],
        fullList: product?.ingredients?.fullList || '',
        image: product?.ingredients?.image || '',
      },
      goodFor: product?.goodFor || '',
      whyItWorks: product?.whyItWorks || '',
      howToUse: {
        steps: product?.howToUse?.steps || [],
        proTips: product?.howToUse?.proTips || [],
        note: product?.howToUse?.note || '',
      },
      complimentaryGift: {
        name: product?.complimentaryGift?.name || '',
        description: product?.complimentaryGift?.description || '',
        image: product?.complimentaryGift?.image || '',
        value: product?.complimentaryGift?.value || '',
      },
      realUserReviews: {
        image: product?.realUserReviews?.image || '',
        content: product?.realUserReviews?.content || '',
      },
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!isEditing || !product?.slug) {
      const slug = generateSlug(value);
      form.setValue('slug', slug);
    }
  };

  // Handle image upload
  const handleImageUpload = async (files: File[]) => {
    if (!isEditing || !product) {
      showError('Please save the product first before uploading images');
      return;
    }

    try {
      const uploadPromises = files.map((file) =>
        uploadProductImage(product.id, file)
      );
      const uploadedImages = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImages]);
      showSuccess(`${files.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Failed to upload images:', error);
      showError(error.message || 'Failed to upload images');
    }
  };

  // Handle image reorder
  const handleImageReorder = async (reorderedImages: ProductImage[]) => {
    setImages(reorderedImages);

    if (!product) return;

    try {
      // Update sort order for all images
      const updatePromises = reorderedImages.map((img, index) =>
        updateProductImage(product.id, img.id, { sortOrder: index })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to update image order:', error);
      showError('Failed to save image order');
    }
  };

  // Handle image delete
  const handleImageDelete = async (imageId: string) => {
    if (!product) return;

    try {
      await deleteProductImage(product.id, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      showSuccess('Image deleted');
    } catch (error) {
      console.error('Failed to delete image:', error);
      showError('Failed to delete image');
    }
  };

  // Handle set primary image
  const handleSetPrimary = async (imageId: string) => {
    if (!product) return;

    try {
      await updateProductImage(product.id, imageId, { isPrimary: true });

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
      showSuccess('Primary image updated');
    } catch (error) {
      console.error('Failed to set primary image:', error);
      showError('Failed to set primary image');
    }
  };

  // Handle alt text update
  const handleAltTextUpdate = async (imageId: string, altText: string) => {
    if (!product) return;

    // Optimistic update
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, altText } : img))
    );

    try {
      await updateProductImage(product.id, imageId, { altText });
    } catch (error) {
      console.error('Failed to update alt text:', error);
      showError('Failed to save alt text');
    }
  };

  // Handle description update
  const handleDescriptionUpdate = async (imageId: string, description: string) => {
    if (!product) return;

    // Optimistic update
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, description } : img))
    );

    try {
      await updateProductImage(product.id, imageId, { description });
    } catch (error) {
      console.error('Failed to update description:', error);
      showError('Failed to save description');
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // Transform form data to match API expectations
      // Exclude fields that don't exist in Product type or are managed separately
      const { categoryIds, tagIds, variants, images: _images, ingredients, howToUse, realUserReviews, ...productFields } = data;

      const productData: Partial<Product> = {
        ...productFields,
        ingredients: ingredients ? {
          keyIngredients: ingredients.keyIngredients || [],
          fullList: ingredients.fullList || '',
          image: ingredients.image || undefined,
        } : undefined,
        howToUse: howToUse ? {
          steps: howToUse.steps || [],
          proTips: howToUse.proTips || [],
          note: howToUse.note,
        } : undefined,
        realUserReviews: realUserReviews ? {
          image: realUserReviews.image || undefined,
          content: realUserReviews.content || undefined,
        } : undefined,
        // Filter out empty values for optional fields
        compareAtPrice: data.compareAtPrice || undefined,
        subtitle: data.subtitle || undefined,
        description: data.description || undefined,
        shortDescription: data.shortDescription || undefined,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        // Note: categoryIds, tagIds, variants, and images should be handled through separate API calls
        // as they don't exist directly in the Product interface or have different structures
      };

      if (isEditing && product) {
        await updateProduct(product.id, productData);
        showSuccess('Product updated successfully');
        navigate('/admin/products');
      } else {
        const newProduct = await createProduct(productData);
        showSuccess('Product created successfully', 'You can now upload images for this product');
        // Redirect to edit page so user can upload images
        navigate(`/admin/products/${newProduct.id}`);
        return;
      }
    } catch (error: any) {
      console.error('Failed to save product:', error);

      // Handle validation errors
      if (error.statusCode === 422 && error.errors) {
        // Map API validation errors to form fields
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            form.setError(field as any, {
              type: 'manual',
              message: messages[0],
            });
          }
        });
        showError('Please fix the validation errors');
      } else {
        showError(error.message || 'Failed to save product');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product name"
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="product-slug" />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Brief product subtitle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Brief description for product listings"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Detailed product description"
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Base Price</FormLabel>
                  <FormControl>
                    <PriceInput
                      {...field}
                      onChange={field.onChange}
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormDescription>
                    Price in dollars (e.g., 29.99)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compare At Price</FormLabel>
                  <FormControl>
                    <PriceInput
                      {...field}
                      value={field.value || undefined}
                      onChange={field.onChange}
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormDescription>
                    Original price for showing discounts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price Preview */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Preview:</span>
            {form.watch('compareAtPrice') && form.watch('compareAtPrice')! > (form.watch('basePrice') || 0) && (
              <span className="text-lg text-muted-foreground line-through">
                ${formatPrice(form.watch('compareAtPrice')!)}
              </span>
            )}
            <span className="text-xl font-bold">
              ${formatPrice(form.watch('basePrice') || 0)}
            </span>
          </div>
        </Card>

        {/* Product Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Settings</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Product Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single Product</SelectItem>
                      <SelectItem value="set">Product Set</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Product</FormLabel>
                    <FormDescription>
                      Display this product in featured sections
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackInventory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Track Inventory</FormLabel>
                    <FormDescription>
                      Enable inventory tracking for this product
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Images */}
        {isEditing && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>
            <ImageUploader
              images={images}
              onUpload={handleImageUpload}
              onReorder={handleImageReorder}
              onDelete={handleImageDelete}
              onSetPrimary={handleSetPrimary}
              onUpdateAltText={handleAltTextUpdate}
              onUpdateDescription={handleDescriptionUpdate}
            />
          </Card>
        )}

        {!isEditing && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>
            <p className="text-sm text-muted-foreground">
              Save the product first to upload images
            </p>
          </Card>
        )}



        {/* Additional Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="goodFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Good For</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Who is this product good for?"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyItWorks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why It Works</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Explain the science or benefits..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Ingredients */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <IngredientsManager control={form.control} />
        </Card>

        {/* How To Use */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">How To Use</h2>
          <HowToUseManager control={form.control} />
        </Card>

        {/* Complimentary Gift */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Complimentary Gift</h2>
          <ComplimentaryGiftForm control={form.control} />
        </Card>

        {/* Real User Reviews - เสียงจากผู้ใช้จริง */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">เสียงจากผู้ใช้จริง (Loved by Real Users)</h2>
          <RealUserReviewsForm control={form.control} />
        </Card>

        {/* Variants */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
          <VariantManager control={form.control} />
        </Card>

        {/* SEO */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">SEO</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="SEO title for search engines"
                      maxLength={255}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/255 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="SEO description for search engines"
                      rows={3}
                      maxLength={500}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form >
  );
}

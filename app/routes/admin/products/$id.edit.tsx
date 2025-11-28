import type { Route } from './+types/$id.edit';
import { useNavigation } from 'react-router';
import { ProductForm } from '~/components/admin/products/product-form';
import { FormSkeleton } from '~/components/admin/layout/form-skeleton';
import { getProduct } from '~/lib/services/admin/product-admin.service';

export async function loader({ params, request }: Route.LoaderArgs) {
  const productId = params.id;

  if (!productId) {
    throw new Response('Invalid product ID', { status: 400 });
  }

  try {
    const product = await getProduct(productId, request.headers);
    return { product };
  } catch (error) {
    throw new Response('Product not found', { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `Edit ${data?.product?.name || 'Product'} - Admin Portal` },
    { name: 'description', content: 'Edit product details' },
  ];
}

export default function EditProductPage({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product information for {product.name}
        </p>
      </div>

      {isLoading ? <FormSkeleton /> : <ProductForm product={product} />}
    </div>
  );
}

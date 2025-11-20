import type { Route } from './+types/$id.edit';
import { ProductForm } from '~/components/admin/products/product-form';
import { getProduct } from '~/lib/admin/api-client';

export async function loader({ params }: Route.LoaderArgs) {
  const productId = parseInt(params.id, 10);
  
  if (isNaN(productId)) {
    throw new Response('Invalid product ID', { status: 400 });
  }
  
  try {
    const product = await getProduct(productId);
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
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product information for {product.name}
        </p>
      </div>
      
      <ProductForm product={product} />
    </div>
  );
}

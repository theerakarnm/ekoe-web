import type { Route } from './+types/new';
import { ProductForm } from '~/components/admin/products/product-form';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Create Product - Admin Portal' },
    { name: 'description', content: 'Create a new product' },
  ];
}

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground mt-2">
          Add a new product to your catalog
        </p>
      </div>
      
      <ProductForm />
    </div>
  );
}

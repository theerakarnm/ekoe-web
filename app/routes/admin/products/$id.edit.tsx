import type { Route } from "./+types/$id.edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Product - Admin Portal" },
    { name: "description", content: "Edit product details" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // Product data will be loaded in later tasks
  return { product: null, id: params.id };
}

export default function EditProduct({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <p className="text-gray-600">Product ID: {loaderData.id}</p>
      <p className="text-gray-600">Product form will be implemented in task 7</p>
    </div>
  );
}

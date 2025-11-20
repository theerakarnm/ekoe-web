import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Products - Admin Portal" },
    { name: "description", content: "Manage products" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  // Product list data will be loaded in later tasks
  return { products: [], total: 0 };
}

export default function ProductList() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <p className="text-gray-600">Product list will be implemented in task 6</p>
    </div>
  );
}

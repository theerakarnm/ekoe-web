import type { Route } from "./+types/new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New Product - Admin Portal" },
    { name: "description", content: "Create a new product" },
  ];
}

export default function NewProduct() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <p className="text-gray-600">Product form will be implemented in task 7</p>
    </div>
  );
}

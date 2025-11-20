import type { Route } from "./+types/$id.edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Coupon - Admin Portal" },
    { name: "description", content: "Edit discount coupon" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // Coupon data will be loaded in later tasks
  return { coupon: null, id: params.id };
}

export default function EditCoupon({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Coupon</h1>
      <p className="text-gray-600">Coupon ID: {loaderData.id}</p>
      <p className="text-gray-600">Coupon form will be implemented in task 11</p>
    </div>
  );
}

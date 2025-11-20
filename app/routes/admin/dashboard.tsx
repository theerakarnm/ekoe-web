import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Admin Portal" },
    { name: "description", content: "Admin dashboard with key metrics" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  // Dashboard data will be loaded in later tasks
  return { metrics: null };
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600">Dashboard metrics will be implemented in task 5</p>
    </div>
  );
}

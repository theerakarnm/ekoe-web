import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Admin Portal" },
    { name: "description", content: "Manage blog articles" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  // Blog list data will be loaded in later tasks
  return { posts: [], total: 0 };
}

export default function BlogList() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Blog Articles</h1>
      <p className="text-gray-600">Blog list will be implemented in task 8</p>
    </div>
  );
}

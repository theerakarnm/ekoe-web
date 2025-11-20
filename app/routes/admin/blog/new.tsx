import type { Route } from "./+types/new";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New Article - Admin Portal" },
    { name: "description", content: "Create a new blog article" },
  ];
}

export default function NewBlogPost() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
      <p className="text-gray-600">Blog form will be implemented in task 9</p>
    </div>
  );
}

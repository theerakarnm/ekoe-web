import type { Route } from "./+types/$id.edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit Article - Admin Portal" },
    { name: "description", content: "Edit blog article" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // Blog post data will be loaded in later tasks
  return { post: null, id: params.id };
}

export default function EditBlogPost({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <p className="text-gray-600">Article ID: {loaderData.id}</p>
      <p className="text-gray-600">Blog form will be implemented in task 9</p>
    </div>
  );
}

import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { blogService } from "~/lib/services/blog.service";
import type { BlogPost } from "~/interface/blog.interface";

export function meta() {
  return [
    { title: "Ekoe Journal - Natural Skincare Tips & Stories" },
    { name: "description", content: "Read our latest articles about natural skincare, beauty tips, and the Ekoe lifestyle." },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const limit = 12;

  try {
    const response = await blogService.getBlogs({ page, limit, sortOrder: 'desc' });
    return {
      posts: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
      error: null
    };
  } catch (error) {
    console.error("Failed to load blog posts", error);
    return {
      posts: [] as BlogPost[],
      total: 0,
      page: 1,
      limit: 12,
      error: "Failed to load blog posts. Please try again later."
    };
  }
}

export default function BlogIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const { posts, total, page, limit, error } = loaderData;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
              The Ekoe Journal
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-serif">
              Discover tips for natural beauty, skincare routines, and stories from our community.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="text-center text-red-600 mb-8 py-4 bg-red-50 rounded">
              {error as string}
            </div>
          )}

          {posts.length === 0 && !error ? (
            <div className="text-center py-12 text-gray-500">
              <p>No articles found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post: BlogPost) => (
                <Link to={`/blogs/${post.id}`} key={post.id} className="group cursor-pointer block">
                  <div className="aspect-4/3 bg-gray-100 mb-4 overflow-hidden rounded-sm">
                    {post.featuredImageUrl ? (
                      <img
                        src={post.featuredImageUrl}
                        alt={post.featuredImageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1 font-serif uppercase tracking-wider">
                    {post.categoryName || 'Journal'}
                  </p>
                  <h3 className="text-xl font-serif font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1 font-serif uppercase tracking-wider">
                    {post.subtitle}
                  </p>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 font-serif mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-sm border-b border-gray-900 pb-0.5 group-hover:border-gray-600 transition-colors font-serif">
                    Read Article
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  to={`?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${page === p
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import type { BlogPost } from "~/interface/blog.interface";
import { Link } from "react-router";

interface BlogSectionProps {
  posts?: BlogPost[];
}

export default function BlogSection({ posts = [] }: BlogSectionProps) {
  // Use passed posts or fallback to empty array (or skeleton maybe later)
  // If no posts, we might want to hide the section or show a message, 
  // but for now let's just render what we have.

  const displayPosts = posts.length > 0 ? posts : [];

  if (displayPosts.length === 0) {
    return null; // Don't show section if no blogs
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold font-serif text-gray-900">From the Ekoe Journal</h2>
        <Link to="/blogs" className="text-sm text-gray-700 hover:text-gray-900 underline font-serif">
          Explore more
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {displayPosts.map((post) => (
          <Link to={`/blogs/${post.slug}`} key={post.id} className="group cursor-pointer block">
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
            <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs text-gray-500 mb-1 font-serif uppercase tracking-wider">
              {post.subtitle}
            </p>
            {post.excerpt && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-3 font-serif">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

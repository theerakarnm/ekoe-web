import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Header } from "~/components/share/header";
import { Footer } from "~/components/share/footer";
import { blogService } from "~/lib/services/blog.service";
import type { BlogPost } from "~/interface/blog.interface";
import { ContentRenderer } from "~/components/blog/content-renderer";

export function meta({ data }: { data: { post: BlogPost } }) {
  if (!data?.post) {
    return [
      { title: "Article Not Found - Ekoe Journal" },
      { name: "description", content: "Article not found" },
    ];
  }
  return [
    { title: `${data.post.title} - Ekoe Journal` },
    { name: "description", content: data.post.metaDescription || data.post.excerpt || data.post.title },
  ];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  try {
    const post = await blogService.getBlogPost(id);
    return { post, error: null };
  } catch (error) {
    console.error("Failed to load blog post", error);
    throw new Response("Blog post not found", { status: 404 });
  }
}

export default function BlogPostDetail() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        {/* Article Header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <Link to="/blogs" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-flex items-center">
            ← Back to Journal
          </Link>

          <div className="text-center">
            <span className="text-xs font-serif uppercase tracking-wider text-gray-500 mb-2 block">
              {post.categoryName || 'Journal'}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-xl text-gray-600 font-serif mb-6 italic">
                {post.subtitle}
              </p>
            )}
            {post.authorName && (
              <p className="text-sm text-gray-500 font-serif">
                By {post.authorName} • {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {post.contentBlocks && post.contentBlocks.length > 0 ? (
            <ContentRenderer blocks={post.contentBlocks} />
          ) : (
            // Fallback for legacy content
            <div
              className="prose prose-lg prose-stone max-w-none font-serif prose-headings:font-serif prose-headings:font-semibold"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}

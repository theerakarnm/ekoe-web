import type { Route } from './+types/$id';
import { blogService } from '~/lib/services/blog.service';
import { ContentRenderer } from '~/components/blog/content-renderer';
import { TableOfContents } from '~/components/blog/table-of-contents';
import { useMemo } from 'react';
import { Header } from '~/components/share/header';
import { Footer } from '~/components/share/footer';

export function meta({ data }: Route.MetaArgs) {
  if (!data?.post) {
    return [
      { title: 'Blog Post Not Found - Ekoe' },
      { name: 'description', content: 'The requested blog post could not be found.' },
    ];
  }
  return [
    { title: `${data.post.title} - Ekoe Blog` },
    { name: 'description', content: data.post.metaDescription || data.post.excerpt || 'Read our latest article.' },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { id } = params;
  if (!id) throw new Response('Not Found', { status: 404 });

  try {
    const post = await blogService.getBlogPost(id, request.headers);
    return { post };
  } catch (error) {
    throw new Response('Not Found', { status: 404 });
  }
}

export default function BlogPostDetail({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  // Use backend TOC or generate if missing (fallback)
  const toc = post.tableOfContents || [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Featured Image - Full Width Top */}
        {post.featuredImageUrl && (
          <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
            <img
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
          </div>
        )}

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

            {/* Left Column: Title, Subtitle, Sticky TOC */}
            <div className="lg:w-1/3 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                <header className="space-y-4">
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900">
                    {post.title}
                  </h1>
                  {post.subtitle && (
                    <h2 className="font-serif text-xl md:text-2xl text-gray-500 font-normal">
                      {post.subtitle}
                    </h2>
                  )}
                </header>

                <div className="hidden lg:block pt-8 border-t border-gray-100">
                  <TableOfContents items={toc} />
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="lg:w-2/3">
              {/* Mobile TOC (visible only on small screens) */}
              <div className="lg:hidden mb-12 bg-gray-50 p-6 rounded-lg">
                <TableOfContents items={toc} />
              </div>

              {post.contentBlocks && post.contentBlocks.length > 0 ? (
                <ContentRenderer blocks={post.contentBlocks} />
              ) : (
                // Legacy content fallback
                <div
                  className="prose prose-stone max-w-none prose-lg dark:prose-invert font-serif"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import type { Route } from './+types/$id';
import { blogService } from '~/lib/services/blog.service';
import { ContentRenderer } from '~/components/blog/content-renderer';
import { TableOfContents } from '~/components/blog/table-of-contents';
import { useMemo } from 'react';
import { Header } from '~/components/share/header';
import { Footer } from '~/components/share/footer';
import {
  generateSEOMeta,
  generateArticleSchema,
  generateBreadcrumbSchema,
  JsonLd,
  SITE_CONFIG
} from '~/lib/seo';

export function meta({ data }: Route.MetaArgs) {
  if (!data?.post) {
    return generateSEOMeta({
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
      pathname: '/blogs',
      noIndex: true,
    });
  }

  return generateSEOMeta({
    title: data.post.title,
    description: data.post.metaDescription || data.post.excerpt || 'อ่านบทความล่าสุดจาก Ekoe',
    pathname: `/blogs/${data.post.id}`,
    ogType: 'article',
    ogImage: data.post.featuredImageUrl || undefined,
    publishedTime: data.post.createdAt,
    modifiedTime: data.post.updatedAt || data.post.createdAt,
    author: 'Ekoe',
    keywords: ['skincare', 'Ekoe', 'บทความสกินแคร์', data.post.title],
  });
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

  // Generate Article Schema
  const articleSchema = useMemo(() =>
    generateArticleSchema({
      title: post.title,
      description: post.metaDescription || post.excerpt || '',
      url: `/blogs/${post.id}`,
      imageUrl: post.featuredImageUrl,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      author: 'Ekoe',
    }),
    [post]);

  // Generate Breadcrumb Schema
  const breadcrumbSchema = useMemo(() =>
    generateBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blogs' },
      { name: post.title, path: `/blogs/${post.id}` },
    ]),
    [post.id, post.title]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Header />

      <main className="grow">
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
                  {/* Article metadata for SEO */}
                  <div className="text-sm text-gray-500">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
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

              <article>
                {post.contentBlocks && post.contentBlocks.length > 0 ? (
                  <ContentRenderer blocks={post.contentBlocks} />
                ) : (
                  // Legacy content fallback
                  <div
                    className="prose prose-stone max-w-none prose-lg dark:prose-invert font-serif"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  />
                )}
              </article>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


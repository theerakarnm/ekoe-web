import type { Route } from './+types/campaign.$slug';
import { getMarketingCampaignBySlug, type MarketingCampaign } from '~/lib/services/marketing-campaigns.service';
import { Link } from 'react-router';

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response('Campaign not found', { status: 404 });
  }

  try {
    const campaign = await getMarketingCampaignBySlug(slug, request.headers);
    return { campaign };
  } catch (error) {
    throw new Response('Campaign not found', { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.campaign) {
    return [{ title: 'Campaign Not Found' }];
  }

  return [
    { title: `${data.campaign.title} | Ekoe` },
    { name: 'description', content: data.campaign.description || data.campaign.subtitle || '' },
    { property: 'og:title', content: data.campaign.title },
    { property: 'og:description', content: data.campaign.description || '' },
    { property: 'og:image', content: data.campaign.heroImageUrl || '' },
  ];
}

export default function CampaignPage({ loaderData }: Route.ComponentProps) {
  const { campaign } = loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        {campaign.heroImageUrl && (
          <>
            {/* Desktop Image */}
            <picture className="absolute inset-0 w-full h-full">
              {campaign.heroImageMobileUrl && (
                <source media="(max-width: 768px)" srcSet={campaign.heroImageMobileUrl} />
              )}
              <img
                src={campaign.heroImageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </picture>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          </>
        )}

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo */}
          {campaign.logoUrl && (
            <img
              src={campaign.logoUrl}
              alt="Brand Logo"
              className="h-12 md:h-16 mx-auto mb-8 drop-shadow-lg"
            />
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
            {campaign.title}
          </h1>

          {/* Subtitle */}
          {campaign.subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md leading-relaxed max-w-2xl mx-auto">
              {campaign.subtitle}
            </p>
          )}

          {/* CTA Button */}
          {campaign.ctaText && campaign.ctaUrl && (
            <Link
              to={campaign.ctaUrl}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out"
            >
              {campaign.ctaText}
            </Link>
          )}
        </div>
      </section>

      {/* Description Section */}
      {campaign.description && (
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg md:prose-xl prose-slate mx-auto text-center">
              {campaign.description.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-slate-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section (if no button in hero) */}
      {campaign.ctaText && campaign.ctaUrl && (
        <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              พร้อมเริ่มต้นแล้วหรือยัง?
            </h2>
            <Link
              to={campaign.ctaUrl}
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out"
            >
              {campaign.ctaText}
            </Link>
          </div>
        </section>
      )}

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}

// Error Boundary for 404
export function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Campaign Not Found</h1>
        <p className="text-slate-600 mb-8">
          The campaign you're looking for doesn't exist or has ended.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

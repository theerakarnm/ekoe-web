import { useState } from 'react';
import type { Route } from './+types/campaign.$slug';
import { getMarketingCampaignBySlug, registerPhoneForCampaign, type MarketingCampaign } from '~/lib/services/marketing-campaigns.service';
import { Link } from 'react-router';
import { Phone, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useNavigate } from 'react-router';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || phoneNumber.length < 9) {
      setError('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerPhoneForCampaign(campaign.slug, phoneNumber);
      setIsSuccess(true);
      setPhoneNumber('');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
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
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/50" />
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
        </div>
      </section>

      {/* Description Section */}
      {campaign.description && (
        <section className="py-12 md:py-16 px-4">
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

      {/* Phone Registration Section */}
      <section className="py-12 md:py-16 px-4 bg-linear-to-br from-gray-50 to-orange-50">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
           

            {isSuccess ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  ลงทะเบียนสำเร็จ!
                </h3>
                <p className="text-slate-600 mb-3">
                  ขอบคุณที่ลงทะเบียน เราจะติดต่อกลับเร็วๆ นี้
                </p>
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  กลับหน้าหลัก
                </Button>
              </div>
            ) : (
               <div>
                <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Phone className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                ลงทะเบียนรับสิทธิพิเศษ
              </h2>
              <p className="text-slate-600">
                กรอกเบอร์โทรศัพท์เพื่อรับข่าวสารและสิทธิพิเศษ
              </p>
            </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      +66
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="8XXXXXXXX"
                      className="w-full pl-14 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                      maxLength={10}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังลงทะเบียน...
                    </>
                  ) : (
                    'ลงทะเบียน'
                  )}
                </Button>
              </form>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section (if has CTA) */}
      {campaign.ctaText && campaign.ctaUrl && (
        <section className="py-16 md:py-20 px-4 bg-linear-to-br from-slate-900 to-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              พร้อมเริ่มต้นแล้วหรือยัง?
            </h2>
            <Link
              to={campaign.ctaUrl}
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-slate-900 bg-linear-to-r from-amber-400 to-yellow-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out"
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


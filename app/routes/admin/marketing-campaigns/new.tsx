import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  createMarketingCampaign,
  type CreateMarketingCampaignInput,
} from '~/lib/services/admin/marketing-campaigns-admin.service';
import { showSuccess, showError } from '~/lib/admin/toast';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Switch } from '~/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { SingleImageUploader } from '~/components/admin/products/single-image-uploader';
import { ArrowLeft, Save } from 'lucide-react';

export function meta() {
  return [{ title: 'New Campaign - Admin Portal' }];
}

export default function NewMarketingCampaign() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    heroImageUrl: '',
    heroImageMobileUrl: '',
    logoUrl: '',
    ctaText: '',
    ctaUrl: '',
    isActive: true,
    startsAt: '',
    endsAt: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: formData.slug || generateSlug(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const createData: CreateMarketingCampaignInput = {
        name: formData.name,
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        description: formData.description || undefined,
        heroImageUrl: formData.heroImageUrl || undefined,
        heroImageMobileUrl: formData.heroImageMobileUrl || undefined,
        logoUrl: formData.logoUrl || undefined,
        ctaText: formData.ctaText || undefined,
        ctaUrl: formData.ctaUrl || undefined,
        isActive: formData.isActive,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
      };

      await createMarketingCampaign(createData);
      showSuccess('Campaign created successfully');
      navigate('/admin/marketing-campaigns');
    } catch (error: any) {
      showError(error.message || 'Failed to create campaign');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/marketing-campaigns')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
          <p className="text-muted-foreground mt-1">Create a new marketing campaign</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Campaign name, URL, and main content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name (Internal)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Holiday 2025 Promo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/campaign/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="holiday-2025"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Campaign headline"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Optional subtitle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Campaign description..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Hero image and brand logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Hero Image (Desktop)</Label>
                <SingleImageUploader
                  value={formData.heroImageUrl}
                  onChange={(url) => setFormData({ ...formData, heroImageUrl: url })}
                  placeholder="Upload hero image"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Image (Mobile)</Label>
                <SingleImageUploader
                  value={formData.heroImageMobileUrl}
                  onChange={(url) => setFormData({ ...formData, heroImageMobileUrl: url })}
                  placeholder="Upload mobile hero image (optional)"
                />
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <Label>Logo (Optional)</Label>
              <SingleImageUploader
                value={formData.logoUrl}
                onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                placeholder="Upload brand logo"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card>
          <CardHeader>
            <CardTitle>Call to Action</CardTitle>
            <CardDescription>Button text and link (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="e.g., Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaUrl">Button URL</Label>
                <Input
                  id="ctaUrl"
                  value={formData.ctaUrl}
                  onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  placeholder="e.g., /shop"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Scheduling</CardTitle>
            <CardDescription>Control when the campaign is visible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">Campaign is visible to public</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startsAt">Start Date</Label>
                <Input
                  id="startsAt"
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Leave empty for immediate start</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endsAt">End Date</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Leave empty for no end date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/marketing-campaigns')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}

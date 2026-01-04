import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Video } from 'lucide-react';
import { SingleImageUploader } from '~/components/admin/products/single-image-uploader';
import { showSuccess, showError } from '~/lib/admin/toast';
import {
  getAllSiteSettings,
  updateSiteSetting,
  type SiteSettings,
  type HeroSlide,
  type FeatureSectionSetting,
  type OnlineExecutiveSetting,
  type WelcomePopupSetting,
} from '~/lib/services/admin/site-settings-admin.service';

export default function LandingPageAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAllSiteSettings();
      setSettings(data);
    } catch (error: any) {
      showError(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Landing Page Settings</h1>
        <p className="text-muted-foreground">
          Manage content displayed on the landing page sections
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="feature">Feature Section</TabsTrigger>
          <TabsTrigger value="online-executive">Online Executive</TabsTrigger>
          <TabsTrigger value="popup">Welcome Popup</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <HeroSectionForm
            slides={settings.hero_slides}
            onSave={async (slides) => {
              setSaving(true);
              try {
                await updateSiteSetting('hero_slides', slides);
                setSettings({ ...settings, hero_slides: slides });
                showSuccess('Hero section saved successfully');
              } catch (error: any) {
                showError(error.message || 'Failed to save');
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="feature" className="mt-6">
          <FeatureSectionForm
            data={settings.feature_section}
            onSave={async (data) => {
              setSaving(true);
              try {
                await updateSiteSetting('feature_section', data);
                setSettings({ ...settings, feature_section: data });
                showSuccess('Feature section saved successfully');
              } catch (error: any) {
                showError(error.message || 'Failed to save');
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="online-executive" className="mt-6">
          <OnlineExecutiveForm
            data={settings.online_executive}
            onSave={async (data) => {
              setSaving(true);
              try {
                await updateSiteSetting('online_executive', data);
                setSettings({ ...settings, online_executive: data });
                showSuccess('Online Executive section saved successfully');
              } catch (error: any) {
                showError(error.message || 'Failed to save');
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="popup" className="mt-6">
          <WelcomePopupForm
            data={settings.welcome_popup}
            onSave={async (data) => {
              setSaving(true);
              try {
                await updateSiteSetting('welcome_popup', data);
                setSettings({ ...settings, welcome_popup: data });
                showSuccess('Welcome popup saved successfully');
              } catch (error: any) {
                showError(error.message || 'Failed to save');
              } finally {
                setSaving(false);
              }
            }}
            saving={saving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// Hero Section Form
// ============================================================================

interface HeroSectionFormProps {
  slides: HeroSlide[];
  onSave: (slides: HeroSlide[]) => Promise<void>;
  saving: boolean;
}

function HeroSectionForm({ slides: initialSlides, onSave, saving }: HeroSectionFormProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);

  const addSlide = () => {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
    setSlides([
      ...slides,
      {
        id: newId,
        title: '',
        subtitle: '',
        description: '',
        media: { type: 'image', url: '' },
      },
    ]);
  };

  const updateSlide = (id: number, updates: Partial<HeroSlide>) => {
    setSlides(slides.map(slide =>
      slide.id === id ? { ...slide, ...updates } : slide
    ));
  };

  const removeSlide = (id: number) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Carousel Slides</CardTitle>
        <CardDescription>
          Manage the slides shown in the hero section carousel on the homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <span className="font-medium">Slide {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSlide(slide.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                    placeholder="Enter slide title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={slide.media.type === 'image' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSlide(slide.id, { media: { ...slide.media, type: 'image' } })}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" /> Image
                    </Button>
                    <Button
                      type="button"
                      variant={slide.media.type === 'video' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSlide(slide.id, { media: { ...slide.media, type: 'video' } })}
                    >
                      <Video className="h-4 w-4 mr-2" /> Video
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                  placeholder="Enter slide subtitle"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={slide.description}
                  onChange={(e) => updateSlide(slide.id, { description: e.target.value })}
                  placeholder="Enter slide description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Media {slide.media.type === 'video' ? '(Video URL)' : ''}</Label>
                {slide.media.type === 'image' ? (
                  <SingleImageUploader
                    value={slide.media.url}
                    onChange={(url) => updateSlide(slide.id, { media: { ...slide.media, url } })}
                    placeholder="Upload hero image"
                  />
                ) : (
                  <Input
                    value={slide.media.url}
                    onChange={(e) => updateSlide(slide.id, { media: { ...slide.media, url: e.target.value } })}
                    placeholder="Enter video URL (e.g., /ekoe-asset/video.mp4)"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={addSlide}>
            <Plus className="h-4 w-4 mr-2" /> Add Slide
          </Button>
          <Button onClick={() => onSave(slides)} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Hero Section'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Feature Section Form
// ============================================================================

interface FeatureSectionFormProps {
  data: FeatureSectionSetting;
  onSave: (data: FeatureSectionSetting) => Promise<void>;
  saving: boolean;
}

function FeatureSectionForm({ data: initialData, onSave, saving }: FeatureSectionFormProps) {
  const [data, setData] = useState<FeatureSectionSetting>({
    ...initialData,
    // Ensure text fields have defaults if not present
    leftTitle: initialData.leftTitle || "Glow That's Worth Obsessing Over",
    leftDescription: initialData.leftDescription || '',
    leftButtonText: initialData.leftButtonText || 'Keep Me Glowing',
    rightTitle: initialData.rightTitle || 'ปรัชญาแห่งความเรียบง่าย เพื่อผิวที่ดีที่สุด',
    rightDescription: initialData.rightDescription || '',
    rightHighlightText: initialData.rightHighlightText || '"ผิวที่ดี เริ่มจากสิ่งที่ดีจริงๆ"',
    rightButtonText: initialData.rightButtonText || 'Begin Your Glow',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Section</CardTitle>
        <CardDescription>
          Manage the two feature blocks displayed on the homepage (images and text)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Left Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Left Section</h3>

          <div className="space-y-2">
            <Label>Image</Label>
            <SingleImageUploader
              value={data.leftImage}
              onChange={(url) => setData({ ...data, leftImage: url })}
              placeholder="Upload left section image"
            />
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={data.leftTitle}
              onChange={(e) => setData({ ...data, leftTitle: e.target.value })}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={data.leftDescription}
              onChange={(e) => setData({ ...data, leftDescription: e.target.value })}
              placeholder="Enter description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={data.leftButtonText}
              onChange={(e) => setData({ ...data, leftButtonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Right Section</h3>

          <div className="space-y-2">
            <Label>Image</Label>
            <SingleImageUploader
              value={data.rightImage}
              onChange={(url) => setData({ ...data, rightImage: url })}
              placeholder="Upload right section image"
            />
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={data.rightTitle}
              onChange={(e) => setData({ ...data, rightTitle: e.target.value })}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={data.rightDescription}
              onChange={(e) => setData({ ...data, rightDescription: e.target.value })}
              placeholder="Enter description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Highlight Text</Label>
            <Input
              value={data.rightHighlightText}
              onChange={(e) => setData({ ...data, rightHighlightText: e.target.value })}
              placeholder="Enter highlight text (e.g., quote)"
            />
          </div>

          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={data.rightButtonText}
              onChange={(e) => setData({ ...data, rightButtonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
        </div>

        <Button onClick={() => onSave(data)} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Feature Section'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Online Executive Form
// ============================================================================

interface OnlineExecutiveFormProps {
  data: OnlineExecutiveSetting;
  onSave: (data: OnlineExecutiveSetting) => Promise<void>;
  saving: boolean;
}

function OnlineExecutiveForm({ data: initialData, onSave, saving }: OnlineExecutiveFormProps) {
  const [data, setData] = useState<OnlineExecutiveSetting>(initialData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Executive Page</CardTitle>
        <CardDescription>
          Manage images and quote text on the Online Executive page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Main Product Image (Right Side)</Label>
            <SingleImageUploader
              value={data.mainImage}
              onChange={(url) => setData({ ...data, mainImage: url })}
              placeholder="Upload main product image"
            />
          </div>

          <div className="space-y-2">
            <Label>Quote Background Image (Bottom)</Label>
            <SingleImageUploader
              value={data.quoteImage}
              onChange={(url) => setData({ ...data, quoteImage: url })}
              placeholder="Upload quote background image"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Quote Text</Label>
          <Textarea
            value={data.quoteText}
            onChange={(e) => setData({ ...data, quoteText: e.target.value })}
            placeholder="Enter quote text"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">Use \n for line breaks</p>
        </div>

        <Button onClick={() => onSave(data)} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Online Executive'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Welcome Popup Form
// ============================================================================

interface WelcomePopupFormProps {
  data: WelcomePopupSetting;
  onSave: (data: WelcomePopupSetting) => Promise<void>;
  saving: boolean;
}

function WelcomePopupForm({ data: initialData, onSave, saving }: WelcomePopupFormProps) {
  const [data, setData] = useState<WelcomePopupSetting>(initialData);

  const addTerm = () => {
    setData({ ...data, terms: [...data.terms, ''] });
  };

  const updateTerm = (index: number, value: string) => {
    const newTerms = [...data.terms];
    newTerms[index] = value;
    setData({ ...data, terms: newTerms });
  };

  const removeTerm = (index: number) => {
    setData({ ...data, terms: data.terms.filter((_, i) => i !== index) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Popup</CardTitle>
        <CardDescription>
          Manage the welcome popup shown to first-time visitors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Popup Image (Left Side)</Label>
          <SingleImageUploader
            value={data.image}
            onChange={(url) => setData({ ...data, image: url })}
            placeholder="Upload popup image"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Enter popup title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              placeholder="Enter popup subtitle"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Enter popup description"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Terms & Conditions</Label>
          <div className="space-y-2">
            {data.terms.map((term, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={term}
                  onChange={(e) => updateTerm(index, e.target.value)}
                  placeholder={`Term ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTerm(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addTerm}>
              <Plus className="h-4 w-4 mr-2" /> Add Term
            </Button>
          </div>
        </div>

        <Button onClick={() => onSave(data)} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Welcome Popup'}
        </Button>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '~/components/share/header';
import { Footer } from '~/components/share/footer';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { showSuccess, showError } from '~/lib/toast';
import { submitContactForm } from '~/lib/services/contact.service';
import { Loader2, Mail, MessageSquare, Send, User } from 'lucide-react';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ').max(255),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  topic: z.string().min(1, 'กรุณาเลือกหัวข้อ'),
  message: z.string().min(1, 'กรุณากรอกข้อความ').max(5000),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Topic options
const topicOptions = [
  { value: 'general', label: 'สอบถามทั่วไป' },
  { value: 'order', label: 'สอบถามเกี่ยวกับคำสั่งซื้อ' },
  { value: 'product', label: 'สอบถามเกี่ยวกับสินค้า' },
  { value: 'return', label: 'คืนสินค้า/เปลี่ยนสินค้า' },
  { value: 'partnership', label: 'ความร่วมมือทางธุรกิจ' },
  { value: 'feedback', label: 'ข้อเสนอแนะ' },
  { value: 'other', label: 'อื่นๆ' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      topic: '',
      message: '',
    },
  });

  const selectedTopic = watch('topic');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
      showSuccess('ส่งข้อความสำเร็จ', 'เราจะติดต่อกลับโดยเร็วที่สุด');
      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      showError(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-linear-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                ติดต่อเรา
              </h1>
              <p className="text-lg text-gray-300">
                มีคำถามหรือข้อเสนอแนะ? เราพร้อมรับฟังและช่วยเหลือคุณ
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Success State */}
              {isSubmitted ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ขอบคุณสำหรับข้อความของคุณ
                  </h2>
                  <p className="text-gray-600 mb-8">
                    เราได้รับข้อความของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    ส่งข้อความอีกครั้ง
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      ส่งข้อความถึงเรา
                    </h2>
                    <p className="text-gray-600">
                      กรอกข้อมูลด้านล่างเพื่อติดต่อทีมงานของเรา
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        ชื่อ-นามสกุล <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="กรอกชื่อของคุณ"
                        className="h-12"
                        aria-invalid={!!errors.name}
                        disabled={isSubmitting}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        อีเมล <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="h-12"
                        aria-invalid={!!errors.email}
                        disabled={isSubmitting}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Topic Field */}
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        หัวข้อ <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedTopic}
                        onValueChange={(value) => setValue('topic', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="เลือกหัวข้อ" />
                        </SelectTrigger>
                        <SelectContent>
                          {topicOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.topic && (
                        <p className="text-sm text-red-500">{errors.topic.message}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        ข้อความ <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="เขียนข้อความของคุณที่นี่..."
                        rows={6}
                        className="resize-none"
                        aria-invalid={!!errors.message}
                        disabled={isSubmitting}
                        {...register('message')}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          กำลังส่ง...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          ส่งข้อความ
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">
                  หรือติดต่อเราผ่านช่องทางอื่น
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm">
                  <a
                    href="mailto:support@ekoe.co.th"
                    className="flex items-center justify-center gap-2 text-gray-700 hover:text-black transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@ekoe.co.th
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

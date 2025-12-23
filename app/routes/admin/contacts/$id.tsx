import { useState } from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router';
import type { Route } from './+types/$id';
import { getContactById, updateContactStatus, type ContactResponse } from '~/lib/services/admin/contacts-admin.service';
import { showSuccess, showError } from '~/lib/admin/toast';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ArrowLeft, Mail, User, Clock, MessageSquare, Loader2 } from 'lucide-react';

export async function loader({ params, request }: Route.LoaderArgs) {
  const contact = await getContactById(params.id!, request.headers);
  return { contact };
}

export default function ContactDetailPage() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'unread' | 'read' | 'responded') => {
    setIsUpdating(true);
    try {
      await updateContactStatus(contact.id, newStatus);
      showSuccess('อัปเดตสถานะสำเร็จ');
      revalidator.revalidate();
    } catch (error: any) {
      showError(error.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: ContactResponse['status']) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive">ยังไม่อ่าน</Badge>;
      case 'read':
        return <Badge variant="secondary">อ่านแล้ว</Badge>;
      case 'responded':
        return <Badge variant="default" className="bg-green-600">ตอบกลับแล้ว</Badge>;
      default:
        return null;
    }
  };

  const getTopicLabel = (topic: string) => {
    const labels: Record<string, string> = {
      general: 'สอบถามทั่วไป',
      order: 'สอบถามเกี่ยวกับคำสั่งซื้อ',
      product: 'สอบถามเกี่ยวกับสินค้า',
      return: 'คืนสินค้า/เปลี่ยนสินค้า',
      partnership: 'ความร่วมมือทางธุรกิจ',
      feedback: 'ข้อเสนอแนะ',
      other: 'อื่นๆ',
    };
    return labels[topic] || topic;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/contacts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับ
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">รายละเอียดข้อความ</h1>
          <p className="text-muted-foreground mt-2">
            ข้อความจาก {contact.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(contact.status)}
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ข้อมูลผู้ติดต่อ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">ชื่อ</p>
              <p className="font-medium">{contact.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">อีเมล</p>
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-blue-600 hover:underline flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">หัวข้อ</p>
              <p className="font-medium">{getTopicLabel(contact.topic)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              ข้อมูลเพิ่มเติม
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">วันที่ส่ง</p>
              <p className="font-medium">{formatDate(contact.createdAt)}</p>
            </div>
            {contact.readAt && (
              <div>
                <p className="text-sm text-muted-foreground">วันที่อ่าน</p>
                <p className="font-medium">{formatDate(contact.readAt)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-2">เปลี่ยนสถานะ</p>
              <Select
                value={contact.status}
                onValueChange={(value) => handleStatusChange(value as any)}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">ยังไม่อ่าน</SelectItem>
                  <SelectItem value="read">อ่านแล้ว</SelectItem>
                  <SelectItem value="responded">ตอบกลับแล้ว</SelectItem>
                </SelectContent>
              </Select>
              {isUpdating && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  กำลังอัปเดต...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            ข้อความ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {contact.message}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button asChild>
          <a href={`mailto:${contact.email}?subject=Re: ${getTopicLabel(contact.topic)}`}>
            <Mail className="h-4 w-4 mr-2" />
            ตอบกลับทางอีเมล
          </a>
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/contacts')}>
          กลับไปรายการ
        </Button>
      </div>
    </div>
  );
}

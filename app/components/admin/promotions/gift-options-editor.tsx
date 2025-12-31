import React from 'react';
import { Plus, Trash2, Gift, GripVertical } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { SingleImageUploader } from '~/components/admin/products/single-image-uploader';
import { Card } from '~/components/ui/card';

export interface GiftOption {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  quantity: number;
  productId?: string;
}

interface GiftOptionsEditorProps {
  options: GiftOption[];
  onChange: (options: GiftOption[]) => void;
  maxSelections: number;
  onMaxSelectionsChange: (max: number) => void;
}

function generateOptionId(): string {
  return `opt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function GiftOptionsEditor({
  options,
  onChange,
  maxSelections,
  onMaxSelectionsChange,
}: GiftOptionsEditorProps) {
  const addOption = () => {
    const newOption: GiftOption = {
      id: generateOptionId(),
      name: '',
      quantity: 1,
    };
    onChange([...options, newOption]);
  };

  const updateOption = (index: number, updates: Partial<GiftOption>) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], ...updates };
    onChange(updatedOptions);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      // Need at least 2 options for selection mode
      return;
    }
    onChange(options.filter((_, i) => i !== index));
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= options.length) return;
    const updatedOptions = [...options];
    const [movedItem] = updatedOptions.splice(fromIndex, 1);
    updatedOptions.splice(toIndex, 0, movedItem);
    onChange(updatedOptions);
  };

  return (
    <div className="space-y-4">
      {/* Max Selections */}
      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex-1">
          <Label className="text-sm font-medium">จำนวนที่ลูกค้าเลือกได้</Label>
          <p className="text-xs text-gray-500 mt-0.5">
            กำหนดจำนวนของแถมที่ลูกค้าสามารถเลือกได้ (จากตัวเลือกทั้งหมด {options.length} รายการ)
          </p>
        </div>
        <div className="w-24">
          <Input
            type="number"
            min="1"
            max={options.length || 1}
            value={maxSelections}
            onChange={(e) => onMaxSelectionsChange(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      </div>

      {/* Gift Options List */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <Card key={option.id} className="p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              {/* Drag Handle */}
              <div className="pt-2 text-gray-400 cursor-move">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Option Number Badge */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium mt-1">
                {index + 1}
              </div>

              {/* Option Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Image */}
                <div>
                  <Label className="text-xs">รูปภาพ</Label>
                  <div className="mt-1">
                    <SingleImageUploader
                      value={option.imageUrl}
                      onChange={(url) => updateOption(index, { imageUrl: url })}
                      placeholder="อัปโหลดรูป"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="md:col-span-2">
                  <Label className="text-xs">
                    ชื่อของแถม <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={option.name}
                    onChange={(e) => updateOption(index, { name: e.target.value })}
                    placeholder="กรอกชื่อของแถม"
                    className="mt-1"
                  />
                  {!option.name && (
                    <p className="text-xs text-red-500 mt-1">กรุณากรอกชื่อ</p>
                  )}
                </div>

                {/* Value & Quantity */}
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">มูลค่า (บาท)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={option.price || ''}
                      onChange={(e) => updateOption(index, { price: parseFloat(e.target.value) || undefined })}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">จำนวน (ชิ้น)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={option.quantity}
                      onChange={(e) => updateOption(index, { quantity: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveOption(index, index - 1)}
                  disabled={index === 0}
                  className="h-8 w-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => moveOption(index, index + 1)}
                  disabled={index === options.length - 1}
                  className="h-8 w-8 p-0"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Option Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        เพิ่มตัวเลือกของแถม
      </Button>

      {/* Help Text */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <Gift className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">วิธีใช้งาน:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>เพิ่มตัวเลือกของแถมอย่างน้อย 2 รายการ</li>
              <li>ลูกค้าจะเลือกของแถมตามจำนวนที่กำหนดไว้</li>
              <li>ถ้าเลือกได้ 2 ชิ้น จะแสดง 2 การ์ดเลือกของแถมในตะกร้า</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

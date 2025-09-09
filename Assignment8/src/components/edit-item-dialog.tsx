"use client";

import { useState, type FC, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  itemType: 'category' | 'tag';
  initialValue: string;
}

const EditItemDialog: FC<EditItemDialogProps> = ({ isOpen, onClose, onSave, itemType, initialValue }) => {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    setName(initialValue);
  }, [initialValue, isOpen]);

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  const title = itemType === 'category' ? '카테고리 이름 변경' : '태그 이름 변경';
  const description = itemType === 'category' ? '새로운 카테고리 이름을 입력하세요.' : '새로운 태그 이름을 입력하세요.';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>취소</Button>
          <Button type="submit" onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;

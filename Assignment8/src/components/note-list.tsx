"use client";

import type { FC } from 'react';
import { useState } from 'react';
import type { Category } from '@/lib/types';
import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarGroupAction,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Search, Tags, XCircle, Folder, Plus, MoreVertical, Edit, Trash2, Settings, Trash, NotebookText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';


interface NoteListProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  tags: string[];
  selectedTag: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectTag: (tag: string | null) => void;
  onAddCategory: () => void;
  onAddTag: (tagName: string) => void;
  onEditCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onEditTag: (name: string) => void;
  onDeleteTag: (name: string) => void;
  sidebarColor: string;
  onSetSidebarColor: (color: string) => void;
  mainContentColor: string;
  onSetMainContentColor: (color: string) => void;
  onSelectTrash: () => void;
  isTrashSelected: boolean;
}

const colorOptions = [
    { name: 'Stone', hsl: '30 25% 90%' },
    { name: 'Rose', hsl: '0 90% 90%' },
    { name: 'Mint', hsl: '150 75% 90%' },
    { name: 'Sky', hsl: '200 95% 90%' },
    { name: 'Lavender', hsl: '240 85% 90%' },
];

const mainContentColorOptions = colorOptions.map(color => {
    const [h, s, l] = color.hsl.match(/\d+/g)!.map(Number);
    return {
        name: color.name,
        hsl: `${h} ${s}% ${Math.min(98, l + 5)}%`
    };
});

const TagDropdown: FC<{ onAddTag: (tagName: string) => void; children: React.ReactNode }> = ({ onAddTag, children }) => {
  const [tagName, setTagName] = useState('');

  const handleAdd = () => {
    if (tagName.trim()) {
      onAddTag(tagName.trim());
      setTagName('');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="p-2 space-y-2">
          <Input 
            placeholder="새 태그 이름..."
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
                (e.target as HTMLElement).closest('[data-radix-dropdown-menu-content]')?.parentElement?.querySelector('[data-radix-dropdown-menu-trigger]')?.['__radix_dropdown_menu_trigger__']?.(new MouseEvent('click'));
              }
            }}
          />
          <Button onClick={handleAdd} className="w-full">추가 & 노트 생성</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListItemActions: FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/item:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>이름 변경</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>삭제</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete();
                setIsDeleteDialogOpen(false);
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


const NoteList: FC<NoteListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  tags,
  selectedTag,
  searchTerm,
  onSearchChange,
  onSelectTag,
  onAddCategory,
  onAddTag,
  onEditCategory,
  onDeleteCategory,
  onEditTag,
  onDeleteTag,
  sidebarColor,
  onSetSidebarColor,
  mainContentColor,
  onSetMainContentColor,
  onSelectTrash,
  isTrashSelected,
}) => {

  const handleColorChange = (sidebarHsl: string) => {
    onSetSidebarColor(sidebarHsl);
    const selectedColorIndex = colorOptions.findIndex(c => c.hsl === sidebarHsl);
    if (selectedColorIndex !== -1) {
      const correspondingMainColor = mainContentColorOptions[selectedColorIndex];
      onSetMainContentColor(correspondingMainColor.hsl);
    }
  };
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <NotebookText className="h-8 w-8 text-primary" />
            <h2 className="text-xl font-semibold">MemoMind</h2>
        </div>
        <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <SidebarInput 
              placeholder="노트 검색..." 
              className="pl-8 border-2 border-sidebar-border focus-visible:border-primary"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Tags /><span>태그</span></div>
             <TagDropdown onAddTag={onAddTag}>
              <SidebarGroupAction>
                <Plus />
              </SidebarGroupAction>
            </TagDropdown>
          </SidebarGroupLabel>
          
          <SidebarMenu>
            {selectedTag && (
               <SidebarMenuItem>
                 <SidebarMenuButton 
                    variant="default"
                    onClick={() => onSelectTag(null)}
                    className="text-destructive hover:text-destructive hover:bg-[hsl(var(--sidebar-accent))]"
                 >
                    <XCircle className="h-4 w-4" />
                    <span>필터 해제</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {tags.map(tag => (
                <SidebarMenuItem key={tag} className="group/item flex items-center justify-between">
                    <SidebarMenuButton 
                        variant="default"
                        isActive={tag === selectedTag}
                        onClick={() => onSelectTag(tag)}
                        className="flex-grow group-hover/item:bg-[hsl(var(--sidebar-accent))] group-hover/item:text-[hsl(var(--sidebar-accent-foreground))] transition-colors border-2 border-transparent group-hover/item:border-sidebar-border"
                    >
                        <span># {tag}</span>
                    </SidebarMenuButton>
                    <ListItemActions onEdit={() => onEditTag(tag)} onDelete={() => onDeleteTag(tag)} />
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Folder /><span>카테고리</span></div>
             <SidebarGroupAction onClick={onAddCategory}>
                <Plus />
             </SidebarGroupAction>
          </SidebarGroupLabel>
          
          <SidebarMenu>
             <SidebarMenuItem className="group/item">
                 <SidebarMenuButton 
                    variant="default"
                    onClick={() => onSelectCategory(null)}
                    isActive={selectedCategoryId === null && !isTrashSelected}
                    className="transition-colors group-hover/item:bg-[hsl(var(--sidebar-accent))] group-hover/item:text-[hsl(var(--sidebar-accent-foreground))] border-2 border-transparent group-hover/item:border-sidebar-border"
                 >
                    <Folder className="h-4 w-4" />
                    <span>모든 노트</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            {categories.map(category => (
                <SidebarMenuItem key={category.id} className="group/item flex items-center justify-between">
                    <SidebarMenuButton 
                        variant="default"
                        isActive={category.id === selectedCategoryId}
                        onClick={() => onSelectCategory(category.id)}
                        className="flex-grow group-hover/item:bg-[hsl(var(--sidebar-accent))] group-hover/item:text-[hsl(var(--sidebar-accent-foreground))] transition-colors border-2 border-transparent group-hover/item:border-sidebar-border"
                    >
                        <span>{category.name}</span>
                    </SidebarMenuButton>
                    <ListItemActions onEdit={() => onEditCategory(category.id, category.name)} onDelete={() => onDeleteCategory(category.id)} />
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem className="group/item">
                    <SidebarMenuButton 
                        variant="default"
                        onClick={onSelectTrash}
                        isActive={isTrashSelected}
                        className="transition-colors group-hover/item:bg-[hsl(var(--sidebar-accent))] group-hover/item:text-[hsl(var(--sidebar-accent-foreground))] border-2 border-transparent group-hover/item:border-sidebar-border"
                    >
                        <Trash className="h-4 w-4" />
                        <span>휴지통</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
       <SidebarFooter>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              <span>설정</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-auto p-2" align="start">
            <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">테마 색상</p>
                  <div className="flex gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.hsl)}
                        className={cn(
                          "h-8 w-8 rounded-full border-2",
                          sidebarColor === color.hsl ? 'border-primary' : 'border-transparent'
                        )}
                        style={{ backgroundColor: `hsl(${color.hsl})` }}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </>
  );
};

export default NoteList;

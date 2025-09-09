"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Note } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import NoteList from '@/components/note-list';
import NoteEditor from '@/components/note-editor';
import NoteGrid from '@/components/note-grid';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { PlusCircle, ArrowUp, ArrowDown, ChevronDown, Trash, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AddCategoryDialog from './add-category-dialog';
import EditItemDialog from './edit-item-dialog';

import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

type SortKey = 'updatedAt' | 'createdAt' | 'priority';
type SortDirection = 'asc' | 'desc';

// Header Component
const Header = ({
  isTrashSelected,
  onQuickNoteSubmit,
  newNoteTitle,
  onNewNoteTitleChange,
  filteredNotes,
  onRestoreAll,
  onEmptyTrash,
  sortKey,
  onSortKeyChange,
  sortDirection,
  onSortDirectionToggle,
}: {
  isTrashSelected: boolean;
  onQuickNoteSubmit: (e: React.FormEvent) => void;
  newNoteTitle: string;
  onNewNoteTitleChange: (value: string) => void;
  filteredNotes: Note[];
  onRestoreAll: () => void;
  onEmptyTrash: () => void;
  sortKey: SortKey;
  onSortKeyChange: (key: SortKey) => void;
  sortDirection: SortDirection;
  onSortDirectionToggle: () => void;
}) => {
  const sortKeyLabels: Record<SortKey, string> = {
    updatedAt: '수정 순',
    createdAt: '생성 순',
    priority: '중요도 순',
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {!isTrashSelected && (
        <form onSubmit={onQuickNoteSubmit}>
          <div className="relative">
            <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="새 노트 제목을 입력하고 Enter를 누르세요..."
              className="w-full pl-10 pr-4 py-2 text-base rounded-lg border-2 border-primary/50 focus-visible:ring-primary"
              value={newNoteTitle}
              onChange={(e) => onNewNoteTitleChange(e.target.value)}
            />
          </div>
        </form>
      )}

      <div className="flex items-center justify-between">
        {isTrashSelected && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRestoreAll} disabled={filteredNotes.length === 0}>
              <ArchiveRestore className="mr-2 h-4 w-4" /> 모두 복원
            </Button>
            <Button variant="destructive" onClick={onEmptyTrash} disabled={filteredNotes.length === 0}>
              <Trash className="mr-2 h-4 w-4" /> 휴지통 비우기
            </Button>
          </div>
        )}
        <div className="flex items-center justify-end gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {sortKeyLabels[sortKey]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuLabel>정렬 기준</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onSortKeyChange('updatedAt')}>수정 순</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSortKeyChange('createdAt')}>생성 순</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSortKeyChange('priority')}>중요도 순</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={onSortDirectionToggle}
            aria-label={`정렬 방향: ${sortDirection === 'asc' ? '오름차순' : '내림차순'}`}
          >
            {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

// MainContent Component
const MainContent = ({
  notes,
  isTrashSelected,
  onEditNote,
  onPermanentlyDeleteNote,
  onDeleteNote,
  onRestoreNote,
  onSetPriority,
}: {
  notes: Note[];
  isTrashSelected: boolean;
  onEditNote: (id: string) => void;
  onPermanentlyDeleteNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onRestoreNote: (id: string) => void;
  onSetPriority: (noteId: string, priority: 'low' | 'medium' | 'high') => void;
}) => {
  if (notes.length > 0) {
    return (
      <NoteGrid
        notes={notes}
        onEditNote={onEditNote}
        onDeleteNote={isTrashSelected ? onPermanentlyDeleteNote : onDeleteNote}
        onRestoreNote={onRestoreNote}
        onSetPriority={onSetPriority}
        isTrashView={isTrashSelected}
      />
    );
  }
  return (
    <div className="flex h-[calc(100vh-150px)] flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
      <Image src="https://picsum.photos/300/300" alt="MemoMind" width={200} height={200} className="rounded-full mb-6" data-ai-hint="abstract notebook" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">{isTrashSelected ? '휴지통이 비어있습니다' : '노트가 없습니다'}</h2>
      <p className="max-w-md text-muted-foreground">{isTrashSelected ? '삭제된 노트가 여기에 표시됩니다.' : '새 노트를 만들어 생각을 정리해보세요.'}</p>
    </div>
  );
};


export default function MemoMindClient() {
  const { toast } = useToast();
  const { notes, addNote, updateNote, deleteNote, setNotes, restoreNote, permanentlyDeleteNote, emptyTrash, restoreAllFromTrash } = useNotes();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  // Integrated Sidebar State Management
  const [sidebarColor, setSidebarColor] = useState('30 25% 90%');
  const [mainContentColor, setMainContentColor] = useState('30 25% 98%');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedSidebarColor = localStorage.getItem('memomind-sidebar-color');
      if (storedSidebarColor) setSidebarColor(storedSidebarColor);
      
      const storedMainContentColor = localStorage.getItem('memomind-main-content-color');
      if(storedMainContentColor) setMainContentColor(storedMainContentColor);

    } catch (error) {
      console.error("Failed to load colors from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.setProperty('--sidebar-background', `hsl(${sidebarColor})`);
      localStorage.setItem('memomind-sidebar-color', sidebarColor);
      
      document.documentElement.style.setProperty('--background', `hsl(${mainContentColor})`);
      localStorage.setItem('memomind-main-content-color', mainContentColor);
    }
  }, [sidebarColor, mainContentColor, isMounted]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'category' | 'tag', id: string, name: string } | null>(null);
  const [isTrashSelected, setIsTrashSelected] = useState(false);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      if (!note.deletedAt) {
        note.tags?.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [notes]);

  const handleNewNote = (title: string = '제목 없는 노트', tags: string[] = []) => {
    const defaultCategoryId = selectedCategoryId || (categories.length > 0 ? categories[0].id : '1');
    
    const newNote = addNote({
      title,
      content: '',
      categoryId: defaultCategoryId,
      priority: 'medium',
      tags: tags.length > 0 ? tags : (selectedTag ? [selectedTag] : []),
      color: 'bg-white',
    });
    setEditingNoteId(newNote.id);
  };
  
  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteTitle.trim()) {
        handleNewNote(newNoteTitle.trim());
        setNewNoteTitle('');
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (editingNoteId === id) {
        setEditingNoteId(null);
    }
    toast({ title: "노트가 휴지통으로 이동했습니다." });
  };
  
  const handleSaveNote = (updatedNote: Note) => {
    updateNote(updatedNote);
    setEditingNoteId(null);
    toast({ title: "노트 저장됨" });
  };

  const handleSetPriority = (noteId: string, priority: 'low' | 'medium' | 'high') => {
    const noteToUpdate = notes.find(n => n.id === noteId);
    if (noteToUpdate) {
        updateNote({ ...noteToUpdate, priority });
    }
    toast({title: "우선순위 변경됨"});
  }

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedTag(null);
    setIsTrashSelected(false);
  };

  const handleSelectTag = (tag: string | null) => {
    setSelectedTag(tag);
    setSelectedCategoryId(null);
    setIsTrashSelected(false);
  };

  const handleSelectTrash = () => {
    setIsTrashSelected(true);
    setSelectedCategoryId(null);
    setSelectedTag(null);
  };
  
  const handleAddCategory = (name: string) => {
    if (name.trim() === '') {
        toast({ title: "오류", description: "카테고리 이름은 비워둘 수 없습니다.", variant: "destructive" });
        return;
    }
    addCategory(name);
    toast({ title: "카테고리 추가됨" });
    setIsAddCategoryOpen(false);
  };
  
  const handleAddTag = (tagName: string) => {
    handleNewNote(`${tagName} 관련 노트`, [tagName]);
    toast({ title: "새 노트 추가됨" });
  };

  const handleEditCategory = (id: string, newName: string) => {
    updateCategory(id, newName);
    toast({ title: "카테고리 수정됨" });
  };
  
  const handleDeleteCategory = (id: string) => {
    const categoryName = categories.find(c => c.id === id)?.name || '';
    deleteCategory(id);
    setNotes(notes.map(n => n.categoryId === id ? { ...n, categoryId: '' } : n));
    if (selectedCategoryId === id) setSelectedCategoryId(null);
    toast({ title: "카테고리 삭제됨" });
  };
  
  const handleEditTag = (oldName: string, newName: string) => {
    setNotes(notes.map(note => ({ ...note, tags: note.tags?.map(tag => tag === oldName ? newName : tag) })));
    if (selectedTag === oldName) setSelectedTag(newName);
    toast({ title: "태그 수정됨" });
  };
  
  const handleDeleteTag = (tagName: string) => {
    setNotes(notes.map(note => ({ ...note, tags: note.tags?.filter(tag => tag !== tagName) })));
    if (selectedTag === tagName) setSelectedTag(null);
    toast({ title: "태그 삭제됨" });
  };

  const handleSaveEditedItem = (newName: string) => {
    if (!editingItem) return;
    if (editingItem.type === 'category') {
      handleEditCategory(editingItem.id, newName);
    } else {
      handleEditTag(editingItem.id, newName);
    }
    setEditingItem(null);
  };

  const handleRestoreNote = (id: string) => {
    restoreNote(id);
    toast({ title: "노트 복원됨" });
  };

  const handlePermanentlyDeleteNote = (id: string) => {
    permanentlyDeleteNote(id);
    toast({ title: "노트 영구 삭제됨", variant: "destructive" });
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    toast({ title: "휴지통 비워짐", variant: "destructive" });
  };

  const handleRestoreAll = () => {
    restoreAllFromTrash();
    toast({ title: "모두 복원됨" });
  };

  const filteredNotes = useMemo(() => {
    let notesToFilter = isTrashSelected ? notes.filter(note => note.deletedAt) : notes.filter(note => !note.deletedAt);

    if (!isTrashSelected) {
      if (selectedCategoryId) {
        notesToFilter = notesToFilter.filter(note => note.categoryId === selectedCategoryId);
      }
      if (selectedTag) {
        notesToFilter = notesToFilter.filter(note => note.tags?.includes(selectedTag));
      }
      if (searchTerm) {
        notesToFilter = notesToFilter.filter(note => 
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    return [...notesToFilter].sort((a, b) => {
      if (sortKey === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sortDirection === 'asc' 
          ? priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium']
          : priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
      }
      const dateA = new Date(a[sortKey]).getTime();
      const dateB = new Date(b[sortKey]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [notes, isTrashSelected, selectedCategoryId, selectedTag, searchTerm, sortKey, sortDirection]);

  const editingNote = useMemo(() => notes.find(note => note.id === editingNoteId), [notes, editingNoteId]);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <NoteList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          tags={allTags}
          selectedTag={selectedTag}
          onSelectTag={handleSelectTag}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddCategory={() => setIsAddCategoryOpen(true)}
          onAddTag={handleAddTag}
          onEditCategory={(id, name) => setEditingItem({ type: 'category', id, name })}
          onDeleteCategory={handleDeleteCategory}
          onEditTag={(name) => setEditingItem({ type: 'tag', id: name, name })}
          onDeleteTag={handleDeleteTag}
          sidebarColor={sidebarColor}
          onSetSidebarColor={setSidebarColor}
          mainContentColor={mainContentColor}
          onSetMainContentColor={setMainContentColor}
          onSelectTrash={handleSelectTrash}
          isTrashSelected={isTrashSelected}
        />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">MemoMind</h1>
        </header>
        <main className="flex-1">
          <Header
            isTrashSelected={isTrashSelected}
            onQuickNoteSubmit={handleQuickNoteSubmit}
            newNoteTitle={newNoteTitle}
            onNewNoteTitleChange={setNewNoteTitle}
            filteredNotes={filteredNotes}
            onRestoreAll={handleRestoreAll}
            onEmptyTrash={handleEmptyTrash}
            sortKey={sortKey}
            onSortKeyChange={setSortKey}
            sortDirection={sortDirection}
            onSortDirectionToggle={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          />
          <MainContent
            notes={filteredNotes}
            isTrashSelected={isTrashSelected}
            onEditNote={setEditingNoteId}
            onPermanentlyDeleteNote={handlePermanentlyDeleteNote}
            onDeleteNote={handleDeleteNote}
            onRestoreNote={handleRestoreNote}
            onSetPriority={handleSetPriority}
          />
        </main>
      </SidebarInset>
      {editingNote && (
        <NoteEditor
          note={editingNote}
          categories={categories}
          allTags={allTags}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onCancel={() => setEditingNoteId(null)}
          isOpen={!!editingNote && !editingNote.deletedAt}
        />
      )}
      <AddCategoryDialog 
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />
      {editingItem && (
        <EditItemDialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEditedItem}
          itemType={editingItem.type}
          initialValue={editingItem.name}
        />
      )}
    </SidebarProvider>
  );
}

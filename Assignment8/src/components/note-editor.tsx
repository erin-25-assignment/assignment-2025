"use client";

import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import type { Note, Category } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from '@/components/ui/badge';
import { summarizeLongNote } from '@/ai/flows/summarize-long-note';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2, Trash2, X, Tag, Palette, Save, PlusCircle, Bold, Italic, Underline, List, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  allTags: string[];
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const noteSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  content: z.string(),
  categoryId: z.string().min(1, '카테고리는 필수입니다'),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.string()),
  color: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

const availableColors = [
  'bg-white', 'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-purple-200'
];

const NoteEditor: FC<NoteEditorProps> = ({ note, categories, allTags, onSave, onDelete, onCancel, isOpen }) => {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
      categoryId: note?.categoryId || '',
      priority: note?.priority || 'medium',
      tags: note?.tags || [],
      color: note?.color || 'bg-white',
    },
  });

  const noteColor = form.watch('color');

  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
        categoryId: note.categoryId,
        priority: note.priority,
        tags: note.tags || [],
        color: note.color || 'bg-white',
      });
    }
  }, [note, form, isOpen]);
  
  const toggleTag = (tagToToggle: string) => {
    const currentTags = form.getValues('tags');
    const newTags = currentTags.includes(tagToToggle)
      ? currentTags.filter(tag => tag !== tagToToggle)
      : [...currentTags, tagToToggle];
    form.setValue('tags', newTags, { shouldDirty: true });
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = form.getValues('tags').filter(tag => tag !== tagToRemove);
    form.setValue('tags', newTags, { shouldDirty: true });
  };

  const onSubmit = (data: NoteFormData) => {
    if (!note) return;
    onSave({ ...note, ...data });
  };

  const applyMarkdown = (syntax: 'bold' | 'italic' | 'underline' | 'list' | 'quote') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';

    switch (syntax) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        break;
      case 'list':
        newText = `\n- ${selectedText}`;
        break;
      case 'quote':
        newText = `\n> ${selectedText}`;
        break;
    }

    const updatedValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    form.setValue('content', updatedValue, { shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + newText.length - (selectedText.length > 0 ? 0 : (syntax === 'bold' ? 2 : (syntax === 'italic' ? 1 : (syntax === 'underline' ? 4 : 0))));
      
      if (selectedText) {
          textarea.setSelectionRange(start, start + newText.length);
      } else {
           switch (syntax) {
              case 'bold':
                  textarea.setSelectionRange(start + 2, start + 2);
                  break;
              case 'italic':
                  textarea.setSelectionRange(start + 1, start + 1);
                  break;
              case 'underline':
                  textarea.setSelectionRange(start + 3, start + 3);
                  break;
              default:
                  textarea.setSelectionRange(newCursorPosition, newCursorPosition);
                  break;
          }
      }
  }, 0);
  };
  
  const handleSummarize = async () => {
    const content = form.getValues('content');
    if (!content || content.length < 50) {
      toast({
        title: "내용이 너무 짧습니다",
        description: "요약을 위해 노트 내용은 50자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }
    setIsSummarizing(true);
    try {
      const result = await summarizeLongNote({ noteContent: content });
      setSummary(result.summary);
      setIsSummaryDialogOpen(true);
    } catch (error) {
      console.error("Failed to summarize note:", error);
      toast({ title: "요약 실패", description: "요약을 생성할 수 없습니다.", variant: "destructive" });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 bg-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="flex items-center justify-between">
                  <span>노트 편집</span>
                   <div className="flex items-center gap-2 pr-8">
                     <Button type="button" variant="outline" size="sm" onClick={handleSummarize} disabled={isSummarizing}>
                      {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                      요약
                    </Button>
                    <Button type="submit" size="sm">
                        <Save className="mr-2 h-4 w-4"/>
                        저장
                    </Button>
                    <Button type="button" variant="destructive" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">노트 삭제</span>
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="노트 제목" 
                            {...field} 
                            className="text-2xl font-bold border-2 shadow-inner focus-visible:ring-2 px-4 py-6 bg-white border-primary/50" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                <div className="flex items-center gap-4 p-2 border rounded-lg bg-background/50 shadow-inner">
                   <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[180px] !bg-white">
                              <SelectValue placeholder="카테고리 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => applyMarkdown('bold')}><Bold className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => applyMarkdown('italic')}><Italic className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => applyMarkdown('underline')}><Underline className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => applyMarkdown('list')}><List className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => applyMarkdown('quote')}><Quote className="h-4 w-4" /></Button>
                  </div>
                </div>
                  
                <div className="flex-1 flex flex-col">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col">
                        <FormControl>
                          <Textarea
                            placeholder="노트 내용..."
                            className={cn(
                                "flex-1 text-base border-2 shadow-inner focus-visible:ring-2 resize-none transition-colors",
                                noteColor
                            )}
                            {...field}
                             ref={contentRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              </div>

              <DialogFooter className="border-t p-4 flex-col items-start w-full bg-background/50 space-y-4 md:space-y-0 md:flex-row md:items-end md:justify-between md:space-x-4">
                  <div className="w-full md:w-1/2">
                      <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-xs text-muted-foreground"><Tag className="h-4 w-4"/> 태그</FormLabel>
                              <FormControl>
                                  <div>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start font-normal bg-white border-primary/50">
                                          <PlusCircle className="mr-2 h-4 w-4" /> 태그 선택
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <ScrollArea className="h-40">
                                          <div className="p-2 space-y-1">
                                            {allTags.map(tag => (
                                              <Button 
                                                key={tag}
                                                type="button"
                                                variant={field.value.includes(tag) ? "secondary" : "ghost"}
                                                className="w-full justify-start"
                                                onClick={() => toggleTag(tag)}
                                              >
                                                {tag}
                                              </Button>
                                            ))}
                                          </div>
                                        </ScrollArea>
                                      </PopoverContent>
                                    </Popover>
                                    <div className="flex flex-wrap gap-2 min-h-[24px] mt-2">
                                        {field.value.map(tag => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                                <button type="button" className="ml-2" onClick={() => removeTag(tag)}>
                                                    <X className="h-3 w-3"/>
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                  </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                  </div>
                  <div className="flex items-end justify-between w-full md:w-auto md:gap-4">
                      <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                          <FormItem className="flex flex-col justify-end">
                            <FormLabel className="text-xs text-muted-foreground">우선순위</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-[180px] !bg-white">
                                    <SelectValue placeholder="우선순위 선택" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="low">낮음</SelectItem>
                                    <SelectItem value="medium">중간</SelectItem>
                                    <SelectItem value="high">높음</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="color"
                          render={({ field }) => (
                              <FormItem className="flex flex-col justify-end">
                                  <FormLabel className="text-xs text-muted-foreground h-[14px]">&nbsp;</FormLabel>
                                  <Popover>
                                      <PopoverTrigger asChild>
                                          <Button variant="outline" className="bg-white">
                                              <Palette className="mr-2 h-4 w-4" />
                                              노트 색상
                                          </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-2">
                                          <div className="flex gap-1">
                                          {availableColors.map(color => (
                                              <Button 
                                                  key={color}
                                                  type="button"
                                                  variant={field.value === color ? 'default' : 'outline'}
                                                  className={`h-8 w-8 rounded-full p-0 border-2 ${color}`}
                                                  onClick={() => field.onChange(color)}
                                              />
                                          ))}
                                          </div>
                                      </PopoverContent>
                                  </Popover>
                              </FormItem>
                          )}
                      />
                  </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      

      <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI 요약</AlertDialogTitle>
            <AlertDialogDescription>
              노트의 핵심 내용입니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-[60vh] overflow-y-auto rounded-md border bg-secondary/50 p-4">
            <p className="text-sm text-secondary-foreground">{summary}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>닫기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 노트가 휴지통으로 이동됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(note.id);
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

export default NoteEditor;

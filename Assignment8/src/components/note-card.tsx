"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Note } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Star, MoreVertical, Pin, ArchiveRestore } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteCardProps {
    note: Note;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onSetPriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
    onRestore?: (id: string) => void;
    isTrashView?: boolean;
}

const NoteCard: FC<NoteCardProps> = ({ note, onEdit, onDelete, onSetPriority, onRestore, isTrashView = false }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const priorityStyles = {
        low: {
            text: 'Low',
            textColor: 'text-blue-500',
            iconColor: 'text-blue-400',
        },
        medium: {
            text: 'Medium',
            textColor: 'text-yellow-600',
            iconColor: 'text-yellow-500',
        },
        high: {
            text: 'High',
            textColor: 'text-red-500',
            iconColor: 'text-red-500',
        },
    }

    const shadowColors: { [key: string]: string } = {
        'bg-white': 'hover:shadow-gray-400/50',
        'bg-red-200': 'hover:shadow-red-400/50',
        'bg-orange-200': 'hover:shadow-orange-400/50',
        'bg-yellow-200': 'hover:shadow-yellow-400/50',
        'bg-green-200': 'hover:shadow-green-400/50',
        'bg-blue-200': 'hover:shadow-blue-400/50',
        'bg-purple-200': 'hover:shadow-purple-400/50',
    };

    const shadowClass = shadowColors[note.color || 'bg-white'] || 'hover:shadow-gray-400/50';

    const currentPriority = note.priority || 'medium';
    const currentPriorityStyle = priorityStyles[currentPriority];
    
    const cardContentClickHandler = () => {
        if (!isTrashView) {
            onEdit(note.id);
        }
    }

    return (
        <>
            <Card className={cn(
                "relative flex flex-col h-72 justify-between transition-shadow hover:shadow-xl",
                 note.color || 'bg-card',
                 shadowClass,
                 isTrashView && "opacity-70"
            )}>
                <CardHeader className={cn(isTrashView ? "cursor-default" : "cursor-pointer")} onClick={cardContentClickHandler}>
                    <div className="flex justify-between items-start">
                        <CardTitle className="truncate pr-2">{note.title}</CardTitle>
                        {!isTrashView && (
                            <div className={cn("flex items-center gap-1 text-xs font-semibold capitalize", currentPriorityStyle.textColor)}>
                                <Pin className={cn("h-3.5 w-3.5", currentPriorityStyle.iconColor)} />
                                <span>{currentPriorityStyle.text}</span>
                            </div>
                        )}
                    </div>
                    <CardDescription>{format(new Date(note.createdAt), 'yyyy년 M월 d일 HH:mm', { locale: ko })}</CardDescription>
                </CardHeader>
                <CardContent className={cn("flex-grow overflow-hidden", isTrashView ? "cursor-default" : "cursor-pointer")} onClick={cardContentClickHandler}>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 pt-2">
                    <div className="flex flex-wrap gap-1">
                        {note.tags?.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                    <div className="flex w-full justify-end gap-2">
                        {isTrashView ? (
                            <>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRestore?.(note.id)}>
                                    <ArchiveRestore className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(note.id)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => onSetPriority(note.id, 'high')}>
                                            <Star className={cn("mr-2 h-4 w-4", priorityStyles.high.iconColor)} /> 높음
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onSetPriority(note.id, 'medium')}>
                                            <Star className={cn("mr-2 h-4 w-4", priorityStyles.medium.iconColor)} /> 중간
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onSetPriority(note.id, 'low')}>
                                            <Star className={cn("mr-2 h-4 w-4", priorityStyles.low.iconColor)} /> 낮음
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>

             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{isTrashView ? '정말 영구적으로 삭제하시겠습니까?' : '정말 삭제하시겠습니까?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isTrashView 
                            ? "이 작업은 되돌릴 수 없습니다. 노트가 영구적으로 삭제됩니다." 
                            : "노트가 휴지통으로 이동됩니다."
                        }
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
    )
}

export default NoteCard;

    